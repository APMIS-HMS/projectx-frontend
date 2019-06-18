import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductObserverService } from './../../../../../../../services/tools/product-observer.service';
import { ProductService } from './../../../../../../../services/facility-manager/setup/product.service';
import { ProductBase } from 'app/system-modules/module-menu/apmis-store/store-utils/global';

@Component({
  selector: 'app-base-unit',
  templateUrl: './base-unit.component.html',
  styleUrls: ['./base-unit.component.scss']
})
export class BaseUnitComponent implements OnInit, OnDestroy {
  baseUnitSubscription: Subscription;
  isBaseUnitSubscription: Subscription;
  preSelectedSubscription: Subscription;
  showDrugBaseUnit = false;
  apmisSearch = false;
  packSizes = [];
  preSelectedPackWithSizes = [];
  baseName = '';
  isBaseUnitSet = false;


  constructor(private productService: ProductService,
    private pdObserverService: ProductObserverService) {
     
     }
  ngOnInit() {
    
      this.baseUnitSubscription = this.pdObserverService.baseUnitChanged.subscribe(baseState => {
          this.showDrugBaseUnit = baseState;
      });
      this.isBaseUnitSubscription = this.pdObserverService.isBaseUnitChanged.subscribe((baseData: ProductBase) => {
        this.isBaseUnitSet = baseData.isBase;
        this.baseName = baseData.name;
    });
    this.preSelectedSubscription = this.pdObserverService.preSelectedChanged.subscribe(data => {
      this.preSelectedPackWithSizes = data;
    });
    this.getProductPackTypes();
  }
  onShowSearch() {
    this.apmisSearch = !this.apmisSearch;
  }
  private getProductPackTypes() {
    this.productService.findPackageSize({
      query: {
        $limit: false
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.packSizes = payload.data.map(({_id: id, name: label}) => ({id, label}));
      }
    });
  }
  onSearchSelectedItems(data) {
    if (this.preSelectedPackWithSizes.length > 0) {
      for (let i = 0; i < data.length; i++) {
        const found = this.preSelectedPackWithSizes.filter(x => x.packId === data[i].id);
        if (found.length > 0) {
          data[i].size = found[0].size;
        } else {}
       }
       // emit selected pack size to pack-size config component
       // emit updateSizeObj to whoever needs it
       this.pdObserverService.setSelectedPackSize(data);
       this.setBaseName(data);
       // this.setPackSizes(data);
       // this.updateSizePackObj = data;
    } else {
      // emit to pack-size component
      this.setBaseName(data);
      this.pdObserverService.setSelectedPackSize(data);
    }
  }
  private setBaseName(data) {
    if (data.length > 0) {
      this.isBaseUnitSet = true;
      this.baseName = data[0].label;
    }
  }
  onClickClose(val) {
    if (!val) {
        this.apmisSearch = !this.apmisSearch;
    }
  }
  onCreateNewItem(item) {
    if (item !== '' || item !== undefined) {
      const newPackSize = {
        name: item
      };
      this.productService.createPackageSize(newPackSize).then(payload => {
          this.getProductPackTypes();
      });
    }
  }
  ngOnDestroy() {
    
    if (this.baseUnitSubscription !== null) {
      this.baseUnitSubscription.unsubscribe();
    }
    if (this.isBaseUnitSubscription !== null) {
      this.isBaseUnitSubscription.unsubscribe();
    }
    if (this.preSelectedSubscription !== null) {
      this.preSelectedSubscription.unsubscribe();
    }
  }
}
