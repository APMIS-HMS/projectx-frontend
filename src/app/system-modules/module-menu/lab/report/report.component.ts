import { Component, OnInit, Output, Input, OnDestroy } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FacilitiesService,
	LaboratoryRequestService,
	LaboratoryReportService,
	DocumentationService,
	FormsService,
	BillingService,
	DocumentUploadService
} from '../../../../services/facility-manager/setup/index';
import { Facility, User, PendingLaboratoryRequest } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { ISubscription } from '../../../../../../node_modules/rxjs/Subscription';
import { LabEventEmitterService } from '../../../../services/facility-manager/lab-event-emitter.service';

@Component({
	selector: 'app-report',
	templateUrl: './report.component.html',
	styleUrls: [ './report.component.scss' ]
})
export class ReportComponent implements OnInit, OnDestroy {
	patientSearch = new FormControl();
	patientSearch2 = new FormControl();
	@Output() selectedInvestigationData: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
	reportFormGroup: FormGroup;
	// panelReportFormGroup: FormGroup;
	patientFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	selectedForm: any = <any>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	selectedInvestigation: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
	selectedLab: any = {};
	selectedWorkbench: any = {};
	apmisLookupUrl = 'patient-search';
	apmisLookupText = '';
	apmisLookupQuery: any = {};
	apmisLookupDisplayKey = 'firstName';
	apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
	apmisInvestigationLookupUrl = 'investigations';
	// apmisLookupOtherKeys = ['personDetails.email', 'personDetails.dateOfBirth'];
	apmisLookupOtherKeys = [ 'lastName', 'firstName', 'apmisId', 'email' ];
	selectedPatient: any = <any>{};
	patientSelected: Boolean = false;
	loading: Boolean = true;
	reportLoading: Boolean = true;
	pendingReLoading: Boolean = true;
	requests: any[] = [];
	pendingRequests: any[] = [];
	reports: any[] = [];
	hasRequest: Boolean = false;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	numericReport = false;
	textReport = true;
	docAction = true;
	diagnosisAction = true;
	report_view = false;
	repDetail_view = false;
	activeInvestigationNo: number = -1;
	referenceValue: any = [];
	saveAndUploadBtnText: String = 'SAVE AND PUBLISH';
	saveToDraftBtnText: String = 'SAVE AS DRAFT';
	disablePaymentBtn: Boolean = false;
	importTemplate: Boolean = false;
	paymentStatusText: String = '<i class="fa fa-refresh"></i> Refresh Payment Status';
	fileName;
	fileType;
	fileBase64;
	searchOpen = false;
	searchOpen2 = false;
	labSubscription: ISubscription;

