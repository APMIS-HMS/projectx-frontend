import { appointment } from './../../../../../services/facility-manager/setup/devexpress.service';
import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import * as getDay from 'date-fns/get_day';
import * as getHours from 'date-fns/get_hours';
import * as getMinutes from 'date-fns/get_minutes';
import * as getMonth from 'date-fns/get_month';
import * as getYear from 'date-fns/get_year';
import * as isBefore from 'date-fns/is_before';
import * as isToday from 'date-fns/is_today';
import * as parse from 'date-fns/parse';
import * as setDay from 'date-fns/set_day';
import * as setHours from 'date-fns/set_hours';
import * as setMinutes from 'date-fns/set_minutes';
import * as setMonth from 'date-fns/set_month';
import * as setYear from 'date-fns/set_year';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { error } from 'selenium-webdriver';

import {
	Appointment,
	AppointmentType,
	ClinicModel,
	Employee,
	Facility,
	MinorLocation,
	Patient,
	Profession,
	ScheduleRecordModel
} from '../../../../../models/index';
import {
	AppointmentService,
	AppointmentTypeService,
	BillingService,
	EmployeeService,
	FacilitiesService,
	FacilitiesServiceCategoryService,
	FacilityPriceService,
	PatientService,
	ProfessionService,
	SchedulerService,
	SmsAlertService,
	TimezoneService,
	WorkSpaceService
} from '../../../../../services/facility-manager/setup/index';
import { LocationService, OrderStatusService } from '../../../../../services/module-manager/setup/index';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

@Component({
	selector: 'app-schedule-frm',
	templateUrl: './schedule-frm.component.html',
	styleUrls: [ './schedule-frm.component.scss' ]
})
export class ScheduleFrmComponent implements OnInit {
	appointmentIsToday = false;
	showTimeZone: boolean;
	@Input() selectedPatient: any;
	selectedProvider: any;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	selectedProfession: Profession = <Profession>{};
	clinics: any[] = [];
	patients: Patient[] = [];
	clinicLocations: MinorLocation[] = [];

	filteredClinics: Observable<any[]>;
	filteredProviders: Observable<Employee[]>;
	filteredAppointmentTypes: Observable<AppointmentType[]>;
	filteredPatients: Observable<Patient[]>;
	filteredCategoryServices: Observable<any[]>;

	appointmentTypes: AppointmentType[] = [];
	providers: Employee[] = [];
	schedules: ScheduleRecordModel[] = [];
	scheduleManagers: ScheduleRecordModel[] = [];
	professions: Profession[] = [];
	categoryServices: any[] = [];
	timezones: any[] = [];
	appointments: any[] = [];
	orderStatuses: any[] = [];
	selectedClinic: any = <any>{};
	selectedClinicSchedule: any;
	isDoctor = false;
	loadIndicatorVisible = false;
	loadingPatients = false;
	loadingProviders = false;
	canCheckIn = true;
	subscription: Subscription;
	auth: any;
	currentDate: Date = new Date();
	clinicMajorLocation: any;
	organizationalServiceId: any = {};
	organizationalServicePrice = 0;
	// filteredStates: any;
	patient: FormControl;
	timeSlots: FormControl;
	clinic: FormControl;
	provider: FormControl;
	type: FormControl;
	status: FormControl;
	serviceCategory: FormControl;
	category: FormControl;
	checkIn: FormControl;
	teleMed: FormControl;
	timezone: FormControl;
	date = new Date(); // FormControl = new FormControl();
	endDate = new Date();
	startDate = new Date();
	dateCtrl: FormControl = new FormControl(new Date(), [ Validators.required ]);
	reason: FormControl = new FormControl();
	appointment: any = <any>{};
	apmisLookupUrl = 'patient-search';
	apmisLookupText = '';
	apmisLookupQuery: any = {};
	apmisLookupDisplayKey = 'personDetails.firstName';
	apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
	apmisLookupOtherKeys = [
		'personDetails.lastName',
		'personDetails.firstName',
		'personDetails.apmisId',
		'personDetails.email'
	];
	apmisProviderLookupUrl = 'employee-search';
	apmisProviderLookupText = '';
	apmisProviderLookupQuery: any = {};
	apmisProviderLookupDisplayKey = 'personDetails.firstName';
	apmisProviderLookupImgKey = 'personDetails.profileImageObject.thumbnail';
	apmisProviderLookupOtherKeys = [
		'personDetails.lastName',
		'personDetails.firstName',
		'personDetails.apmisId',
		'personDetails.email'
	];

	days: any[] = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' ];
	selectedAppointment: Appointment = <Appointment>{};
	btnText = 'Schedule Appointment';
	disableBtn = false;
	saveAppointment = true;
	savingAppointment = false;
	updateAppointment = false;
	clinicErrorMsg = ' Clinic does not hold on the selected date!!!';
	clinicErrorEalierDateMsg = ' Clinic can not be set for earlier date!!!';
	isEarlierDate = false;

	user = {};
	placeholderString = 'Select timezone';

