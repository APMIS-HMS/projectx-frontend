import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, FacilitiesServiceCategoryService } from '../../../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../../../models/facility-manager/setup/facility';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { OrderSetSharedService } from '../../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-edit-procedure',
  templateUrl: './edit-procedure.component.html',
  styleUrls: ['./edit-procedure.component.scss']
})
export class EditProcedureComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() editedValue;
  addProcedureForm: FormGroup;
  facility: Facility = <Facility>{};
  selectedProcedure: any = <any>{};
  cuDropdownLoading = false;
  showCuDropdown = false;
  onEditProcedurePrice = false;
  results: any = [];
  procedures: any = <any>[];
  newTemplate = true;
  costForm = new FormControl();

  constructor(
    private _locker: CoolLocalStorage,
    private _fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService,
    private _facilityServiceCategoryService: FacilitiesServiceCategoryService
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.addProcedureForm = this._fb.group({
      procedure: ['', [<any>Validators.required]]
    });
    if (this.editedValue !== null) {
      this.selectedProcedure = this.editedValue;
      this.addProcedureForm.controls['procedure'].setValue(this.editedValue.name);
    }

    this.addProcedureForm.controls['procedure'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap(value => this._facilityServiceCategoryService.searchProcedure({ query: { 'text': value, facilityId: this.facility._id } }))
      .subscribe((res: any) => {
        this.cuDropdownLoading = false;
        if (res.status === 'success') {
          this.results = res.data;
        }
      });

    this.costForm.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((res) => {
        this.selectedProcedure.changedPrice = res;
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
      this.costForm.setValue('');
      this.onEditProcedurePrice = false;
      this.selectedProcedure = {};
    }
  }

  apmisLookupHandleSelectedItem(value) {
    this.selectedProcedure = value;
    this.addProcedureForm.controls['procedure'].setValue(value.name);
  }

  onEditProcedure() {
    this.onEditProcedurePrice = !this.onEditProcedurePrice;
  }

  focusSearch() {
    this.showCuDropdown = !this.showCuDropdown;
  }

  focusOutSearch() {
    setTimeout(() => {
      this.showCuDropdown = !this.showCuDropdown;
    }, 300);
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
