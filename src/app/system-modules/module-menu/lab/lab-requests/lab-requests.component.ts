import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment } from './../../../../models/facility-manager/setup/appointment';
import { Component, OnInit, Renderer, ElementRef, ViewChild, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	FacilitiesService,
	InvestigationService,
	LaboratoryRequestService,
	BillingService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index';
import {
	Facility,
	MinorLocation,
	Investigation,
	InvestigationModel,
	Employee,
	BillIGroup,
	BillItem,
	BillModel,
	PendingLaboratoryRequest,
	User
} from '../../../../models/index';
import { Observable } from 'rxjs/Observable';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { ISubscription } from 'rxjs/Subscription';
import { LabEventEmitterService } from '../../../../services/facility-manager/lab-event-emitter.service';

@Component({
	selector: 'app-lab-requests',
	templateUrl: './lab-requests.component.html',
	styleUrls: [ './lab-requests.component.scss' ]
})
export class LabRequestsComponent implements OnInit, OnDestroy {
	patientSearch = new FormControl();
	@ViewChild('fileInput') fileInput: ElementRef;
	@Input() isLaboratory = true;
	@Input() patientId;
	@Input() appointment: Appointment;
	paramLabNo = '';
	paramPersonFullName = '';
	paramcLinicalInformation = '';
	paramDiagnosis = '';
	selectedFacility: Facility = <Facility>{};
	isValidateForm = false;
	apmisLookupUrl = 'patient-search';
	apmisLookupText = '';
	apmisLookupQuery: any = {};
	apmisLookupDisplayKey = 'personDetails.firstName';
	apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';

	apmisLookupOtherKeys = [
		'personDetails.lastName',
		'personDetails.firstName',
		'personDetails.dateOfBirth',
		'personDetails.email'
	];
	apmisInvestigationLookupUrl = 'investigations';
	apmisInvestigationLookupText = '';
	apmisInvestigationLookupQuery: any = {};
	apmisInvestigationLookupDisplayKey = 'name';
	apmisInvestigationLookupImgKey = '';
	// apmisLookupOtherKeys = ['lastName', 'email'];
	request_view = false;
	reqDetail_view = false;
	personAcc_view = false;
	mainErr = true;
	paymentStatus = false;
	sampleStatus = true;
	recievedStatus = true;
	resultStatus = false;
	loading = true;
	extList = false;
	isExternal = false;
	checkedValues: any[] = [];
	requests: any[] = [];
	pendingRequests: any[] = [];
	pendingExternalRequests: any[] = [];
	selectedPatient: any = <any>{};
	errMsg = 'You have unresolved errors';
	makeRequestBtn = true;
	makingRequestBtn = false;
	disableBtn = false;
	public frmNewRequest: FormGroup;
	searchInvestigation: FormControl;
	investigationRadio = false;
	selectedLab: any = {};
	investigations: InvestigationModel[] = [];
	bindInvestigations: InvestigationModel[] = [];
	movedInvestigations: any[] = [];
	selectedInvestigation: any = <any>{};
	user: User = <User>{};
	loginEmployee: Employee;
	totalPrice: Number = 0;
	searchOpen = false;
	routeSubscription: ISubscription;
	requestLoading = false;

	constructor(
		private formBuilder: FormBuilder,
		private renderer: Renderer,
		private locker: CoolLocalStorage,
		private route: ActivatedRoute,
		private billingService: BillingService,
		private facilityService: FacilitiesService,
		private _router: Router,
		private _labEventEmitter: LabEventEmitterService,
		private investigationService: InvestigationService,
		private requestService: LaboratoryRequestService,
		private _systemModuleService: SystemModuleService,
		private _authFacadeService: AuthFacadeService
	) {
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.loginEmployee = res;
				if (res.workbenchCheckIn !== undefined && res.workbenchCheckIn.length > 0) {
					const workBench = this.loginEmployee.workbenchCheckIn.filter((x) => x.isOn);
					if (workBench.length > 0) {
						this.selectedLab = { typeObject: workBench[0], type: 'workbench' };
					}
				}
			})
			.catch((err) => {});

		// Subscribe to the event when ward changes.
		this.routeSubscription = this._labEventEmitter.announceLab.subscribe((val) => {
			this.selectedLab = val;
			this._getAllPendingRequests();
		});
	}

	ngOnInit() {
		this.requests = [];
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this.locker.getObject('auth');
		this.searchInvestigation = new FormControl('', []);

		this.patientSearch.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.do((val) => {
				this.pendingRequests = [];
				this.loading = true;
			})
			.switchMap((term) =>
				Observable.fromPromise(
					this.requestService.customFind({
						query: { search: term, facilityId: this.selectedFacility._id }
					})
				)
			)
			.subscribe(
				(res: any) => {
					this.pendingRequests = [];
					if (res.status === 'success') {
						this.loading = false;
						let labId = '';
						if (
							this.selectedLab !== undefined &&
							this.selectedLab !== null &&
							this.selectedLab.typeObject !== undefined
						) {
							labId = this.selectedLab.typeObject.minorLocationId;
						}

						// Filter investigations based on the laboratory Id
						res.data.forEach((labRequest) => {
							labRequest.investigations.forEach((investigation) => {
								if (
									investigation.isSaved === undefined ||
									!investigation.isSaved ||
									((investigation.isUploaded === undefined || !investigation.isUploaded) &&
										labId === investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id)
								) {
									const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
									if (!investigation.isSaved || !investigation.isUploaded) {
										pendingLabReq.report = investigation.report;
										pendingLabReq.isSaved = investigation.isSaved;
										pendingLabReq.isUploaded = investigation.isUploaded;
									}
									pendingLabReq.labRequestId = labRequest._id;
									pendingLabReq.facility = labRequest.facilityId;
									pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
									pendingLabReq.diagnosis = labRequest.diagnosis;
									pendingLabReq.labNumber = labRequest.labNumber;
									pendingLabReq.patientId = labRequest.patientId;
									pendingLabReq.patient = labRequest.personDetails;
									pendingLabReq.isExternal = investigation.isExternal;
									pendingLabReq.isUrgent = investigation.isUrgent;
									if (investigation.location !== undefined) {
										pendingLabReq.minorLocation = investigation.location.laboratoryId;
									}

									pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
									pendingLabReq.isPanel = investigation.investigation.isPanel;
									pendingLabReq.name = investigation.investigation.name;
									pendingLabReq.reportType = investigation.investigation.reportType;
									pendingLabReq.specimen = investigation.investigation.specimen;
									pendingLabReq.service = investigation.investigation.serviceId;
									pendingLabReq.unit = investigation.investigation.unit;
									pendingLabReq.investigationId = investigation.investigation._id;
									pendingLabReq.createdAt = labRequest.createdAt;
									pendingLabReq.updatedAt = labRequest.updatedAt;
									pendingLabReq.createdById = labRequest.createdBy;
									pendingLabReq.createdBy = labRequest.employeeDetails;

									if (investigation.specimenReceived !== undefined) {
										pendingLabReq.specimenReceived = investigation.specimenReceived;
									}
									if (investigation.specimenNumber !== undefined) {
										pendingLabReq.specimenNumber = investigation.specimenNumber;
									}

									this.pendingRequests.push(pendingLabReq);
								}
							});
						});
					}
				},
				(err) => {}
			);

		this.searchInvestigation.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.investigationService
					.find({
						query: {
							facilityId: this.selectedFacility._id,
							name: { $regex: -1, $options: 'i' }
						}
					})
					.then((payload) => {
						this.investigations = [];
						payload.data.forEach((item) => {
							const investigation: InvestigationModel = <InvestigationModel>{};
							investigation.investigation = item;
							investigation.LaboratoryWorkbenches = item.LaboratoryWorkbenches;
							investigation.isExternal = false;
							investigation.isUrgent = false;
							investigation.isChecked = false;
							const listItems: any[] = [];
							if (item.isPanel) {
								item.panel.forEach((inItem) => {
									const innerChild = <InvestigationModel>{};
									innerChild.investigation = inItem;
									innerChild.isExternal = false;
									innerChild.isUrgent = false;
									innerChild.isChecked = false;
									listItems.push(innerChild);
								});
								investigation.investigation.panel = listItems;
								this.investigations.push(investigation);
							} else {
								this.investigations.push(investigation);
							}
						});
					})
					.catch((err) => {});
			} else {
				this.investigationService
					.find({
						query: {
							facilityId: this.selectedFacility._id,
							name: { $regex: value, $options: 'i' }
						}
					})
					.then((payload) => {
						this.investigations = [];
						payload.data.forEach((item) => {
							const investigation: InvestigationModel = <InvestigationModel>{};
							investigation.investigation = item;
							investigation.LaboratoryWorkbenches = item.LaboratoryWorkbenches;
							investigation.isExternal = false;
							investigation.isUrgent = false;
							investigation.isChecked = false;
							const listItems: any[] = [];
							if (item.isPanel) {
								item.panel.forEach((inItem) => {
									const innerChild = <InvestigationModel>{};
									innerChild.investigation = inItem;
									innerChild.isExternal = false;
									innerChild.isUrgent = false;
									innerChild.isChecked = false;
									listItems.push(innerChild);
								});
								investigation.investigation.panel = listItems;
								this.investigations.push(investigation);
							} else {
								this.investigations.push(investigation);
							}
						});
					})
					.catch((err) => {});
			}
		});
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.frmNewRequest = this.formBuilder.group({
			patient: [ '', [ Validators.required ] ],
			labNo: [ '', [ Validators.required ] ],
			clinicalInfo: [ '', [ Validators.required ] ],
			diagnosis: [ '', [ Validators.required ] ],
			investigation: [ '' ]
		});

		this.frmNewRequest.controls['patient'].valueChanges.subscribe((value) => {
			this.apmisLookupQuery = {
				facilityId: this.selectedFacility._id,
				searchText: value
			};
		});
		this.frmNewRequest.controls['investigation'].valueChanges.subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.apmisInvestigationLookupQuery = {
					facilityId: this.selectedFacility._id,
					name: { $regex: -1, $options: 'i' }
				};
			} else {
				this.apmisInvestigationLookupQuery = {
					facilityId: this.selectedFacility._id,
					name: { $regex: value, $options: 'i' }
				};
			}
			this.validateForm();
		});

		this.frmNewRequest.valueChanges.subscribe((value) => {
			this.validateForm();
		});

		this.routeSubscription = this.route.params.subscribe((params: any) => {
			if (params.id !== undefined && this.isLaboratory) {
				this.isExternal = true;
				this.requestService.find({ query: { 'patientId.personDetails._id': params.id } }).then((payload) => {
					if (payload.data.length > 0) {
						this.frmNewRequest.controls['labNo'].setValue(payload.data[0].labNumber);
						this.frmNewRequest.controls['patient'].setValue(
							payload.data[0].patientId.personDetails.personFullName
						);
						this.frmNewRequest.controls['clinicalInfo'].setValue(payload.data[0].clinicalInformation);
						this.frmNewRequest.controls['diagnosis'].setValue(payload.data[0].diagnosis);
						this.selectedPatient = payload.data[0].patientId;
					}
					let labId = '';
					if (this.selectedLab !== undefined && this.selectedLab.typeObject !== undefined) {
						labId = this.selectedLab.typeObject.minorLocationId;
						this.paramLabNo = labId;
					}
					// Filter investigations based on the laboratory Id
					payload.data.forEach((labRequest) => {
						labRequest.investigations.forEach((investigation) => {
							if (investigation.isExternal) {
								const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
								if (!investigation.isSaved || !investigation.isUploaded) {
									pendingLabReq.report = investigation.report;
									pendingLabReq.isSaved = investigation.isSaved;
									pendingLabReq.isUploaded = investigation.isUploaded;
								}
								pendingLabReq.labRequestId = labRequest._id;
								pendingLabReq.facility = labRequest.facilityId;
								pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
								pendingLabReq.diagnosis = labRequest.diagnosis;
								pendingLabReq.labNumber = labRequest.labNumber;
								pendingLabReq.patient = labRequest.patientId;
								pendingLabReq.isExternal = investigation.isExternal;
								pendingLabReq.isUrgent = investigation.isUrgent;
								if (investigation.location !== undefined) {
									pendingLabReq.minorLocation = investigation.location.laboratoryId;
								}

								pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
								pendingLabReq.isPanel = investigation.investigation.isPanel;
								pendingLabReq.name = investigation.investigation.name;
								pendingLabReq.reportType = investigation.investigation.reportType;
								pendingLabReq.specimen = investigation.investigation.specimen;
								pendingLabReq.service = investigation.investigation.serviceId;
								pendingLabReq.unit = investigation.investigation.unit;
								pendingLabReq.investigationId = investigation.investigation._id;
								pendingLabReq.createdAt = labRequest.createdAt;
								pendingLabReq.updatedAt = labRequest.updatedAt;
								pendingLabReq.createdBy = labRequest.createdBy;

								if (investigation.specimenReceived !== undefined) {
									pendingLabReq.specimenReceived = investigation.specimenReceived;
								}
								if (investigation.specimenNumber !== undefined) {
									pendingLabReq.specimenNumber = investigation.specimenNumber;
								}

								this.pendingExternalRequests.push(pendingLabReq);
							}
						});
					});
					this.request_view = true;
				});
			} else {
				if (this.isLaboratory === false) {
					this.selectedPatient = this.patientId;
					this.frmNewRequest.controls['labNo'].setValue('N/A');
					this.frmNewRequest.controls['patient'].setValue(
						this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.lastName
					);
				}
			}
		});
		this._getAllPendingRequests();
	}

	extList_show() {
		this.extList = true;
	}
	extList_close() {
		this.extList = false;
	}

	getInvestigations() {
		this.investigationService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then((payload) => {
			payload.data.forEach((item) => {
				const investigation: InvestigationModel = <InvestigationModel>{};
				investigation.investigation = item;
				investigation.LaboratoryWorkbenches = item.LaboratoryWorkbenches;
				investigation.isExternal = false;
				investigation.isUrgent = false;
				investigation.isChecked = false;
				const listItems: any[] = [];
				if (item.isPanel) {
					item.panel.forEach((inItem) => {
						const innerChild = <InvestigationModel>{};
						innerChild.investigation = inItem;
						innerChild.isExternal = false;
						innerChild.isUrgent = false;
						innerChild.isChecked = false;
						listItems.push(innerChild);
					});
					investigation.investigation.panel = listItems;
					this.investigations.push(investigation);
				} else {
					this.investigations.push(investigation);
				}
			});
		});
	}
	getLaboratoryRequest() {
		this.requests = [];
		this.requestService.find({ query: { 'facilityId._id': this.selectedFacility._id } }).then((payload) => {
			this.requests = payload.data;
		});
	}
	showImageBrowseDlg() {
		this.fileInput.nativeElement.click();
	}
	onChange() {
		// upload file
	}

	apmisLookupHandleSelectedItem(value) {
		this.apmisLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}`;
		this.selectedPatient = value;
		this.frmNewRequest.controls['labNo'].setValue('');
		if (this.selectedPatient.clientsNo !== undefined) {
			this.selectedPatient.clientsNo.forEach((item) => {
				if (item.minorLocationId === this.selectedLab.typeObject.minorLocationObject._id) {
					this.frmNewRequest.controls['labNo'].setValue(item.clientNumber);
				}
			});
		}
	}

	apmisInvestigationLookupHandleSelectedItem(value) {
		if (value.action !== undefined) {
			if (value.action === 'cancel' && value.clear === true) {
				this.checkedValues = [];
				this.apmisInvestigationLookupText = '';
				this.frmNewRequest.controls['investigation'].setValue('');
			} else if (value.action === 'ok') {
				this.apmisInvestigationLookupText = '';
				this.frmNewRequest.controls['investigation'].setValue('');
			}
		} else {
			if (value.checked === true) {
				if (this.checkedValues.filter((item) => item.name === value.object.name).length === 0) {
					this.checkedValues.push(value.object);
				}
			} else {
				if (this.checkedValues.filter((item) => item.name === value.object.name).length > 0) {
					const index = this.checkedValues.findIndex((item) => item.name === value.object.name);
					this.checkedValues.splice(index, 1);
				}
			}
			this.apmisInvestigationLookupText = value.object.name;
		}
	}
	request_show() {
		this.request_view = !this.request_view;
	}
	reqDetail(request) {
		this.selectedInvestigation = request;
		this.reqDetail_view = true;
	}
	newPerson() {
		this.personAcc_view = true;
	}
	close_onClick(message: boolean): void {
		this.reqDetail_view = false;
		this.personAcc_view = false;
		this._getAllPendingRequests();
	}
	childChanged($event, investigation: InvestigationModel, childInvestigation?: InvestigationModel, isChild = false) {
		if ($event.checked || childInvestigation !== undefined) {
			if (investigation.investigation.isPanel) {
				// isPanel
				if (childInvestigation !== undefined) {
					// also send child investigation
					const copyInvestigation = JSON.parse(JSON.stringify(investigation));
					const isInBind = this.bindInvestigations.findIndex(
						(x) => x.investigation._id === copyInvestigation.investigation._id
					);
					if (isInBind > -1) {
						if ($event.checked) {
							childInvestigation.isChecked = true;
							this.bindInvestigations.splice(isInBind, 1);
							if (investigation.location !== undefined) {
								childInvestigation.location = investigation.location.laboratoryId;
							}
							this.bindInvestigations.push(childInvestigation);
							// if (this.bindInvestigations[isInBind].investigation.panel
							//   .findIndex(x => x._id === copyInvestigation.investigation.panel[0]._id) >= 0) {
							//   this.bindInvestigations[isInBind].investigation.panel.push(copyInvestigation.investigation.panel[0]);
							//   if (this.bindInvestigations[isInBind].investigation.panel.length === investigation.investigation.panel.length) {
							//     investigation.isChecked = true;
							//   } else {
							//     investigation.isChecked = false;
							//   }
							// }
						} else {
							// const indexToRemove = this.bindInvestigations[isInBind].investigation.panel
							//   .findIndex(x => x.investigation._id === childInvestigation.investigation._id);
							// this.bindInvestigations[isInBind].investigation.panel.splice(indexToRemove, 1);
							// childInvestigation.isChecked = false;
							// if (this.bindInvestigations[isInBind].investigation.panel.length === 0 || investigation.isChecked) {
							//   if (!investigation.isChecked) {
							//     this.bindInvestigations.splice(0, 1);
							//   }
							//   investigation.isChecked = false;
							// }
						}
					}
				}
			}
		}
	}
	investigationChanged(
		$event,
		investigation: InvestigationModel,
		childInvestigation?: InvestigationModel,
		isChild = false
	) {
		if ($event.checked || childInvestigation !== undefined) {
			if (investigation.investigation.isPanel) {
				// isPanel
				if (childInvestigation !== undefined) {
					// also send child investigation
					childInvestigation.isChecked = true;
					const found = false;
					const childIndex = investigation.investigation.panel.findIndex(
						(x) => x.investigation._id === childInvestigation.investigation._id
					);
					if (childIndex > -1) {
						const copyInvestigation = JSON.parse(JSON.stringify(investigation));
						investigation.investigation.panel.forEach((item, i) => {
							if (i !== childIndex) {
								copyInvestigation.investigation.panel.splice(i, 1);
							}
						});
						const isInBind = this.bindInvestigations.findIndex(
							(x) => x.investigation._id === copyInvestigation.investigation._id
						);
						if (isInBind > -1) {
							if ($event.checked) {
								if (
									this.bindInvestigations[isInBind].investigation.panel.findIndex(
										(x) => x._id === copyInvestigation.investigation.panel[0]._id
									) >= 0
								) {
									this.bindInvestigations[isInBind].investigation.panel.push(
										copyInvestigation.investigation.panel[0]
									);
									if (
										this.bindInvestigations[isInBind].investigation.panel.length ===
										investigation.investigation.panel.length
									) {
										investigation.isChecked = true;
									} else {
										investigation.isChecked = false;
									}
								}
							} else {
								const indexToRemove = this.bindInvestigations[isInBind].investigation.panel.findIndex(
									(x) => x.investigation._id === childInvestigation.investigation._id
								);
								this.bindInvestigations[isInBind].investigation.panel.splice(indexToRemove, 1);
								childInvestigation.isChecked = false;

								if (
									this.bindInvestigations[isInBind].investigation.panel.length === 0 ||
									investigation.isChecked
								) {
									if (!investigation.isChecked) {
										this.bindInvestigations.splice(0, 1);
									}

									investigation.isChecked = false;
								}
							}
						} else {
							this.bindInvestigations.push(copyInvestigation);
						}
					}
				} else {
					// without child investigation
					const copyInvestigation = JSON.parse(JSON.stringify(investigation));
					const isInBind = this.bindInvestigations.findIndex(
						(x) => x.investigation._id === copyInvestigation.investigation._id
					);
					if (isInBind > -1) {
						if ($event.checked) {
							// investigation.isChecked = true;
							investigation.investigation.panel.forEach((child, k) => {
								const thisBindInvest = this.bindInvestigations[isInBind];
								const findIndex = thisBindInvest.investigation.panel.findIndex(
									(x) => x.investigation._id === child.investigation._id
								);
								if (findIndex < 0) {
									// child.isChecked = true;
									if (
										thisBindInvest.investigation.panel.length ===
										investigation.investigation.panel.length
									) {
										investigation.isChecked = true;
									} else {
										investigation.isChecked = false;
									}
								}
							});
						}
					} else {
						investigation.isChecked = true;
						// copyInvestigation = JSON.parse(JSON.stringify(investigation));
						// this.bindInvestigations.push(copyInvestigation);
						// check all children

						if (investigation.investigation.isPanel) {
							investigation.investigation.panel.forEach((child, k) => {
								// child.isChecked = true;
							});
						}
					}
					// investigation.LaboratoryWorkbenches = pay.LaboratoryWorkbenches;
				}
			} else {
				// checked without panel
				if ($event.checked) {
					// this.bindInvestigations.push(investigation);
					investigation.isChecked = true;
					investigation.LaboratoryWorkbenches = investigation.LaboratoryWorkbenches;
				} else {
					const indexToRemove = this.bindInvestigations.findIndex(
						(x) => x.investigation._id === investigation.investigation._id
					);
					this.bindInvestigations.splice(indexToRemove, 1);
				}
				// this.investigationService.get(investigation.investigation._id, {}).then(pay => {

				// })
			}
		} else {
			const indexToRemove = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);
			this.bindInvestigations.splice(indexToRemove, 1);
			// unchecked panel and uncheched all children
			if (investigation.investigation.isPanel) {
				investigation.investigation.panel.forEach((child, k) => {
					child.isChecked = false;
				});
				investigation.isChecked = false;
				investigation.isExternal = false;
				investigation.isUrgent = false;
			} else {
				investigation.isChecked = false;
				investigation.isExternal = false;
				investigation.isUrgent = false;
			}
		}
	}

	locationChanged($event, investigation: InvestigationModel, location, LaboratoryWorkbenches) {
		const ids: any[] = [];
		if ($event.value) {
			this.investigationRadio = true;
		} else {
			this.investigationRadio = false;
		}
		if (investigation.investigation.isPanel) {
			const isInBind = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);
			if (isInBind > -1) {
				this.bindInvestigations.splice(isInBind, 1);
			}
			investigation.investigation.panel.forEach((child, k) => {
				// child.isChecked = true;
				ids.push(child.investigation._id);
			});

			// i need prices for the two children investigation and their prices
			const labId = location.laboratoryId._id;
			this.investigationService.find({ query: { _id: { $in: ids } } }).then((payload) => {
				const tempList: any[] = [];
				payload.data.forEach((item, j) => {
					const index = item.LaboratoryWorkbenches.findIndex(
						(x) => x.laboratoryId._id === location.laboratoryId._id
					);
					if (index > -1) {
						const withId = item.LaboratoryWorkbenches[index];
						withId.investigationId = item._id;
						tempList.push(withId);
					}
				});
				investigation.temporaryInvestigationList = tempList;
			});
			investigation.location = location;
			this.bindInvestigations.push(investigation);
		} else {
			const isInBind = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);
			if (isInBind > -1) {
				this.bindInvestigations.splice(isInBind, 1);
			}
			const copyBindInvestigation = JSON.parse(JSON.stringify(investigation));
			copyBindInvestigation.location = location;
			copyBindInvestigation.LaboratoryWorkbenches = [];
			copyBindInvestigation.LaboratoryWorkbenches.push(location);
			copyBindInvestigation.investigation.LaboratoryWorkbenches = copyBindInvestigation.LaboratoryWorkbenches;
			this.bindInvestigations.push(copyBindInvestigation);
		}
	}
	getChildPrice(investigation, panel) {
		let parentLocation;
		let retVal = '';
		parentLocation = investigation.location.laboratoryId;
		if (investigation.temporaryInvestigationList !== undefined) {
			investigation.temporaryInvestigationList.forEach((item) => {
				if (item.laboratoryId._id === parentLocation._id && item.investigationId === panel.investigation._id) {
					if (item.workbenches.length > 0) {
						panel.location = investigation.location;
						// tslint:disable-next-line:max-line-length
						// panel.location.workbenches = item.workbenches; // commented this out by starday to fix issue with panel price taking the price of a sigle item
						retVal = item.workbenches[0].price;
					}
				}
			});
		}
		return retVal;
	}
	getTotalPrice() {
		let retVal = 0;
		this.bindInvestigations.forEach((bind) => {
			if (!bind.isExternal) {
				if (bind.location !== undefined) {
					if (bind.location.workbenches !== undefined) {
						bind.location.workbenches.forEach((item) => {
							retVal = retVal + item.price;
						});
					}
				}
			}
		});
		return retVal;
	}
	IsParentChecked(investigation, panel) {
		return (
			this.bindInvestigations.findIndex((x) => x.investigation._id === investigation.investigation._id) > -1 ||
			investigation.isChecked
		);
	}
	getParentLocation(investigation, panel) {
		// const index = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
		// if (index > -1 && this.bindInvestigations[index].location !== undefined) {
		//   return this.bindInvestigations[index].location.laboratoryId.name;
		// }
		if (investigation.location !== undefined) {
			return investigation.location.laboratoryId.name;
		}
		return '';
	}

	removeBindingInvestigation(investigation: InvestigationModel) {
		const indexToRemove = this.bindInvestigations.findIndex(
			(x) => x.investigation._id === investigation.investigation._id
		);
		this.bindInvestigations.splice(indexToRemove, 1);

		const invIndexToUncheck = this.investigations.findIndex(
			(x) => x.investigation._id === investigation.investigation._id
		);
		this.investigations[invIndexToUncheck].isChecked = false;
	}

	markExternal(event, investigation: InvestigationModel) {
		if (event.checked) {
			// Check if an item is selected to uncheck the save button.
			if (event.checked) {
				this.investigationRadio = true;
			} else {
				this.investigationRadio = false;
			}

			delete investigation.location;
			const indexToRemove = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);

			if (indexToRemove > -1) {
				this.bindInvestigations.splice(indexToRemove, 1);
			}

			investigation.isExternal = true;
			const copyBindInvestigation = JSON.parse(JSON.stringify(investigation));
			delete copyBindInvestigation.LaboratoryWorkbenches;
			delete copyBindInvestigation.investigation.LaboratoryWorkbenches;
			this.bindInvestigations.push(copyBindInvestigation);
		} else {
			const indexToRemove = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);
			if (indexToRemove > -1) {
				this.bindInvestigations.splice(indexToRemove, 1);
			}
			investigation.isExternal = false;
			this.investigationChanged({ checked: true }, investigation);
		}
	}

	getValue(investigation) {
		return false;
	}

	getPrice(workbenches) {
		return workbenches[0].price;
	}

	validateForm() {
		if (this.frmNewRequest.valid) {
			this.isValidateForm = true;
		} else if (
			this.selectedPatient !== undefined &&
			this.selectedPatient._id !== undefined &&
			this.selectedPatient._id.length > 0
		) {
			if (
				this.frmNewRequest.controls['clinicalInfo'].valid &&
				this.frmNewRequest.controls['diagnosis'].valid &&
				this.frmNewRequest.controls['investigation'].valid
			) {
				this.isValidateForm = true;
			}
		} else {
			this.isValidateForm = false;
		}
	}

	save(valid, value) {
		this.requestLoading = true;
		this.makingRequestBtn = true;
		this.makeRequestBtn = false;
		this.disableBtn = true;

		const copyBindInvestigation = JSON.parse(JSON.stringify(this.bindInvestigations));
		const readyCollection: any[] = [];

		copyBindInvestigation.forEach((item: any, i) => {
			if (item.investigation.isPanel) {
				delete item.isChecked;
				delete item.temporaryInvestigationList;
				item.investigation.panel.forEach((panel, j) => {
					delete panel.isChecked;
				});
			} else {
				delete item.isChecked;
				delete item.LaboratoryWorkbenches;
				delete item.location;
			}

			readyCollection.push(item);
		});

		const request: any = {
			facilityId: this.selectedFacility._id,
			patientId: this.isLaboratory ? this.selectedPatient._id : this.selectedPatient._id,
			labNumber: !this.isLaboratory ? this.frmNewRequest.controls['labNo'].value : value.labNo,
			clinicalInformation: this.frmNewRequest.controls['clinicalInfo'].value,
			minorLocationId:
				this.selectedLab.typeObject !== undefined
					? this.selectedLab.typeObject.minorLocationObject._id
					: undefined,
			diagnosis: this.frmNewRequest.controls['diagnosis'].value,
			investigations: readyCollection,
			createdBy: this.loginEmployee._id
		};

		if (!this.isLaboratory) {
			if (request.source === undefined) {
				if (this.appointment !== undefined && this.appointment.attendance !== undefined) {
					request.source = {};
					request.source.facilityId = this.appointment.facilityId;
					request.source.majorLocationId = this.appointment.attendance.majorLocationId;
					request.source.minorLocationId = this.appointment.attendance.minorLocationId;
					request.source.name = `${this.appointment.clinicId} (Clinic)`;
				}
			}
		}
		// Make request.
		this.requestService
			.customCreate(request)
			.then((res) => {
				if (res.status === 'success') {
					this.frmNewRequest.reset();
					this._getAllPendingRequests();
					this.bindInvestigations = [];
					this.investigations = [];
					this.selectedPatient = undefined;
					this._systemModuleService.announceSweetProxy('Request has been sent successfully!', 'success');
					this.requestLoading = false;
					this.makingRequestBtn = false;
					this.makeRequestBtn = true;
					this.disableBtn = false;
				} else {
					this._systemModuleService.announceSweetProxy(
						'There was a problem trying to send request!',
						'error'
					);
					this.requestLoading = false;
					this.makingRequestBtn = false;
					this.makeRequestBtn = true;
					this.disableBtn = false;
				}
			})
			.catch((err) => {
				this._systemModuleService.announceSweetProxy('There was a problem trying to send request!', 'error');
				this.requestLoading = false;
			});
	}

	externalChanged($event, investigation) {
		investigation.isExternal = $event.checked;
	}

	urgentChanged($event, investigation) {
		investigation.isUrgent = $event.checked;
	}

	private _getAllPendingRequests() {
		this.pendingRequests = [];
		if (
			this.patientId !== undefined &&
			this.patientId._id !== undefined &&
			this.patientId._id.length > 0 &&
			!this.isExternal
		) {
			this.request_view = true;
			this.requestService
				.customFind({
					query: {
						patientId: this.patientId._id,
						facilityId: this.selectedFacility._id,
						$sort: { createdAt: -1 }
					}
				})
				.then((res) => {
					this.loading = false;
					let labId = '';
					if (
						this.selectedLab !== undefined &&
						this.selectedLab !== null &&
						this.selectedLab.typeObject !== undefined
					) {
						labId = this.selectedLab.typeObject.minorLocationId;
					}

					// Filter investigations based on the laboratory Id
					res.data.forEach((labRequest) => {
						labRequest.investigations.forEach((investigation) => {
							if (this.isLaboratory === true) {
								if (
									// investigation.isSaved === undefined ||
									// !investigation.isSaved ||
									// ((investigation.isUploaded === undefined ||
									//   !investigation.isUploaded) &&
									!!investigation.investigation &&
									!!investigation.investigation.LaboratoryWorkbenches &&
									investigation.investigation.LaboratoryWorkbenches.length > 0 &&
									labId === investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id
								) {
									const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
									if (!!investigation.isSaved || !!investigation.isUploaded) {
										pendingLabReq.report = investigation.report;
										pendingLabReq.isSaved = investigation.isSaved;
										pendingLabReq.isUploaded = investigation.isUploaded;
									}
									pendingLabReq.labRequestId = labRequest._id;
									pendingLabReq.facility = labRequest.facilityId;
									pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
									pendingLabReq.isPaid = labRequest.isPaid;
									pendingLabReq.diagnosis = labRequest.diagnosis;
									pendingLabReq.labNumber = labRequest.labNumber;
									pendingLabReq.patientId = labRequest.patientId;
									pendingLabReq.patient = labRequest.personDetails;
									pendingLabReq.isExternal = investigation.isExternal;
									pendingLabReq.isUrgent = investigation.isUrgent;
									if (investigation.location !== undefined) {
										pendingLabReq.minorLocation = investigation.location.laboratoryId;
									}

									pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
									pendingLabReq.isPanel = investigation.investigation.isPanel;
									pendingLabReq.name = investigation.investigation.name;
									pendingLabReq.reportType = investigation.investigation.reportType;
									pendingLabReq.specimen = investigation.investigation.specimen;
									pendingLabReq.service = investigation.investigation.serviceId;
									pendingLabReq.unit = investigation.investigation.unit;
									pendingLabReq.investigationId = investigation.investigation._id;
									pendingLabReq.createdAt = labRequest.createdAt;
									pendingLabReq.updatedAt = labRequest.updatedAt;
									pendingLabReq.createdById = labRequest.createdBy;
									pendingLabReq.createdBy = labRequest.employeeDetails;

									if (investigation.specimenReceived !== undefined) {
										pendingLabReq.specimenReceived = investigation.specimenReceived;
									}
									if (investigation.specimenNumber !== undefined) {
										pendingLabReq.specimenNumber = investigation.specimenNumber;
									}

									if (investigation.sampleTaken !== undefined) {
										pendingLabReq.sampleTaken = investigation.sampleTaken;
									}
									if (investigation.sampleTakenBy !== undefined) {
										pendingLabReq.sampleTakenBy = investigation.sampleTakenBy;
									}

									this.pendingRequests.push(pendingLabReq);
								}
							} else {
								const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
								if (!!investigation.isSaved || !!investigation.isUploaded) {
									pendingLabReq.report = investigation.report;
									pendingLabReq.isSaved = investigation.isSaved;
									pendingLabReq.isUploaded = investigation.isUploaded;
								}
								pendingLabReq.labRequestId = labRequest._id;
								pendingLabReq.facility = labRequest.facilityId;
								pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
								pendingLabReq.isPaid = labRequest.isPaid;
								pendingLabReq.diagnosis = labRequest.diagnosis;
								pendingLabReq.labNumber = labRequest.labNumber;
								pendingLabReq.patientId = labRequest.patientId;
								pendingLabReq.patient = labRequest.personDetails;
								pendingLabReq.isExternal = investigation.isExternal;
								pendingLabReq.isUrgent = investigation.isUrgent;
								if (investigation.location !== undefined) {
									pendingLabReq.minorLocation = investigation.location.laboratoryId;
								}

								pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
								pendingLabReq.isPanel = investigation.investigation.isPanel;
								pendingLabReq.name = investigation.investigation.name;
								pendingLabReq.reportType = investigation.investigation.reportType;
								pendingLabReq.specimen = investigation.investigation.specimen;
								pendingLabReq.service = investigation.investigation.serviceId;
								pendingLabReq.unit = investigation.investigation.unit;
								pendingLabReq.investigationId = investigation.investigation._id;
								pendingLabReq.createdAt = labRequest.createdAt;
								pendingLabReq.updatedAt = labRequest.updatedAt;
								pendingLabReq.createdById = labRequest.createdBy;
								pendingLabReq.createdBy = labRequest.employeeDetails;

								if (investigation.specimenReceived !== undefined) {
									pendingLabReq.specimenReceived = investigation.specimenReceived;
								}
								if (investigation.specimenNumber !== undefined) {
									pendingLabReq.specimenNumber = investigation.specimenNumber;
								}

								if (investigation.sampleTaken !== undefined) {
									pendingLabReq.sampleTaken = investigation.sampleTaken;
								}
								if (investigation.sampleTakenBy !== undefined) {
									pendingLabReq.sampleTakenBy = investigation.sampleTakenBy;
								}

								this.pendingRequests.push(pendingLabReq);
							}
						});
					});
				})
				.catch((err) => {});
		} else {
			this.requestService
				.customFind({ query: { facilityId: this.selectedFacility._id, $sort: { createdAt: -1 } } })
				.then((res) => {
					this.loading = false;
					let labId = '';
					if (this.selectedLab !== null && this.selectedLab.typeObject !== undefined) {
						labId = this.selectedLab.typeObject.minorLocationId;
					}

					// Filter investigations based on the laboratory Id
					res.data.forEach((labRequest) => {
						labRequest.investigations.forEach((investigation) => {
							if (
								// investigation.isSaved === undefined ||
								// !investigation.isSaved ||
								// ((investigation.isUploaded === undefined ||
								//   !investigation.isUploaded) &&
								!!investigation.investigation &&
								!!investigation.investigation.LaboratoryWorkbenches &&
								investigation.investigation.LaboratoryWorkbenches.length > 0 &&
								labId === investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id
							) {
								const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
								if (!!investigation.isSaved || !!investigation.isUploaded) {
									pendingLabReq.report = investigation.report;
									pendingLabReq.isSaved = investigation.isSaved;
									pendingLabReq.isUploaded = investigation.isUploaded;
								}
								pendingLabReq.labRequestId = labRequest._id;
								pendingLabReq.facility = labRequest.facilityId;
								pendingLabReq.isPaid = labRequest.isPaid;
								pendingLabReq.isWaved = labRequest.isWaved;
								pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
								pendingLabReq.diagnosis = labRequest.diagnosis;
								pendingLabReq.labNumber = labRequest.labNumber;
								pendingLabReq.patientId = labRequest.patientId;
								pendingLabReq.patient = labRequest.personDetails;
								pendingLabReq.isExternal = investigation.isExternal;
								pendingLabReq.isUrgent = investigation.isUrgent;
								if (investigation.location !== undefined) {
									pendingLabReq.minorLocation = investigation.location.laboratoryId;
								}

								pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
								pendingLabReq.isPanel = investigation.investigation.isPanel;
								pendingLabReq.name = investigation.investigation.name;
								pendingLabReq.reportType = investigation.investigation.reportType;
								pendingLabReq.specimen = investigation.investigation.specimen;
								pendingLabReq.service = investigation.investigation.serviceId;
								pendingLabReq.unit = investigation.investigation.unit;
								pendingLabReq.investigationId = investigation.investigation._id;
								pendingLabReq.createdAt = labRequest.createdAt;
								pendingLabReq.updatedAt = labRequest.updatedAt;
								pendingLabReq.createdById = labRequest.createdBy;
								pendingLabReq.createdBy = labRequest.employeeDetails;
								if (investigation.specimenReceived !== undefined) {
									pendingLabReq.specimenReceived = investigation.specimenReceived;
								}
								if (investigation.specimenNumber !== undefined) {
									pendingLabReq.specimenNumber = investigation.specimenNumber;
								}

								if (investigation.sampleTaken !== undefined) {
									pendingLabReq.sampleTaken = investigation.sampleTaken;
								}
								if (investigation.sampleTakenBy !== undefined) {
									pendingLabReq.sampleTakenBy = investigation.sampleTakenBy;
								}
								pendingLabReq.source = labRequest.source;
								this.pendingRequests.push(pendingLabReq);
							}
						});
					});
				})
				.catch((err) => {});
		}
	}

	goToWriteReport(request: any) {
		this._router.navigate([
			'/dashboard/laboratory/report/' + request.labRequestId + '/' + request.investigationId
		]);
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}

	// Notification
	private _notification(type: string, text: string): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	ngOnDestroy() {
		this.routeSubscription.unsubscribe();
	}
}
