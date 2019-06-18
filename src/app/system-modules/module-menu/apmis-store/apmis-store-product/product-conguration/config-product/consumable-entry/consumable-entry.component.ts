import { Subscription } from 'rxjs/Subscription';
import { ApmisFilterBadgeService } from './../../../../../../../services/tools/apmis-filter-badge.service';
import { SystemModuleService } from './../../../../../../../services/module-manager/setup/system-module.service';
import { ManufacturerService } from './../../../../../../../services/facility-manager/setup/manufacturer.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductObserverService } from './../../../../../../../services/tools/product-observer.service';
import { ProductService } from './../../../../../../../services/facility-manager/setup/product.service';
import { StoreProduct, ApmisConsumables, ProductType } from 'app/system-modules/module-menu/apmis-store/store-utils/global';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-consumable-entry',
  templateUrl: './consumable-entry.component.html',
  styleUrls: ['./consumable-entry.component.scss']
})
export class ConsumableEntryComponent implements OnInit, OnDestroy {
@Input() consumableExist: boolean;
canConfigure = false;
consumables: any = [];
manufacturers: any = [];
categories = [];
configProductBtn = '';
showProduct = false;
showOtherProp = false;
showManufactuerBtn = false;
showManufacturers = false;
consumableEntry = false;
category_select = false;
selectedConsumableName = '';
selectedManufacturerName = '';
selectedCategory;
selectedManufacturer;
consumableInputValue = '';
selectedConsumable: StoreProduct = <StoreProduct>{};
currentFacility: Facility = <Facility>{};
consumableSearch = new FormControl();
manufacturerSearch = new FormControl();
productNameSubscription: Subscription;
editableConfigSubscription: Subscription;
viewSubscription: Subscription;
  constructor(private productService: ProductService,
    private pdObserverService: ProductObserverService,
    private locker: CoolLocalStorage,
    private manufacturerService: ManufacturerService,
    private apmisFilterService: ApmisFilterBadgeService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.getCategories();
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.consumableSearch.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
      this.consumableInputValue = val;
      if (this.consumableSearch.value.length >= 3) {
        this.productService.findConSumables({
          query: {
            STR: { $regex: val, $options: 'i' }
          }
        }).then(payload => {
          this.canConfigure = true;
          this.showOtherProp = true;
          this.consumables = payload.data;
          if (this.consumables.length > 0) {
            this.showProduct = true;
          } else {
            this.showProduct = false;
          }
        });
      } else if (this.consumableSearch.value.length < 1) {
        this.canConfigure = false;
        this.consumableExist = false;
        this.showProduct = false;
        this.pdObserverService.setBaseUnitState(false);
        this.pdObserverService.setConfigContainerState(false);
      }
    });
    this.manufacturerSearch.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(query => {
      if (this.manufacturerSearch.value.length >= 3) {
          this.manufacturerService.find({
            query: {
              name: { $regex: query, $options: 'i' }
              }
          }).then(paydata => {
              this.manufacturers = paydata.data;
              if (this.manufacturers.length > 0) {
                  this.showManufacturers = true;
              }
          });
      } else if (this.manufacturerSearch.value.length < 1) {
        this.canConfigure = false;
        this.pdObserverService.setBaseUnitState(false);
        this.pdObserverService.setConfigContainerState(false);
      }
    });
    this.editableConfigSubscription = this.pdObserverService.editableConfigChanged.subscribe(data => {
      console.log(data);
      this.consumableSearch.setValue(data.productObject.name);
      if (data.ProductType === ProductType.Consumables) {
          this.consumableSearch.setValue(data.productObject.name);
          this.canConfigure = false;
          this.showOtherProp = false;
      }
});

  }
setSelectedProduct(option) {
    this.selectedConsumable.type = ProductType.Consumables;
    this.selectedConsumable = option;
    this.selectedConsumableName = option.STR;
    this.showProduct = false;
    this.showOtherProp = true;
    this.getConsumableConfigById(option._id);
  }
  onShowCategorySelect() {
    this.category_select = !this.category_select;
  }
  private getConsumableConfigById(id) {
    this.productService.findProductConfigs({
      query: {
        facilityId: this.currentFacility._id,
        productId: id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.consumableExist = true;
        this.showProduct = true;
        this.canConfigure = false;
        this.showOtherProp = true;
      } else {
        this.canConfigure = true;
        this.showProduct = false;
        this.showOtherProp = true;
        this.consumableExist = false;
      }
    });
  }
  setSelectedManufacturer(option) {
    this.selectedManufacturer = option;
    this.selectedManufacturerName = option.name;
    this.showManufacturers = false;
  }
  onClickConfigure() {
    const selectedConsumable = this.selectedConsumableName ? this.selectedConsumableName : this.consumableInputValue;
    if (this.selectedConsumableName !== '' || this.selectedConsumableName !== null) {
        if (!this.consumableExist && this.canConfigure && this.selectedManufacturer !== undefined && this.selectedCategory !== undefined) {
          const code = (Date.now().toString(36) + Math.random().toString(36).substr(2, 2)).toUpperCase();
          const consumable = {
              STR: selectedConsumable,
              MAT: this.selectedManufacturer.name,
              CODE: code,
              CONSUMABLECATEGORYID: this.selectedCategory.id
          };
          // persist the data to apmis-consumables
          this.productService.createApmisConsumable(consumable).then(payload => {
            this.selectedConsumable = {
              id: payload._id,
              code: payload.code,
              name: payload.STR,
              type: ProductType.Consumables
            };
            this.configProductBtn = 'Save Configuration';
            this.pdObserverService.setBaseUnitState(true);
            this.apmisFilterService.clearItemsStorage(true);
          });
        } else {
          this.systemModuleService.announceSweetProxy(
            'Consumable: Please check input fields.',
            'error', null, null, null, null, null, null, null
          );
        }
    } else {
      this.pdObserverService.setBaseUnitState(false);
    }
  }
  private getCategories() {
    this.productService.findConsumableCategories().then(payload => {
      this.categories = payload.data.map(({_id: id, name: label}) => ({id, label}));
    });
  }
  onSearchSelectedItems(data) {
    if (data.length > 0) {
      this.selectedCategory = data[0];
    }
  }
  onCreateNewItem(item) {
    if (item !== '' || item !== undefined) {
      const newPackSize = {
        name: item
      };
      this.productService.createConsumableCategory(newPackSize).then(payload => {
          this.getCategories();
      });
    }
  }
  onClickClose(val) {
      if (val) {
        this.category_select = !this.category_select;
      }
  }
  ngOnDestroy() {
    if (this.selectedCategory !== null) {
      this.apmisFilterService.clearItemsStorage(true);
    }
    if (this.editableConfigSubscription !== null) {
        this.editableConfigSubscription.unsubscribe();
    }
    // if (this.viewSubscription !== null) {
    //   this.viewSubscription.unsubscribe();
    // }
  }
}
