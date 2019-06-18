import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import {
	Appointment,
	AppointmentType,
	ClinicModel,
	Employee,
	Facility,
	Profession,
	ScheduleRecordModel
} from '../../../../models/index';
// var _ = require('lodash');

import {
	AppointmentService,
	AppointmentTypeService,
	EmployeeService,
	FacilitiesService,
	PatientService,
	ProfessionService,
	SchedulerService,
	WorkSpaceService
} from '../../../../services/facility-manager/setup/index';
import { IPagerSource } from 'app/core-ui-modules/ui-components/PagerComponent';

@Component({
	selector: 'app-new-appointment',
	templateUrl: './new-appointment.component.html',
	styleUrls: [ './new-appointment.component.scss' ]
})
export class NewAppointmentComponent implements OnInit {
	appointmentTypeForm: FormGroup;
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	selectedProfession: Profession = <Profession>{};
	selectedAppointment: Appointment = <Appointment>{};
	clinics: any[] = [];
	schedules: ScheduleRecordModel[] = [];
	gSchedules: any[] = [];

	filteredClinics: any;
	filteredProviders: any;
	filteredAppointmentTypes: any;

	appointmentTypes: AppointmentType[] = [];
	providers: Employee[] = [];
	appointments: any[] = [];
	pastAppointments: any[] = [];
	isDoctor = false;
	loadIndicatorVisible = false;
	loadingProviders = false;
	subscription: Subscription;
	auth: any;
	currentDate: Date = new Date();
	physicianAppointment = true;
	immunizationAppointment = false;
	radiologyAppointment = false;
	theatreAppointment = true;
	clinicCtrl: FormControl;
	providerCtrl: FormControl;
	typeCtrl: FormControl;
	statusCtrl: FormControl;
	todayCtrl: FormControl;
	searchControl: FormControl = new FormControl();
	selectedPatient: any = <any>{};
	selectedClinic: any = <any>{};
	dateRange: any;
	filteredStates: any;
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

