import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreGlobalUtilService } from '../store-utils/global-service';
import { Filters } from '../store-utils/global';

@Component({
  selector: 'app-apmis-store-product',
  templateUrl: './apmis-store-product.component.html',
  styleUrls: ['./apmis-store-product.component.scss']
})
export class ApmisStoreProductComponent implements OnInit {

  showAdjustStock = false;
  tab_all_products = true;
  tab_product_config = false;
  storeFilters = [];
  selectedFilterIndex = 0;
  filterType = '';
  constructor(private storeUtilService: StoreGlobalUtilService) { }

  ngOnInit() {
    this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
  }
  tab_click(tab) {
    if (tab === 'products') {
      this.tab_all_products = true;
      this.tab_product_config = false;
    } else if ( tab === 'productConfig') {
      this.tab_all_products = false;
      this.tab_product_config = true;
    }
  }
  setSelectedFilter(index, filter) {
      this.selectedFilterIndex = index;
      this.filterType = filter;
      //console.log(this.filterText);
  }
}


