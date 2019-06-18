import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, FacilityService, ServiceCategory, ServiceItem } from '../../../../../models/index';
import { FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  facility: Facility = <Facility>{};
  categories: ServiceCategory = <ServiceCategory>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshCategory: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedCategory: any;
  @Input() categoryBool: Boolean;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  edit = false;
  editCategory = false;

  public frmEditcat: FormGroup;
  public frmNewcat: FormGroup;
  btnTitle = 'CREATE CATEGORY';

  constructor(private formBuilder: FormBuilder,
    private _locker: CoolLocalStorage,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.btnTitle = 'CREATE CATEGORY';
    this.addNew();
    this.editCat();
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    if (this.selectedCategory.name !== undefined) {
      this.btnTitle = 'UPDATE CATEGORY';
      this.frmNewcat.controls['catName'].setValue(this.selectedCategory.name);
    }
  }
  addNew() {
    this.frmNewcat = this.formBuilder.group({
      catName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
    });
  }
  editCat() {
    this.frmEditcat = this.formBuilder.group({
      catName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.categoryBool = false;
  }

  newcat(model: any, valid: boolean) {
    if (valid) {
      this.systemModuleService.on();
      const facilityServiceModel: FacilityService = <FacilityService>{};
      const facilityCategoryeModel: ServiceCategory = <ServiceCategory>{};
      facilityServiceModel.facilityId = this.facility._id;
      facilityCategoryeModel.name = this.frmNewcat.controls['catName'].value;
      facilityCategoryeModel.services = [];
      facilityServiceModel.categories = [];
      if (this.selectedCategory.name === undefined) {
        this._facilitiesServiceCategoryService.create(facilityCategoryeModel, {
          query: {
            facilityId: this.facility._id,
            isCategory: true
          }
        }).then(payload => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Category added successful', 'success', null, null, null, null, null, null, null);
          this.refreshCategory.emit(true);
        }, error => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Failed to add category', 'error');
        });
      } else {
        this._facilitiesServiceCategoryService.update2(this.facility._id, facilityCategoryeModel, {
          query: {
            facilityId: this.facility._id,
            isCategory: true,
            categoryId: this.selectedCategory._id,
            name: facilityCategoryeModel.name
          }
        }).then(payload => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Category added successful', 'success', null, null, null, null, null, null, null);
          this.refreshCategory.emit(true);
          this.close_onClick();
        }, error => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Failed to add category', 'error');
        });
      }


    }

  }
}
