import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
	CountriesService,
	EmployeeService,
	FormsService,
	FacilitiesService,
	UserService,
	PersonService,
	PatientService,
	AppointmentService,
	DocumentationService
} from '../../../../../services/facility-manager/setup/index';
import {
	Facility,
	User,
	Patient,
	Employee,
	MinorLocation,
	Appointment,
	Country,
	ClinicInteraction,
	Documentation
} from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { format } from 'date-fns';

@Component({
	selector: 'app-patient-summary',
	templateUrl: './patient-summary.component.html',
	styleUrls: [ './patient-summary.component.scss' ]
})
export class PatientSummaryComponent implements OnInit, OnDestroy {
	@Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() patient: Patient;
	// @Input() vitalDocuments: any;
	lineChartData = [];
	public lineChartLabels: Array<any> = [];
	public lineChartOptions: any = {
		responsive: true
	};
	public lineChartColors: Array<any> = [
		{
			// grey
			backgroundColor: 'rgba(148,159,177,0.2)',
			borderColor: 'rgba(148,159,177,1)',
			pointBackgroundColor: 'rgba(148,159,177,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(148,159,177,0.8)'
		},
		{
			// dark grey
			backgroundColor: 'rgba(77,83,96,0.2)',
			borderColor: 'rgba(77,83,96,1)',
			pointBackgroundColor: 'rgba(77,83,96,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(77,83,96,1)'
		},
		{
			// cyan
			backgroundColor: 'rgba(77,208,225,0.2)',
			borderColor: 'rgba(77,208,225,1)',
			pointBackgroundColor: 'rgba(77,208,225,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(77,208,225,0.8)'
		},
		{
			// green
			backgroundColor: 'rgba(129,199,132,0.2)',
			borderColor: 'rgba(129,199,132,1)',
			pointBackgroundColor: 'rgba(129,199,132,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(129,199,132,0.8)'
		},
		{
			// lime
			backgroundColor: 'rgba(220,231,117,0.2)',
			borderColor: 'rgba(220,231,117,1)',
			pointBackgroundColor: 'rgba(220,231,117,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(220,231,117,0.8)'
		},
		{
			// purple
			backgroundColor: 'rgba(186,104,200,0.2)',
			borderColor: 'rgba(186,104,200,1)',
			pointBackgroundColor: 'rgba(186,104,200,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(186,104,200,0.8)'
		},
		{
			// red
			backgroundColor: 'rgba(229,	115,	115,0.2)',
			borderColor: 'rgba(229,115,115,1)',
			pointBackgroundColor: 'rgba(229,115,115,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(229,115,115,0.8)'
		},
		{
			// red
			backgroundColor: 'rgba(229,	115,	115,0.2)',
			borderColor: 'rgba(229,115,115,1)',
			pointBackgroundColor: 'rgba(229,115,115,1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(229,115,115,0.8)'
		}
	];
	public lineChartLegend = true;
	public lineChartType = 'line';
	subsect_biodata = true;
	subsect_contacts = false;
	subsect_vitals = true;
	subsect_tags = true;
	addVitalsPop = false;
	addTagsPop = false;
	checkoutPatient = false;

	addTag_view = false;
	addProblem_view = false;
	addAllergy_view = false;
	addHistory_view = false;
	addVitals_view = false;

	menuSummary = true;
	menuPharmacy = false;
	menuBilling = false;
	menuTreatmentPlan = false;
	menuPrescriptions = false;
	menuImaging = false;
	menuLab = false;
	menuForms = false;
	menuDocs = false;
	menuImages = false;
	menuLists = false;
	menuTimeline = false;
	menuFinance = false;

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

