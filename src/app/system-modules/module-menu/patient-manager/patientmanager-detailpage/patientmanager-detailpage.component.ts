import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

import {
	Appointment,
	ClinicInteraction,
	Country,
	Documentation,
	Employee,
	Facility,
	MinorLocation,
	Patient,
	User
} from '../../../../models/index';
import {
	AppointmentService,
	CountriesService,
	DocumentationService,
	EmployeeService,
	FacilitiesService,
	FormsService,
	PatientService,
	PersonService,
	UserService
} from '../../../../services/facility-manager/setup/index';

import { AuthorizationType } from './../../../../models/facility-manager/setup/documentation';
import { USE_DOC_AUTHORIZATION } from './../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from './../../../service-facade/auth-facade.service';

@Component({
	selector: 'app-patientmanager-detailpage',
	templateUrl: './patientmanager-detailpage.component.html',
	styleUrls: [ './patientmanager-detailpage.component.scss' ]
})
export class PatientmanagerDetailpageComponent implements OnInit, OnDestroy {
	@Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() employeeDetails: any;
	patientDetails: any;
	@Input() patient: any;

	user: User = <User>{};
	subsect_biodata = true;
	subsect_contacts = false;
	subsect_vitals = true;
	subsect_tags = true;
	addVitalsPop = false;
	mergePatient = false;
	addTagsPop = false;
	checkoutPatient = false;
	menuUploads = false;

	menuSummary = true;
	menuPharmacy = false;
	menuBilling = false;
	menuTreatmentPlan = false;
	menuPrescription = false;
	menuExternalPrescription = false;
	menuMedicationHistory = false;
	menuImaging = false;
	menuLab = false;
	menuForms = false;
	menuDocs = false;
	menuPregnant = false;
	menuOrder = false;
	menuTags = false;
	menuImmunization = false;
	// menuImages = false;
	// menuLists = false;
	menuTimeline = false;
	menuFinance = false;
	menuPrescriptions = false;
	menuPayment = false;
	billingPayment = false;
	menuFluid = false;
	menuRegisters = false;
	menuVitals = false;
	menuBCRAssessment = false;

	contentSecMenuShow = false;
	modal_on = false;
	changeUserImg = false;
	logoutConfirm_on = false;
	empDetailPg = true;
	selectedDepartment: any;
	selectedNationality: Country;
	selectedState: any;
	selectedLGA: any;
	selectedFacility: Facility = <Facility>{};
	searchControl = new FormControl();
	patients: Patient[] = [];
	documentations: Documentation[] = [];
	homeAddress = '';
	selectedUser: User = <User>{};
	loginEmployee: Employee = <Employee>{};
	clinicInteraction: ClinicInteraction = <ClinicInteraction>{};
	previousUrl = '/';
	minorLocationList: MinorLocation[] = [];
	selectedAppointment: Appointment = <Appointment>{};
	json: any = {};
	tempChart: any[] = [];
	bpChart: any[] = [];
	wHChart: any[] = [];
	rRChart: any[] = [];
	pRChart: any[] = [];
	timeVal: Date;
	routeId: any;
	checkedIn: any;

