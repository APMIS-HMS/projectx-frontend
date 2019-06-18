import { Component, EventEmitter, OnInit, Output } from '@angular/core';



@Component({
  selector: 'app-product-entry',
  templateUrl: './product-entry.component.html',
  styleUrls: ['./product-entry.component.scss']
})
export class ProductEntryComponent implements OnInit {

  tab_initialize_store = true;
  tab_invoice_entry = false;
  tab_purchase_list = false;
  tab_purchase_order = false;
  tab_supplier = false;


  constructor() { }

  ngOnInit() {
  }

  tab_click(tab) {
    if (tab === 'initializeStore') {
      this.tab_initialize_store = true;
      this.tab_invoice_entry = false;
      this.tab_purchase_list = false;
      this.tab_purchase_order = false;
      this.tab_supplier = false;
    } else if ( tab === 'invoiceEntry') { 
      this.tab_initialize_store = false;
      this.tab_invoice_entry = true;
      this.tab_purchase_list = false;
      this. tab_purchase_order = false;
      this.tab_supplier = false;
    } else if ( tab === 'purchaseList') {
      this.tab_initialize_store = false;
      this.tab_invoice_entry = false;
      this.tab_purchase_list = true;
      this.tab_purchase_order = false;
      this.tab_supplier = false;
    } else if ( tab === 'purchaseOrder') {
      this.tab_initialize_store = false;
      this.tab_invoice_entry = false;
      this.tab_purchase_list = false;
      this.tab_purchase_order = true;
      this.tab_supplier = false;
    } else if ( tab === 'suppliers') {
      this.tab_initialize_store = false;
      this.tab_invoice_entry = false;
      this.tab_purchase_list = false;
      this.tab_purchase_order = false;
      this.tab_supplier = true;
    }
  }

}
