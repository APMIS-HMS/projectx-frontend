import { CoolLocalStorage } from 'angular2-cool-storage';
import { User } from './../../../../../models/facility-manager/setup/user';
import { LaboratoryRequestService } from './../../../../../services/facility-manager/setup/laboratoryrequest.service';
import { Investigation, Patient, Employee } from './../../../../../models/index';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild, Input } from '@angular/core';
import { FacilitiesService, PatientService } from '../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-request-detail',
	templateUrl: './request-detail.component.html',
	styleUrls: [ './request-detail.component.scss' ]
})
export class RequestDetailComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() investigation: any;
	@ViewChild('fileInput') fileInput: ElementRef;
	specimenNumber: FormControl = new FormControl();
	labNumber: FormControl = new FormControl();
	loginEmployee: Employee;
	showDocument = false;
	hasNo = false;
	hasSample = false;
	hasSpecimen = false;
	hasLabNo = false;
	localInvestigation: any = <any>{};
	localInvestigationIndex = -1;
	localRequest: any = <any>{};
	user: User = <User>{};
	selectedPatient: Patient = <Patient>{};
	selectedLab: any = <any>{};
	client: any = <any>{};

	constructor(
		private renderer: Renderer,
		private facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private patientService: PatientService,
		private _laboratoryRequestService: LaboratoryRequestService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService
	) {
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				if (!!res._id) {
					this.loginEmployee = res;
					const selectedLab = res.workbenchCheckIn.filter((x) => x.isOn);
					this.selectedLab = selectedLab[0];
				}
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this.user = <User>this._locker.getObject('auth');
		// this.getIncomingRequest(this.investigation.labRequestId);
		this.getIncomingRequestAndPatient(this.investigation.labRequestId);
		// this.getIncomingPatient();
	}
	// getIncomingPatient() {
	//   this.patientService.get(this.investigation.patientId, {}).then(patient => {
	//     if (patient !== undefined) {
	//       this.selectedPatient = patient;
	//       if (this.selectedPatient.clientsNo === undefined) {
	//         this.selectedPatient.clientsNo = [];
	//       } else {
	//         let index = this.selectedPatient.clientsNo.findIndex(x => x.minorLocationId._id === this.selectedLab.minorLocationObject._id);
	//         if (index > -1) {
	//           this.client = this.selectedPatient.clientsNo[index];
	//           this.hasLabNo = true;
	//         }
	//       }
	//     }
	//   })
	// }
	// getIncomingRequest(id) {
	//   this._laboratoryRequestService.get(id, {}).then(payload => {
	//     let index = payload.investigations.findIndex(x => x.investigation._id === this.investigation.investigationId);
	//     let _investigation = payload.investigations[index];
	//     this.localInvestigation = _investigation;
	//     this.localRequest = payload;
	//     if (this.localInvestigation.specimenReceived !== undefined && this.localInvestigation.specimenReceived === true) {
	//       this.hasSpecimen = true;
	//     } else {
	//       this.hasSpecimen = false;
	//     }
	//     if (this.localInvestigation.sampleTaken !== undefined && this.localInvestigation.sampleTaken === true) {
	//       this.hasSample = true;
	//     } else {
	//       this.hasSample = false;
	//     }

	//   });
	// }

	getIncomingRequestAndPatient(id) {
		this._laboratoryRequestService.get(id, {}).then((payload) => {
			this.patientService.get(this.investigation.patientId, {}).then((patient) => {
				if (patient !== undefined) {
					this.selectedPatient = patient;
					if (this.selectedPatient.clientsNo === undefined) {
						this.selectedPatient.clientsNo = [];
					} else {
						const index = this.selectedPatient.clientsNo.findIndex(
							(x) => x.minorLocationId._id === this.selectedLab.minorLocationObject._id
						);
						if (index > -1) {
							this.client = this.selectedPatient.clientsNo[index];
							this.hasLabNo = true;
						}
					}
				}
				const requestIndex = payload.investigations.findIndex(
					(x) => x.investigation._id === this.investigation.investigationId
				);
				const _investigation = payload.investigations[requestIndex];
				this.localInvestigation = _investigation;
				this.localRequest = payload;
				if (!!_investigation.specimenReceived && _investigation.specimenReceived) {
					this.hasSpecimen = true;
				}

				if (!!_investigation.labNumber && _investigation.labNumber !== null) {
					this.hasLabNo = true;
				}

				if (!!_investigation.sampleTaken && _investigation.sampleTaken) {
					this.hasSample = true;
				}
			});
		});
	}

	showImageBrowseDlg() {
		this.fileInput.nativeElement.click();
	}

	onChange() {
		// upload file
	}

	close_onClick(event) {
		this.closeModal.emit(true);
	}

	takeSample() {
		this.localInvestigation.sampleTaken = true;
		// const logEmp = this.loginEmployee;
		// delete logEmp.personDetails.wallet;
		// this.localInvestigation.sampleTakenBy = logEmp.personDetails;
		this.localInvestigation.sampleTakenBy = this.loginEmployee._id;
		this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
		this._laboratoryRequestService
			.patch(this.localRequest._id, this.localRequest, {})
			.then((res) => {
				this._systemModuleService.announceSweetProxy('Sample has been taken successfully!', 'success');
				const index = res.investigations.findIndex(
					(x) => x.investigation._id === this.investigation.investigationId
				);
				const _investigation = res.investigations[index];
				this.localInvestigation = _investigation;
				this.localRequest = res;
				this.hasSample = true;
			})
			.catch((err) => {});
	}

	receiveSpecimen() {
		this.localInvestigation.specimenReceived = true;
		this.localInvestigation.specimenNumber = this.specimenNumber.value;

		this.localRequest.investigations[this.localInvestigationIndex] = this.localInvestigation;
		this._laboratoryRequestService
			.patch(this.localRequest._id, this.localRequest, {})
			.then((res) => {
				this._systemModuleService.announceSweetProxy(
					'Specimen Number has been updated successfully!',
					'success'
				);
				const index = res.investigations.findIndex(
					(x) => x.investigation._id === this.investigation.investigationId
				);
				const _investigation = res.investigations[index];
				this.localInvestigation = _investigation;
				this.localRequest = res;
				this.hasSpecimen = true;
			})
			.catch((err) => {});
	}

	assignLabNo() {
		const clientNo = {
			minorLocationId: this.selectedLab.typeObject.minorLocationObject,
			clientNumber: this.labNumber.value
		};
		this.selectedPatient.clientsNo.push(clientNo);
		this.patientService.update(this.selectedPatient).then((payload) => {
			this.selectedPatient = payload;
			const index = this.selectedPatient.clientsNo.findIndex(
				(x) => x.minorLocationId._id === this.selectedLab.minorLocationObject._id
			);
			if (index > -1) {
				this.client = this.selectedPatient.clientsNo[index];
				this.hasLabNo = true;
			}
		});
	}

	// private _notification(type: string, text: string): void {
	//   this.facilityService.announceNotification({
	//     users: [this.user._id],
	//     type: type,
	//     text: text
	//   });
	// }
}
