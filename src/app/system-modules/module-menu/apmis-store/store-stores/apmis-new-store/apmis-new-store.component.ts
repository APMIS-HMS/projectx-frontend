import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../../services/module-manager/setup/location.service';
import { ProductTypeService } from './../../../../../services/facility-manager/setup/product-type.service';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { ApmisFilterBadgeService } from './../../../../../services/tools/apmis-filter-badge.service';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-apmis-new-store',
  templateUrl: './apmis-new-store.component.html',
  styleUrls: ['./apmis-new-store.component.scss']
})
export class ApmisNewStoreComponent implements OnInit {

  tab_store = true;
  newStoreForm: FormGroup;
  selectedFacility: any = <any>{};
  minorLocations: any = [];
  locations: any = [];
  storeLocations: any = [];
  productTypes: any = [];
  placeholder = "Add Product Type";

  constructor(private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private productTypeService: ProductTypeService,
    private systemModuleService: SystemModuleService,
    private storeService: StoreService,
    private apmisFilterBadgeService: ApmisFilterBadgeService) { }

  ngOnInit() {
    this.newStoreForm = this.fb.group({
      'majorLoc': [' ', Validators.required],
      'minorLocationId': [' ', Validators.required],
      'name': [' ', Validators.required],
      'productTypeId': [' ', Validators.required],
      'description': [' ', Validators.required],
      'canDespense': [true, Validators.required],
      'canReceivePurchaseOrder': [true, Validators.required]
    });

    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.getLocationService();
    this.getProductTypeService();
    this.newStoreForm.controls['majorLoc'].valueChanges.subscribe(value => {
      if (value !== null && value !== '') {
        this.storeLocations = this.minorLocations.filter(x => x.locationId.toString() === value.toString());
      }
    });
  }

  tab_click(tab) {
    if (tab === 'store') {
      this.tab_store = true;
    }
  }

  onDespense(event) {
    this.newStoreForm.controls['canDespense'].setValue(event.target.checked);
  }

  onReceivePurchaseOrder(event) {
    this.newStoreForm.controls['canReceivePurchaseOrder'].setValue(event.target.checked);
  }

  getProductTypeService() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id, isActive: true, $select: ['name'] } }).then(payload => {
      this.productTypes = payload.data.map(x => {
        return {
          id: x._id,
          label: x.name
        };
      });
    });
  }

  getFacilityService() {
    this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
      this.minorLocations = payload.minorLocations;
    }, err => { })
  }

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
    }, err => { })
  }

  onSearchSelectedItems(value) {
    let productTypeItems = [];
    value.forEach(element => {
      productTypeItems.push({
        productTypeId: element.id
      });
    });
    this.newStoreForm.controls['productTypeId'].setValue(productTypeItems);
  }

  onCreateNewItem(value) {
    const productType = {
      facilityId: this.selectedFacility._id,
      name: value
    }
    this.systemModuleService.on();
    this.productTypeService.create(productType).then(payload => {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('You have succesfully added ' + value.toString().toUpperCase() + ' as a Product type', 'success', null,
        null,
        null,
        null,
        null,
        null,
        null);
      this.getProductTypeService();
    }, err => {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Failed to add ' + value.toString().toUpperCase() + ' as a Product type', 'error', null,
        null,
        null,
        null,
        null,
        null,
        null);
    });
  }

  onSave() {
    this.systemModuleService.on();
    if (this.newStoreForm.valid) {
      const store = this.newStoreForm.value;
      store.facilityId = this.selectedFacility._id;
      this.storeService.create(store).then(payload => {
        this.systemModuleService.announceSweetProxy('Store created successfully', 'success', null,
          null,
          null,
          null,
          null,
          null,
          null);
        this.newStoreForm.reset();
        this.systemModuleService.off();
        this.apmisFilterBadgeService.reset(true);
      }, err => {
        this.systemModuleService.announceSweetProxy('Failed to create store', 'error', null,
          null,
          null,
          null,
          null,
          null,
          null);
        this.systemModuleService.off();
        this.newStoreForm.reset();
        this.apmisFilterBadgeService.reset(true);
      });

    } else {
      this.systemModuleService.announceSweetProxy('Required value is missing', 'error', null,
        null,
        null,
        null,
        null,
        null,
        null);
      this.systemModuleService.off();
    }
  }

}
