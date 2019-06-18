import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UUID } from 'angular2-uuid';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import * as format from 'date-fns/format';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
	BillIGroup,
	BillItem,
	Documentation,
	Employee,
	Facility,
	InvestigationModel,
	Patient,
	PatientDocumentation
} from '../../../../../models/index';
import {
	BillingService,
	DocumentationService,
	FacilitiesService,
	FormsService,
	LaboratoryRequestService,
	PrescriptionPriorityService,
	PrescriptionService,
	DocumentUploadService
} from '../../../../../services/facility-manager/setup/index';
import { FormTypeService } from '../../../../../services/module-manager/setup/index';
import { SharedService } from '../../../../../shared-module/shared.service';

@Component({
	selector: 'app-documentation',
	templateUrl: './documentation.component.html',
	styleUrls: [ './documentation.component.scss' ]
})
export class DocumentationComponent implements OnInit, OnDestroy {
	currentDocument: any;
	@Input() patient;
	docDetail_view = false;
	clinicalNote_view = false;
	addProblem_view = false;
	addAllergy_view = false;
	addHistory_view = false;
	addVitals_view = false;
	addendumPop = false;
	editClick = false;
	isDocumentEdit = false;

	showPrintPop = false;
	showDoc = true;
	showOrderSet = false;

	expanded = false;
	expandedChild = false;

