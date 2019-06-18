import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
	ConsultingRoomService,
	EmployeeService,
	FacilitiesService,
	StoreService
} from '../../../../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee, Facility } from '../../../../../models/index';
import { ClinicHelperService } from '../../../clinic/services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

@Component({
	selector: 'app-apmis-store-check-in',
	templateUrl: './apmis-store-check-in.component.html',
	styleUrls: [ './apmis-store-check-in.component.scss' ]
})
export class ApmisStoreCheckInComponent implements OnInit {
	@Input() loginEmployee: any;
	@Input() workSpace: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	storeCheckin: FormGroup;
	facility: Facility = <Facility>{};
	selectedStore: ConsultingRoomModel = <ConsultingRoomModel>{};
	mainErr = true;
	errMsg = 'You have unresolved errors';
	workSpaces: any;
	isLoading = false;
	stores: any[] = [];
	locations: any[] = [];
	checkInBtn = true;
	disableBtn = false;
	checkingInBtn = false;

	constructor(
		public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		public consultingRoomService: ConsultingRoomService,
		public employeeService: EmployeeService,
		public storeService: StoreService,
		public locker: CoolLocalStorage,
		private _authFacadeService: AuthFacadeService,
		private _storeService: StoreService
	) {
		this.facility = <Facility>this.locker.getObject('selectedFacility');
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.loginEmployee = res;
				this.workSpaces = res.workSpaces;
				this._getAllStores(this.workSpaces);
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this.storeCheckin = this.formBuilder.group({
			location: [ '', [ <any>Validators.required ] ],
			room: [ '', [ <any>Validators.required ] ],
			isDefault: [ false, [ <any>Validators.required ] ]
		});
		this.storeCheckin.controls['location'].valueChanges.subscribe((value) => {
			this.storeService.find({ query: { minorLocationId: value } }).then((res) => {
				if (res.data.length > 0) {
					this.stores = res.data;
				}
			});
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	checkIn(valid, value) {
		if (valid) {
			this.disableBtn = true;
			this.checkInBtn = false;
			this.checkingInBtn = true;

			const checkIn: any = <any>{};
			checkIn.minorLocationId = value.location._id;
			checkIn.storeId = value.room._id;
			checkIn.lastLogin = new Date();
			checkIn.isOn = true;
			checkIn.isDefault = value.isDefault;
			checkIn.minorLocationObject = {
				name: value.location.name,
				_id: value.location._id
			};
			checkIn.storeObject = {
				name: value.room.name,
				_id: value.room._id
			};
			if (this.loginEmployee.storeCheckIn === undefined) {
				this.loginEmployee.storeCheckIn = [];
			}
			this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
				itemi.isOn = false;
				if (value.isDefault === true) {
					itemi.isDefault = false;
				}
			});

			this.loginEmployee.storeCheckIn.push(checkIn);
			this.employeeService
				.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
				.then((payload) => {
					this.loginEmployee = payload;
					let keepCheckIn;
					this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
						itemi.isOn = false;
						if (itemi.storeId === checkIn.storeId) {
							itemi.isOn = true;
							keepCheckIn = itemi;
						}
					});
					this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
					this.checkInBtn = true;
					this.checkInBtn = false;
					this.disableBtn = true;
					this.close_onClick();
				});
		}
	}
	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.loginEmployee.storeCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			if (itemi._id === checkIn._id) {
				itemi.isOn = true;
				keepCheckIn = itemi;
			}
		});
		this._authFacadeService
			.getCheckedInEmployee(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
			.then((payload) => {
				this.loginEmployee = payload;
				this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'store' });
				this.close_onClick();
			});
	}

	private _getAllStores(workSpaces) {
		// Get all Stores that has been created.
		this._storeService
			.find({ query: { facilityId: this.facility._id } })
			.then((res) => {
				if (res.data.length > 0) {
					if (!!workSpaces && workSpaces.length > 0) {
						res.data.forEach((store) => {
							workSpaces.forEach((workspace) => {
								if (workspace.isActive && workspace.locations.length > 0) {
									workspace.locations.forEach((x) => {
										if (x.isActive && x.minorLocationId === store.minorLocationId) {
											this.locations.push(x.minorLocationObject);
										}
									});
								}
							});
						});
					}
				}
			})
			.catch((err) => {});
	}
}
