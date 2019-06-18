import { DrugListApiService } from '../../../../../../services/facility-manager/setup/drug-list-api.service';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, Output, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { PrescriptionPriorityService, FrequencyService } from 'app/services/facility-manager/setup';
import { Prescription, PrescriptionItem, Facility, Appointment } from 'app/models';
import { DurationUnits, DosageUnits } from 'app/shared-module/helpers/global-config';
import { DrugInteractionService } from '../services/drug-interaction.service';
import * as addMinutes from 'date-fns/add_minutes';
import * as addHours from 'date-fns/add_hours';
import * as addDays from 'date-fns/add_days';
import * as addWeeks from 'date-fns/add_weeks';
import * as addMonths from 'date-fns/add_months';
import { OrderSetSharedService } from '../../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-drug-orderset',
  templateUrl: './drug-orderset.component.html',
  styleUrls: ['./drug-orderset.component.scss']
})
export class DrugOrdersetComponent implements OnInit {
  @Output() prescriptionItems: Prescription = <Prescription>{};
	@Input() patientDetails: any;
	@Input() selectedAppointment: Appointment = <Appointment>{};
	drugSearch = false;
	dosageUnits: any[] = [];
	drugs: string[] = [];
	routes: string[] = [];
	frequencies: any[] = [];
	durationUnits: any[] = [];
	selectedDosage: any;
	products: any[] = [];
	commonProducts: any[] = [];

	addPrescriptionForm: FormGroup;

	selectedFacility: any;
	checkingStore: any;
	searchHasBeenDone = false;
	selectedProductName: any = '';
	selectedProduct: any;
	refillCount = 0;
	startDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
	endDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
	showRefill: false;
	currentPrescription: Prescription = <Prescription>{};
	employeeDetails: any = {};
	constructor(
		private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _frequencyService: FrequencyService,
		private _authFacadeService: AuthFacadeService,
		private _drugListApiService: DrugListApiService,
    private _drugInteractionService: DrugInteractionService,
    private _orderSetSharedService: OrderSetSharedService
	) {}
	ngOnInit() {
		this._getAllFrequencies();
		this._authFacadeService
			.getLogingEmployee()
			.then((res) => {
				this.employeeDetails = res;
				this.currentPrescription = <Prescription>{
					facilityId: this.selectedFacility._id,
					employeeId: this.employeeDetails._id,
					clinicId: !!this.selectedAppointment.clinicId ? this.selectedAppointment.clinicId : undefined,
					priority: '',
					patientId: this.patientDetails._id,
					personId: this.patientDetails.personId,
					prescriptionItems: [],
					isAuthorised: false,
					totalCost: 0,
					totalQuantity: 0
				};
				this._getCommonlyPrescribedDrugs();
				//this._getAllFrequencies();
			})
			.catch((err) => {});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.currentPrescription.prescriptionItems = [];
		this.prescriptionItems.prescriptionItems = [];
		this.durationUnits = DurationUnits;
		this.dosageUnits = DosageUnits;
		this.selectedDosage = DosageUnits[0].name;

		this.addPrescriptionForm = this.fb.group({
			drug: [ '', [ <any>Validators.required ] ],
			code: [ '', [ <any>Validators.required ] ],
			productId: [ '', [ <any>Validators.required ] ],
			regimenArray: this.fb.array([ this.initRegimen() ]),
			refillCount: [ this.refillCount ],
			refill: [ false, [] ],
			startDate: [ new Date().toISOString().substring(0, 10), [ <any>Validators.required ] ],
			endDate: [ new Date().toISOString().substring(0, 10), [] ],
			specialInstruction: [ '' ]
		});

		this.subscribeToRegimen(0);

		this.addPrescriptionForm.controls['drug'].valueChanges
			.distinctUntilChanged()
			.debounceTime(100)
			.subscribe((value) => {
				if (!!value) {
					this.searchHasBeenDone = false;
					this.products = [];
					const searchList = this.canSearchBeDone(value.split(','));
					if (searchList.length > 0 && this.selectedProductName.length === 0) {
						this.selectedProductName = '';
						this._drugListApiService
							.find({
								query: {
									searchtext: value,
									po: false,
									brandonly: false,
									genericonly: true,
									$limit: false
								}
							})
							.then(
								(payload) => {
									if (payload.status === 'success') {
										this.products = this.modifyProducts(payload.data);
										if (this.products.length === 0) {
											this.searchHasBeenDone = true;
										} else {
											this.searchHasBeenDone = false;
										}
									} else {
										this.searchHasBeenDone = false;
									}
								},
								(error) => {
									this.searchHasBeenDone = false;
								}
							);
					} else {
						this.selectedProductName = '';
					}
				}
			});

		this.addPrescriptionForm.controls['refill'].valueChanges.subscribe((value) => {
			this.showRefill = value;
		});
	}

