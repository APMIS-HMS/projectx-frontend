import { SystemModuleService } from './../../../../../../../services/module-manager/setup/system-module.service';
import { ApmisFilterBadgeService } from './../../../../../../../services/tools/apmis-filter-badge.service';
import { Component, OnInit, OnDestroy, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ProductObserverService } from './../../../../../../../services/tools/product-observer.service';
import { ProductService } from './../../../../../../../services/facility-manager/setup/product.service';
import { Subscription } from 'rxjs/Subscription';
import { ProductPackSize, StoreProduct, ProductConfig,
  ProductBase } from 'app/system-modules/module-menu/apmis-store/store-utils/global';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Component({
  selector: 'app-config-container',
  templateUrl: './config-container.component.html',
  styleUrls: ['./config-container.component.scss']
})
export class ConfigContainerComponent implements OnInit, OnDestroy {
  packSizeSubscription: Subscription;
  configContainerSubscription: Subscription;
  editableConfigSubscription: Subscription;
  packConfigurations: ProductPackSize[] = [];
  selectedPackSizes = [];
  showSaveConfig = false;
  productExist: boolean;
  @Input() btnName = '';
  baseName = '';
  @Input() selectedProduct: StoreProduct;
  showConfigContainer = false;
  modifiedPackSizes = [];
  updateObj = [];
  updateSizePackObj = [];
  sizeIsEdited = false;
  isSaving = false;
  preSelectedPackWithSizes = [];
  currentFacility: Facility = <Facility>{};
  baseProp: ProductBase = <ProductBase>{};
  productConfigId = '';
  Nodata:any={};

  constructor(private productService: ProductService,
    private pdObserverService: ProductObserverService,
    private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage,
    private apmisFilterService: ApmisFilterBadgeService) { }