	selectedFacility: Facility = <Facility>{};
	selectedMiniFacility: Facility = <Facility>{};
	loginEmployee: any = <any>{};
	selectedForm: any = <any>{};
	selectedDocument: PatientDocumentation = <PatientDocumentation>{};
	patientDocumentation: Documentation = <Documentation>{};
	documents: any[] = [];
	mainDocuments: any[] = [];
	docDocuments: any[] = [];
	auth: any;
	subscription: Subscription;
	draftSubscription: Subscription;
	priority: any = <any>{};
	public tableChartData = [];
	vitalsObjArray = [];
	hasSavedDraft = false;
	draftDocument: any;
	constructor(
		private formService: FormsService,
		private locker: CoolLocalStorage,
		private documentationService: DocumentationService,
		private formTypeService: FormTypeService,
		private sharedService: SharedService,
		private facilityService: FacilitiesService,
		private requestService: LaboratoryRequestService,
		private billingService: BillingService,
		private _prescriptionService: PrescriptionService,
		private authFacadeService: AuthFacadeService,
		private _priorityService: PrescriptionPriorityService,
		private systemModuleService: SystemModuleService,
		private docUploadService: DocumentUploadService
	) {
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
		});

		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.selectedMiniFacility = <Facility>this.locker.getObject('miniFacility');

		this.subscription = this.sharedService.submitForm$.subscribe((payload) => {
			if (!this.hasSavedDraft) {
				const doc: PatientDocumentation = <PatientDocumentation>{};
				doc.document = { documentType: this.selectedForm, body: payload };

				doc.createdBy =
					this.loginEmployee.personDetails.title +
					' ' +
					this.loginEmployee.personDetails.lastName +
					' ' +
					this.loginEmployee.personDetails.firstName;
				doc.facilityId = this.selectedFacility._id;
				doc.facilityName = this.selectedFacility.name;
				(doc.patientId = this.patient._id),
					(doc.patientName =
						this.patient.personDetails.title +
						' ' +
						this.patient.personDetails.lastName +
						' ' +
						this.patient.personDetails.firstName);
				this.patientDocumentation.documentations.push(doc);
				// Get the raw orderset data and send to different destination.
				this._listenAndSaveRawOrderSetData();

				this.documentationService.update(this.patientDocumentation).then(
					(pay) => {
						this.getPersonDocumentation();
						this.getDocuments();
						this._notification('Success', 'Documentation successfully saved!');
					},
					(error) => {}
				);
			} else {
				Object.assign(this.draftDocument.document.body, payload);
				const doc = this.draftDocument;
				doc.documentationStatus = 'Completed';
				const draftIndex = this.patientDocumentation.documentations.findIndex(
					(x) => x.apmisGuid === this.draftDocument.apmisGuid
				);
				if (draftIndex > -1) {
					this.patientDocumentation.documentations[draftIndex] = doc;
				}
				// this.patientDocumentation.documentations.push(doc);
				// Get the raw orderset data and send to different destination.
				this._listenAndSaveRawOrderSetData();

				this.documentationService.update(this.patientDocumentation).then(
					(pay) => {
						this.draftDocument = undefined;
						this.hasSavedDraft = false;
						this.sharedService.announceFinishedSavingDraft(false);
						this.getPersonDocumentation();
						this.getDocuments();
						this._notification('Success', 'Documentation successfully saved!');
					},
					(eror) => {}
				);
			}
		});

		this.subscription = this.sharedService.newFormAnnounced$.subscribe((payload: any) => {
			if (payload.isEditing === false) {
				this.draftDocument = undefined;
				this.hasSavedDraft = false;
				this.selectedForm = payload.form;
			} else {
				this.hasSavedDraft = true;
			}
		});

		this.subscription = this.documentationService.announceDocumentation$.subscribe((payload) => {
			this.getPersonDocumentation();
			this.getDocuments();
		});

		this.draftSubscription = this.sharedService.announceSaveDraft$.subscribe(
			(payload) => {
				if (Object.keys(payload).length > 0 && payload.constructor === Object) {
					this.sharedService.announceFinishedSavingDraft(false);
					if (!this.hasSavedDraft) {
						// this.sharedService.announceFinishedSavingDraft(true);
						const apmisGuid = UUID.UUID();
						const doc: PatientDocumentation = <PatientDocumentation>{};
						doc.document = { documentType: this.selectedForm, body: payload };
						doc.createdBy =
							this.loginEmployee.personDetails.title +
							' ' +
							this.loginEmployee.personDetails.lastName +
							' ' +
							this.loginEmployee.personDetails.firstName;
						doc.createdById = this.loginEmployee._id;
						doc.facilityId = this.selectedFacility._id;
						doc.facilityName = this.selectedFacility.name;
						(doc.patientId = this.patient._id),
							(doc.patientName =
								this.patient.personDetails.title +
								' ' +
								this.patient.personDetails.lastName +
								' ' +
								this.patient.personDetails.firstName);
						doc.documentationStatus = 'Draft';
						doc.apmisGuid = apmisGuid;
						this.draftDocument = doc;
						this.patientDocumentation.documentations.push(doc);

						let documentationList = this.patientDocumentation.documentations;
						this.documentationService.update(this.patientDocumentation).then(
							(pay) => {
								this.hasSavedDraft = true;
								this.sharedService.announceFinishedSavingDraft(true);
								this.getPersonDocumentation();
								this.getDocuments();
							},
							(error) => {}
						);
					} else {
						// this.sharedService.announceFinishedSavingDraft(true);
						if (this.draftDocument !== undefined) {
							this.draftDocument.document.body = payload;

							const draftIndex = this.patientDocumentation.documentations.findIndex(
								(x) => x.apmisGuid === this.draftDocument.apmisGuid
							);
							if (draftIndex > -1) {
								this.patientDocumentation.documentations[draftIndex] = this.draftDocument;
								this.documentationService.update(this.patientDocumentation).then((pay) => {
									this.hasSavedDraft = true;
									this.sharedService.announceFinishedSavingDraft(true);

									this.getPersonDocumentation();
									this.getDocuments();
								});
							}
						}
					}
				}
			},
			(error) => {}
		);

		this.subscription = this.documentationService.listenerUpdate.subscribe((payload) => {
			this.patientDocumentation = payload;
		});
	}

	ngOnInit() {
		this.getPersonDocumentation();
		this.auth = this.locker.getObject('auth');
		this._getAllPriorities();
		this.getDocuments();
	}
	getPersonDocumentation() {
		this.documentationService
			.find({
				query: {
					personId: this.patient.personId,
					$sort: { 'documentations.updatedAt': -1 }
				}
			})
			.then((payload: any) => {
				if (payload.data.length === 0) {
					this.patientDocumentation.personId = this.patient.personDetails;
					this.patientDocumentation.documentations = [];
					this.subscription = this.documentationService
						.create(this.patientDocumentation)
						.subscribe((pload) => {
							this.patientDocumentation = pload;
						});
				} else {
					if (payload.data[0].documentations.length === 0) {
						this.patientDocumentation = payload.data[0];
					} else {
						const mload = payload;
						if (mload.data.length > 0) {
							this.patientDocumentation = mload.data[0];
							if (this.hasSavedDraft && this.draftDocument !== undefined) {
								const draftIndex = this.patientDocumentation.documentations.findIndex(
									(x) => x.apmisGuid === this.draftDocument.apmisGuid
								);
								if (draftIndex > -1) {
									this.draftDocument = this.patientDocumentation.documentations[draftIndex];
									// this.sharedService.announceFinishedSavingDraft(false);
								}
							}

							this.populateDocuments();
							// mload.data[0].documentations[0].documents.push(doct);
						}
						// this.documentationService.find({
						//   query:
						//     {
						//       'personId': this.patient.personId, //
						//       'documentations.patientId': this.patient._id,
						//       // $select: ['documentations.documents',
						//       'documentations.facilityId']
						//     }
						// }).subscribe((mload: any) => {
						//   if (mload.data.length > 0) {
						//     this.patientDocumentation = mload.data[0];
						//     if (this.hasSavedDraft && this.draftDocument !== undefined)
						//     {
						//       const draftIndex =
						//       this.patientDocumentation.documentations.findIndex(x =>
						//       x.apmisGuid === this.draftDocument.apmisGuid); if
						//       (draftIndex > -1) {
						//         this.draftDocument =
						//         this.patientDocumentation.documentations[draftIndex];
						//         this.sharedService.announceFinishedSavingDraft(false);
						//       }
						//     }

						//     this.populateDocuments();
						//     // mload.data[0].documentations[0].documents.push(doct);
						//   }
						// })
					}
				}
			});
	}

	_listenAndSaveRawOrderSetData() {
		this.subscription = this.sharedService.announceBilledOrderSet$.subscribe((value: any) => {
			if (!!value) {
				if (!!value.investigations) {
					const saveLab = this._saveLabRequest(value.investigations);
				}

				if (!!value.medications) {
					const saveMedication = this._saveMedication(value.medications);
				}
			}
		});
	}

	private _saveMedication(medications) {
		// this.deleteUnncessaryPatientData();
		const prescriptions = {
			// clinicId: (!!this.selectedAppointment.clinicId) ?
			// this.selectedAppointment.clinicId : undefined,
			priority: { id: this.priority._id, name: this.priority.name },
			facilityId: this.selectedFacility._id,
			employeeId: this.loginEmployee._id,
			patientId: this.patient._id,
			personId: this.patient.personId,
			prescriptionItems: medications,
			isAuthorised: true,
			totalCost: 0,
			totalQuantity: 0
		};

		this._prescriptionService
			.authorizePresciption(prescriptions)
			.then((res) => {
				if (res.status === 'success') {
					return true;
				} else {
					return false;
				}
			})
			.catch((err) => {});

		// // bill model
		// const billItemArray = [];
		// let totalCost = 0;
		// prescriptions.prescriptionItems.forEach(element => {
		//   if (element.isBilled) {
		//     const billItem = <BillItem>{
		//       facilityServiceId: element.facilityServiceId,
		//       serviceId: element.serviceId,
		//       facilityId: this.selectedMiniFacility._id,
		//       patientId: this.patient._id,
		//       isBearerConfirmed: true,
		//       covered: {
		//         coverType: "wallet"
		//       },
		//       patientObject: this.patient,
		//       description: element.productName,
		//       quantity: element.quantity,
		//       totalPrice: element.totalCost,
		//       unitPrice: element.cost,
		//       unitDiscountedAmount: 0,
		//       totalDiscoutedAmount: 0,
		//     };

		//     totalCost += element.totalCost;
		//     billItemArray.push(billItem);
		//   }
		// });

		// const bill = <BillIGroup>{
		//   facilityId: this.selectedMiniFacility._id,
		//   patientId: this.patient._id,
		//   billItems: billItemArray,
		//   discount: 0,
		//   subTotal: totalCost,
		//   grandTotal: totalCost,
		// }

		// // If any item was billed, then call the billing service
		// if (billItemArray.length > 0) {
		//   // send the billed items to the billing service
		//   this.billingService.create(bill).then(res => {
		//     if (res._id !== undefined) {
		//       prescriptions.billId = res._id;
		//       // if this is true, send the prescribed drugs to the prescription
		//       service this._prescriptionService.create(prescriptions).then(pRes
		//       => {
		//         this._notification('Success', 'Prescription has been sent!');
		//       }).catch(err => {
		//         this._notification('Error', 'There was an error creating
		//         prescription. Please try again later.');
		//       });
		//     } else {
		//       this._notification('Error', 'There was an error generating bill.
		//       Please try again later.');
		//     }
		//   }).catch(err => console.error(err));
		// } else {
		//   // Else, if no item was billed, just save to the prescription table.
		//   this._prescriptionService.create(prescriptions).then(res => {
		//     this._notification('Success', 'Prescription has been sent!');
		//   }).catch(err => {
		//     this._notification('Error', 'There was an error creating
		//     prescription. Please try again later.');
		//   });
		// }
	}

	private _saveLabRequest(labRequests) {
		// this.deleteUnncessaryPatientData();

		// const logEmp = this.loginEmployee;
		// delete logEmp.department;
		// delete logEmp.employeeFacilityDetails;
		// delete logEmp.role;
		// delete logEmp.units;
		// delete logEmp.consultingRoomCheckIn;
		// delete logEmp.storeCheckIn;
		// delete logEmp.unitDetails;
		// delete logEmp.professionObject;
		// delete logEmp.workSpaces;
		// delete logEmp.employeeDetails.countryItem;
		// delete logEmp.employeeDetails.homeAddress;
		// delete logEmp.employeeDetails.gender;
		// delete logEmp.employeeDetails.maritalStatus;
		// delete logEmp.employeeDetails.nationality;
		// delete logEmp.employeeDetails.nationalityObject;
		// delete logEmp.employeeDetails.nextOfKin;
		// delete logEmp.workbenchCheckIn;

		const copyBindInvestigation = labRequests;
		const readyCollection: any[] = [];

		copyBindInvestigation.forEach((item, i) => {
			if (!!item.investigation && item.investigation.investigation.isPanel) {
				delete item.investigation.isChecked;
				item.investigation.investigation.panel.forEach((panel, j) => {
					delete panel.isChecked;
				});
			} else if (!!item.investigation && !item.investigation.investigation.isPanel) {
				delete item.investigation.isChecked;
				delete item.investigation.LaboratoryWorkbenches;
				delete item.investigation.location;
				readyCollection.push(item.investigation);
			} else {
				// readyCollection.push(item);
			}
		});

		const request: any = {
			facilityId: this.selectedFacility._id,
			patientId: this.patient._id,
			investigations: readyCollection,
			createdBy: this.loginEmployee._id
		};

		this.requestService.customCreate(request).then((res) => {
			if (res.status === 'success') {
				return true;
			} else {
				return false;
			}
		});

		// const billGroup: BillIGroup = <BillIGroup>{};
		// billGroup.discount = 0;
		// billGroup.facilityId = this.selectedMiniFacility._id;
		// billGroup.grandTotal = 0;
		// billGroup.isWalkIn = false;
		// billGroup.patientId = this.patient._id;
		// billGroup.subTotal = 0;
		// // billGroup.userId = '';
		// billGroup.billItems = [];
		// readyCollection.forEach(item => {
		//   if (!item.isExternal) {
		//     const billItem: BillItem = <BillItem>{};
		//     billItem.unitPrice =
		//     item.investigation.LaboratoryWorkbenches[0].workbenches[0].price;
		//     billItem.facilityId = this.selectedMiniFacility._id;
		//     billItem.description = '';
		//     billItem.facilityServiceId = item.investigation.facilityServiceId;
		//     billItem.serviceId = item.investigation.serviceId;
		//     billItem.itemName = item.investigation.name;
		//     billItem.patientId = this.patient._id;
		//     billItem.quantity = 1;
		//     billItem.totalPrice = billItem.quantity * billItem.unitPrice;
		//     billItem.unitDiscountedAmount = 0;
		//     billItem.totalDiscoutedAmount = 0;
		//     billGroup.subTotal = billGroup.subTotal + billItem.totalPrice;
		//     billGroup.grandTotal = billGroup.subTotal;
		//     billGroup.billItems.push(billItem);
		//   }
		// })

		// if (billGroup.billItems.length > 0) {
		//   const request$ =
		//   Observable.fromPromise(this.requestService.create(request)); const
		//   billing$ =
		//   Observable.fromPromise(this.billingService.create(billGroup));
		//   Observable.forkJoin([request$, billing$]).subscribe((results: any) => {
		//     // const request = results[0];
		//     const billing = results[1];
		//     delete billing.facilityItem;
		//     delete billing.patientItem;
		//     billing.billItems.forEach(item => {
		//       delete item.facilityServiceObject;
		//       delete item.modifierId;
		//       delete item.paymentStatus;
		//       delete item.paments;
		//       delete item.serviceModifierOject
		//     });
		//     results[0].billingId = billing;
		//     this.requestService.update(results[0]).then(payload => {
		//       this._notification('Success', 'Request has been sent
		//       successfully!');
		//     }).catch(err => {
		//     });
		//   });
		// } else {
		//   this.requestService.create(request).then(payload => {
		//     this._notification('Success', 'Request has been sent successfully!');
		//   }).catch(err => {
		//   });
		// }
	}

	// private deleteUnncessaryPatientData() {
	//   delete this.patient.appointments;
	//   delete this.patient.encounterRecords;
	//   delete this.patient.orders;
	//   delete this.patient.tags;
	//   delete this.patient.personDetails.addressObj;
	//   delete this.patient.personDetails.countryItem;
	//   delete this.patient.personDetails.homeAddress;
	//   delete this.patient.personDetails.maritalStatus;
	//   delete this.patient.personDetails.nationality;
	//   delete this.patient.personDetails.nationalityObject;
	//   delete this.patient.personDetails.nextOfKin;
	//   delete this.patient.personDetails.wallet;
	// }

	private _getAllPriorities() {
		this._priorityService
			.findAll()
			.then((res) => {
				const priority = res.data.filter((x) => x.name.toLowerCase().includes('normal'));
				if (priority.length > 0) {
					this.priority = priority[0];
				} else {
					this.priority = res.data[0];
				}
			})
			.catch((err) => {});
	}

	getvitalCharts(vitals) {
		this.tableChartData = vitals;
	}

	populateDocuments() {
		this.mainDocuments = [];
		this.docDocuments = [];
		this.documents = [];
		this.patientDocumentation.documentations.forEach((documentation) => {
			if (documentation.facilityName === undefined) {
				documentation.facilityName = this.selectedFacility.name;
			}
			if (
				(documentation.document !== undefined &&
					documentation.document.documentType &&
					documentation.document.documentType.isSide === false) ||
				(documentation.document !== undefined &&
					documentation.document.documentType &&
					documentation.document.documentType.isSide === undefined)
			) {
				const createdById = this.loginEmployee._id;
				const facilityId = this.selectedFacility._id;
				if (documentation.documentationStatus !== 'Draft') {
					this.mainDocuments.push(documentation);
				} else if (documentation.createdById === createdById && documentation.facilityId === facilityId) {
					this.hasSavedDraft = true;
					this.draftDocument = documentation;
					this.mainDocuments.push(documentation);
					this.clinicalNote_view = true;
				}
			} else {
				if (
					documentation.document !== undefined &&
					documentation.document.documentType.isSide === true &&
					documentation.document.documentType.title === 'Problems'
				) {
					this.mainDocuments.push(documentation);
				} else if (
					documentation.document !== undefined &&
					documentation.document.documentType.isSide === true &&
					documentation.document.documentType.title === 'Vitals'
				) {
					this.tableChartData = documentation.document.body.vitals;
					this.mainDocuments.push(documentation);
				} else {
					this.mainDocuments.push(documentation);
				}
			}
		});
		const reverseDocuments = this.mainDocuments.reverse();
		const grouped = this.groupBy(reverseDocuments, (reverseDocument) =>
			format(reverseDocument.createdAt, 'DD/MM/YYYY')
		);
		// this.documents = Array.from(grouped);
		this.documents = [ ...this.documents, ...Array.from(grouped) ];
	}

	getDocuments() {
		this.docUploadService
			.docUploadFind({
				query: {
					patientId: this.patient._id,
					facilityId: this.facilityService.getSelectedFacilityId()._id,
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				// this.documents = payload.data;
				payload.data.forEach((document) => {
					this.docDocuments.push({ createdAt: document.createdAt, document: document });
				});
				const reverseDocuments = this.docDocuments.reverse();
				const grouped = this.groupBy(reverseDocuments, (reverseDocument) =>
					format(reverseDocument.createdAt, 'DD/MM/YYYY')
				);
				this.documents = [ ...this.documents, ...Array.from(grouped) ];
			});
	}
	checkType(value) {
		if (typeof value === 'string') {
			return true;
		} else if (typeof value === 'number') {
			return true;
		} else if (value.length !== undefined) {
			return true;
		}
	}
	edit(document: any) {
		if (document.documentationStatus === 'Draft') {
			this.clinicalNote_view = false;
			this.clinicalNote_view = true;
			const obj = {
				json: document.document.documentType.body,
				form: document.document.documentType,
				isManual: false,
				isEditing: true
			};
			this.sharedService.announceNewForm(obj);
			this.sharedService.announceEditDocumentation({ document: document.document.body, leg: 0, main: obj });
			this.hasSavedDraft = true;
			this.draftDocument = document;
		} else {
			this.hasSavedDraft = false;
			// this.clinicalNote_view = false;
			this.systemModuleService.announceSweetProxy(
				'Completed documentation can not be edited!',
				'warning',
				null,
				null,
				null,
				null,
				null,
				null,
				null
			);
		}
	}
	toObject(arr) {
		const rv = {};
		for (let i = 0; i < arr.length; ++i) {
			rv[i] = arr[i];
		}
		return rv;
	}
	analyseObject(object) {
		const props = Object.getOwnPropertyNames(object);
		const docs: any[] = [];
		props.forEach((prop, i) => {
			const property = prop.toString();
			docs.push({ property: object[prop] });
		});

		// const arr = Object.keys(object).map(function (k) { return object[k] });
		// const arr = Object.keys(object).map(function(_) { return object[_]; })
		// const obj = JSON.parse(object);
		// const splitObject = JSON.stringify(object).split(':'); //.replace('{"',
		// '')
		return object;
	}
	trimKey(value) {
		const init = value.replace('{"', '');
		return init.replace('"', '');
	}
	trimValue(value) {
		const init = value.replace('"', '');
		return init.replace('"}', '');
	}
	docDetail_show(document, isDocumentEdit) {
		this.selectedDocument = document;
		this.docDetail_view = true;
		this.isDocumentEdit = isDocumentEdit;
	}

	clinicalNote_show() {
		this.clinicalNote_view = !this.clinicalNote_view;
	}
	addProblem_show(e) {
		this.addProblem_view = true;
	}
	addAllergy_show(e) {
		this.addAllergy_view = true;
	}
	addHistory_show(e) {
		this.addHistory_view = true;
	}
	addVitals_show(e) {
		this.addVitals_view = true;
	}

	close_onClick(message: boolean): void {
		this.docDetail_view = false;
		this.clinicalNote_view = false;
		this.addProblem_view = false;
		this.addAllergy_view = false;
		this.addHistory_view = false;
		this.addVitals_view = false;
		this.showPrintPop = false;
		this.getPersonDocumentation();
		this.getDocuments();
	}

	showOrderset_onClick(e) {
		this.showDoc = false;
		this.showOrderSet = true;
	}
	showDoc_onClick(e) {
		this.showDoc = true;
		this.showOrderSet = false;
	}

	showPrintPopClick(e) {
		this.showPrintPop = true;
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
		this.draftSubscription.unsubscribe();
		this.draftDocument = undefined;
		// this.patient = undefined;
	}

	private _notification(type: string, text: string): void {
		this.facilityService.announceNotification({ users: [ this.auth._id ], type: type, text: text });
	}

	onClickeditClick() {
		this.editClick = !this.editClick;
	}

	node_toggle(document) {
		if (this.currentDocument !== undefined && document === this.currentDocument) {
			this.currentDocument = undefined;
		} else {
			this.currentDocument = document;
		}
	}
	should_show(document) {
		return this.currentDocument === undefined ? false : this.currentDocument._id === document._id;
	}
	nodeChild_toggle() {
		this.expandedChild = !this.expandedChild;
	}

	groupBy(list, keyGetter) {
		const map = new Map();
		list.forEach((item) => {
			const key = keyGetter(item);
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [ item ]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}

	getCurrentDocument(group) {
		return {
			url: group.docUrl
		};
	}

	onComplete(event) {
		// this.loading = false;
	}
	onError(event) {
		// this.loading = false;
		// this.loadingError = true;
	}
	onProgress(progressData: any) {}


	docDetail_Print(){
		const printContents = document.getElementById('printDoc').innerHTML;
		const popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
		  <html>
			<head>
			  <title></title>
			  <style>

			  .tree-child{
				display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: start;
					-ms-flex-pack: start;
					justify-content: flex-start;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					z-index: 2;
					position: relative;
					padding: 10px;
				}
				
				
				.node-child-title {
					font-size: 1.4rem;
					color: #194985;
				}
				
				
				.node-child-content {
					background: #fff;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
					margin-bottom: 10px;
				}
				
				.docCard-header {
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					justify-content: space-between;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					width: 100%;
					height: 35px;
					background: #e2e2e2;
					border-bottom: 1px solid #e2e2e2;
					padding: 5px;
					-webkit-box-sizing: border-box;
					box-sizing: border-box;
				}
				
				.empWrap {
					display: -webkit-box;
					display: -ms-flexbox;
					display: flex;
					-webkit-box-pack: justify;
					-ms-flex-pack: justify;
					justify-content: space-between;
					-webkit-box-align: center;
					-ms-flex-align: center;
					align-items: center;
					cursor: pointer;
				}
				
				.list-img{
					width: 30px;
					height: 30px;
					border-radius: 100%;
					margin-right: 10px;
				}
				
				.val-tag {
					font-size: 0.9rem;
					color: #0288D1;
				}
				
				.list-label {
					font-size: 1.2rem;
					color: #000;
				}
				
				.docCard-header, .docCard-body {
					position: relative;
					width: 99%;
					margin: 0 auto;
				}
				
				.cardSect-wrap {
					margin-bottom: 20px;
					margin-left: 10px;
					margin-top: -10px;
				}
				.card-sect {
					margin-top: 20px;
				}
				.docCard-sectContent {
					font-size: 1.2rem;
					line-height: 1.5;
					color: #474747;
					letter-spacing: 0.3px;
				}
				
				.doc-list-wrap {
					padding-bottom: 10px;
				}
				
				.sect-key {
					font-size: 1rem;
					color: #0288D1;
					margin-top: 20px;
					text-decoration: underline;
				}
				
				.sect-value {
					line-height: 1.7;
					margin-left: 10px;
					margin-right: 10px;
					text-align: justify;
				}	
			  </style>
			</head>
			<body onload="window.print();window.close()">
			${printContents}
			</body>
		  </html>`);
		popupWin.document.close();
	  }
}