	subscribeToRegimen(index) {
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		(<FormGroup>control.controls[index]).controls['duration'].valueChanges.subscribe((value) => {
			const endDate = this.getEndDate((<FormGroup>control.controls[index]).controls['durationUnit'].value, value);
			this.addPrescriptionForm.controls['endDate'].setValue(endDate.toISOString().substring(0, 10));
		});

		(<FormGroup>control.controls[index]).controls['durationUnit'].valueChanges.subscribe((value) => {
			const endDate = this.getEndDate(value, (<FormGroup>control.controls[index]).controls['duration'].value);
			this.addPrescriptionForm.controls['endDate'].setValue(endDate.toISOString().substring(0, 10));
		});
	}

	getEndDate(unit, value) {
		const date = this.addPrescriptionForm.controls['startDate'].value;
		switch (unit) {
			case 'Minutes':
				return addMinutes(date, value);
			case 'Hours':
				return addHours(date, value);
			case 'Days':
				return addDays(date, value);
			case 'Weeks':
				return addWeeks(date, value);
			case 'Months':
				return addMonths(date, value);
			default:
				break;
		}
	}

	initRegimen() {
		return this.fb.group({
			dosage: [ '', [ <any>Validators.required ] ],
			frequency: [
				this.frequencies[0] === undefined ? '' : this.frequencies[0].name,
				[ <any>Validators.required ]
			],
			duration: [ 0, [ <any>Validators.required ] ],
			durationUnit: [ this.durationUnits[1].name, [ <any>Validators.required ] ]
		});
	}

	onClickAddRegimen() {
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		control.push(this.initRegimen());
		this.subscribeToRegimen(control.length - 1);
	}

	canSearchBeDone(list: any[]) {
		return list.filter((value) => value.trim().length > 4).map((l) => l.trim());
	}

	private _getCommonlyPrescribedDrugs() {
		this._drugListApiService
			.find_commonly_prescribed({
				query: {
					facilityId: this.selectedFacility._id,
					personId: this.employeeDetails.personId
				}
			})
			.then((res) => {
				this.commonProducts = res.data.map((common) => common.productObject);
			})
			.catch((err) => {});
	}

	private _getAllFrequencies() {
		this._frequencyService
			.findAll()
			.then((res) => {
				if (res.data.length > 0) {
					this.frequencies = res.data;
					const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
					if (this.frequencies.length > 0) {
						(<FormGroup>control.controls[0]).controls['frequency'].setValue(this.frequencies[0].name);
					}
				}
			})
			.catch((err) => {});
	}

	modifyProducts(products: any[]) {
		return products.map((product) => {
			product.marked = this.validateAgainstDuplicateProductEntry(product) === false ? true : false;
			return product;
		});
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = this.commonProducts.find((x) => x.id.toString() === product.id.toString());
		return result === undefined ? true : false;
	}

	onFocus(focus) {
		if (focus === 'in') {
			this.drugSearch = true;
		} else {
			setTimeout(() => {
				this.drugSearch = false;
			}, 500);
		}
	}
	close_search(event) {
		this.drugSearch = false;
		if (!!event) {
			this.selectedProductName = event.name;
			this.selectedProduct = event;
			this.drugSearch = false;
			this.addPrescriptionForm.controls['drug'].setValue(this.selectedProductName);
			this.addPrescriptionForm.controls['code'].setValue(this.selectedProduct.code);
			this.addPrescriptionForm.controls['productId'].setValue(this.selectedProduct.id);
		} else {
			this.selectedProductName = '';
			this.selectedProduct = undefined;
			this.drugSearch = false;
		}
	}

