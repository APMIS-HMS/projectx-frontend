import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	WardDischargeTypesService,
	InPatientService,
	BedOccupancyService,
	BillingService,
	FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import { ActivatedRoute } from '@angular/router';
import { WardDischarge, Facility, BillModel, BillItem, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-discharge-patient',
	templateUrl: './discharge-patient.component.html',
	styleUrls: [ './discharge-patient.component.scss' ]
})
export class DischargePatientComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedPatient: any;
	dischargeFormGroup: FormGroup;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	dischargeTypeItems: any[];
	inPatientId: string;
	discharge: any = <any>{};
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	bill: BillModel = <BillModel>{};
	disableBtn = false;
	dischargeBtn = true;
	dischargingBtn = false;

	constructor(
		private fb: FormBuilder,
		private _wardDischargeTypesService: WardDischargeTypesService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _inPatientService: InPatientService,
		private _bedOccupancyService: BedOccupancyService,
		private _billingService: BillingService,
		private _facilityService: FacilitiesService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService
	) {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				if (!!res._id) {
					this.employeeDetails = res;
				}
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this.user = <User>this._locker.getObject('auth');

		this.dischargeFormGroup = this.fb.group({
			dischargeType: [ '', [ <any>Validators.required ] ],
			comment: [ '', [ <any>Validators.required ] ]
		});

		this._route.params.subscribe((params) => {
			this.inPatientId = params.id;
		});

		this._wardDischargeTypesService.findAll().then((res) => {
			if (res.data.length > 0) {
				this.dischargeTypeItems = res.data;
			}
		});
	}

	onDischarge(value: any, valid: boolean) {
		if (valid) {
			this.disableBtn = true;
			this.dischargeBtn = false;
			this.dischargingBtn = true;

			let payload = {
				action: 'dischargePatient',
				facilityId: this.facility._id,
				employeeId: this.employeeDetails._id,
				discharge: value,
				patientId: this.selectedPatient.patientId,
				inPatientId: this.selectedPatient._id,
				status: myGlobals.discharge
			};

			this._inPatientService
				.customCreate(payload)
				.then((res) => {
					if (res.status === 'success') {
						const patient = `${this.selectedPatient.patient.personDetails.firstName} ${this.selectedPatient
							.patient.personDetails.lastName}`;
						const text = `${patient} has been discharged successfully.`;
						this._systemModuleService.announceSweetProxy(
							text,
							'success',
							null,
							null,
							null,
							null,
							null,
							null,
							null
						);
						this.close_onClick();
						setTimeout((e) => {
							this._router.navigate([ '/dashboard/ward-manager/admitted' ]);
						}, 2000);
					} else {
						this._systemModuleService.announceSweetProxy(res.message, 'error');
					}
				})
				.catch((err) => {});
		}
	}

	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	onDischargeTypeChange(param) {}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
