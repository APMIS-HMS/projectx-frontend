import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import {
	SchedulerService,
	SchedulerTypeService,
	FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import { ClinicModel, Facility, Location, ScheduleRecordModel, User } from '../../../../models/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DurationUnits } from '../../../../shared-module/helpers/global-config';
import * as differenceInMinutes from 'date-fns/difference_in_minutes';
import * as addMinutes from 'date-fns/add_minutes';
const moment = require('moment');
@Component({
	selector: 'app-clinic-schedule',
	templateUrl: './clinic-schedule.component.html',
	styleUrls: [ './clinic-schedule.component.scss' ]
})
export class ClinicScheduleComponent implements OnInit {
	value: Date = new Date(1981, 3, 27);
	now: Date = new Date();
	min: Date = new Date(1900, 0, 1);
	dateClear = new Date(2015, 11, 1, 6);
	user: User = <User>{};

	clinicScheduleForm: FormGroup;
	locationTypeControl = new FormControl();
	clinic: Location = <Location>{};
	selectedFacility: Facility = <Facility>{};
	selectedSchedulerType: any = <any>{};
	selectedManager: ScheduleRecordModel = <ScheduleRecordModel>{};
	clinics: any[] = [];
	clinicLocations: any[] = [];
	schedules: any[] = [];
	scheduleManagers: ScheduleRecordModel[] = [];
	loading: Boolean = false;
	durationUnits = [];

	sorter = {
		// "sunday": 0, // << if sunday is first day of week
		monday: 1,
		tuesday: 2,
		wednesday: 3,
		thursday: 4,
		friday: 5,
		saturday: 6,
		sunday: 7
	};

	days: any[] = [ 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday' ];
	btnCreatText = 'Create';
	constructor(
		private formBuilder: FormBuilder,
		private facilityService: FacilitiesService,
		private locationService: LocationService,
		private locker: CoolLocalStorage,
		private schedulerTypeService: SchedulerTypeService,
		private systemModuleService: SystemModuleService,
		private schedulerService: SchedulerService,
		private _systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.durationUnits = DurationUnits;
		this.subscribToFormControls();
		const facility = <Facility>this.locker.getObject('selectedFacility');
		this.selectedFacility = facility;
		// this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.facilityService.get(facility._id, {}).then((payload) => {
			this.selectedFacility = payload;
			payload.departments.forEach((itemi, i) => {
				itemi.units.forEach((itemj, j) => {
					itemj.clinics.forEach((itemk, k) => {
						const clinicModel: ClinicModel = <ClinicModel>{};
						clinicModel.clinic = itemk;
						clinicModel.department = itemi;
						clinicModel.unit = itemj;
						clinicModel._id = itemk._id;
						clinicModel.clinicName = itemk.clinicName;
						this.clinics.push(clinicModel);
					});
				});
			});
		});
		this.user = <User>this.locker.getObject('auth');

		this.getSchedulerType();
		this.addNewClinicSchedule();
		this.getClinicSchedules();
		this.getClinicMajorLocation();
	}

	getClinicSchedules() {
		this.clearAllSchedules();
		this.schedulerService.find({ query: { facilityId: this.selectedFacility._id } }).then((payload) => {
			this.loading = false;
			// this.scheduleManagers = payload.data;
			const self = this;

			// this.scheduleManagers = payload.data;
			for (let i = 0; i < payload.data.length; i++) {
				payload.data[i].schedules.sort(function sortByDay(a, b) {
					const day1 = a.day.toLowerCase();
					const day2 = b.day.toLowerCase();
					return self.sorter[day1] > self.sorter[day2];
				});
			}
			this.scheduleManagers = payload.data;
		});
	}

	subscribToFormControls() {
		this.locationTypeControl.valueChanges.subscribe((value) => {
			if (value !== undefined) {
				this.clearAllSchedules();
				this.schedulerService
					.find({ query: { clinic: value.clinicName, facilityId: this.selectedFacility._id } })
					.then((payload) => {
						if (payload.data.length > 0) {
							this.selectedManager = payload.data[0];
							this.loadManagerSchedules(false);
						}
					});
			}
		});
	}

	onSelectSchedulerManager(manager: ScheduleRecordModel) {
		this.selectedManager = manager;
		this.locationTypeControl.setValue(this.clinics.filter((x) => x.clinicName === this.selectedManager.clinic)[0]);
		this.loadManagerSchedules(false);
		if (this.selectedManager.schedules.length > 0) {
			this.btnCreatText = 'Update';
		} else {
			this.btnCreatText = 'Create';
		}
	}

	deleteSelectedSchedulerManager(manager: any, i) {
		this._systemModuleService.announceSweetProxy('Are you sure you want to delete this item?', 'question', this);
	}

	sweetAlertCallback(result) {
		if (result.value) {
			this.schedulerService.remove(this.selectedManager._id, {}).subscribe((payload) => {
				this.loadManagerSchedules(true);
			});
		}
	}

	loadManagerSchedules(force: boolean) {
		this.clearAllSchedules();
		if (this.selectedManager !== undefined && this.selectedManager.clinic !== undefined && force === false) {
			this.selectedManager.schedules.forEach((itemi, i) => {
				const d = new Date(itemi.startTime);
				const hour = d.getHours();
				const min = d.getMinutes();
				const time = { hour: hour, minute: min };

				const d2 = new Date(itemi.endTime);
				const ehour = d2.getHours();
				const emin = d2.getMinutes();
				const etime = { hour: ehour, minute: emin };
				(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).push(
					this.formBuilder.group({
						day: [ itemi.day, [ <any>Validators.required ] ],
						noSlots: [ itemi.noSlots, [] ],
						timePerSlot: [ itemi.timePerSlot, [] ],
						timeUnit: [ itemi.timeUnit, [] ],
						slots: [ itemi.slots, [] ],
						startTime: [ time, [ <any>Validators.required ] ],
						endTime: [ etime, [ <any>Validators.required ] ],
						location: [
							this.clinicLocations.filter((x) => x._id === itemi.location._id)[0],
							[ <any>Validators.required ]
						],
						readOnly: [ true ]
					})
				);
			});
		} else {
			this.getClinicSchedules();
		}
	}

	get formData() {
		return <FormArray>this.clinicScheduleForm.controls['clinicScheduleArray'].get('Data');
	}

	clearAllSchedules() {
		this.clinicScheduleForm.controls['clinicScheduleArray'] = this.formBuilder.array([]);
	}

	getClinicMajorLocation() {
		this.locationService.findAll().then((payload) => {
			payload.data.forEach((itemi, i) => {
				if (itemi.name === 'Clinic') {
					this.clinic = itemi;
					this.getClinicLocation();
				}
			});
		});
	}
	getSchedulerType() {
		this.schedulerTypeService
			.find({ query: { name: 'Clinic' } })
			.then((res) => {
				if (res.data.length > 0) {
					this.selectedSchedulerType = res.data[0];
				}
			})
			.catch((err) => {});
	}

	getClinicLocation() {
		this.clinicLocations = this.selectedFacility.minorLocations.filter((x) => x.locationId === this.clinic._id);
	}

	addNewClinicSchedule() {
		this.clinicScheduleForm = this.formBuilder.group({
			clinicScheduleArray: this.formBuilder.array([
				this.formBuilder.group({
					day: [ '', [ <any>Validators.required ] ],
					startTime: [ this.now, [ <any>Validators.required ] ],
					endTime: [ this.now, [ <any>Validators.required ] ],
					location: [ '', [ <any>Validators.required ] ],
					noSlots: [ 0, [] ],
					timePerSlot: [ 0, [] ],
					timeUnit: [ this.durationUnits[0].name, [] ],
					slots: [ [], [] ],
					readOnly: [ false ]
				})
			])
		});
	}
	pushNewClinicSchedule() {
		(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).push(
			this.formBuilder.group({
				day: [ '', [ <any>Validators.required ] ],
				startTime: [ this.now, [ <any>Validators.required ] ],
				endTime: [ this.now, [ <any>Validators.required ] ],
				location: [ '', [ <any>Validators.required ] ],
				noSlots: [ 0, [] ],
				timePerSlot: [ 0, [] ],
				timeUnit: [ this.durationUnits[0].name, [] ],
				slots: [ [], [] ],
				readOnly: [ false ]
			})
		);
		this.subscribToFormControls();
	}
	compareTimeUnit(d1: any, d2: any) {
		return d1 === d2;
	}
	calculateMinutes(count, unit) {
		if (unit === 'Minutes') {
			return count;
		} else if (unit === 'Hours') {
			return count * 60;
		} else if (unit === 'Days') {
			return count * 60 * 60;
		} else {
			return 0;
		}
	}
	onCreateSchedule() {
		this.schedules = [];
		let hasReadOnly = false;

		(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.forEach((itemi, i) => {
			if (itemi.value.readOnly === true) {
				hasReadOnly = true;
			}
		});

		if (this.selectedManager !== undefined && this.selectedManager.clinic !== undefined && hasReadOnly) {
			this.selectedManager.schedules = [];
			(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.forEach((itemi, i) => {
				const startTime = new Date();
				startTime.setHours(itemi.value.startTime.hour);
				startTime.setMinutes(itemi.value.startTime.minute);
				itemi.value.startTime = startTime;

				const endTime = new Date();
				endTime.setHours(itemi.value.endTime.hour);
				endTime.setMinutes(itemi.value.endTime.minute);
				itemi.value.endTime = endTime;
				this.selectedManager.schedules.push(itemi.value);

				if (itemi.value.noSlots > 0 && itemi.value.timePerSlot > 0 && itemi.value.timeUnit.length > 0) {
					const timeDifference = differenceInMinutes(endTime, startTime);
					const timeInMinutes = this.calculateMinutes(itemi.value.timePerSlot, itemi.value.timeUnit);
					const totalSlot = timeDifference / timeInMinutes;
					let _startTime = Object.assign(startTime);
					itemi.value.slots = [];
					for (i = 0; i < totalSlot; i++) {
						const _endTime = addMinutes(_startTime, timeInMinutes);
						if (itemi.value.slots !== undefined && itemi.value.slots !== null) {
							itemi.value.slots.push({
								start: moment(_startTime).format('HH:mm A'),
								end: moment(_endTime).format('HH:mm A')
							});
						} else {
							itemi.value.slots = [];
							itemi.value.slots.push({ start: _startTime.toTimeString(), end: _endTime.toTimeString() });
						}
						_startTime = _endTime;
					}
				}
			});

			this.schedulerService.update(this.selectedManager).then((payload) => {
				this.selectedManager = payload;
				this.systemModuleService.announceSweetProxy(
					'Clinic Schedule has been updated successfully',
					'success',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
				this._notification('Success', 'Clinic Schedule has been updated successfully.');
				this.loadManagerSchedules(true);
			});
		} else {
			if (!!this.selectedSchedulerType) {
				const manager: ScheduleRecordModel = <ScheduleRecordModel>{ schedules: [] };
				delete this.locationTypeControl.value.department.units;
				manager.clinic = this.locationTypeControl.value.clinicName;
				manager.scheduleType = this.selectedSchedulerType.name;
				manager.facilityId = this.selectedFacility._id;
				manager.department = this.locationTypeControl.value.department.name;
				manager.unit = this.locationTypeControl.value.unit.name;
				(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.forEach((itemi, i) => {
					const startTime = new Date();
					startTime.setHours(itemi.value.startTime.hour);
					startTime.setMinutes(itemi.value.startTime.minute);
					itemi.value.startTime = startTime;

					const endTime = new Date();
					endTime.setHours(itemi.value.endTime.hour);
					endTime.setMinutes(itemi.value.endTime.minute);
					itemi.value.endTime = endTime;
					manager.schedules.push(itemi.value);
				});

				this.schedulerService.create(manager).then((payload) => {
					this.selectedManager = payload;
					this._notification('Success', 'Clinic Schedule has been created successfully.');
					this.systemModuleService.announceSweetProxy(
						'Clinic Schedule has been created successfully',
						'success',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
					this.loadManagerSchedules(true);
				});
			} else {
				this._notification(
					'Error',
					'There was a problem getting Schedule type service. Please try again later.'
				);
				this.systemModuleService.announceSweetProxy(
					'There was a problem getting Schedule type service. Please try again later.',
					'error',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
				this.getSchedulerType();
			}
		}
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	closeClinicSchedule(clinic: any, i: any) {
		(<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.splice(i, 1);
		const remainSchedules = (<FormArray>this.clinicScheduleForm.controls['clinicScheduleArray']).controls.map(
			(v) => v.value
		);
		this.selectedManager.schedules = remainSchedules;
		// this.loadManagerSchedules(false);
		this.btnCreatText = 'Update';
	}

	onSubmit() {}
}
