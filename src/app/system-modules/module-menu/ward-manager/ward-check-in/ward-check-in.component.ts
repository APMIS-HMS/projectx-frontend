import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Employee, Facility, User } from '../../../../models/index';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { ClinicHelperService } from '../../../../system-modules/module-menu/clinic/services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { LocationService } from 'app/services/module-manager/setup';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-ward-check-in',
	templateUrl: './ward-check-in.component.html',
	styleUrls: [ './ward-check-in.component.scss' ]
})
export class WardCheckInComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	loginEmployee: Employee;
	workSpace: any;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	wardCheckin: FormGroup;
	wards: any[] = [];
	checkins: any[] = [];
	switchBtnText: String = 'Switch To Room';
	addCheckin = true;
	addingCheckin = false;
	disableSwitch = false;
	disableCheckIn = false;

	constructor(
		public formBuilder: FormBuilder,
		public clinicHelperService: ClinicHelperService,
		public facilityService: FacilitiesService,
		private _authFacadeService: AuthFacadeService,
		public employeeService: EmployeeService,
		private _wardEventEmitter: WardEmitterService,
		private _locationService: LocationService,
		public locker: CoolLocalStorage,
		private _router: Router,
		private _systemModuleService: SystemModuleService
	) {
		this.facility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this.locker.getObject('auth');
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				if (!!res._id) {
					this.loginEmployee = res;
					const reversedArr = this.loginEmployee.wardCheckIn.reverse();
					this.checkins = reversedArr.slice(0, 5);
				} else {
					this._notification('Error', "Couldn't get Logged in user! Please try again later");
				}
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this._getMajorLocation();

		this.wardCheckin = this.formBuilder.group({
			room: [ '', [ <any>Validators.required ] ],
			isDefault: [ true, [ <any>Validators.required ] ]
		});
	}

	checkIn(valid: boolean, value: any) {
		if (valid) {
			this.disableCheckIn = true;
			this.addCheckin = false;
			this.addingCheckin = true;
			const checkIn: any = <any>{};
			// checkIn.majorLocationId = value.location;
			checkIn.majorLocationId = value.room.locationId;
			checkIn.minorLocationId = { name: value.room.name, _id: value.room._id };
			checkIn.lastLogin = new Date();
			checkIn.isOn = true;
			checkIn.isDefault = value.isDefault;
			if (this.loginEmployee.wardCheckIn === undefined) {
				this.loginEmployee.wardCheckIn = [];
			}
			this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
				itemi.isOn = false;
				if (value.isDefault === true) {
					itemi.isDefault = false;
				}
			});
			this.loginEmployee.wardCheckIn.push(checkIn);
			this.employeeService.update(this.loginEmployee).then((payload) => {
				this.loginEmployee = payload;
				const reversedArr = this.loginEmployee.wardCheckIn.reverse();
				this.checkins = reversedArr.slice(0, 5);
				// const workspaces = <any>this.locker.getObject('workspaces');
				// this.loginEmployee.workSpaces = workspaces;
				// this.locker.setObject('loginEmployee', payload);
				let keepCheckIn;
				this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
					itemi.isOn = false;
					if (itemi.minorLocationId._id === checkIn.minorLocationId._id) {
						itemi.isOn = true;
						keepCheckIn = itemi;
					}
				});
				const text = 'You have successfully checked into ' + value.room.name + ' ward';
				// this._notification('Success', text);
				this._systemModuleService.announceSweetProxy(text, 'success');
				this.disableCheckIn = false;
				this.addCheckin = true;
				this.addingCheckin = false;
				this._wardEventEmitter.announceWardChange({ typeObject: keepCheckIn, type: 'ward' });
				this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'ward' });
				this.close_onClick();
			});
		} else {
			this._notification('Error', 'Some fields are empty. Please fill all required fields!');
		}
	}

	changeRoom(checkIn: any) {
		this.disableSwitch = true;
		let keepCheckIn;
		this.switchBtnText = 'Switching...';
		this.loginEmployee.wardCheckIn.forEach((itemi, i) => {
			itemi.isOn = false;
			itemi.isDefault = false;
			if (itemi.minorLocationId._id === checkIn.minorLocationId._id) {
				itemi.isOn = true;
				itemi.isDefault = true;
				keepCheckIn = itemi;
			}
		});

		this.employeeService.update(this.loginEmployee).then((payload) => {
			this.loginEmployee = payload;
			this.switchBtnText = 'Switch To Room';
			const text = 'You have successfully changed ward to ' + checkIn.minorLocationId.name + ' ward';
			// this._notification('Success', text);
			this._systemModuleService.announceSweetProxy(text, 'success');
			this.disableCheckIn = false;
			this.addCheckin = true;
			this.addingCheckin = false;
			this._wardEventEmitter.announceWardChange({ typeObject: keepCheckIn, type: 'ward' });
			this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'ward' });
			this.close_onClick();
		});
	}

	private _getMajorLocation() {
		this._locationService
			.find({ query: { name: 'Ward' } })
			.then((res) => {
				if (res.data.length > 0) {
					const locationId = res.data[0]._id;
					this._getFacilityWard(locationId);
				}
			})
			.catch((err) => {});
	}

	private _getFacilityWard(locationId) {
		this.facilityService
			.find({
				query: {
					_id: this.facility._id,
					'minorLocations.locationId': locationId
				}
			})
			.then((res) => {
				// *Starday Check if no ward location has been set
				if (res.data.length > 0) {
					if (
						!!this.loginEmployee &&
						!!this.loginEmployee.workSpaces &&
						this.loginEmployee.workSpaces.length > 0
					) {
						this.loginEmployee.workSpaces.forEach((workspace) => {
							if (workspace.isActive && workspace.locations.length > 0) {
								workspace.locations.forEach((x) => {
									if (x.isActive && x.majorLocationId === locationId) {
										const wards = res.data[0].minorLocations.filter(
											(y) => x.minorLocationId === y._id
										);
										this.wards.push(wards[0]);
									}
								});
							}
						});
					}
				} else {
					const text = 'No ward location has been created! Please create one!!';
					this._systemModuleService.announceSweetProxy(text, 'info');
					this._router.navigate([ '/dashboard/facility' ]);
				}
			})
			.catch((err) => {});
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
}
