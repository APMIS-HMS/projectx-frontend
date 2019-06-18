import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesServiceCategoryService, ServicePriceService, TagService } from '../../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, FacilityServicePrice, Tag } from '../../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

@Component({
  selector: 'app-new-modefier',
  templateUrl: './new-modefier.component.html',
  styleUrls: ['./new-modefier.component.scss']
})
export class NewModefierComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacilityServicePrice: any = <any>{};
  @Output() refreshModifiers: EventEmitter<any> = new EventEmitter<any>();
  mainErr = true;
  errMsg = 'you have unresolved errors';
  categories: FacilityService[] = [];
  tags: Tag[] = [];
  selectedCategory: FacilityService = <FacilityService>{};
  services: CustomCategory[] = [];
  facility: Facility = <Facility>{};
  selectedTag: Tag = <Tag>{};
  showBtn = false;
  public frmNewmodefier: FormGroup;



  constructor(private formBuilder: FormBuilder,
    private _tagService: TagService,
    private servicePriceService: ServicePriceService,
    private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
    private systemModuleService: SystemModuleService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.addNew();
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getCategories();
    this.frmNewmodefier.controls['tag'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(value => {
        this.tags = [];
        this.systemModuleService.on();
        this._tagService.find({
          query:
            { name: { $regex: this.frmNewmodefier.controls['tag'].value, '$options': 'i' }, facilityId: this.facility._id }
        }).then(payload => {
          if (this.frmNewmodefier.controls['tag'].value !== '') {
            if (payload.data !== undefined) {
              this.tags = payload.data;
              if (payload.data.length > 0) {
                const index = payload.data.filter(x => x.name.toLowerCase() === this.frmNewmodefier.controls['tag'].value.toLowerCase());
                if (index.length > 0) {
                  this.showBtn = false;
                } else {
                  this.showBtn = true;
                }
              } else {
                this.showBtn = true;
              }
            }
          } else {
            this.showBtn = false;
          }
          this.systemModuleService.off();
        })
      });
  }
  getCategories() {
    this._facilitiesServiceCategoryService.find({
      query: {
        $or: [
          { facilityId: this.facility._id },
          { facilityId: undefined }
        ]
      }
    })
      .then(payload => {
        this.categories = [];
        this.services = [];
        payload.data.forEach((itemi, i) => {
          itemi.categories.forEach((itemj, j) => {
            if (itemi.facilityId !== undefined) {
              this.categories.push(itemj);
            }
          });
        });
      });
  }

  onSuggestTag() {

  }
  addNew() {
    this.frmNewmodefier = this.formBuilder.group({
      tag: ['', [<any>Validators.required]],
      value: ['', [<any>Validators.required]],
      valueCheck: ['Percentage', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onCreateNewTag() {
    this.systemModuleService.on();
    const newServiceTag = {
      name: this.frmNewmodefier.controls['tag'].value,
      facilityId: this.facility._id
    }
    this._tagService.create(newServiceTag).then(payload => {
      this.showBtn = false;
      this.selectedTag = payload;
      this.systemModuleService.off();
    })
  }


  onSelectedTag(value: any) {
    this.selectedTag = value;
    this.frmNewmodefier.controls['tag'].setValue(this.selectedTag.name);
  }
  newModefier(value, valid) {
    this.systemModuleService.on();
    const modifier: any = <any>{};
    if(this.selectedTag._id !== undefined){
      modifier.priceId = this.selectedFacilityServicePrice.priceId;
      modifier.tagId = this.selectedTag._id;
      modifier.modifierType = this.frmNewmodefier.controls['valueCheck'].value;
      modifier.modifierValue = this.frmNewmodefier.controls['value'].value;
      if (modifier.priceId !== undefined) {
        this.servicePriceService.createModifier(modifier).then(payload => {
          this.systemModuleService.off();
          this.selectedFacilityServicePrice = payload;
          this.systemModuleService.announceSweetProxy('Price modifier added successful', 'success', null, null, null, null, null, null, null);
          this.refreshModifiers.emit(payload.categoryId);
          this.close_onClick();
        }, err => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Failed to add price modifiers', 'error');
        })
      } else {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy
        ('Empty price cannot be modify, please assign atleast ZERO as the price of this service', 'error');
      }
    }else{
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Add '+ this.frmNewmodefier.controls['tag'].value.toUpperCase()+' as TAG before settings modifier', 'error');
    }
  }
}
