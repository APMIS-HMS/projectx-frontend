import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	FacilitiesService,
	PrescriptionService,
	PrescriptionPriorityService,
	FrequencyService
} from '../../../../../services/facility-manager/setup/index';
import { Appointment, Facility, Prescription, PrescriptionItem, Dispensed, User } from '../../../../../models/index';
import { DurationUnits, DosageUnits } from '../../../../../shared-module/helpers/global-config';
import { Subject } from 'rxjs/Subject';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-patient-prescription',
	templateUrl: './patient-prescription.component.html',
	styleUrls: [ './patient-prescription.component.scss' ]
})
export class PatientPrescriptionComponent implements OnInit {
	@Input() patientDetails: any;
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Output() prescriptionItems: Prescription = <Prescription>{};
	isDispensed: Subject<any> = new Subject();
	facility: Facility = <Facility>{};
	clinicObj: any = {};
	employeeDetails: any = {};
	user: User = <User>{};
	showCuDropdown = false;
	cuDropdownLoading = false;
	addPrescriptionShow = false;
	currentMedicationShow = false;
	pastMedicationShow = false;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	addPrescriptionForm: FormGroup;
	allPrescriptionsForm: FormGroup;
	facilityId: string;
	employeeId: string;
	priorities: string[] = [];
	dosageUnits: any[] = [];
	prescriptions: Prescription = <Prescription>{};
	prescriptionArray: PrescriptionItem[] = [];
	drugs: string[] = [];
	routes: string[] = [];
	frequencies: string[] = [];
	durationUnits: any[] = [];
	selectedValue: any;
	selectedDosage: any;
	drugId = '';
	selectedDrugId = '';
	searchText = '';
	refillCount = 0;
	currentDate: Date = new Date();
	minDate: Date = new Date();
	selectedForm = '';
	selectedIngredients: any = [];
	currentMedications: any[] = [];
	pastMedications: any[] = [];
	currMedLoading = false;
	pastMedLoading = false;
	apmisLookupQuery = {};
	apmisLookupText = '';
	apmisLookupUrl = 'drug-generic-list';
	apmisLookupDisplayKey = 'name';
	authorizeRx = true;
	authorizingRx = false;
	disableAuthorizeRx = false;

	constructor(
		private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _prescriptionService: PrescriptionService,
		private _priorityService: PrescriptionPriorityService,
		private _frequencyService: FrequencyService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		// this.user = <User> this._locker.getObject('auth');
		// this.employeeDetails = this._locker.getObject('loginEmployee');
		this._authFacadeService
			.getLogingEmployee()
			.then((res) => {
				this.employeeDetails = res;
			})
			.catch((err) => {});

		this.prescriptionItems.prescriptionItems = [];
		this.durationUnits = DurationUnits;
		this.dosageUnits = DosageUnits;
		this.selectedValue = DurationUnits[1].name;
		this.selectedDosage = DosageUnits[0].name;
		this._getAllPriorities();
		// this._getAllRoutes();
		this._getAllFrequencies();

		this.allPrescriptionsForm = this.fb.group({
			priority: [ '', [ <any>Validators.required ] ]
		});

		this.addPrescriptionForm = this.fb.group({
			dosage: [ '', [ <any>Validators.required ] ],
			dosageUnit: [ '', [ <any>Validators.required ] ],
			drug: [ '', [ <any>Validators.required ] ],
			code: [ '', [ <any>Validators.required ] ],
			productId: [ '', [ <any>Validators.required ] ],
			regimenArray: this.fb.array([ this.initRegimen() ]),
			refillCount: [ this.refillCount ],
			startDate: [ this.currentDate ],
			specialInstruction: [ '' ]
		});

		this.addPrescriptionForm.controls['drug'].valueChanges.subscribe((value) => {
			this.apmisLookupQuery = {
				searchtext: value,
				po: false,
				brandonly: false,
				genericonly: true
			};
		});
	}

	initRegimen() {
		return this.fb.group({
			frequency: [ '', [ <any>Validators.required ] ],
			duration: [ 0, [ <any>Validators.required ] ],
			durationUnit: [ this.durationUnits[1].name, [ <any>Validators.required ] ]
		});
	}

	apmisLookupHandleSelectedItem(item) {
		this.apmisLookupText = item;
		this.addPrescriptionForm.controls['drug'].setValue(item.name);
		this.addPrescriptionForm.controls['code'].setValue(item.code);
		this.addPrescriptionForm.controls['productId'].setValue(item.id);
	}

