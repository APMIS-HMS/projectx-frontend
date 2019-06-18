import { ProductObserverService } from './../../../../../../services/tools/product-observer.service';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-config-product',
  templateUrl: './config-product.component.html',
  styleUrls: ['./config-product.component.scss']
})
export class ConfigProductComponent implements OnInit {

  selectedIndex: any;
  drugSearchEntry = false;
  consumableEntry= false;
  consumableSearch = new FormControl();
  // selectedToggleIndex = 0;
  toggleData = [];
  constructor(private pdObserverService: ProductObserverService
    ) { }

  ngOnInit() {
    this.toggleData = [{id: 0, name: 'Drugs'}, {id: 1, name: 'Consumable'}];
  }
  // private onToggle(selectedIndex) {
  //   console.log(selectedIndex);
  //   //this.selectedToggleIndex = selectedIndex;
  //   this.pdObserverService.setBaseUnitState(false);
  //   switch (selectedIndex) {
  //     case 0:
  //         this.drugSearchEntry = true;
  //         this.consumableEntry = false;
  //       break;
  //     case 1:
  //         this.consumableEntry = true;
  //         this.drugSearchEntry = false;
  //       break;
  //     default:
  //       break;
  //   }
  // }
  onShowDrugSearchEntry() {
    this.drugSearchEntry = true;
    this.consumableEntry = false;
  }
  onShowComsumableEntry() {
    this.drugSearchEntry = false;
    this.consumableEntry = true;
  }
  setSelectedIndex(i) {
    this.selectedIndex = i;
    this.onShowDrugSearchEntry();
  }
}