	constructor(
		private scheduleService: SchedulerService,
		private locker: CoolLocalStorage,
		private appointmentService: AppointmentService,
		private patientService: PatientService,
		private router: Router,
		private appointmentTypeService: AppointmentTypeService,
		private professionService: ProfessionService,
		private employeeService: EmployeeService,
		private workSpaceService: WorkSpaceService,
		private timeZoneService: TimezoneService,
		private orderStatusService: OrderStatusService,
		private systemModuleService: SystemModuleService,
		private authFacadeService: AuthFacadeService,
		private locationService: LocationService,
		private facilityServiceCategoryService: FacilitiesServiceCategoryService,
		private facilityPriceService: FacilityPriceService,
		private _smsAlertService: SmsAlertService,
		private billingService: BillingService,
		private route: ActivatedRoute
	) {
		appointmentService.appointmentAnnounced$.subscribe((payload: any) => {
			this.appointment = payload;
			this.updateAppointment = true;
			this.saveAppointment = false;
			this.savingAppointment = false;
			const filterClinic = this.clinics.filter((x) => x._id === payload.clinicId._id);
			if (filterClinic.length > 0) {
				this.clinic.setValue(filterClinic[0]);
				this.dateChange(this.appointment.startDate);
			}

			// this.provider.setValue(payload.providerDetails);
			if (this.appointment.providerDetails !== undefined) {
				this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
			}
			// this.selectedPatient = payload.patientDetails;
			this.selectedPatient = payload;
			// this.patient.setValue(payload.patientDetails);
			this.apmisLookupHandleSelectedItem(payload.patientDetails);
			this.date = payload.startDate;
			this.reason.setValue(payload.appointmentReason);
			this.type.setValue(payload.appointmentTypeId);
			this.category.setValue(payload.category);
			this.status.setValue(payload.orderStatusId);
			if (payload.attendance !== undefined) {
				if (this.canCheckIn) {
					this.checkIn.enable();
				} else {
					this.checkIn.disable();
				}
			} else {
				this.checkIn.disable();
			}
			if (payload.zoom !== undefined) {
				this.teleMed.setValue(true);
				this.timezone.setValue(payload.zoom.timezone);
			}
			this.isAppointmentToday();
		});
		this.dateCtrl.valueChanges.subscribe((value) => {
			this.dateChange(value);
		});
		this.checkIn = new FormControl({ value: false, disabled: this.canCheckIn });
		this.teleMed = new FormControl();

		this.patient = new FormControl('', [ Validators.required ]);
		this.patient.valueChanges.subscribe((value) => {
			if (value.length > 2){
			this.apmisLookupQuery = {
				facilityId: this.selectedFacility._id,
				searchText: value,
				patientTable: true
			};
		}
		});
		// this.filteredPatients = this.patient.valueChanges
		//   .startWith(null)
		//   .map(
		//     (patient: Patient) =>
		//       patient && typeof patient === "object"
		//         ? this.announcePatient(patient)
		//         : patient
		//   )
		//   .map(val => (val ? this.filterPatients(val) : this.patients.slice()));

		this.clinic = new FormControl('', [ Validators.required ]);
		this.status = new FormControl('', [ Validators.required ]);
		this.timeSlots = new FormControl('', []);
		this.clinic.valueChanges.subscribe((clinic) => {
			this.getOthers(clinic);
		});

		this.provider = new FormControl();
		this.provider.valueChanges.subscribe((value) => {
			if (value.length > 3) {
				this.apmisProviderLookupQuery = {
					facilityId: this.selectedFacility._id,
					searchText: value,
					employeeTable: true,
					$or: [
						{
							professionId: { $regex: 'doctor', $options: 'i' }
						},
						{
							professionId: { $regex: 'nurse', $options: 'i' }
						}
					],
					apmisLookup: true,
					filterByRole: true,
					moduleName: 'Clinic Management',
					roleName: 'Providers'
				};
			} else {
				// this.apmisProviderLookupQuery = {
				// }
			}
		});

		// this.filteredProviders = this.provider.valueChanges
		//   .startWith(null)
		//   .map(
		//     (provider: Employee) =>
		//       provider && typeof provider === "object"
		//         ? provider.personDetails.lastName
		//         : provider
		//   )
		//   .map(val => (val ? this.filterProviders(val) :
		//   this.providers.slice()));

		this.type = new FormControl('', [ Validators.required ]);

		// this.filteredAppointmentTypes = this.type.valueChanges
		//     .startWith(null)
		//     .map((type: AppointmentType) => type && typeof type === 'object' ?
		//     type.name : type) .map(val => val ? this.filterAppointmentTypes(val)
		//     : this.appointmentTypes.slice());

		this.category = new FormControl('', [ Validators.required ]);
		this.timezone = new FormControl('', []);
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.auth = this.authFacadeService.getAuth(); // <any>this.locker.getObject("auth");

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.primeComponent();
		});

		if (this.selectedClinic._id !== undefined) {
			this.appointmentService.clinicAnnounced({ clinicId: this.selectedClinic, startDate: this.date });
		}
		this.teleMed.valueChanges.subscribe((value) => {
			if (value) {
				this.showTimeZone = true;
			} else {
				this.showTimeZone = false;
			}
		});
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.employeeService.loginEmployeeAnnounced$.subscribe((employee) => {
			this.loginEmployee = employee;
			this.primeComponent();
		});
		this.patientService.patientAnnounced$.subscribe((value) => {
			this.selectedPatient = value;
			// this.patient.setValue(this.selectedPatient);
			this.apmisLookupHandleSelectedItem(this.selectedPatient);
		});

		this.category.valueChanges.subscribe((value) => {
			if (value !== null) {
				this.systemModuleService.on();
				this.facilityPriceService
					.find({
						query: {
							facilityId: this.selectedFacility._id,
							categoryId: this.organizationalServiceId.categoryId,
							facilityServiceId: this.organizationalServiceId.facilityServiceId,
							serviceId: value
						}
					})
					.then(
						(payload) => {
							this.systemModuleService.off();
							if (payload.data.length > 0) {
								this.organizationalServicePrice = payload.data[0].price;
							} else {
								this.systemModuleService.announceSweetProxy(
									'No price found on selected appointment. Please set a price for this appointment category',
									'error'
								);
								this.category.reset();
							}
						},
						(err) => {
							this.systemModuleService.off();
						}
					);
			}
		});

		this.getPatients();
		this.getTimezones();

		this.route.queryParams.subscribe((params) => {
			if (params.checkedOut) {
				this.patient.disable();
				this.type.disable();
				this.clinic.disable();
				this.category.disable();
			}
		});
	}

	apmisLookupHandleSelectedItem(value) {
		this.apmisLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}`;
		this.selectedPatient = value;
		this.appointmentService.patientAnnounced(this.selectedPatient);
	}

	apmisProviderLookupHandleSelectedItem(value) {
		this.apmisProviderLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}`;
		this.selectedProvider = value;
	}

	getTimezones() {
		this.timeZoneService.findAll().then((payload) => {
			this.timezones = payload.data;
			if (this.appointment._id && this.appointment.zoom !== undefined) {
				const index = this.timezones.findIndex((x) => x.value === this.appointment.zoom.timezone);
				this.timezone.setValue(this.timezones[index]);
			}
		});
	}

	primeComponent() {
		const majorLocation$ = Observable.fromPromise(this.locationService.find({ query: { name: 'Clinic' } }));
		const appointmentTypes$ = Observable.fromPromise(this.appointmentTypeService.findAll());
		// const patient$ = Observable.fromPromise(this.patientService.find({ query:
		// { facilityId: this.selectedFacility._id } }));
		const schedule$ = Observable.fromPromise(
			this.scheduleService.find({
				query: { facilityId: this.selectedFacility._id, scheduleType: 'Clinic' }
			})
		);
		const professions$ = Observable.fromPromise(this.professionService.findAll());
		const facilityServiceCategory$ = Observable.fromPromise(
			this.facilityServiceCategoryService.find({ query: { facilityId: this.selectedFacility._id } })
		);
		const workSpaces$ = Observable.fromPromise(
			this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } })
		);
		const orderStatuses$ = Observable.fromPromise(this.orderStatusService.findAll());
		Observable.forkJoin([
			majorLocation$,
			appointmentTypes$,
			professions$,
			facilityServiceCategory$,
			workSpaces$,
			schedule$,
			orderStatuses$
		]).subscribe(
			(results: any) => {
				results[0].data.forEach((itemi, i) => {
					if (itemi.name === 'Clinic') {
						this.clinicMajorLocation = itemi;
					}
				});
				this.appointmentTypes = results[1].data;
				const schedules = results[5].data;
				this.professions = results[2].data;
				if (results[4].data.length > 0) {
				}
				if (results[3].data.length > 0) {
					const categories = results[3].data[0].categories;
					this.organizationalServiceId.facilityServiceId = results[3].data[0]._id;
					const filterCategories = categories.filter((x) => x.name === 'Appointment');
					if (filterCategories.length > 0) {
						this.categoryServices = filterCategories[0].services;
						this.organizationalServiceId.categoryId = filterCategories[0]._id;
					}
				}

				if (this.appointment._id !== undefined) {
					this.category.setValue(this.appointment.category);
				}
				this.orderStatuses = results[6].data;
				if (
					this.appointment._id === null ||
					this.appointment._id === undefined ||
					this.appointment._id === ''
				) {
					this.orderStatuses.forEach((item) => {
						if (item.name === 'Scheduled') {
							this.status.setValue(item);
						}
					});
				} else {
					this.orderStatuses.forEach((item) => {
						if (item.name === this.appointment.orderStatusId) {
							this.status.setValue(item);
						}
					});
				}

				if (this.loginEmployee.professionId === 'Doctor') {
					this.selectedProfession = this.professions.filter(
						(x) => x._id === this.loginEmployee.professionId
					)[0];
					this.isDoctor = true;
				} else {
					this.isDoctor = false;
				}
				if (this.appointment._id !== undefined) {
					// this.patient.setValue(this.appointment.patientDetails);
					this.apmisLookupHandleSelectedItem(this.selectedPatient);
				}
				this.scheduleManagers = schedules;
				this.getEmployees();
				this.getClinics();
				this.validateCurrentAppointment();
			},
			(error) => {}
		);
	}
	validateCurrentAppointment() {
		if (this.appointment !== undefined) {
			const appTypeIndex = this.appointmentTypes.findIndex((x) => x.name === this.appointment.appointmentTypeId);
			if (appTypeIndex > -1) {
				this.type.setValue(this.appointmentTypes[appTypeIndex]);
			}

			const statusIndex = this.orderStatuses.findIndex((x) => x.name === this.appointment.orderStausId);
			if (statusIndex > -1) {
				this.status.setValue(this.orderStatuses[statusIndex]);
			}

			const categoryIndex = this.categoryServices.findIndex((x) => x.name === this.appointment.category);
			if (categoryIndex > -1) {
				this.category.setValue(this.categoryServices[categoryIndex]);
			}

			const clinicIndex = this.clinics.findIndex((x) => x.clinicName === this.appointment.clinicId);
			if (clinicIndex > -1) {
				this.clinic.setValue(this.clinics[clinicIndex]);
				this.dateChange(this.appointment.startDate);
			}
		}
	}

	createBill() {
		try {
			const bills = [];
			const patientDefaultPaymentPlan = this.selectedPatient.paymentPlan.find((x) => x.isDefault === true);
			let covered = {};
			if (patientDefaultPaymentPlan.planType === 'wallet') {
				covered = { coverType: patientDefaultPaymentPlan.planType };
			} else if (patientDefaultPaymentPlan.planType === 'insurance') {
				covered = {
					coverType: patientDefaultPaymentPlan.planType,
					hmoId: patientDefaultPaymentPlan.planDetails.hmoId
				};
			} else if (patientDefaultPaymentPlan.planType === 'company') {
				covered = {
					coverType: patientDefaultPaymentPlan.planType,
					companyId: patientDefaultPaymentPlan.planDetails.companyId
				};
			} else if (patientDefaultPaymentPlan.planType === 'family') {
				covered = {
					coverType: patientDefaultPaymentPlan.planType,
					familyId: patientDefaultPaymentPlan.planDetails.familyId
				};
			}
			bills.push({
				unitPrice: this.organizationalServicePrice,
				facilityId: this.selectedFacility._id,
				facilityServiceId: this.organizationalServiceId.facilityServiceId,
				serviceId: this.category.value,
				patientId: this.selectedPatient._id,
				quantity: 1,
				active: true,
				totalPrice: this.organizationalServicePrice,
				covered: covered
			});
			this.billingService
				.createBill(bills, {
					query: {
						facilityId: this.selectedFacility._id,
						patientId: this.selectedPatient._id
					}
				})
				.then((payld) => {}, (err) => {})
				.catch((er) => {});
		} catch (error) {}
	}

	isAppointmentToday() {
		Observable.fromPromise(
			this.appointmentService
				.findAppointment({ query: { _id: this.appointment._id, isAppointmentToday: true } })
				.subscribe(
					(payload) => {
						if (payload.data.length > 0) {
							this.canCheckIn = true;
							this.checkIn.enable();
							this.appointmentIsToday = true;
						} else {
							this.canCheckIn = false;
							this.checkIn.disable();
							this.appointmentIsToday = false;
						}
					},
					(error) => {}
				)
		);
	}
	announcePatient(value) {
		this.appointmentService.patientAnnounced(value);
		return value.personDetails.lastName;
	}

	getClinicMajorLocation() {
		this.locationService.findAll().then((payload) => {
			payload.data.forEach((itemi, i) => {
				if (itemi.name === 'Clinic') {
					this.clinicMajorLocation = itemi;
					// this.getLoginEmployee();
				}
			});
		});
	}

	getClinics() {
		const clinicIds = [];
		this.clinics = [];
		this.selectedFacility.departments.forEach((itemi, i) => {
			itemi.units.forEach((itemj, j) => {
				itemj.clinics.forEach((itemk, k) => {
					if (this.loginEmployee !== undefined && this.loginEmployee.professionId === 'Doctor') {
						this.loginEmployee.units.forEach((itemu, u) => {
							if (itemu === itemj.name) {
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
					} else if (this.loginEmployee !== undefined && this.loginEmployee.professionId !== 'Doctor') {
						this.loginEmployee.workSpaces.forEach((wrk, ii) => {
							wrk.locations.forEach((lct, li) => {
								this.scheduleManagers.forEach((sch: any, ji) => {
									sch.schedules.forEach((sch2, jji) => {
										if (
											sch2.location._id === lct.minorLocationId &&
											sch.clinic === itemk.clinicName
										) {
											if (clinicIds.filter((x) => x === itemk._id).length === 0) {
												const clinicModel: ClinicModel = <ClinicModel>{};
												clinicModel.clinic = sch.clinic;
												clinicModel.department = itemi;
												clinicModel.unit = itemj;
												clinicModel._id = itemk._id;
												clinicModel.clinicName = itemk.clinicName;
												this.clinics.push(clinicModel);
												clinicIds.push(clinicModel._id);
											}
										}
									});
								});
							});
						});
					}
				});
			});
		});

		this.clinics.forEach((itemc, c) => {
			const filteredManangers = this.scheduleManagers.filter((x) => x.clinic === itemc.name);
			if (filteredManangers.length > 0) {
				itemc.schedules = filteredManangers[0].schedules;
			}
		});
		if (this.appointment._id !== undefined) {
			const filterClinics = this.clinics.filter((x) => x._id === this.appointment.clinicId._id);
			if (filterClinics.length > 0) {
				this.clinic.setValue(filterClinics[0]);
			}
		}
		this.loadIndicatorVisible = false;
	}

	getClinicLocation() {
		this.clinicLocations = [];
		const inClinicLocations: MinorLocation[] = [];
		const minors = this.selectedFacility.minorLocations.filter(
			(x) => x.locationId === this.clinicMajorLocation._id
		);
		minors.forEach((itemi, i) => {
			const minorLocation: MinorLocation = <MinorLocation>{};
			minorLocation._id = itemi._id;
			minorLocation.description = itemi.description;
			minorLocation.locationId = itemi.locationId;
			minorLocation.name = itemi.name;
			minorLocation.shortName = itemi.shortName;
			minorLocation.text = itemi.name;
			inClinicLocations.push(minorLocation);
		});
		if (this.loginEmployee.professionId !== undefined && this.loginEmployee.professionId === 'Doctor') {
			this.schedules.forEach((items, s) => {
				this.loginEmployee.units.forEach((itemu, u) => {
					if (itemu === items.unit) {
						// const res = inClinicLocations.filter(x => x._id ===
						// items.clinicObject.clinic.clinicLocation); if (res.length > 0) {
						//     this.clinicLocations.push(res[0]);
						// }
					}
				});
			});
		} else {
			this.loginEmployee.workSpaces.forEach((itemw, w) => {
				itemw.locations.forEach((iteml, l) => {
					const res = inClinicLocations.filter((x) => x._id === iteml.minorLocationId);
					if (res.length > 0) {
						this.clinicLocations.push(res[0]);
					}
				});
			});
		}
	}

	getSchedules() {
		this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe((payload) => {});
	}

	getPatients() {
		this.loadingPatients = true;
		this.patientService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe((payload) => {
			this.patients = payload.data;
			this.loadingPatients = false;
		});
	}

	// getLoginEmployee() {
	//   this.loadIndicatorVisible = true;
	//   const emp$ = Observable.fromPromise(
	//     this.employeeService.find({
	//       query: {
	//         facilityId: this.selectedFacility._id,
	//         personId: this.auth.data.personId,
	//         showbasicinfo: true
	//       }
	//     })
	//   );
	//   // tslint:disable-next-line:max-line-length
	//   this.subscription = emp$
	//     .mergeMap((emp: any) =>
	//       Observable.forkJoin([
	//         Observable.fromPromise(this.employeeService.get(emp.data[0]._id,
	//         {}))
	//       ])
	//     )
	//     .subscribe((results: any) => {
	//       this.loginEmployee = results[0];
	//       if (
	//         this.loginEmployee !== undefined &&
	//         this.loginEmployee.professionId !== undefined
	//       ) {
	//         this.selectedProfession = this.loginEmployee.professionId;
	//         if (this.loginEmployee.professionId === "Doctor") {
	//           this.isDoctor = true;
	//         }
	//         this.getClinics();
	//       }
	//     });
	// }

	getEmployees() {
		this.loadingProviders = true;
		this.providers = [];
		if (this.isDoctor) {
			this.employeeService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						professionId: this.selectedProfession,
						units: { $in: this.loginEmployee.units }
					}
				})
				.then((payload) => {
					payload.data.forEach((itemi, i) => {
						this.providers.push(itemi);
					});
					if (this.appointment._id !== undefined) {
						// this.provider.setValue(this.appointment.providerDetails);
						if (this.appointment.providerDetails !== undefined) {
							this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
						}
					}
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
					if (this.appointment._id !== undefined) {
						// this.provider.setValue(this.appointment.providerDetails);
						if (this.appointment.providerDetails !== undefined) {
							this.apmisProviderLookupHandleSelectedItem(this.appointment.providerDetails);
						}
					}
					this.loadingProviders = false;
				});
		}
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

	filterPatients(val: any) {
		return val
			? this.patients.filter(
					(s) =>
						s.personDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0 ||
						s.personDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0
				)
			: this.patients;
	}

	filterProviders(val: any) {
		return val
			? this.providers.filter(
					(s) =>
						s.personDetails.lastName.toLowerCase().indexOf(val.toLowerCase()) === 0 ||
						s.personDetails.firstName.toLowerCase().indexOf(val.toLowerCase()) === 0
				)
			: this.providers;
	}
	filterAppointmentTypes(val: any) {
		return val
			? this.appointmentTypes.filter((s) => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
			: this.appointmentTypes;
	}
	filterCategoryServices(val: any) {
		return val
			? this.categoryServices.filter((s) => s.name.toLowerCase().indexOf(val.toLowerCase()) === 0)
			: this.categoryServices;
	}
	displayFn(clinic: any): string {
		return clinic ? clinic.clinicName : clinic;
	}
	providerDisplayFn(provider: any): string {
		return provider ? provider.personDetails.lastName + ' ' + provider.personDetails.firstName : provider;
	}

	appointmentTypeDisplayFn(type: any): string {
		return type ? type.name : type;
	}
	patientDisplayFn(patient: any) {
		return patient ? patient.personDetails.lastName + ' ' + patient.personDetails.firstName : patient;
	}

	categoryServiceDisplayFn(category: any) {
		return category ? category.name : category;
	}

	timezoneDisplayFn(timezone: any) {
		return timezone ? timezone.name : timezone;
	}

	orderStatusDisplayFn(order: any) {
		return order ? order.name : order;
	}

	setValueSmsAlert(personFullName, startDate, facility, clinic, email) {
		const contentValue =
			'Hello ' +
			personFullName +
			'an appointment was scheduled for ' +
			startDate +
			'at ' +
			facility +
			' ' +
			clinic;
		const params = { content: contentValue, sender: 'APMIS', receiver: email };
		this._smsAlertService.post({}, params);
	}

	async scheduleAppointment() {
		if (this.dateCtrl.valid && this.patient.valid && this.type.valid && this.category.valid && this.clinic.valid) {
			this.systemModuleService.on();
			this.disableBtn = true;
			this.updateAppointment = false;
			this.saveAppointment = false;
			this.savingAppointment = true;
			const patient = this.selectedPatient._id; // this.patient.value._id;
			const clinic = this.clinic.value.clinicName;

			const type = this.type.value.name;
			const category = this.category.value.name;
			const orderStatus = this.status.value.name;
			const checkIn = this.checkIn.value;
			const date = this.date;
			const reason = this.reason.value;
			const facility = this.selectedFacility._id;
			// this.selectedPatient = this.patient.value;

			this.appointment.appointmentReason = reason;
			this.appointment.appointmentTypeId = type;
			this.appointment.clinicId = clinic;
			if (
				this.provider.value !== null &&
				this.provider.value !== undefined &&
				this.selectedProvider !== undefined
			) {
				const provider = this.selectedProvider._id;
				this.appointment.doctorId = provider;
			}

			this.appointment.facilityId = facility;
			this.appointment.patientId = patient;
			this.appointment.startDate = this.date;
			if (checkIn === true) {
				this.appointment.attendance = {
					employeeId:
						this.loginEmployee.personDetails.title +
						' ' +
						this.loginEmployee.personDetails.lastName +
						' ' +
						this.loginEmployee.personDetails.firstName,
					majorLocationId: this.selectedClinicSchedule.location.locationId,
					minorLocationId: this.selectedClinicSchedule.location._id,
					dateCheckIn: new Date()
				};
			}
			this.appointment.category = category;
			this.appointment.orderStatusId = orderStatus;
			if (this.appointmentIsToday && this.checkIn.value === true) {
				const activeFilter = this.orderStatuses.filter((x) => (x.name = 'Active'));
				if (activeFilter.length > 0) {
					const active = activeFilter[0];
					this.appointment.orderStatusId = active.name;
				}
			}
			if (this.appointment._id !== undefined) {
				this.appointmentService.update(this.appointment).then(
					(payload) => {
						if (this.teleMed.value === true) {
							const topic = 'Appointment with ' + this.selectedPatient.personDetails.apmisId;
							this.appointmentService
								.setMeeting(
									topic,
									this.appointment.startDate,
									this.appointment._id,
									this.timezone.value.value
								)
								.then(
									(meeting) => {
										const fullName =
											this.selectedPatient.personDetails.lastName +
											' ' +
											this.selectedPatient.personDetails.Name;
										// this.setValueSmsAlert(
										// 	fullName,
										// 	this.appointment.startDate,
										// 	this.selectedFacility.name,
										// 	clinic.name,
										// 	this.selectedPatient.personDetails.email
										// );

										this.disableBtn = true;
										this.updateAppointment = false;
										this.saveAppointment = true;
										this.savingAppointment = false;
										this.systemModuleService.off();
										this.router.navigate([ '/dashboard/clinic/appointment' ]);
										this.systemModuleService.off();
										this.systemModuleService.announceSweetProxy(
											'Appointment updated successfully',
											'success',
											null,
											null,
											null,
											null,
											null,
											null,
											null
										);
									},
									(error) => {
										this.systemModuleService.off();
										this.systemModuleService.announceSweetProxy(
											'Clinic Appointment updated successfully but telemedice appointment not updated or created',
											'warning'
										);
									}
								);
						} else {
							this.appointmentService.patientAnnounced(this.patient);
							this.disableBtn = true;
							this.updateAppointment = false;
							this.saveAppointment = true;
							this.savingAppointment = false;
							this.newSchedule();
							this.appointmentService.clinicAnnounced({
								clinicId: this.selectedClinic,
								startDate: this.date
							});
							const fullName =
								this.selectedPatient.personDetails.lastName +
								' ' +
								this.selectedPatient.personDetails.Name;
							// this.setValueSmsAlert(
							// 	fullName,
							// 	this.appointment.startDate,
							// 	this.selectedFacility.name,
							// 	clinic.name,
							// 	this.selectedPatient.personDetails.email
							// );
							this.router.navigate([ '/dashboard/clinic/appointment' ]);
							this.systemModuleService.off();
							this.systemModuleService.announceSweetProxy(
								'Appointment updated successfully',
								'success',
								null,
								null,
								null,
								null,
								null,
								null,
								null
							);
						}
					},
					(error) => {
						this.savingAppointment = false;
						this.disableBtn = false;
						this.loadIndicatorVisible = false;
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'There was an error setting the appointment',
							'error'
						);
					}
				);
			} else {
				this.appointmentService.create(this.appointment).then(
					(payload) => {
						this.createBill();
						if (this.teleMed.value === true) {
							const topic = 'Appointment with ' + this.selectedPatient.personDetails.apmisId;
							this.appointmentService
								.setMeeting(topic, this.appointment.startDate, payload._id, this.timezone.value.value)
								.then(
									(meeting) => {
										this.disableBtn = true;
										this.updateAppointment = false;
										this.saveAppointment = true;
										this.savingAppointment = false;
										const fullName =
											this.selectedPatient.personDetails.lastName +
											' ' +
											this.selectedPatient.personDetails.Name;
										// this.setValueSmsAlert(
										// 	fullName,
										// 	this.appointment.startDate,
										// 	this.selectedFacility.name,
										// 	this.selectedClinic.name,
										// 	this.selectedPatient.personDetails.email
										// );

										this.router.navigate([ '/dashboard/clinic/appointment' ]);
										this.systemModuleService.off();
										this.systemModuleService.announceSweetProxy(
											'Appointment set successfully',
											'success',
											null,
											null,
											null,
											null,
											null,
											null,
											null
										);
									},
									(error) => {
										this.savingAppointment = false;
										this.disableBtn = false;
										this.loadIndicatorVisible = false;
										this.systemModuleService.off();
										this.systemModuleService.announceSweetProxy(
											'Appointment set successfully but there was an error creating Telemedicine appointment',
											'warning'
										);
									}
								);
						} else {
							this.disableBtn = true;
							this.updateAppointment = false;
							this.saveAppointment = true;
							this.savingAppointment = false;
							const fullName =
								this.selectedPatient.personDetails.lastName +
								' ' +
								this.selectedPatient.personDetails.Name;
							// this.setValueSmsAlert(
							// 	fullName,
							// 	this.appointment.startDate,
							// 	this.selectedFacility.name,
							// 	clinic.name,
							// 	this.selectedPatient.personDetails.email
							// );
							this.router.navigate([ '/dashboard/clinic/appointment' ]);
							this.systemModuleService.off();
							this.systemModuleService.announceSweetProxy(
								'Appointment set successfully',
								'success',
								null,
								null,
								null,
								null,
								null,
								null,
								null
							);
						}
					},
					(error) => {
						this.savingAppointment = false;
						this.disableBtn = false;
						this.loadIndicatorVisible = false;
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'There was an error setting the appointment',
							'error'
						);
					}
				);
			}
		} else {
			this.systemModuleService.off();
			this.savingAppointment = false;
			this.disableBtn = false;
			this.loadIndicatorVisible = false;
			this.systemModuleService.announceSweetProxy('Some required field missing, please try again!', 'warning');
		}
	}

	getOthers(clinic: any) {
		this.schedules = [];
		if (clinic !== null) {
			this.selectedClinic = clinic;
			this.scheduleManagers.forEach((manager) => {
				if (manager.clinic === clinic.clinicName) {
					this.schedules = this.schedules.concat(manager.schedules);
				}
			});
			this.appointmentService.schedulesAnnounced(this.schedules);

			const dayNum = getDay(this.date);
			const day = this.days[dayNum];
			const scheduleFiltered = this.schedules.filter((x: any) => x.day === day);
			if (scheduleFiltered.length === 0) {
				this.dateCtrl.setErrors({ noValue: true });
				this.dateCtrl.markAsTouched();
				this.checkIn.disable();
				this.checkIn.setValue(false);
			} else {
				const schedule: any = scheduleFiltered[0];
				const scheduleStartHour = getHours(schedule.startTime);
				const scheduleEndHour = getHours(schedule.endTime);
				const currentHour = getHours(new Date());
				if (this.appointment._id === undefined) {
					// comment by me starday
					// this.date = setHours(this.date, getHours(schedule.startTime));
					// this.date = setMinutes(this.date, getMinutes(schedule.startTime));
					// this.startDate = setHours(this.startDate,
					// getHours(schedule.startTime)); this.startDate = setMinutes(
					//   this.startDate,
					//   getMinutes(schedule.startTime)
					// );
					// end comment

					// start new code here
					if (scheduleStartHour < currentHour && scheduleEndHour > currentHour) {
						this.date = new Date();
						this.date = setHours(this.date, getHours(new Date()));
						this.date = setMinutes(this.date, getMinutes(new Date()));
						this.startDate = setHours(this.startDate, getHours(new Date()));
						this.startDate = setMinutes(this.startDate, getMinutes(new Date()));
					}
					// end new code here
					if (this.canCheckIn) {
						this.checkIn.enable();
					} else {
						this.checkIn.disable();
					}
					this.dateCtrl.setErrors(null); // ({ noValue: false });
					this.dateCtrl.markAsUntouched();
					this.selectedClinicSchedule = schedule;
				} else {
					if (scheduleStartHour > currentHour || scheduleEndHour < currentHour) {
						this.dateCtrl.setErrors({ noValue: true });
						this.dateCtrl.markAsTouched();
						this.checkIn.disable();
						this.checkIn.setValue(false);
					} else {
						this.date = setHours(this.date, getHours(schedule.startTime));
						this.date = setMinutes(this.date, getMinutes(schedule.startTime));
						this.startDate = setHours(this.startDate, getHours(schedule.startTime));
						this.startDate = setMinutes(this.startDate, getMinutes(schedule.startTime));
						if (this.canCheckIn) {
							this.checkIn.enable();
						} else {
							this.checkIn.disable();
						}
						this.dateCtrl.setErrors(null); // ({ noValue: false });
						this.dateCtrl.markAsUntouched();
						this.selectedClinicSchedule = schedule;
					}
				}
			}
			if (this.selectedClinic._id !== undefined) {
				this.appointmentService.clinicAnnounced({ clinicId: clinic, startDate: this.date });
			}
		}
	}

	convert(str) {
		var date = new Date(str),
			mnth = ('0' + (date.getMonth() + 1)).slice(-2),
			day = ('0' + date.getDate()).slice(-2);
		const hours = ('0' + date.getHours()).slice(-2);
		const minutes = ('0' + date.getMinutes()).slice(-2);
		return [ date.getFullYear(), mnth, day, hours, minutes ].join('-');
	}

	dateChange(event) {
		this.authFacadeService
			.getServerTime()
			.then((serverTime: any) => {
				const serverDate = new Date(serverTime.datetime);
				const localDate = new Date(event);
				const scheduleStartHour = getHours(this.selectedClinicSchedule.startTime);
				const scheduleEndHour = getHours(this.selectedClinicSchedule.endTime);
				const currentHour = getHours(localDate);

				if (
					(isBefore(serverDate, localDate) &&
						(scheduleStartHour < currentHour && scheduleEndHour > currentHour)) ||
					this.appointment._id !== undefined
				) {
					this.isEarlierDate = false;
					const dayNum = getDay(event);
					const day = this.days[dayNum];
					const scheduleFiltered = this.schedules.filter((x: any) => x.day === day);
					if (scheduleFiltered.length === 0) {
						this.dateCtrl.setErrors({ noValue: true });
						this.dateCtrl.markAsTouched();
						this.date = event;
						this.startDate = event;
						this.endDate = event;
						this.checkIn.disable();
						this.checkIn.setValue(false);
						this.startDate = setHours(this.startDate, getHours(this.startDate));
						this.startDate = setMinutes(this.startDate, getMinutes(this.startDate));
					} else {
						this.date = event;
						const schedule: any = scheduleFiltered[0];
						this.startDate = setHours(this.startDate, getHours(schedule.startTime));
						this.startDate = setMinutes(this.startDate, getMinutes(schedule.startTime));
						this.canCheckIn = isToday(this.date);

						if (this.canCheckIn) {
							this.checkIn.enable();
						} else {
							this.checkIn.disable();
						}
						this.dateCtrl.setErrors(null); // ({ noValue: false });
						this.dateCtrl.markAsUntouched();
					}
					if (this.selectedClinic._id !== undefined) {
						this.appointmentService.clinicAnnounced({
							clinicId: this.selectedClinic,
							startDate: this.date
						});
					}
				} else {
					this.dateCtrl.setErrors({ noValue: true });
					this.isEarlierDate = true;
					this.dateCtrl.markAsTouched();
				}
			})
			.catch((er) => {});
	}
	newSchedule() {
		this.patient.reset();
		this.clinic.reset();
		this.provider.reset();
		this.type.reset();
		this.category.reset();
		this.checkIn.reset();
		this.teleMed.reset();
		this.timezone.reset();
		this.date = new Date();
		this.reason.reset();
		this.status.reset();
		this.savingAppointment = false;
		this.disableBtn = false;
	}

	changeTimezone(timezone) {
		// this.user.timezone = timezone;
	}
}
