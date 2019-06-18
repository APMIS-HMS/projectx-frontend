import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { BedOccupancyService, FacilitiesService, InPatientService } from '../../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-transfer-patient',
	templateUrl: './transfer-patient.component.html',
	styleUrls: ['./transfer-patient.component.scss']
})
export class TransferPatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedPatient: any;
	transferFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	inPatientId: string;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	wards: any[];
	disableTransferBtn: boolean = false;
	transferBtn: boolean = true;
	transferingBtn: boolean = false;

	constructor(
		private fb: FormBuilder,
		private _route: Router,
		private _router: ActivatedRoute,
		private _facilitiesService: FacilitiesService,
		private _bedOccupancyService: BedOccupancyService,
		private _locker: CoolLocalStorage,
    private _inPatientService: InPatientService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService
	) {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.employeeDetails = res;
      }
    }).catch(err => { });
  }

	ngOnInit() {
    this.user = <User>this._locker.getObject('auth');

		this.transferFormGroup = this.fb.group({
			ward: ['', [<any>Validators.required]]
		});

		this._router.params.subscribe(params => {
			this.inPatientId = params.id;
		});

		this.getFacilityWard();
	}

	onClickTransfer(value: any, valid: boolean) {
		if (valid) {
      const name = `${this.selectedPatient.patient.personDetails.firstName} ${this.selectedPatient.patient.personDetails.lastName}`;
      const question = `Are you sure you want to transfer ${name} to ${value.ward.name} ward?`;
      this._systemModuleService.announceSweetProxy(question, 'question', this, null, null, value);
		} else {
      this._notification('Error', 'Please fill in all required fields');
    }
  }

  transfer(data) {
    this.disableTransferBtn = true;
    this.transferBtn = false;
    this.transferingBtn = true;

    const payload = {
      action: 'transferPatient',
      patientId: this.selectedPatient.patientId,
      inPatientId: this.inPatientId,
      minorLocationId: data.ward._id,
      facilityId: this.facility._id,
      employeeId: this.employeeDetails._id,
      status: myGlobals.transfer
    };

    this._inPatientService.customCreate(payload).then(res => {
      if (res.status === 'success') {
        const name = `${this.selectedPatient.patient.personDetails.firstName} ${this.selectedPatient.patient.personDetails.lastName}`;
        const text = `You have successfully transfered ${name} to ${data.ward.name}`;
        // this._notification('Success', fullText);
				this._systemModuleService.announceSweetProxy(text, 'success');
				this.close_onClick();
				this._route.navigate(['/dashboard/ward-manager/admitted']);
      } else {
        this._systemModuleService.announceSweetProxy(res.message, 'error');
      }
    }).catch(err => {});


			// this._inPatientService.get(this.inPatientId, {}).then(res => {
      //   res.statusId = myGlobals.transfer;
      //   res.proposedWard = data.ward;
			// 	this._inPatientService.update(res).then(res2 => {
      //     this.disableTransferBtn = false;
      //     this.transferBtn = true;
      //     this.transferingBtn = false;

      //     const name = `${this.selectedPatient.patient.personDetails.firstName} ${this.selectedPatient.patient.personDetails.lastName}`;
			// 		let text = `You have successfully transfered ${name} to ${data.ward.name}`;
      //     // this._notification('Success', text);
      //     this._systemModuleService.announceSweetProxy(text, 'success');
			// 		this.close_onClick();
			// 		setTimeout(e => {
			// 			this._route.navigate(['/dashboard/ward-manager/admitted']);
			// 		}, 2000);
			// 	}).catch(err => {});
			// }).catch(err => {});
  }

  sweetAlertCallback(result, data) {
    if (result.value) {
      this.transfer(data);
    } else {
      this.close_onClick();
    }
  }

	getFacilityWard() {
		this._facilitiesService.get(this.facility._id, {}).then(res => {
      this.wards = res.minorLocations.filter(x => x.locationId === this.selectedPatient.minorLocation.locationId);
		});
	}

	// Notification
	private _notification(type: String, text: String): void {
		this._facilitiesService.announceNotification({
			users: [this.user._id],
			type: type,
			text: text
		});
	}

	onWardChange(param) {
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