	dayCount = [ 'Today', 'Last 3 Days', 'Last Week', 'Last 2 Weeks', 'Last Month' ];
	paginationObj: IPagerSource = { totalRecord: 0, currentPage: 0, pageSize: 10, totalPages: 0 };
	constructor(
		private _fb: FormBuilder,
		private scheduleService: SchedulerService,
		private locker: CoolLocalStorage,
		private appointmentService: AppointmentService,
		private facilityService: FacilitiesService,
		private appointmentTypeService: AppointmentTypeService,
		private professionService: ProfessionService,
		private employeeService: EmployeeService,
		private workSpaceService: WorkSpaceService,
		private patientService: PatientService,
		private route: ActivatedRoute
	) {
		route.params.subscribe((params) => {
			if (params.id !== undefined) {
				this.appointmentService.getAppointment(params.id, {}).subscribe((payload) => {
					this.selectedAppointment = payload;
					if (payload.immunizationRecords !== undefined) {
						this.appointmentTypeForm.controls['category'].setValue('immunizationAppointment');
						this.onClickRadioBtn('immunizationAppointment');
						// this. appointmentService.appointmentAnnounced(payload);
					} else {
						this.appointmentTypeForm.controls['category'].setValue('physicianAppointment');
						this.onClickRadioBtn('physicianAppointment');
					}
					this.appointmentService.appointmentAnnounced(payload);
				});
			} else if (params.patientId !== undefined && params.doctorId !== undefined) {
				this.patientService.get(params.patientId, {}).then((inPayload) => {
					this.patientService.announcePatient(inPayload);
					this.selectedPatient = inPayload;
				});
			}
		});

		this.appointmentService.schedulesAnnounced$.subscribe((payload: any) => {
			var self = this;
			payload.sort(function sortByDay(a, b) {
				var day1 = a.day.toLowerCase();
				var day2 = b.day.toLowerCase();
				return self.sorter[day1] > self.sorter[day2];
			});
			this.schedules = payload;
		});

		this.appointmentService.patientAnnounced$.subscribe((payload: any) => {
			this.selectedPatient = payload;
			this.getPreviousAppointments(payload);
		});

		this.appointmentService.clinicAnnounced$.subscribe((payload: any) => {
			this.getClinicAppointments(payload);
		});

		this.clinicCtrl = new FormControl();
		this.filteredClinics = this.clinicCtrl.valueChanges
			.startWith(null)
			.map((clinic) => (clinic && typeof clinic === 'object' ? clinic.clinicName : clinic))
			.map((val) => (val ? this.filterClinics(val) : this.clinics.slice()));

		this.providerCtrl = new FormControl();
		this.filteredProviders = this.providerCtrl.valueChanges
			.startWith(null)
			.map(
				(provider: Employee) =>
					provider && typeof provider === 'object' ? provider.employeeDetails.lastName : provider
			)
			.map((val) => (val ? this.filterProviders(val) : this.providers.slice()));

		this.typeCtrl = new FormControl();
		this.filteredAppointmentTypes = this.typeCtrl.valueChanges
			.startWith(null)
			.map((type: AppointmentType) => (type && typeof type === 'object' ? type.name : type))
			.map((val) => (val ? this.filterAppointmentTypes(val) : this.appointmentTypes.slice()));

		this.statusCtrl = new FormControl();
		// this.filteredStates = this.statusCtrl.valueChanges
		//     .startWith(null)
		//     .map(name => this.filterStates(name));

		this.todayCtrl = new FormControl();
		// this.filteredStates = this.statusCtrl.valueChanges
		//     .startWith(null)
		//     .map(name => this.filterStates(name));
		this.prime();
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.auth = <any>this.locker.getObject('auth');
		// this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
		this.employeeService.loginEmployeeAnnounced$.subscribe((employee) => {
			this.loginEmployee = employee;
			this.prime();
		});

		this.appointmentTypeForm = this._fb.group({ category: [ 'physicianAppointment' ] });
	}
	getClinicAppointments(value) {
		this.selectedClinic = value.clinicId;
		this.appointmentService
			.findAppointment({
				query: {
					clinicId: value.clinicId.clinicName,
					facilityId: this.selectedFacility._id,
					hasDate: true,
					startDate: value.startDate,
					$limit: this.paginationObj.pageSize,
					$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
				}
			})
			.subscribe((payload) => {
				this.appointments = payload.data;
				this.paginationObj.totalRecord = payload.total;
			});
	}
	setReturnValue(dateRange: any): any {
		this.dateRange = dateRange;
		this.appointmentService
			.find({
				query: {
					isWithinRange: true,
					from: this.dateRange.from,
					to: this.dateRange.to,
					'facilityId._id': this.selectedFacility._id,
					'patientId._id': this.selectedPatient._id
				}
			})
			.subscribe((payload) => {
				this.appointments = payload.data;
			});
	}
	getPreviousAppointments(value) {
		this.pastAppointments = [];
		if (value._id !== undefined) {
			this.appointmentService
				.findAppointment({
					query: {
						patientId: value._id,
						$limit: this.paginationObj.pageSize,
						$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
					}
				})
				.subscribe((payload) => {
					this.pastAppointments = payload.data;
					this.paginationObj.totalRecord = payload.total;
				});
		}
	}

