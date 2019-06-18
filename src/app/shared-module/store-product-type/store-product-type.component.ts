import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility, Category } from '../../models/index';
import { ProductTypeService } from '../../services/facility-manager/setup';

@Component({
  selector: 'app-store-product-type',
  templateUrl: './store-product-type.component.html',
  styleUrls: ['./store-product-type.component.scss']
})
export class StoreProductTypeComponent implements OnInit {
  categoryGroup: FormGroup;
  selectedFacility: Facility = <Facility>{};
  categories: any[] = [];
  selectedItem: any = <Category>{};
  btnLabel = 'Create';
  searchControl = new FormControl();
  mainErr: Boolean = true;
  errMsg: String = 'You have unresolved errors';
  loading = true;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private _locker: CoolLocalStorage,
    private _fb: FormBuilder,
    private _categoryService: ProductTypeService
  ) {
  }

  ngOnInit() {
    this.categoryGroup = this._fb.group({
      name: ['', [<any>Validators.required]]
    });
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getManufacturer();
    this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((por: any) => {
        this._categoryService.find({
          query: {
            facilityId: this.selectedFacility._id, name:
              { $regex: this.searchControl.value, '$options': 'i' }
          }
        })
          .then(data => {
            this.categories = data.data;
          });
      })
  }

  onClickAdd(value: any, valid: boolean) {
    if (valid) {
      this.mainErr = true;
      // Check if you are editing an existing or creating a new record
      if (this.selectedItem._id === undefined) {
        // Creating new record
        value.facilityId = this.selectedFacility._id;
        this._categoryService.create(value)
          .then(data => {
            this.categoryGroup.reset();
            this.categories.push(data);
          })
          .catch(err => {
          });
      } else {
        // Updating existing record
        value = this.selectedItem;
        value.name = this.categoryGroup.get('name').value;

        this._categoryService.update(value)
          .then(data => {
            this.categoryGroup.reset();
            this.selectedItem = {};
            this.btnLabel = 'Create';
          })
          .catch(err => {
          });
      }

    } else {
      this.mainErr = false;
    }
  }

  onClickEdit(value: any) {
    this.categoryGroup.controls['name'].setValue(value.name);
    this.selectedItem = value;
    this.btnLabel = 'Update';
  }

  onClickCancel() {
    this.selectedItem = {};
    this.categoryGroup.controls['name'].setValue('');
    this.btnLabel = 'Create';
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onClickIsActive(value) {
    // Updating existing record
    value.isActive = !value.isActive;

    this._categoryService.update(value)
      .then(data => {
        // Do nothing for now
      })
      .catch(err => {
      });
  }

  getManufacturer() {
    this._categoryService.find({ query: { facilityId: this.selectedFacility._id } })
      .then(data => {
        this.categories = data.data;
      });
  }


}
