import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators
} from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { Facility } from '../../../../models/index';
import { DrugListApiService } from '../../../../services/facility-manager/setup';
import { DurationUnits } from '../../../../shared-module/helpers/global-config';
import { ImmunizationScheduleService } from '../../../../services/facility-manager/setup/immunization-schedule.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-immunization-schedule',
  templateUrl: './new-immunization-schedule.component.html',
  styleUrls: ['./new-immunization-schedule.component.scss']
})
export class NewImmunizationScheduleComponent implements OnInit, OnDestroy {
  immunizationScheduleForm: FormGroup;
  facility: Facility = <Facility>{};
  immunizationSchedule = <any>{};
  results: any = <any>[];
  apmisLookupQuery = {};
  apmisLookupText = '';
  apmisLookupUrl = 'drug-generic-list';
  apmisLookupDisplayKey = 'name';
  disableBtn = false;
  saveScheduleBtn = true;
  updateScheduleBtn = false;
  savingScheduleBtn = false;
  updatingScheduleBtn = false;
  showCuDropdown = false;
  cuDropdownLoading = true;
  drugIndex: number;
  durationUnits = DurationUnits;
  private routeParams: ISubscription;
  private routeId: string;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _drugListAPI: DrugListApiService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _systemModuleService: SystemModuleService,
    private _immunizationScheduleService: ImmunizationScheduleService
  ) {
    // Check if the route has an Id
    this.routeParams = this._route.params.subscribe(params => {
      if (!!params.id) {
        this.routeId = params.id;
        this._getImmunizationSchedule(params.id);
      }
    });
  }
  // get formData { return this.immunizationScheduleForm.get('Data'); }
  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    // Depending on if there is a routeId, use form initializer.
    if (!!this.routeId) {
      this.immunizationScheduleForm = this._fb.group({
        name: ['', [<any>Validators.required]],
        price: ['', [<any>Validators.required]],
        serviceId: [''],
        'vaccinesArray': this._fb.array([])
      });
    } else {
      this.immunizationScheduleForm = this._fb.group({
        name: ['', [<any>Validators.required]],
        price: ['', [<any>Validators.required]],
        serviceId: [''],
        'vaccinesArray': this._fb.array([this.initVaccineBuilder()])
      });
    }

    (this.immunizationScheduleForm.get('vaccinesArray') as FormArray).valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      // .switchMap(value => this._drugListAPI.find({ query: { 'text': value[this.drugIndex].name, facilityId: this.facility._id }}))
      .subscribe((res: any) => {
        if (res.length > 0) {
          if (this.drugIndex !== undefined) {
            const immuneSch = <FormArray>this.immunizationScheduleForm.controls['vaccinesArray'];
            const vaccine = <FormArray>immuneSch.controls[this.drugIndex];
            const intervals = <FormArray>vaccine.controls['intervals'];
            const text = res[this.drugIndex].name;
            const intervalLength = intervals.controls.length;
            // Get the length from interval and  assign numberOfDosage.
            vaccine.controls['numberOfDosage'].setValue(intervalLength);

            this._drugListAPI
              .find({ query: { searchtext: text, method: 'immunization' } })
              .then(resp => {
                this.cuDropdownLoading = false;
                if (resp.status === 'success') {
                  this.results = resp.data;
                }
              });
          }
        }
      });
  }

  onClickSaveSchedule(valid: boolean, value: any) {
    if (valid) {
      this.disableBtn = true;
      this.saveScheduleBtn = false;
      this.updateScheduleBtn = false;
      this.savingScheduleBtn = true;
      this.updatingScheduleBtn = false;

      const payload = {
        _id: !!this.routeId ? this.routeId : undefined,
        action: 'create',
        facilityId: this.facility._id,
        name: value.name,
        vaccines: value.vaccinesArray,
        price: value.price,
        serviceId: !!this.routeId ? value.serviceId : undefined,
      };

      this._systemModuleService.on();
      // update immunization schedule record.
      if (!!this.routeId) {
        this._immunizationScheduleService.customUpdate(payload).then(res => {
          this._systemModuleService.off();
          if (res.status === 'success') {
            // const text = `${value.name} immunization schedule has been updated successfully!`;
            const text = `${value.name} Batch schedule has been updated successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.immunizationScheduleForm.reset();
            this.disableBtn = false;
            this.saveScheduleBtn = true;
            this.updateScheduleBtn = false;
            this.savingScheduleBtn = false;
            this.updatingScheduleBtn = false;
          } else {
            this._systemModuleService.announceSweetProxy(res.message, 'error');
            this.disableBtn = false;
            this.saveScheduleBtn = true;
            this.updateScheduleBtn = false;
            this.savingScheduleBtn = false;
            this.updatingScheduleBtn = false;
          }
        });
      } else {
        this._immunizationScheduleService.customCreate(payload).then(res => {
          this._systemModuleService.off();
          if (res.status === 'success') {
            // const text = `${value.name} immunization schedule has been created successfully!`;
            const text = `${value.name} Batch schedule has been created successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.immunizationScheduleForm.reset();
            this.disableBtn = false;
            this.saveScheduleBtn = true;
            this.updateScheduleBtn = false;
            this.savingScheduleBtn = false;
            this.updatingScheduleBtn = false;
          } else {
            this._systemModuleService.announceSweetProxy(res.message, 'error');
            this.disableBtn = false;
            this.saveScheduleBtn = true;
            this.updateScheduleBtn = false;
            this.savingScheduleBtn = false;
            this.updatingScheduleBtn = false;
          }
        });
      }
    }
  }

  initVaccineBuilder(vaccine?: any) {
    if (!!vaccine) {
      return this._fb.group({
        name: [vaccine.name, Validators.required],
        nameCode: [vaccine.nameCode, Validators.required], // drug code
        code: [vaccine.code, Validators.required],
        vaccinationSite: [vaccine.vaccinationSite, Validators.required],
        numberOfDosage: [vaccine.numberOfDosage, Validators.required],
        dosage: [vaccine.dosage, Validators.required],
        price: [vaccine.serviceObject.price, Validators.required],
        serviceId: [vaccine.serviceObject.serviceId],
        intervals: this._fb.array([])
      });
    } else {
      return this._fb.group({
        name: ['', Validators.required],
        nameCode: ['', Validators.required], // drug code
        code: ['', Validators.required],
        vaccinationSite: ['', Validators.required],
        numberOfDosage: ['', Validators.required],
        dosage: ['', Validators.required],
        price: ['', Validators.required],
        serviceId: [''],
        intervals: this._fb.array([this.initIntervalBuilder()])
      });
    }
  }

  initIntervalBuilder(interval?: any) {
    if (!!interval) {
      return this._fb.group({
        sequence: [interval.sequence, Validators.required],
        unit: [interval.unit, Validators.required],
        duration: [interval.duration, Validators.required]
      });
    } else {
      return this._fb.group({
        sequence: ['', Validators.required],
        unit: ['', Validators.required],
        duration: ['', Validators.required]
      });
    }
  }

  onClickAddVaccine(vaccine?: any) {
    if (!!vaccine) {
      // add vaccine to list
      const control = <FormArray>this.immunizationScheduleForm.controls['vaccinesArray'];
      control.push(this.initVaccineBuilder(vaccine));
    } else {
      // add vaccine to list
      const control = <FormArray>this.immunizationScheduleForm.controls['vaccinesArray'];
      control.push(this.initVaccineBuilder());
    }
  }

  onClickAddInterval(i?: number, vaccine?, action?, data?) {
    const control = <FormArray>vaccine.controls['intervals'];
    if (action === 'add') {
      // add interval into the list of vaccines.
      if (!!data) {
        control.push(this.initIntervalBuilder(data));
      } else {
        control.push(this.initIntervalBuilder());
      }
    } else {
      // Remove interval from the list of vaccines.
      control.removeAt(control.length - 1);
    }
  }

  apmisLookupHandleSelectedItem(i, value, vaccine) {
    vaccine.controls['name'].setValue(value.name);
    vaccine.controls['nameCode'].setValue(value.code);
  }

  private _getImmunizationSchedule(id) {
    this._systemModuleService.on();
    this._immunizationScheduleService.get(id, {}).then(res => {
      this._systemModuleService.off();
      if (!!res._id) {
        this.immunizationSchedule = res;
        this._populateImmunizationSchedule(res);
      }
    });
  }

  private _populateImmunizationSchedule(immunization) {
    if (!!immunization._id) {
      this.immunizationScheduleForm.controls['name'].setValue(immunization.name);
      if (!!immunization.serviceObject && immunization.serviceObject.price) {
        this.immunizationScheduleForm.controls['price'].setValue(immunization.serviceObject.price);
        this.immunizationScheduleForm.controls['serviceId'].setValue(immunization.serviceObject.serviceId);
      }
      if (immunization.vaccines.length > 0) {
        immunization.vaccines.forEach((vaccine, i) => {
          this.onClickAddVaccine(vaccine);
          vaccine.intervals.forEach((interval, j) => {
            const immuneSch = <FormArray>this.immunizationScheduleForm.controls['vaccinesArray'];
            const vaccineControl = <FormArray>immuneSch.controls[i];
            this.onClickAddInterval(j, vaccineControl, 'add', interval);
          });
        });
      }
    }
  }

  private _populateInterval(control, intervals) {
    if (!!intervals && intervals.length > 0) {
      intervals.forEach(interval => {
        this.onClickAddInterval(null, control, 'add', interval);
      });
    }
  }

  removeVaccine(i: number) {
    // remove address from the list
    const control = <FormArray>this.immunizationScheduleForm.controls['vaccinesArray'];
    control.removeAt(i);
  }

  focusSearch(i) {
    this.drugIndex = i;
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch(i) {
    setTimeout(() => {
      this.drugIndex = i;
      this.showCuDropdown = !this.showCuDropdown;
    }, 300);
  }

  close_onClick() {
    this._systemModuleService.on();
    this._router.navigate(['/dashboard/immunization/']).then(res => {
      this._systemModuleService.off();
    });
  }

  ngOnDestroy() {
    // unsubscribe from any subscribed observable.
    this.routeParams.unsubscribe();
  }
}
