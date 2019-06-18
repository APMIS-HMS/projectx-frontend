import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InPatientService } from '../../../../services/facility-manager/setup/index';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as differenceInCalendarDays from 'date-fns/difference_in_calendar_days';

@Component({
	selector: 'app-ward-manager-admitted-detailspage',
	templateUrl: './ward-manager-admitted-detailspage.component.html',
	styleUrls: ['./ward-manager-admitted-detailspage.component.scss']
})
export class WardManagerAdmittedDetailspageComponent implements OnInit {
	dischargePatient = false;
	transferPatient = false;
	addVitals = false;
	admittedPatientId: string;
	selectedPatient: any;
	daysAdmitted: number;

	constructor(
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
		private _route: ActivatedRoute,
		private _router: Router,
    public _inPatientService: InPatientService,
    private _systemModuleService: SystemModuleService
  ) {
		// this._inPatientService.listenerCreate.subscribe(payload => {
		// 	this.getAdmittedPatientItems();
		// });

		// this._inPatientService.listenerUpdate.subscribe(payload => {
		// 	this.getAdmittedPatientItems();
		// });
	}

	ngOnInit() {
    // this is for the pageInView header
    this._wardEventEmitter.setRouteUrl('Admitted Patient Details');

		this._route.params.subscribe(params => {
			this.admittedPatientId = params.id;
      this.getAdmittedPatientItems();
		});
	}

	getAdmittedPatientItems() {
		this._inPatientService.get(this.admittedPatientId, {}).then(res => {
      if (!!res._id) {
				const wardDetails = res.transfers[res.lastIndex];
				this.selectedPatient = res;
				// this is to calculate the number of days the selected
				// patient has been admitted in the hospital
				const admissionStartDate = this.selectedPatient.admissionDate;
				const currentDate = Date.now();
				this.daysAdmitted = differenceInCalendarDays(currentDate, admissionStartDate);
        this.selectedPatient.wardItem = wardDetails;
        // Check if the patient has been discharged.
        if (res.status === myGlobals.discharge) {
          const patient = `${res.patient.personDetails.firstName} ${res.patient.personDetails.lastName}`;
          const text = `${patient} has been discharged.`;
          this._systemModuleService.announceSweetProxy(text, 'error');
        }
			}
    });
  }

  onClickPatientDocumentation(patient: any) {
    // const text = 'If you click on yes, you will be redirected to the patient documentation.';
		// this._systemModuleService.announceSweetProxy(text, 'question', this, null, null, patient);
		patient.patient.isFromWard = true;
		patient.patient.inPatientId = this.admittedPatientId;
		this._locker.setObject('patient', patient.patient);
		this._router.navigate([`/dashboard/patient-manager/patient-manager-detail`, patient.patient.personId]).then(res => {
		}).catch(err => {
		});
	}

	onClickVitals() {
		this.addVitals = true;
	}

  // sweetAlertCallback(result, data) {
  //   if (result.value) {
  //     this._router.navigate([`/dashboard/patient-manager/patient-manager-detail`, data.patient.personId]).then(res => {
  //     }).catch(err => {
  //     });
  //   }
  // }

	onClickDischargePatient() {
		this.dischargePatient = true;
	}

	onClickTransferPatient() {
		this.transferPatient = true;
	}

	close_onClick() {
		this.dischargePatient = false;
		this.transferPatient = false;
		this.addVitals = false;
	}

}