	menuResp = false;
	authorizationNotApproved = false;
	patientDocumentationAuthorization = false;
	headerText = '';
	authorizationType: AuthorizationType;
	USE_DOC_AUTHORIZATION = USE_DOC_AUTHORIZATION;
	menuPrescription2: boolean;
	constructor(
		private countryService: CountriesService,
		private patientService: PatientService,
		private userService: UserService,
		private facilityService: FacilitiesService,
		private appointmentService: AppointmentService,
		private personService: PersonService,
		private employeeService: EmployeeService,
		private formsService: FormsService,
		private router: Router,
		private route: ActivatedRoute,
		private locker: CoolLocalStorage,
		private authFacadeService: AuthFacadeService,
		private _documentationService: DocumentationService
	) {
		// this.router.events
		//   .filter(e => e.constructor.name === 'RoutesRecognized')
		//   .pairwise()
		//   .subscribe((e: any[]) => {
		//     this.previousUrl = e[0].urlAfterRedirects;
		//   });

		this.personService.updateListener
			.filter((person) => person._id === this.patient.personId)
			.subscribe((payload) => {
				this.patient.personDetails = payload;
			});

		this.personService.patchListener
			.filter((person) => person._id === this.patient.personId)
			.subscribe((payload) => {
				this.patient.personDetails = payload;
			});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
		});
		this.appointmentService.appointmentAnnounced$.subscribe((appointment: any) => {
			this.selectedAppointment = appointment;
			this.patient = appointment.patientDetails;
			this.patientDetails = appointment.patientDetails;
			this.employeeDetails = this.loginEmployee;
			this._documentationService.find({ query: { patientId: this.patient._id } }).then(
				(payloadPatient) => {
					this.documentations = payloadPatient.data;
				},
				(error) => {}
			);
			this.getCurrentUser();
		});
		this.patientService.patientAnnounced$
			.filter((patient) => patient._id === this.patient._id)
			.subscribe((patient) => {
				this.patient = patient;
				this.locker.setObject('patient', patient);
			});
	}
	setAppointment() {
		if (this.patient !== undefined && this.loginEmployee !== undefined && this.loginEmployee !== null) {
			this.router.navigate([
				'/dashboard/clinic/schedule-appointment',
				this.patient._id,
				this.loginEmployee._id
			]);
		} else {
		}
	}
	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this.locker.getObject('auth');

		if (<any>this.locker.getObject('patient') !== null) {
			this.patient = <any>this.locker.getObject('patient');
		} else {
			this.router.navigate([ '/dashboard/patient-manager' ]);
		}
		this.getForms();

		this.route.params.subscribe((payloadk) => {
			this.authFacadeService.getLogingEmployee().then((payload: any) => {
				this.loginEmployee = payload;
				if (payloadk['checkInId'] !== undefined) {
					let isOnList = this.loginEmployee.consultingRoomCheckIn.filter((x) => x._id);
					if (isOnList.length > 0) {
						const isOnObj = isOnList[0];
						isOnObj.isOn = true;
						const coo = <Appointment>this.locker.getObject('appointment');
						this.checkedIn = !coo.isCheckedOut || false;
						this.employeeService.update(this.loginEmployee).subscribe((payloadu) => {
							this.loginEmployee = payloadu;
							if (this.selectedAppointment !== undefined) {
								isOnList = this.loginEmployee.consultingRoomCheckIn.filter((x) => x.isOn === true);
								if (isOnList.length > 0) {
									const isOn = isOnList[0];
									const checkingObject = this.locker.getObject('checkingObject');
								}
							}
						});

						this.clinicInteraction.locationName = coo.clinicId;
						this.clinicInteraction.employee =
							this.loginEmployee.personDetails.title +
							' ' +
							this.loginEmployee.personDetails.lastName +
							' ' +
							this.loginEmployee.personDetails.firstName;
						this.clinicInteraction.startAt = new Date();
						coo.isEngaged = true;
						this.appointmentService.update(coo).then(
							(payload) => {
								this.selectedAppointment = payload;
							},
							(error) => {}
						);
					}
				}
			});
		});
	}

	backToWard() {
		this.router.navigate([ `/dashboard/ward-manager/admitted/${this.patient.inPatientId}` ]);
	}

	getForms() {
		this.formsService.findAll().then((payload) => {
			this.json = payload.data[0].body;
		});
	}
	getCurrentUser() {
		this.userService.find({ query: { personId: this.loginEmployee.personId } }).then((payload) => {
			if (payload.data.length > 0) {
				this.selectedUser = payload.data[0];
			} else {
				this.selectedUser = <User>{};
			}
		});
	}
	navEpDetail(val: Patient) {
		this.router.navigate([ '/dashboard/patient-manager/patient-manager-detail', val.personId ]);
	}
	getSelectedState() {
		this.selectedNationality.states.forEach((item, i) => {
			if (item._id === this.patient.personDetails.stateOfOriginId) {
				this.selectedState = item;
				this.getSelectedLGA();
			}
		});
	}
	getSelectedLGA() {
		this.selectedState.lgs.forEach((item, i) => {
			if (item._id === this.patient.personDetails.lgaOfOriginId) {
				this.selectedLGA = item;
			}
		});
	}
	getPatientDetail(val: any) {}
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}
	close_onClick(message: boolean): void {
		this.changeUserImg = false;
		this.addVitalsPop = false;
		this.mergePatient = false;
		this.addTagsPop = false;
		this.checkoutPatient = false;
		this.modal_on = false;
	}
	close_authoricationClick(event: boolean) {
		try {
			setTimeout(() => {
				this.authorizationNotApproved = false;
				this.patientDocumentationAuthorization = true;
				// this.menuDocs_click();
				this.menuSummary = false;
				this.menuUploads = false;
				this.menuPharmacy = false;
				this.menuBilling = false;
				this.menuTreatmentPlan = false;
				this.menuImaging = false;
				this.menuImmunization = false;
				this.menuLab = false;
				this.menuForms = false;
				this.menuUploads = false;
				this.menuDocs = true;
				this.menuPregnant = false;
				this.menuOrder = false;
				this.menuFluid = false;
				this.menuVitals = false;
				this.menuTimeline = false;
				this.menuPrescription = false;
				this.menuExternalPrescription = false;
				this.menuFinance = false;
				this.menuMedicationHistory = false;
				this.menuPayment = false;
				this.menuTags = false;
				this.menuResp = false;
			}, 0);
		} catch (error) {}
	}
	show_changeUserImg() {
		this.changeUserImg = true;
	}
	innerMenuHide(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) {
		} else {
			this.contentSecMenuShow = false;
		}
	}

	logoutConfirm_show() {
		this.modal_on = false;
		this.logoutConfirm_on = true;
		this.contentSecMenuShow = false;
	}
	generateUserShow() {
		this.router.navigate([ '/dashboard/patient-manager/generate-user', this.patient._id ]);
		this.contentSecMenuShow = false;
	}
	toggleActivate() {
		this.patient.isActive = !this.patient.isActive;

		this.patientService.update(this.patient).then(
			(payload) => {
				this.patient = payload;
			},
			(error) => {}
		);
		this.contentSecMenuShow = false;
	}
	empDetailShow(apmisId) {
		this.empDetailPg = true;
		this.contentSecMenuShow = false;
	}
	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
		}
	}

	menuSummary_click() {
		this.menuSummary = true;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuPharmacy_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = true;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuBilling_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = true;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuTreatmentPlan_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = true;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuRegisters = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuMedicationHistory_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = true;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuImaging_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = true;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuOrder = false;
		this.menuPregnant = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuLab_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuUploads = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = true;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuForms_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuUploads = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = true;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuUploads_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = true;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuRegisters_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = true;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
	}
	menuDocs_click() {
		if (USE_DOC_AUTHORIZATION) {
			if (
				(this.selectedAppointment !== undefined && this.selectedAppointment._id !== undefined) ||
				this.patientDocumentationAuthorization === true
			) {
				this.headerText = 'Enter Doctor Authorization code to continue';
				this.authorizationType = AuthorizationType.Medical;
				this.authorizationNotApproved = true;
			} else if (USE_DOC_AUTHORIZATION) {
				this.headerText = 'Enter Patient Authorization code to continue';
				this.authorizationType = AuthorizationType.Patient;
				this.authorizationNotApproved = true;
			}
		} else {
			this.menuSummary = false;
			this.menuUploads = false;
			this.menuPharmacy = false;
			this.menuBilling = false;
			this.menuTreatmentPlan = false;
			this.menuImaging = false;
			this.menuImmunization = false;
			this.menuLab = false;
			this.menuForms = false;
			this.menuUploads = false;
			this.menuDocs = true;
			this.menuPregnant = false;
			this.menuOrder = false;
			this.menuFluid = false;
			this.menuRegisters = false;
			this.menuVitals = false;
			this.menuTimeline = false;
			this.menuPrescription = false;
			this.menuExternalPrescription = false;
			this.menuFinance = false;
			this.menuMedicationHistory = false;
			this.menuPayment = false;
			this.menuTags = false;
			this.menuResp = false;
			this.menuBCRAssessment = false;
		}
		// else {
		//   console.log(3);
		//   this.menuSummary = false;
		//   this.menuUploads = false;
		//   this.menuPharmacy = false;
		//   this.menuBilling = false;
		//   this.menuTreatmentPlan = false;
		//   this.menuImaging = false;
		//   this.menuImmunization = false;
		//   this.menuLab = false;
		//   this.menuForms = false;
		//   this.menuUploads = false;
		//   this.menuDocs = true;
		//   this.menuOrder = false;
		//   this.menuFluid = false;
		//   this.menuVitals = false;
		//   this.menuTimeline = false;
		//   this.menuPrescription = false;
		//   this.menuExternalPrescription = false;
		//   this.menuFinance = false;
		//   this.menuMedicationHistory = false;
		//   this.menuPayment = false;
		//   this.menuTags = false;
		//   this.menuResp = false;
		// }
	}
	menuFluid_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = true;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuTimeline_click() {
		this.menuUploads = false;
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = true;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuPrescriptions_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = true;
		this.menuPrescription2 = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}

	menuPrescriptions2_click() {
		this.menuSummary = false;
		this.menuUploads = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuPrescription2 = true;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuExternalPrescriptions_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuUploads = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = true;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuPayment_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuUploads = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = true;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuOrder_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = true;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuVitals_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = true;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuTags_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = true;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuImmunization_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = true;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}
	menuPregnant_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = true;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = false;
	}

	menuBCRAssessment_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuUploads = false;
		this.menuImaging = false;
		this.menuImmunization = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuUploads = false;
		this.menuDocs = false;
		this.menuPregnant = false;
		this.menuOrder = false;
		this.menuFluid = false;
		this.menuRegisters = false;
		this.menuVitals = false;
		this.menuTimeline = false;
		this.menuPrescription = false;
		this.menuExternalPrescription = false;
		this.menuFinance = false;
		this.menuMedicationHistory = false;
		this.menuPayment = false;
		this.menuTags = false;
		this.menuResp = false;
		this.menuBCRAssessment = true;
	}

	subsect_biodata_click() {
		this.subsect_biodata = true;
		this.subsect_contacts = false;
	}
	subsect_contacts_click() {
		this.subsect_biodata = false;
		this.subsect_contacts = true;
	}
	subsect_vitals_click() {
		this.subsect_vitals = true;
	}
	subsect_tags_click() {
		this.subsect_tags = true;
	}

	addVitalsPop_show() {
		this.addVitalsPop = true;
	}

	addMergePatient_show() {
		this.mergePatient = true;
	}
	checkoutPatient_show() {
		// Check is this patient has an appointment. If not, redirect the user to
		// the appointment page if (!!this.selectedAppointment &&
		// this.selectedAppointment._id !== undefined) {
		this.patientDetails = this.patient;
		this.checkoutPatient = true;
		// } else {
		//   let text = 'Please set appointment for ' +
		//   this.patient.personDetails.personFullName + '';

		// 	this._notification('Info', text.concat(' before you can continue this
		// process.'));
		// }
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({ users: [ this.user._id ], type: type, text: text });
	}

	addTagsPop_show() {
		this.addTagsPop = true;
	}

	onPersonValueUpdated(value) {
		this.patient = value;
		this.mergePatient = false;
		this.ngOnInit();
	}

	ngOnDestroy() {
		this.locker.removeItem('patient');

		if (this.clinicInteraction.locationName !== undefined && this.clinicInteraction.locationName.length > 1) {
			if (this.selectedAppointment.clinicInteractions === undefined) {
				this.selectedAppointment.clinicInteractions = [];
			}
			this.clinicInteraction.endAt = new Date();
			this.clinicInteraction.title = "Doctor's Encounter";
			this.selectedAppointment.clinicInteractions.push(this.clinicInteraction);
			this.selectedAppointment.isEngaged = false;
			this.appointmentService.update(this.selectedAppointment).then((payload) => {});
		}
	}

	patientMenu() {
		this.menuResp = !this.menuResp;
	}
}