	async mark_product(event) {
		if (this.validateAgainstDuplicateProductEntry(event.product)) {
			const commonDrug = {
				facilityId: this.selectedFacility._id,
				personId: this.employeeDetails.personId,
				productObject: event.product
			};
			const createdCommonlyPrescribed = await this._drugListApiService.create_commonly_prescribed(commonDrug);
			if (!!createdCommonlyPrescribed) {
				this.commonProducts.push(event.product);
			}
		} else {
			try {
				const removedCommonlyPrescribed = await this._drugListApiService.remove_commonly_prescribed(null, {
					query: { 'productObject.id': event.product.id }
				});
				if (!!removedCommonlyPrescribed) {
					this.commonProducts = this.commonProducts.filter(
						(x) => x.id.toString() !== event.product.id.toString()
					);
				}
			} catch (error) {}
		}
	}

	isValid() {
		return this.addPrescriptionForm.valid !== true;
	}
	add() {
		const item: PrescriptionItem = <PrescriptionItem>{};
		item.genericName = this.addPrescriptionForm.controls['drug'].value;
		item.productId = this.addPrescriptionForm.controls['productId'].value;
		item.isRefill = this.addPrescriptionForm.controls['refill'].value;
		item.refillCount = this.addPrescriptionForm.controls['refillCount'].value;
		item.code = this.addPrescriptionForm.controls['code'].value;
		item.patientInstruction = this.addPrescriptionForm.controls['specialInstruction'].value;
		item.startDate = this.addPrescriptionForm.controls['startDate'].value;
		item.endDate = this.addPrescriptionForm.controls['endDate'].value;
		item.totalCost = 0;
		item.cost = 0;
    item.regimen = this.addPrescriptionForm.controls['regimenArray'].value;
    const medication = {
      //Available
      //genericName: value.drug,
     
      //regimen: value.regimenArray,
      //startDate: value.startDate,
      //patientInstruction: value.specialInstruction,
      //refillCount: value.refillCount,
      
     // code: this.selectedGeneric.code,
      
     // cost: 0,
      //totalCost: 0,

      //Not availble
     // dosage: value.dosage,
      //dosageUnit: value.dosageUnit,
      //ingredients: this.selectedIngredients,
      comment: '',
      status: 'Not Started',
      completed: false,
      isExternal: false,
      initiateBill: false,
      isBilled: false,
      isDispensed: false,
      //old stuff
      // routeName: value.route,
      // strength: value.strength,
      // frequency: value.frequency,
      // duration: value.duration,
      // durationUnit: value.durationUnit,
    };


    this.currentPrescription.prescriptionItems.push(item);
    console.log(this.currentPrescription.prescriptionItems);
    this._orderSetSharedService.saveItem({ medications: this.currentPrescription.prescriptionItems });
		this._drugInteractionService.checkDrugInteractions(this.currentPrescription.prescriptionItems);
		this.reset();
	}
  onClickRemoveRegimen(i) {
    const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
    // Remove interval from the list of vaccines.
    control.removeAt(i);
  }
	reset() {
		this.addPrescriptionForm.controls['drug'].reset();
		this.addPrescriptionForm.controls['startDate'].setValue(new Date().toISOString().substring(0, 10));
		this.addPrescriptionForm.controls['endDate'].setValue(new Date().toISOString().substring(0, 10));
		this.addPrescriptionForm.controls['refill'].setValue(false);
		this.addPrescriptionForm.controls['refillCount'].setValue(0);
		this.addPrescriptionForm.controls['specialInstruction'].reset();
		const control = <FormArray>this.addPrescriptionForm.controls['regimenArray'];
		if (this.frequencies.length > 0) {
			(<FormGroup>control.controls[0]).controls['frequency'].setValue(this.frequencies[0].name);
		}
		if (this.durationUnits.length > 0) {
			(<FormGroup>control.controls[0]).controls['durationUnit'].setValue(this.durationUnits[1].name);
		}
		(<FormGroup>control.controls[0]).controls['duration'].setValue(0);
		(<FormGroup>control.controls[0]).controls['dosage'].setValue('');
	}
	startPrescription(event) {
		this.currentPrescription = <Prescription>{
			facilityId: this.selectedFacility._id,
			employeeId: this.employeeDetails._id,
			clinicId: !!this.selectedAppointment.clinicId ? this.selectedAppointment.clinicId : undefined,
			priority: '',
			patientId: this.patientDetails._id,
			personId: this.patientDetails.personId,
			prescriptionItems: [],
			isAuthorised: false,
			totalCost: 0,
			totalQuantity: 0
		};
	}
}


