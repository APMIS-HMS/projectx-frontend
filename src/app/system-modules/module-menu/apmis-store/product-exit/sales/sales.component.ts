import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  selectedIndex: any;
  selectedToggleIndex = 0;
  toggleData = [];

  showCashCustomer = true;
  showAPMIScustomer= false;
  constructor() { }

  ngOnInit() {
    this.toggleData = [{id: 1, name: 'Cash Customer'}, { id: 2, name: 'APMIS Customer'}];
    this.onToggle(this.selectedToggleIndex);
  }

  onToggle(index) {
    this.selectedToggleIndex = index;
    switch (index) {
        case 0:
        this.showCashCustomer = true;
        this.showAPMIScustomer= false;
          break;
        case 1:
        this.showCashCustomer = false;
        this.showAPMIScustomer= true;
          break;
        default:
          break;
    }
  }

  onShowCashCustomer(){
    this.showCashCustomer = true;
    this.showAPMIScustomer= false;
  }

  onShowAPMISCustomer(){
    this.showCashCustomer = false;
    this.showAPMIScustomer= true;
  }
 

  setSelectedIndex(i) {
    this.selectedIndex = i;
    this.onShowCashCustomer();
	}
}