	vitalsPulse = [];
	vitalsRespiratoryRate = [];
	vitalsBMI = [];
	vitalsHeight = [];
	vitalsWeight = [];
	vitalsSystolic = [];
	vitalsDiastolic = [];
	vitalsTemp = [];
	vitalChartData = [];
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
		private _DocumentationService: DocumentationService
	) {
		this.router.events.filter((e) => e.constructor.name === 'RoutesRecognized').pairwise().subscribe((e: any[]) => {
			this.previousUrl = e[0].urlAfterRedirects;
		});

		this.personService.updateListener
			.filter((person) => person._id === this.patient.personId)
			.subscribe((payload) => {
				this.patient.personDetails = payload;
				this.getPersonWallet(payload);
			});

		this.personService.patchListener
			.filter((person) => person._id === this.patient.personId)
			.subscribe((payload) => {
				this.patient.personDetails = payload;
				this.getPersonWallet(payload);
			});

		this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
	}

	ngOnInit() {
		this.getForms();
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		if (this.patient !== undefined) {
			this.getCurrentUser();
			this.bindVitalsDataToChart();
			this.getPersonWallet(this.patient.personDetails);
		}

		this._DocumentationService.listenerCreate.subscribe((payload) => {
			// this.bindVitalsDataToChart();
			// window.location.reload();
		});
		this._DocumentationService.listenerUpdate.subscribe((payload) => {
			// this.bindVitalsDataToChart();
			// window.location.reload();
		});
	}

	getPersonWallet(person) {
		this.personService.get(person._id, { query: { $select: [ 'wallet' ] } }).then((payload) => {
			if (payload.wallet === undefined) {
				payload.wallet = {
					balance: 0,
					ledgerBalance: 0,
					transactions: []
				};
				this.personService.update(payload).then((pay) => {
					this.patient.personDetails = pay;
				});
			} else {
				this.patient.personDetails.wallet = payload.wallet;
			}
		});
	}

	// ngAfterViewInit() {
	//   this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
	//   if (this.patient !== undefined) {
	//     this.getCurrentUser();
	//     this.bindVitalsDataToChart();
	//   }

	//   this._DocumentationService.listenerCreate.subscribe(payload => {
	//     this.bindVitalsDataToChart();
	//   });

	//   this._DocumentationService.listenerUpdate.subscribe(payload => {
	//     this.bindVitalsDataToChart();
	//   });
	//   this.refreshVitalsGraph();
	// }

	bindVitalsDataToChart() {
		let vitalsObjArray = [];
		this.lineChartLabels = [];
		this.lineChartData = [
			{ data: [], label: '' },
			{ data: [], label: '' },
			{ data: [], label: '' },
			{ data: [], label: '' },
			{ data: [], label: '' },
			{ data: [], label: '' }
		];
		this._DocumentationService.find({ query: { personId: this.patient.personId } }).then(
			(payload: any) => {
				if (payload.data.length !== 0) {
					const len2 = payload.data[0].documentations.length - 1;
					for (let k = len2; k >= 0; k--) {
						const thisDocument = payload.data[0].documentations[k];
						if (
							!!thisDocument.document &&
							!!thisDocument.document.documentType &&
							thisDocument.document.documentType.title === 'Vitals'
						) {
							vitalsObjArray = thisDocument.document.body.vitals;
							if (vitalsObjArray !== undefined) {
								const len3 = vitalsObjArray.length - 1;
								for (let l = 0; l <= len3; l++) {
									this.lineChartData[0].data.push(vitalsObjArray[l].bloodPressure.systolic);
									this.lineChartData[0].label = 'Systolic';
									this.lineChartData[1].data.push(vitalsObjArray[l].bloodPressure.diastolic);
									this.lineChartData[1].label = 'Diastolic';
									this.lineChartData[2].data.push(vitalsObjArray[l].temperature);
									this.lineChartData[2].label = 'Temperature';
									this.lineChartData[3].data.push(vitalsObjArray[l].bodyMass.height);
									this.lineChartData[3].label = 'Height';
									this.lineChartData[4].data.push(vitalsObjArray[l].bodyMass.weight);
									this.lineChartData[4].label = 'Weight';
									this.lineChartData[5].data.push(vitalsObjArray[l].bodyMass.bmi);
									this.lineChartData[5].label = 'BMI';
									const d = new Date(vitalsObjArray[l].updatedAt);
									const dt = format(d, 'DD/MM/YY HH:mm:ss a');
									JSON.parse(JSON.stringify(this.lineChartLabels.push(dt)));
								}
								this.lineChartData = JSON.parse(
									JSON.stringify(this.refreshVitalsGraph(this.lineChartData))
								);
							}
						}
					}
				}
			},
			(error) => {}
		);
	}

	refreshVitalsGraph(lineChartData: any[]) {
		const _lineChartData: Array<any> = new Array(lineChartData.length);
		for (let i = 0; i < lineChartData.length; i++) {
			_lineChartData[i] = { data: new Array(lineChartData[i].data.length), label: lineChartData[i].label };
			for (let j = 0; j < lineChartData[i].data.length; j++) {
				_lineChartData[i].data[j] = lineChartData[i].data[j];
			}
		}
		return _lineChartData;
	}

	refreshVitalsChanged(value) {
		this.bindVitalsDataToChart();
	}

	getForms() {
		this.formsService.findAll().then((payload) => {
			this.json = payload.data[0].body;
		});
	}
	getCurrentUser() {
		if (this.patient !== null) {
			const patient$ = Observable.fromPromise(this.patientService.get(this.patient._id, {}));
			const user$ = Observable.fromPromise(this.userService.find({ query: { personId: this.patient.personId } }));
			Observable.forkJoin([ patient$, user$ ]).subscribe((results: any) => {
				this.patient = results[0];
				this.selectedUser = results[1];
			});
		}
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
	addTag_show(e) {
		this.addTag_view = true;
	}
	addProblem_show(e) {
		this.addProblem_view = true;
	}
	addAllergy_show(e) {
		this.addAllergy_view = true;
	}
	addHistory_show(e) {
		this.addHistory_view = true;
	}
	addVitals_show(e) {
		this.addVitals_view = true;
	}
	close_onClick(message: boolean): void {
		this.changeUserImg = false;
		this.addVitalsPop = false;
		this.addTagsPop = false;
		this.checkoutPatient = false;
		this.addProblem_view = false;
		this.addTag_view = false;
		this.addAllergy_view = false;
		this.addHistory_view = false;
		this.addVitals_view = false;
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
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuPharmacy_click() {
		this.menuSummary = false;
		this.menuPharmacy = true;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuBilling_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = true;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuTreatmentPlan_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = true;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuImaging_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = true;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuLab_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = true;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuForms_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = true;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuDocs_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = true;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuImages_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = true;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuLists_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = true;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuTimeline_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = true;
		this.menuPrescriptions = false;
		this.menuFinance = false;
	}
	menuPrescriptions_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = true;
		this.menuFinance = false;
	}
	menuFinance_click() {
		this.menuSummary = false;
		this.menuPharmacy = false;
		this.menuBilling = false;
		this.menuTreatmentPlan = false;
		this.menuImaging = false;
		this.menuLab = false;
		this.menuForms = false;
		this.menuDocs = false;
		this.menuImages = false;
		this.menuLists = false;
		this.menuTimeline = false;
		this.menuPrescriptions = false;
		this.menuFinance = true;
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
	checkoutPatient_show() {
		this.checkoutPatient = true;
	}
	addTagsPop_show() {
		this.addTagsPop = true;
	}

	ngOnDestroy() {
		if (this.clinicInteraction.locationName !== undefined && this.clinicInteraction.locationName.length > 1) {
			if (this.selectedAppointment.clinicInteractions === undefined) {
				this.selectedAppointment.clinicInteractions = [];
			}
			this.clinicInteraction.endAt = new Date();
			this.clinicInteraction.title = "Doctor's Encounter";
			this.selectedAppointment.clinicInteractions.push(this.clinicInteraction);
			this.appointmentService.update(this.selectedAppointment).then((payload) => {});
		}
	}

	// public randomize():void {
	//   let _lineChartData:Array<any> = new Array(this.lineChartData.length);
	//   for (let i = 0; i < this.lineChartData.length; i++) {
	//     _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
	//     for (let j = 0; j < this.lineChartData[i].data.length; j++) {
	//       _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
	//     }
	//   }
	//   this.lineChartData = _lineChartData;
	// }

	// events
	public chartClicked(e: any): void {}

	public chartHovered(e: any): void {}
}