	onClickAddPrescription(value: any, valid: boolean) {
		if (valid) {
			const dispensed: Dispensed = {
				totalQtyDispensed: 0,
				outstandingBalance: 0,
				dispensedArray: []
			};

			const prescriptionItem = <PrescriptionItem>{
				genericName: value.drug,
				routeName: value.route,
				code: value.code,
				regimen: value.regimenArray,
				// frequency: value.frequency,
				dosage: value.dosage + ' ' + value.dosageUnit,
				// duration: value.duration + ' ' + value.durationUnit,
				startDate: value.startDate,
				strength: value.strength,
				patientInstruction: value.specialInstruction == null ? '' : value.specialInstruction,
				refillCount: value.refillCount,
				ingredients: this.selectedIngredients,
				form: this.selectedForm,
				cost: 0,
				totalCost: 0,
				isExternal: false,
				initiateBill: false,
				isBilled: false,
				isDispensed: false,
				dispensed: dispensed
			};

			this.addPrescriptionShow = true;
			if (this.prescriptions.prescriptionItems !== undefined) {
				// Check if generic has been added already.
				const containsGeneric = this.prescriptionArray.filter(
					(x) => prescriptionItem.genericName === x.genericName
				);
				if (containsGeneric.length < 1) {
					this.prescriptionArray.push(prescriptionItem);
				}
			} else {
				this.prescriptionArray.push(prescriptionItem);
			}

			const prescription = <Prescription>{
				facilityId: this.facility._id,
				employeeId: this.employeeDetails._id,
				clinicId: !!this.selectedAppointment.clinicId ? this.selectedAppointment.clinicId : undefined,
				priority: '',
				patientId: this.patientDetails._id,
				personId: this.patientDetails.personId,
				prescriptionItems: this.prescriptionArray,
				isAuthorised: true,
				totalCost: 0,
				totalQuantity: 0
			};

			this.prescriptionItems = prescription;
			this.prescriptions = prescription;
			this.addPrescriptionForm.reset();
			this.addPrescriptionForm.controls['refillCount'].reset(0);
			// this.addPrescriptionForm.controls['duration'].reset(0);
			this.addPrescriptionForm.controls['startDate'].reset(new Date());
			// this.addPrescriptionForm.controls['durationUnit'].reset(this.durationUnits[1].name);
			this.addPrescriptionForm.controls['dosageUnit'].reset(this.dosageUnits[0].name);
		}
	}

	comparePriority(l1: any, l2: any) {
		return l1.name === l2.name;
	}

	onClickAuthorizePrescription(value: any, valid: boolean) {
		if (valid && this.prescriptionArray.length > 0) {
			this.disableAuthorizeRx = true;
			this.authorizeRx = false;
			this.authorizingRx = true;
			this.prescriptions.priority = { id: value.priority._id, name: value.priority.name };

			this._prescriptionService
				.authorizePresciption(this.prescriptions)
				.then((res) => {
					if (res.status === 'success') {
						this._systemModuleService.announceSweetProxy(
							'Prescription has been sent successfully!',
							'success'
						);
						this.isDispensed.next(true);
						this.prescriptionItems = <Prescription>{};
						this.prescriptionItems.prescriptionItems = [];
						this.prescriptionArray = [];
						this.addPrescriptionForm.reset();
						this.addPrescriptionForm.controls['refillCount'].reset(0);
						this.addPrescriptionForm.controls['startDate'].reset(new Date());
						// this.addPrescriptionForm.controls['duration'].reset(0);
						// this.addPrescriptionForm.controls['durationUnit'].reset(this.durationUnits[0].name);
						// this.addPrescriptionForm.controls['dosageUnit'].reset(this.dosageUnits[0].name);
						this.disableAuthorizeRx = false;
						this.authorizeRx = true;
						this.authorizingRx = false;
					} else {
						this._systemModuleService.announceSweetProxy(
							'There was a problem creating prescription! Please try again later',
							'error'
						);
						this.disableAuthorizeRx = false;
						this.authorizeRx = true;
						this.authorizingRx = false;
					}
				})
				.catch((err) => {});
		} else {
			this._systemModuleService.announceSweetProxy(
				'Please use the "Add" button above to add prescription!',
				'error'
			);
		}
	}

	// Get all medications
	private _getPrescriptionList() {
		this._prescriptionService
			.find({
				query: {
					facilityId: this.facility._id,
					patientId: this.patientDetails._id
				}
			})
			.then((res) => {
				this.currMedLoading = false;
				this.pastMedLoading = false;
				// Bind to current medication list
				const currentMedications = res.data.filter((x) => {
					const lastSevenDays = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
					if (lastSevenDays < new Date(x.updatedAt)) {
						return x;
					}
				});
				this.currentMedications = currentMedications.splice(0, 3);

				// Bind to past medication list
				const pastMedications = res.data.filter((x) => {
					const lastSevenDays = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
					if (lastSevenDays > new Date(x.updatedAt)) {
						return x;
					}
				});
				this.pastMedications = pastMedications.splice(0, 3);
			})
			.catch((err) => {});
	}

	onClickReset() {
		this.addPrescriptionForm.reset();
	}

	onClickAddRegimen() {
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		control.push(this.initRegimen());
	}

	onClickRemoveRegimen(i) {
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		// Remove interval from the list of vaccines.
		control.removeAt(i);
	}

	private _getAllPriorities() {
		this._priorityService
			.findAll()
			.then((res) => {
				this.priorities = res.data;
				const priority = res.data.filter((x) => x.name.toLowerCase().includes('normal'));
				if (priority.length > 0) {
					this.allPrescriptionsForm.controls['priority'].setValue(priority[0]);
				}
			})
			.catch((err) => {});
	}

	private _getAllFrequencies() {
		this._frequencyService
			.findAll()
			.then((res) => {
				if (res.data.length > 0) {
					this.frequencies = res.data;
				}
			})
			.catch((err) => {});
	}

	focusSearch() {
		this.showCuDropdown = !this.showCuDropdown;
	}

	focusOutSearch() {
		setTimeout(() => {
			this.showCuDropdown = !this.showCuDropdown;
		}, 300);
	}

	onClickMedicationShow(value) {
		if (this.currentMedicationShow === false && this.pastMedicationShow === false) {
			if (value === 'Current') {
				this.currMedLoading = true;
			} else {
				this.pastMedLoading = true;
			}
			this._getPrescriptionList();
		}

		if (value === 'Current') {
			this.currentMedicationShow = !this.currentMedicationShow;
			this.pastMedicationShow = false;
		}

		if (value === 'Past') {
			this.pastMedicationShow = !this.pastMedicationShow;
			this.currentMedicationShow = false;
		}
	}
}
