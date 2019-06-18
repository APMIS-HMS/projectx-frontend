import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../../models/facility-manager/setup/facility';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-template-procedure',
  templateUrl: './template-procedure.component.html',
  styleUrls: ['./template-procedure.component.scss']
})

export class TemplateProcedureComponent implements OnInit {
  addProcedureForm: FormGroup;
  facility: Facility = <Facility>{};
  selectedProcedure: any = <any>{};
  cuDropdownLoading = false;
  showCuDropdown = false;
  results: any = [];
  procedures: any = <any>[];
  newTemplate = true;

  constructor(
    private _locker: CoolLocalStorage,
    private _fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService,
    private _facilityServiceCategoryService: FacilitiesServiceCategoryService
  ) {
    // this.apmisLookupQuery = {
    //   query: {
    //     'categories.name': 'Procedure',
    //     $select: { 'categories.$': 1 }
    //   }
    // };
    // this._facilityServiceCategoryService .find({
    //   query: {
    //     'categories.name': 'Procedure',
    //     'categories.services.name': 'Minor Wound Dressing',
    //     $select: { 'categories.services.$': 1 }
    //   }
    // }).then(payload => {
    //   console.log(payload);
    // }, error => {
    //   console.log(error);
    // });
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.addProcedureForm = this._fb.group({
      procedure: ['', [<any>Validators.required]]
    });

    this.addProcedureForm.controls['procedure'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(value => this._facilityServiceCategoryService.searchProcedure({query: {'text': value, facilityId: this.facility._id }}))
      .subscribe((res: any) => {
        this.cuDropdownLoading = false;
        if (res.status === 'success') {
          this.results = res.data;
        }
      });
  }

  onClickAddProcedure(valid: boolean, value: any) {
    if (valid) {
      this.selectedProcedure.comment = '';
      this.selectedProcedure.status = 'Not Done';
      this.selectedProcedure.completed = false;

      this.procedures.push(this.selectedProcedure);
      this._orderSetSharedService.saveItem({ procedures: this.procedures });

      this.addProcedureForm.reset();
      this.addProcedureForm.controls['procedure'].setValue('');
    }
  }

  apmisLookupHandleSelectedItem(value) {
    this.selectedProcedure = value;
    this.addProcedureForm.controls['procedure'].setValue(value.name);
  }

  focusSearch() {
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch() {
    setTimeout(() => {
      this.showCuDropdown = !this.showCuDropdown;
    }, 300);
  }
}