  ngOnInit() {
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.packSizeSubscription = this.pdObserverService.selectedPackSizeChanged.subscribe((data: ProductPackSize[]) => {
        
       //console.log(data);
        if (data.length > 0) {
          this.updateSizePackObj = data;
          this.setPackSizes(data);
        }
    });
    this.configContainerSubscription = this.pdObserverService.configContainerChanged.subscribe(show => {
      this.showConfigContainer = show;
    });
    this.editableConfigSubscription = this.pdObserverService.editableConfigChanged.subscribe(data => {
        this.productConfigId = data._id;
        this.btnName = 'Edit Configuration';
        this.emitpackSizes(data);
        this.getProductById(data);
        if (this.sizeIsEdited) {
          this.pdObserverService.setPreselectedProduct(this.modifiedPackSizes);
        } else {
          const prodName = data.productObject.name;
          this.pdObserverService.setProductName(prodName);
          this.pdObserverService.setPreselectedProduct(data.packSizes);
        }
    });
  }
  private setPackSizes(data) {
    if (data.length > 0) {
      this.baseProp = {
        isBase: true,
        name: data[0].label
      };
      this.baseName = data[0].label;
      this.pdObserverService.setIsBaseUnit(this.baseProp);
      this.selectedPackSizes = [...data];
      this.packConfigurations = [...data];
      this.packConfigurations.splice(0, 1);
      if (this.packConfigurations.length > 0) {
        this.showConfigContainer = true;
        this.pdObserverService.setBaseUnitState(true);
         this.showSaveConfig = true;
        }
    } else {
      this.baseProp = {
        isBase: false,
        name: ''
      };
      this.pdObserverService.setIsBaseUnit(this.baseProp);
      this.pdObserverService.setBaseUnitState(false);
      this.showSaveConfig = false;
    }
  }
  private getProductById(data) {
    if (data.productObject.name === undefined) {
          this.systemModuleService.announceSweetProxy(
            'Product: Unable to fetch data. Please try again.',
            'error', null, null, null, null, null, null, null
          );
          this.showConfigContainer = false;
          this.showSaveConfig = false;
          this.pdObserverService.setBaseUnitState(false);
          this.baseName = '';
    } else {
          this.selectedProduct = data.productObject;
          this.transformIncomingPackSizes(data.packSizes);
    }
  }
  private emitpackSizes(data) {
    const genericPackSizes = data.packSizes
    .map(({packId: id, name: label}) => ({id, label}));
    this.apmisFilterService.edit(true, genericPackSizes);
  }
  private transformIncomingPackSizes(data) {
    const editable = data
    .map(({packId: id, name: label, size: size}) => ({id, label, size}));
    this.setPackSizes(editable);
  }
  onClickBtn() {
    // This is checking if the user has entered sizes for selected pack sizes
    const isInputValid = this.InputValidationForPackSizes(this.selectedPackSizes);
    if (this.btnName === 'Save Configuration') {
        if (this.selectedProduct.id !== '' || this.selectedProduct.id !== undefined) {
          if (this.productExist) {
            // this disallows multiple saves
              this.showConfigContainer = false;
              this.pdObserverService.setBaseUnitState(false);
              this.showSaveConfig = false;
          } else {
              if (isInputValid) {
                this.isSaving = true;
                this.btnName = 'Processing...';
                this.modifyPackSizes(this.selectedPackSizes);
                const newProductConfig: ProductConfig = {
                  productId: this.selectedProduct.id,
                  facilityId: this.currentFacility._id,
                  productObject: this.selectedProduct,
                  rxCode: this.selectedProduct.code,
                  productType: this.selectedProduct.type,
                  packSizes: this.modifiedPackSizes
              };
              this.productService.createProductConfig(newProductConfig).then(payload => {
                this.isSaving = false;
                this.btnName = 'Save Configuration';
                this.productExist = true;
                this.productService.productConfigAnnounced(payload);
                this.apmisFilterService.clearItemsStorage(true);
            }, err => {
                this.productExist = false;
                this.systemModuleService.announceSweetProxy(
                'Product: An error occured while saving product configuration.',
                'error', null, null, null, null, null, null, null
              );
                this.isSaving = false;
                this.btnName = 'Save Configuration';
              });
              } else {
                this.isSaving = false;
                this.btnName = 'Save Configuration';
                this.showConfigContainer = true;
                this.systemModuleService.announceSweetProxy(
                  'Product: Please enter size for all product pack.',
                  'error', null, null, null, null, null, null, null
                );
              }
          }
        } else {
          // selected id is null
        }
    } else if (this.btnName === 'Edit Configuration') {
      if (isInputValid) {
        this.isSaving = true;
        this.btnName = 'Processing...';
        this.updateObj = this.updateSizePackObj.length > 0 ? this.updateSizePackObj : this.selectedPackSizes;
        this.modifyPackSizes(this.updateObj);
        this.productService.patchProductConfig(this.productConfigId,
          {packSizes: this.modifiedPackSizes}, {}).then(payload => {
          this.isSaving = false;
          this.btnName = 'Edit Configuration';
          this.sizeIsEdited = true;
          this.productService.productConfigUpdateAnnounced(payload);
          this.apmisFilterService.clearItemsStorage(true);
        }, err => {
            this.btnName = 'Edit Configuration';
            this.isSaving = false;
        });
      } else {
        this.isSaving = false;
        this.btnName = 'Edit Configuration';
        this.showConfigContainer = true;
        this.systemModuleService.announceSweetProxy(
          'Product: Please enter size for all product pack.',
          'error', null, null, null, null, null, null, null
        );
      }
    }
  }
  private InputValidationForPackSizes(data): boolean {
    data[0].size = 1;
    for (let i = 0; i < data.length; i++) {
        if (!data[i].hasOwnProperty('size')) {
          return false;
        }
    } return true;
  }
  private modifyPackSizes(packs) {
    this.modifiedPackSizes = [];
    if (packs.length > 1) {
      const selected = packs.map(({id: packId, label: name, size: size}) => ({packId, name, size}));
        for (let i = 0; i < selected.length; i++) {
            if ( i === 0) {
              selected[i].isBase = true;
              selected[i].size = 1;
              } else { selected[i].isBase = false; }
            this.modifiedPackSizes.push(selected[i]);
        }
        return this.modifiedPackSizes;
    }
  }
  ngOnDestroy() {
    if (this.packSizeSubscription !== null) {
      this.packSizeSubscription.unsubscribe();
    }
    if (this.configContainerSubscription !== null) {
      this.configContainerSubscription.unsubscribe();
    }
    if (this.editableConfigSubscription !== null) {
      this.editableConfigSubscription.unsubscribe();
    }
    this.apmisFilterService.clearItemsStorage(true);
  }
  cancel(){
    this.Nodata = {
      packSizes: [],
      productObject: {
              name: '',
              id: '',
              code: ''
              },
      productType: 0,
    };
   // this.pdObserverService.setSelectedProduct(this.Nodata);
    const prodName = '';
    //this.pdObserverService.setProductName(prodName);
    this.pdObserverService.setConfigDataToEdit(this.Nodata);
    this.selectedPackSizes = [];
 
    //this.showConfigContainer=!this.showConfigContainer;
    //this.apmisFilterService.clearItemsStorage(true);
    
  }
}