	constructor(
		private formBuilder: FormBuilder,
		private _router: ActivatedRoute,
		private _route: Router,
		private _locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
		private _formService: FormsService,
		private _laboratoryRequestService: LaboratoryRequestService,
		private _laboratoryReportService: LaboratoryReportService,
		private _documentationService: DocumentationService,
		private _billingService: BillingService,
		private _systemModuleService: SystemModuleService,
		private _authFacadeService: AuthFacadeService,
		private _documentUploadService: DocumentUploadService,
		private _labEventEmitter: LabEventEmitterService
	) {
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.employeeDetails = res;
				if (res.workbenchCheckIn !== undefined && res.workbenchCheckIn.length > 0) {
					const workBench = this.employeeDetails.workbenchCheckIn.filter((x) => x.isOn);
					if (workBench.length > 0) {
						this.selectedLab = { typeObject: workBench[0], type: 'workbench' };
					}
				}
			})
			.catch((err) => {});

		// Subscribe to the event when ward changes.
		this.labSubscription = this._labEventEmitter.announceLab.subscribe((val) => {
			this.selectedLab = val;
			this._getAllReports(this.selectedLab);
			this._getAllPendingRequests();
		});
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');
		// this.selectedLab = <any>this._locker.getObject('workbenchCheckingObject');

		this.patientFormGroup = this.formBuilder.group({
			patient: [ '', [ Validators.required ] ]
		});

		this.reportFormGroup = this.formBuilder.group({
			results: this.formBuilder.array([ this.initResultBuilder() ]),
			outcome: [ '', [ Validators.required ] ],
			conclusion: [ '' ],
			recommendation: [ '' ],
			fileUpload: [ '' ]
		});

		this.patientFormGroup.controls['patient'].valueChanges.subscribe((value) => {
			if (value.length > 2) {
				this.apmisLookupQuery = {
					facilityId: this.facility._id,
					searchText: value
				};
			} else {
				this.activeInvestigationNo = -1;
				this.patientSelected = false;
			}
		});

		this._getDocumentationForm();

		this._router.params.subscribe((url) => {
			if (!!url.requestId) {
				this.report_show();
				this._getSelectedPendingRequests(url.requestId, url.investigationId);
			} else {
				this.CheckIfSelectedPatient();
				this._getAllReports(this.selectedLab);
				this._getAllPendingRequests();
				this.hasRequest = true;
			}
		});

		this.patientSearch.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.do((val) => {
				this.pendingRequests = [];
				this.pendingReLoading = true;
			})
			.switchMap((term) =>
				Observable.fromPromise(
					this._laboratoryRequestService.customFind({
						query: { search: term, facilityId: this.facility._id }
					})
				)
			)
			.subscribe((res: any) => {
				this.pendingReLoading = false;
				if (res.data.length > 0) {
					const pendingRequests = this._modelPendingRequests(res.data);
					if (pendingRequests.length > 0) {
						this.pendingRequests = pendingRequests.filter(
							(x) =>
								(x.isSaved === undefined || x.isSaved) &&
								(x.isUploaded === undefined || x.isUploaded === false)
						);

						// If pendingRequests contains at least a value, then get payment status
						if (this.pendingRequests.length > 0) {
							setTimeout((e) => {
								this._getPaymentStatus();
							}, 500);
						}
					} else {
						this.pendingRequests = [];
					}
				} else {
					this.pendingRequests = [];
				}
			});

		this.patientSearch2.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.do((val) => {
				this.reports = [];
				this.reportLoading = true;
			})
			.switchMap((term) =>
				Observable.fromPromise(
					this._laboratoryRequestService.customFind({
						query: { search: term, facilityId: this.facility._id }
					})
				)
			)
			.subscribe((res: any) => {
				this.reports = [];
				if (res.status === 'success') {
					if (
						!!this.selectedLab.typeObject.minorLocationId ||
						this.selectedLab.typeObject.minorLocationId !== undefined
					) {
						this.reportLoading = false;
						if (res.data.length > 0) {
							const reports = this._modelPendingRequests(res.data);

							if (reports.length > 0) {
								this.reports = reports.filter((x) => x.isUploaded || x.isSaved);
							} else {
								this.reports = [];
							}
						} else {
							this.reports = [];
						}
					} else {
						this._notification(
							'Error',
							'There was a problem getting pending requests. Please try again later!'
						);
					}
				}
			});
	}

	initResultBuilder(investigation?: any) {
		return this.formBuilder.group({
			result: [ '', Validators.required ],
			investigation: investigation
		});
	}

	private _populateInvestigation(result, investigation) {
		return this.formBuilder.group({
			result: [ result ],
			investigation: investigation
		});
	}

	addResultBuilder(investigation) {
		// add address to the list
		const control = <FormArray>this.reportFormGroup.controls['results'];
		control.push(this.initResultBuilder(investigation));
		this.onValueChangeResults(control);
	}

	onValueChangeResults(control) {
		if (this.numericReport) {
			control.valueChanges.subscribe((val) => {
				this.referenceValue = val;
			});
		}
	}

	createReport(valid: Boolean, value: any, action: String) {
		if (valid) {
			if (action === 'save') {
				this.saveToDraftBtnText = 'SAVING...';
			} else if (action === 'upload') {
				this.saveAndUploadBtnText = 'UPLOADING...';
			}

			const isUploaded: Boolean = false;
			const isSaved: Boolean = false;
			const report = {
				employeeId: this.employeeDetails._id,
				patientId: this.selectedPatient.patientId,
				facilityId: this.facility._id,
				action: action,
				investigationId: this.selectedInvestigation.investigationId,
				labRequestId: this.selectedInvestigation.labRequestId,
				conclusion: value.conclusion,
				outcome: value.outcome,
				recommendation: value.recommendation,
				result: value.results,
				file: this.fileBase64,
				publishedById: action === 'upload' ? this.employeeDetails._id : undefined
			};

			this._laboratoryReportService
				.customCreate(report)
				.then((res) => {
					if (res.status === 'success') {
						this.patientSelected = false;
						this.report_show();
						this._getAllReports(this.selectedLab);
						this._getAllPendingRequests();
						if (action === 'save') {
							this.saveToDraftBtnText = 'SAVE AS DRAFT';
							this._systemModuleService.announceSweetProxy(
								'Report has been saved successfully!',
								'success'
							);
						} else {
							this.saveAndUploadBtnText = 'SAVE AND PUBLISH';
							this._systemModuleService.announceSweetProxy(
								'Report has been saved and uploaded successfully!',
								'success'
							);
						}
					} else {
					}
				})
				.catch((err) => {});

			// Call the request service and update the investigation.
			// this._laboratoryRequestService.find({
			//   query: {
			//     'facilityId': this.facility._id,
			//     '_id': this.selectedInvestigation.labRequestId,
			//   }
			// }).then(res => {
			//   // Check the action that the user wants to carry out.
			//   if (action === 'save') {
			//     if (res.data.length > 0) {
			//       const labRequest = res.data[0];

			//       labRequest.investigations.forEach(investigation => {
			//         if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
			//           investigation.report = report;
			//           investigation.isUploaded = isUploaded;
			//           investigation.isSaved = !isSaved;
			//         }
			//       });

			//       this._laboratoryRequestService.patch(labRequest._id, labRequest, {}).then(res => {
			//         this._getAllReports();
			//         this.saveToDraftBtnText = 'SAVE AS DRAFT';
			//         // this._notification('Success', 'Report has been saved successfully!');
			//         this._systemModuleService.announceSweetProxy('Report has been saved successfully!', 'success');
			//       }).catch(err => {
			//         this._notification('Error', 'There was an error saving report. Please try again later!')
			//       });
			//     } else {
			//       this._notification('Error', 'There was an error saving report. Please try again later!');
			//     }
			//   } else if (action === 'upload') {
			//     if (res.data.length > 0) {
			//       const labRequest = res.data[0];
			//       const saveDocument = {
			//         documentType: this.selectedForm,
			//         body: {}
			//       };

			//       labRequest.investigations.forEach(investigation => {
			//         if (investigation.investigation._id === this.selectedInvestigation.investigationId) {
			//           investigation.report = report;
			//           investigation.isUploaded = !isUploaded;
			//           investigation.isSaved = !isSaved;

			//           saveDocument.body['conclusion'] = investigation.report.conclusion;
			//           saveDocument.body['recommendation'] = investigation.report.recommendation;
			//           saveDocument.body['outcome'] = investigation.report.outcome;
			//           saveDocument.body['result'] = investigation.report.result;
			//           saveDocument.body['specimen'] = investigation.investigation.specimen.name;
			//           saveDocument.body['investigation'] = investigation.investigation.name;
			//           saveDocument.body['diagnosis'] = labRequest.diagnosis;
			//           saveDocument.body['clinicalInformation'] = labRequest.clinicalInformation;
			//           saveDocument.body['labNumber'] = labRequest.labNumber;

			//           // // Build document to save in documentation
			//           // saveDocument.body.laboratory.push({
			//           //   'conclusion': investigation.report.conclusion,
			//           //   'recommendation': investigation.report.outcome,
			//           //   'outcome': investigation.report.outcome,
			//           //   'result': investigation.report.result,
			//           //   'specimen': investigation.investigation.specimen.name,
			//           //   'diagnosis': labRequest.diagnosis,
			//           //   'clinicalInformation': labRequest.clinicalInformation,
			//           //   'labNumber': labRequest.labNumber,
			//           //   'investigation': investigation.investigation.name,
			//           // })
			//         }
			//       });

			//       this._laboratoryRequestService.patch(labRequest._id, labRequest, {}).then(res => {
			//         if (!!res._id) {
			//           // Delete irrelevant data from employee
			//           delete this.employeeDetails.personDetails.wallet;

			//           // Build documentation model
			//           const patientDocumentation = {
			//             document: saveDocument,
			//             createdBy: this.employeeDetails._id,
			//             facilityId: this.facility._id,
			//             facilityName: this.facility.name,
			//             patientId: this.selectedPatient.patientId,
			//             patientName: `${this.selectedPatient.firstName} ${this.selectedPatient.lastName}`,
			//           };

			//           const documentation = {
			//             personId: this.selectedPatient._id,
			//             documentations: patientDocumentation,
			//           };

			//           // Check if documentation has been created for the user
			//           this._documentationService.find({
			//             query: { 'personId': this.selectedPatient._id }
			//           }).then(res => {
			//             // Update the lists
			//             this._getAllReports();
			//             // Updated this.pendingRequests
			//             this._getAllPendingRequests();
			//             this.patientSelected = false;

			//             if (res.data.length > 0) {
			//               res.data[0].documentations.push(patientDocumentation);
			//               // Update the existing documentation
			//               this._documentationService.update(res.data[0]).then(res => {
			//                 this.saveAndUploadBtnText = 'SAVE AND UPLOAD';
			//                 this._systemModuleService.announceSweetProxy('Report has been saved successfully!', 'success');
			//                 // this._notification('Success', 'Report has been saved successfully!');
			//               }).catch(err => {
			//                 console.log(err);
			//               });
			//             } else {
			//               // Save into documentation
			//               this._documentationService.create(documentation).then(res => {
			//                 this.saveAndUploadBtnText = 'SAVE AND UPLOAD';
			//                 this._systemModuleService.announceSweetProxy('Report has been saved and uploaded successfully!', 'success');
			//                 // this._notification('Success', 'Report has been saved and uploaded successfully!');
			//               }).catch(err => {
			//                  console.log(err);
			//               });
			//             }
			//           });
			//         }
			//       }).catch(err => {
			//         console.log(err);
			//         this._notification('Error', 'There was an error saving report. Please try again later!');
			//       });
			//     } else {
			//       this._notification('Error', 'There was an error saving report. Please try again later!');
			//     }
			//   }
			// }).catch(err => this._notification('Error', 'There was an error saving report. Please try again later!'));
		} else {
			this._systemModuleService.announceSweetProxy(
				'Some fields are empty. Please fill in the required fields!',
				'error'
			);
			this._notification('Error', 'Some fields are empty. Please fill in the required fields!');
		}
	}

	// apmisLookupHandleSelectedItem(value) {
	//   this.pendingReLoading = true;
	//   this.apmisLookupText = `${value.firstName} ${value.lastName}`;
	//   this.selectedPatient = value;
	//   this._laboratoryRequestService.customFind({
	//     query: { 'facilityId': this.facility._id, 'patientId': value.patientId }
	//   }).then(res => {
	//     this.pendingReLoading = false;
	//     if (res.data.length > 0) {
	//       const pendingRequests = this._modelPendingRequests(res.data);
	//       if (pendingRequests.length > 0) {
	//         this.pendingRequests = pendingRequests.filter(x => (x.isSaved === undefined || x.isSaved)
	//           && (x.isUploaded === undefined || (x.isUploaded === false)));

	//         // If pendingRequests contains at least a value, then get payment status
	//         if (this.pendingRequests.length > 0) {
	//           setTimeout(e => {
	//             this._getPaymentStatus();
	//           }, 500);
	//         }
	//       } else {
	//         this.pendingRequests = [];
	//       }
	//     } else {
	//       this.pendingRequests = [];
	//     }
	//   }).catch(err => this._notification('Error', 'There was a problem getting patient details!'));
	// }

	showImageBrowseDlg() {
		// this.selectImage();
	}

	selectImage(fileInput: any) {
		const fileList = fileInput.target.files;
		if (fileList.length > 0) {
			const file: File = fileList[0];
			const formData: FormData = new FormData();
			formData.append('uploadFile', file, file.name);
			const headers = new Headers();
			/** No need to include Content-Type in Angular 4 */
			headers.append('Content-Type', 'multipart/form-data');
			headers.append('Accept', 'application/json');
			// let options = new RequestOptions({ headers: headers });

			// this.http.post(`${this.apiEndPoint}`, formData, options)
			//     .map(res => res.json())
			//     .catch(error => Observable.throw(error))
			//     .subscribe(
			//     )
		}
	}

	onFileChange(event) {
		let reader = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			this.fileName = file.name;
			if (
				file.type == 'image/png' ||
				file.type == 'image/jpg' ||
				file.type == 'image/gif' ||
				file.type == 'image/jpeg' ||
				file.type == 'application/pdf'
			) {
				if (file.size < 1250000) {
					this.fileType = file.type;
					reader.readAsDataURL(file);
					reader.onload = () => {
						let base64 = reader.result;
						this.fileBase64 = {
							base64: base64,
							name: file.name,
							fileType: file.type,
							docType: 'laboratory report',
							size: file.size,
							container: 'laboratorycontainer',
							investigationId: this.selectedInvestigation.investigationId,
							labRequestId: this.selectedInvestigation.labRequestId
						};
					};
				} else {
					this._systemModuleService.announceSweetProxy('Size Of Document Too BIG!', 'info');
					this.reportFormGroup.controls['fileUpload'].setErrors({ sizeTooBig: true });
				}
			} else {
				this._systemModuleService.announceSweetProxy('Type of document not supported.', 'info');
				this.reportFormGroup.controls['fileUpload'].setErrors({ typeDenied: true });
			}
		}
	}

	onChange(e) {}

	uploadDoc() {
		return this._documentUploadService.create(this.fileBase64, {});
	}

	private _getSelectedPendingRequests(requestId, investigationId) {
		this._laboratoryRequestService
			.customFind({
				query: { facilityId: this.facility._id, _id: requestId, $sort: { createdAt: -1 } }
			})
			.then((res) => {
				this.pendingReLoading = false;
				if (res.data.length > 0) {
					this.pendingReLoading = true;
					this.hasRequest = true;
					const pendingRequests = this._modelPendingRequests(res.data);
					if (pendingRequests.length > 0) {
						this.pendingRequests = pendingRequests.filter(
							(x) =>
								(x.isSaved === undefined || x.isSaved) &&
								(x.isUploaded === undefined || x.isUploaded === false)
						);

						// Highlight the investigation that was selected fro the route parameters
						this.pendingRequests.forEach((invesigation, i) => {
							if (invesigation.investigationId === investigationId) {
								this.onClickInvestigation(invesigation, i);
							}
						});

						// If pendingRequests contains at least a value, then get payment status
						if (this.pendingRequests.length > 0) {
							setTimeout((e) => {
								this._getPaymentStatus();
							}, 500);
						}
					} else {
						this.pendingRequests = [];
					}
				} else {
					const text =
						'This page with id ' + investigationId + ' Does not have any pending request. Redirecting...';
					this._notification('Error', text);
					setTimeout((e) => {
						this._route.navigate([ '/dashboard/laboratory/reports' ]);
					}, 2000);
				}
			})
			.catch((err) => {
				const text = 'This page with id ' + investigationId + ' Does not exist. Redirecting...';
				this._notification('Error', text);
				setTimeout((e) => {
					this._route.navigate([ '/dashboard/laboratory/reports' ]);
				}, 2000);
			});
	}

	private _getAllPendingRequests() {
		this._laboratoryRequestService
			.customFind({
				query: { facilityId: this.facility._id, $sort: { createdAt: -1 } }
			})
			.then((res) => {
				this.pendingReLoading = false;
				if (res.status === 'success' && res.data.length > 0) {
					const pendingRequests = this._modelPendingRequests(res.data);
					if (pendingRequests.length > 0) {
						this.pendingRequests = pendingRequests.filter(
							(x) =>
								(x.isSaved === undefined || x.isSaved) &&
								(x.isUploaded === undefined || x.isUploaded === false)
						);

						// If pendingRequests contains at least a value, then get payment status
						if (this.pendingRequests.length > 0) {
							setTimeout((e) => {
								this._getPaymentStatus();
							}, 500);
						}
					} else {
						this.pendingRequests = [];
					}
				} else {
					this.pendingRequests = [];
				}
			})
			.catch((err) => this._notification('Error', 'There was a problem getting pending requests!'));
	}

	onClickInvestigation(investigation: PendingLaboratoryRequest, index) {
		if (investigation.isPaid) {
			if (investigation.sampleTaken) {
				investigation.patient.patientId = investigation.patientId;
				this.selectedPatient = investigation.patient;
				this.selectedInvestigation = investigation;
				this.apmisLookupText = `${investigation.patient.firstName} ${investigation.patient.lastName}`;

				// Highlight the item that was selected
				this.activeInvestigationNo = index;

				// if The investigation is a panel, then there is no need for the reportType and specimen
				if (!investigation.isPanel) {
					if (this.selectedInvestigation.reportType.name.toLowerCase() === 'text'.toLowerCase()) {
						this.textReport = true;
						this.numericReport = false;
					} else {
						this.numericReport = true;
						this.textReport = false;
					}
					this.reportFormGroup.controls['results'] = this.formBuilder.array([]);
					this.addResultBuilder(investigation);
				} else {
					this.reportFormGroup.controls['results'] = this.formBuilder.array([]);
					investigation.panel.forEach((panel) => {
						this.addResultBuilder(panel);
					});
				}
				this.CheckIfSelectedPatient();

				if (investigation.report === undefined) {
					// this.reportFormGroup.controls['results'].reset();
					this.reportFormGroup.controls['outcome'].reset();
					this.reportFormGroup.controls['recommendation'].reset();
					this.reportFormGroup.controls['conclusion'].reset();
				} else if (!investigation.isSaved || !investigation.isUploaded) {
					// Clear the formArray and then push the result and investigation into the new formArray.
					this.reportFormGroup.controls['results'] = this.formBuilder.array([]);
					const control = <FormArray>this.reportFormGroup.controls['results'];
					this.onValueChangeResults(control);
					investigation.report.result.forEach((result) => {
						control.push(this._populateInvestigation(result.result, result.investigation));
					});

					// this.reportFormGroup.controls['result'].setValue(this.selectedInvestigation.report.result);
					this.reportFormGroup.controls['outcome'].setValue(this.selectedInvestigation.report.outcome);
					this.reportFormGroup.controls['recommendation'].setValue(
						this.selectedInvestigation.report.recommendation
					);
					this.reportFormGroup.controls['conclusion'].setValue(this.selectedInvestigation.report.conclusion);
				}
			} else {
				const text = 'You can not attend to this request as sample has not been taken. ';
				this._notification(
					'Info',
					text.concat('Please use the refresh button above to check if sample has been taken.')
				);
			}
		} else {
			const text = 'You can not attend to this request as payment has not been made. ';
			const fullText = text.concat(' Please use the refresh button above to check for payment status.');
			this._systemModuleService.announceSweetProxy(fullText, 'error');
			this._notification('Info', fullText);
		}
	}

	onClickImportTemplate(selectedInvestigation: PendingLaboratoryRequest) {
		this.importTemplate = true;
	}

	private _getAllReports(selectedLab) {
		this._laboratoryRequestService
			.customFind({
				query: { facilityId: this.facility._id, $sort: { createdAt: -1 } }
			})
			.then((res) => {
				if (!!selectedLab.typeObject.minorLocationId || selectedLab.typeObject.minorLocationId !== undefined) {
					this.reportLoading = false;
					if (res.data.length > 0) {
						const reports = this._modelPendingRequests(res.data);

						if (reports.length > 0) {
							this.reports = reports.filter((x) => x.isUploaded || x.isSaved);
						} else {
							this.reports = [];
						}
					} else {
						this.reports = [];
					}
				} else {
					this._notification(
						'Error',
						'There was a problem getting pending requests. Please try again later!'
					);
				}
			})
			.catch((err) =>
				this._notification('Error', 'There was a problem getting pending requests. Please try again later!')
			);
	}

	private CheckIfSelectedPatient() {
		if (!!this.selectedPatient && this.selectedPatient.hasOwnProperty('_id')) {
			this.patientSelected = true;
		} else {
			this.patientSelected = false;
		}
	}

	private _modelPendingRequests(data: any): PendingLaboratoryRequest[] {
		const pendingRequests = [];
		const labId = this.selectedLab.typeObject.minorLocationId;
		// Filter investigations based on the laboratory Id
		data.forEach((labRequest) => {
			labRequest.investigations.forEach((investigation) => {
				if (!investigation.isExternal) {
					if (labId === investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id) {
						const pendingLabReq: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
						if (investigation.isSaved || investigation.isUploaded) {
							pendingLabReq.report = investigation.report;
							pendingLabReq.isSaved = investigation.isSaved;
							pendingLabReq.isUploaded = investigation.isUploaded;
						}

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

						if (investigation.investigation.isPanel) {
							pendingLabReq.panel = investigation.investigation.panel;
						}

						pendingLabReq.billingId = labRequest.billingId;
						pendingLabReq.labRequestId = labRequest._id;
						pendingLabReq.facility = labRequest.facilityId;
						pendingLabReq.clinicalInformation = labRequest.clinicalInformation;
						pendingLabReq.diagnosis = labRequest.diagnosis;
						pendingLabReq.labNumber = labRequest.labNumber;
						pendingLabReq.patient = labRequest.personDetails;
						pendingLabReq.patientId = labRequest.patientId;
						pendingLabReq.createdBy = labRequest.employeeDetails;
						pendingLabReq.createdById = labRequest.createdBy;
						pendingLabReq.isExternal = investigation.isExternal;
						pendingLabReq.isUrgent = investigation.isUrgent;
						pendingLabReq.minorLocation =
							investigation.investigation.LaboratoryWorkbenches[0].laboratoryId._id;
						pendingLabReq.facilityServiceId = investigation.investigation.facilityServiceId;
						pendingLabReq.isPanel = investigation.investigation.isPanel;
						pendingLabReq.name = investigation.investigation.name;
						pendingLabReq.reportType = investigation.investigation.reportType;
						pendingLabReq.specimen = investigation.investigation.specimen;
						pendingLabReq.service = investigation.investigation.serviceId;
						pendingLabReq.unit = investigation.investigation.unit;
						pendingLabReq.investigationId = investigation.investigation._id;
						pendingLabReq.createdAt = investigation.investigation.createdAt;
						pendingLabReq.updatedAt = investigation.investigation.updatedAt;
						pendingLabReq.isPaid = labRequest.isPaid; // false => am changing this as this will always be false;

						pendingRequests.push(pendingLabReq);
					}
				}
			});
		});
		return pendingRequests;
	}

	// Get payment status
	private _getPaymentStatus() {
		this.disablePaymentBtn = true;
		this.paymentStatusText = 'Getting Payment Status... <i class="fa fa-spinner fa-spin"></i>';

		this.pendingRequests.forEach((request: PendingLaboratoryRequest) => {
			if (!!request.billingId) {
				this._billingService
					.find({
						query: {
							facilityId: this.facility._id,
							_id: request.billingId._id,
							patientId: request.patientId
						}
					})
					.then((res) => {
						const billingItem = res.data[0];
						let counter = 0;
						billingItem.billItems.forEach((billItem) => {
							counter++;
							if (billItem.serviceId === request.service) {
								request.isPaid = billItem.paymentCompleted;
							}
						});

						if (counter === billingItem.billItems.length) {
							this.disablePaymentBtn = false;
							this.paymentStatusText = '<i class="fa fa-refresh"></i> Refresh Payment Status';
						}
					})
					.catch((err) => {});
			} else {
				this.disablePaymentBtn = false;
				this.paymentStatusText = '<i class="fa fa-refresh"></i> Refresh Payment Status';
			}
		});
	}

	onClickRefreshPaymentStatus() {
		this._getPaymentStatus();
	}

	onClickTemplate(event) {
		this.importTemplate = false;
		if (event.investigation.investigation.reportType.name === this.selectedInvestigation.reportType.name) {
			// this.reportFormGroup.controls['result'].setValue(event.investigation.result);
			this.reportFormGroup.controls['recommendation'].setValue(event.investigation.recommendation);
			this.reportFormGroup.controls['conclusion'].setValue(event.investigation.conclusion);
		} else {
			this._notification('Info', 'Please create a template for this report type.');
		}
	}

	private _getDocumentationForm() {
		// this._formService.find({ query: { title: { $regex: 'laboratory', '$options': 'i' } }}).then(res => {
		//   // this.selectedForm = res.data.filter(x => new RegExp('laboratory', 'i').test(x.title))[0];
		// }).catch(err => this._notification('Error', 'There was a problem getting documentations!'));
		this._formService
			.findAll()
			.then((res) => {
				this.selectedForm = res.data.filter((x) => new RegExp('laboratory', 'i').test(x.title))[0];
			})
			.catch((err) => this._notification('Error', 'There was a problem getting documentations!'));
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	showDoc_toggle() {
		this.docAction = !this.docAction;
	}

	showDiagnosis_toggle() {
		this.diagnosisAction = !this.diagnosisAction;
	}

	close_onClick(message: Boolean): void {
		this.repDetail_view = false;
		this.importTemplate = false;
	}

	report_show() {
		this.report_view = !this.report_view;
	}
	openSearch() {
		this.searchOpen = !this.searchOpen;
	}
	openSearch2() {
		this.searchOpen2 = !this.searchOpen2;
	}

	repDetail(value: PendingLaboratoryRequest) {
		this.selectedInvestigationData = value;
		this.repDetail_view = true;
	}

	ngOnDestroy() {
		this.labSubscription.unsubscribe();
	}
}