	getClinics() {
		this.clinics = [];
		const clinicIds = [];
		this.selectedFacility.departments.forEach((itemi, i) => {
			itemi.units.forEach((itemj, j) => {
				itemj.clinics.forEach((itemk, k) => {
					if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
						this.loginEmployee.units.forEach((itemu, u) => {
							if (itemu === itemj._id) {
								const clinicModel: ClinicModel = <ClinicModel>{};
								clinicModel.clinic = itemk;
								clinicModel.department = itemi;
								clinicModel.unit = itemj;
								clinicModel._id = itemk._id;
								clinicModel.clinicName = itemk.clinicName;
								this.clinics.push(clinicModel);
								clinicIds.push(clinicModel._id);
							}
						});
					} else if (
						this.loginEmployee !== undefined &&
						this.loginEmployee.professionObject.name !== 'Doctor'
					) {
						this.loginEmployee.workSpaces.forEach((wrk, ii) => {
							wrk.locations.forEach((lct, li) => {
								this.gSchedules.forEach((sch: any, ji) => {
									sch.schedules.forEach((sch2, jji) => {
										if (
											sch2.location._id === lct.minorLocationId._id &&
											sch.clinicObject.clinic._id === itemk._id
										) {
											const clinicModel: ClinicModel = <ClinicModel>{};
											clinicModel.clinic = sch.clinicObject.clinic;
											clinicModel.department = itemi;
											clinicModel.unit = itemj;
											clinicModel._id = itemk._id;
											clinicModel.clinicName = itemk.clinicName;
											this.clinics.push(clinicModel);
											clinicIds.push(clinicModel._id);
										}
									});
								});
							});
						});
						// this.loginEmployee.workSpaces.forEach((itemw, w) => {
						//     itemw.locations.forEach((iteml, l) => {
						//         if (iteml.minorLocationId === itemk.clinicLocation) {
						//             const clinicModel: ClinicModel = <ClinicModel>{};
						//             clinicModel.clinic = itemk;
						//             clinicModel.department = itemi;
						//             clinicModel.unit = itemj;
						//             clinicModel._id = itemk._id;
						//             clinicModel.clinicName = itemk.clinicName;
						//             this.clinics.push(clinicModel);
						//             clinicIds.push(clinicModel._id);
						//         }
						//     });
						// });
					}
				});
			});
		});
		this.loadIndicatorVisible = false;
	}

	prime() {
		if (this.loginEmployee._id !== undefined) {
			this.loadIndicatorVisible = true;
			this.subscription = Observable.forkJoin([
				Observable.fromPromise(
					this.workSpaceService.find({ query: { 'employeeId._id': this.loginEmployee._id } })
				),
				Observable.fromPromise(this.appointmentTypeService.findAll()),
				Observable.fromPromise(this.professionService.findAll()),
				Observable.fromPromise(this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }))
			]).subscribe((results: any) => {
				this.loginEmployee.workSpaces = results[0].data;
				this.appointmentTypes = results[1].data;
				const professions = results[2].data;
				this.gSchedules = results[3].data;
				const filteredProfessions = professions.filter((x) => x.name === 'Doctor');
				if (filteredProfessions.length > 0) {
					this.selectedProfession = filteredProfessions[0];
				}
				if (this.loginEmployee !== undefined && this.loginEmployee.professionObject !== undefined) {
					this.selectedProfession = this.loginEmployee.professionObject;
					if (this.loginEmployee.professionObject.name === 'Doctor') {
						this.isDoctor = true;
					}
					this.getClinics();
					this.getEmployees();
				}
			});
		}
	}
	getEmployees() {
		this.loadingProviders = true;
		this.providers = [];
		if (this.isDoctor) {
			this.employeeService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						professionId: this.selectedProfession._id,
						units: { $in: this.loginEmployee.units }
					}
				})
				.then((payload) => {
					payload.data.forEach((itemi, i) => {
						this.providers.push(itemi);
					});
					this.loadingProviders = false;
				});
		} else {
			this.employeeService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						professionId: this.selectedProfession._id
					}
				})
				.then((payload) => {
					payload.data.forEach((itemi, i) => {
						this.providers.push(itemi);
					});
					this.loadingProviders = false;
				});
		}
	}
	editAppointment(appointment) {
		this.appointmentService.appointmentAnnounced(appointment);
	}
	cancelAppointment(appointment) {
		appointment.isActive = false;
		this.appointmentService.update(appointment).subscribe((payload) => {
			this.appointmentService.patientAnnounced(this.selectedPatient);
		});
	}
	getAppointmentTypes() {
		this.appointmentTypeService.findAll().subscribe((payload) => {
			this.appointmentTypes = payload.data;
		});
	}
	filterClinics(val: any) {
		return val
			? this.clinics.filter((s) => s.clinicName.toLowerCase().indexOf(val.toLowerCase()) === 0)
			: this.clinics;
	}
	filterProviders(val: any) {
		return val
			? this.providers.filter(
					(s) =>
						s.employeeDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0 ||
						s.employeeDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0
				)
			: this.providers;
	}
	filterAppointmentTypes(val: any) {
		return val
			? this.appointmentTypes.filter((s) => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
			: this.appointmentTypes;
	}
	displayFn(clinic: any): string {
		return clinic ? clinic.clinicName : clinic;
	}
	providerDisplayFn(provider: any): string {
		return provider ? provider.employeeDetails.lastName + ' ' + provider.employeeDetails.lastName : provider;
	}

	appointmentTypeDisplayFn(type: any): string {
		return type ? type.name : type;
	}

	onClickRadioBtn(value: string) {
		if (value === 'physicianAppointment') {
			this.physicianAppointment = true;
			this.immunizationAppointment = false;
			this.radiologyAppointment = false;
			this.theatreAppointment = false;
		} else if (value === 'immunizationAppointment') {
			this.physicianAppointment = false;
			this.immunizationAppointment = true;
			this.radiologyAppointment = false;
			this.theatreAppointment = false;
		} else if (value === 'radiologyAppointment') {
			this.physicianAppointment = false;
			this.immunizationAppointment = false;
			this.radiologyAppointment = true;
			this.theatreAppointment = false;
		} else if (value === 'theatreAppointment') {
			this.physicianAppointment = false;
			this.immunizationAppointment = false;
			this.radiologyAppointment = false;
			this.theatreAppointment = true;
		}
	}
}
