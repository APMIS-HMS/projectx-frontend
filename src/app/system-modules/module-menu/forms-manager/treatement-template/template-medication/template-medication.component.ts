import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import {
    FacilitiesService, PrescriptionService,
    PrescriptionPriorityService, DictionariesService, BillingService,
    RouteService, FrequencyService, DrugListApiService, DrugDetailsService, MedicationListService, PersonService
} from '../../../../../services/facility-manager/setup/index';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';
import { Appointment, Facility, Employee, Prescription, PrescriptionItem, BillItem, BillIGroup, Dispensed, User }
    from '../../../../../models/index';
import { DurationUnits, DosageUnits } from '../../../../../shared-module/helpers/global-config';

@Component({
  selector: 'app-template-medication',
  templateUrl: './template-medication.component.html',
  styleUrls: ['./template-medication.component.scss']
})
export class TemplateMedicationComponent implements OnInit {
  addPrescriptionForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';
  currentDate: Date = new Date();
  minDate: Date = new Date();
  newTemplate = true;
  drugs: string[] = [];
  routes: string[] = [];
  frequencies: string[] = [];
  durationUnits: any[] = [];
  dosageUnits: any[] = [];
  selectedValue: any;
  selectedDosage: any;
  drugId = '';
  refillCount = 0;
  selectedForm = '';
  selectedIngredients: any = [];
  medications: any = [];

  constructor(
    private fb: FormBuilder,
    private _drugListApi: DrugListApiService,
    private _drugDetailsApi: DrugDetailsService,
    private _priorityService: PrescriptionPriorityService,
    private _dictionaryService: DictionariesService,
    private _frequencyService: FrequencyService,
    private _routeService: RouteService,
    private _orderSetSharedService: OrderSetSharedService
  ) {}

  ngOnInit() {
    this.durationUnits = DurationUnits;
    this.dosageUnits = DosageUnits;
    this.selectedValue = DurationUnits[1].name;
    this.selectedDosage = DosageUnits[0].name;

    this.addPrescriptionForm = this.fb.group({
      // strength: ['', [<any>Validators.required]],
      // route: ['', [<any>Validators.required]],
      dosage: ['', [<any>Validators.required]],
      dosageUnit: ['', [<any>Validators.required]],
      drug: ['', [<any>Validators.required]],
      regimenArray: this.fb.array([this.initRegimen()]),
      refillCount: [this.refillCount],
      startDate: [this.currentDate],
      specialInstruction: ['']
    });
    this.apmisLookupUrl = 'drug-generic-list';
    this.apmisLookupDisplayKey = 'name';

    this.addPrescriptionForm.controls['drug'].valueChanges.subscribe(value => {
      this.apmisLookupQuery = {
        searchtext: value,
        po: false,
        brandonly: false,
        genericonly: true
      };
    });

    this._getAllFrequencies();
    // this._getAllRoutes();
  }

  initRegimen() {
    return this.fb.group({
      frequency: ['', [<any>Validators.required]],
      duration: [0, [<any>Validators.required]],
      durationUnit: [this.durationUnits[1].name, [<any>Validators.required]],
    });
  }

  onClickAddMedication(valid: boolean, value: any) {
    if (valid) {
      const medication = {
        genericName: value.drug,
        // routeName: value.route,
        // strength: value.strength,
        dosage: value.dosage,
        dosageUnit: value.dosageUnit,
        regimen: value.regimenArray,
        // frequency: value.frequency,
        // duration: value.duration,
        // durationUnit: value.durationUnit,
        startDate: value.startDate,
        patientInstruction: value.specialInstruction,
        refillCount: value.refillCount,
        ingredients: this.selectedIngredients,
        form: this.selectedForm,
        comment: '',
        status: 'Not Started',
        completed: false,
      };

      this.medications.push(medication);
      this._orderSetSharedService.saveItem({ medications: this.medications});

      this.addPrescriptionForm.reset();
      this.addPrescriptionForm.controls['refillCount'].reset(0);
      this.addPrescriptionForm.controls['duration'].reset(0);
      this.addPrescriptionForm.controls['startDate'].reset(new Date());
      // this.addPrescriptionForm.controls['durationUnit'].reset(this.durationUnits[1].name);
      this.addPrescriptionForm.controls['dosageUnit'].reset(this.dosageUnits[0].name);
    }
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

  apmisLookupHandleSelectedItem(item) {
    this.apmisLookupText = item;
    this.addPrescriptionForm.controls['drug'].setValue(item.name);
    // this._drugDetailsApi.find({ query: { productId: item.productId } }).then(res => {
    // this._drugListApi.find({ query: { method: 'drug-details', 'productId': item.productId } }).then(res => {
    //     const sRes = res.data;
    //     if (res.status === 'success') {
    //       if (!!sRes.ingredients && sRes.ingredients.length > 0) {
    //         this.selectedForm = sRes.form;
    //         this.selectedIngredients = sRes.ingredients;
    //         let drugName: string = sRes.form + ' ';
    //         let strength = '';
    //         const ingredientLength: number = sRes.ingredients.length;
    //         let index = 0;
    //         sRes.ingredients.forEach(element => {
    //           index++;
    //           drugName += element.name;
    //           strength += element.strength + element.strengthUnit;

    //           if (index !== ingredientLength) {
    //             drugName += '/';
    //             strength += '/';
    //           }
    //         });
    //         this.addPrescriptionForm.controls['drug'].setValue(drugName);
    //         this.addPrescriptionForm.controls['strength'].setValue(strength);
    //         this.addPrescriptionForm.controls['route'].setValue(sRes.route);
    //       }
    //     }
    //   }).catch(err => console.error(err));
  }

  // private _getAllRoutes() {
  //   this._routeService.findAll().then(res => {
  //       this.routes = res.data;
  //     }).catch(err => console.error(err));
  // }

  private _getAllFrequencies() {
    this._frequencyService.findAll().then(res => {
      if (res.data.length > 0) {
        this.frequencies = res.data;
      }
    }).catch(err => console.error(err));
  }
}
