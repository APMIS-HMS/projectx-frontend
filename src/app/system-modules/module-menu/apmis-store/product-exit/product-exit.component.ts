import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-product-exit',
  templateUrl: './product-exit.component.html',
  styleUrls: ['./product-exit.component.scss']
})
export class ProductExitComponent implements OnInit {


  tab_sales = true;
  tab_customers = false;
  tab_refund = false;

  constructor() { }

  ngOnInit() {
  }

  
  tab_click(tab) {
    if (tab === 'sales') {  
      this.tab_sales = true;
      this.tab_customers = false;
      this.tab_refund = false;
    } else if ( tab === 'customers') { 
      this.tab_sales = false;
      this.tab_customers = true;
      this.tab_refund = false;
    } else if ( tab === 'refund') { 
      this.tab_sales = false;
      this.tab_customers = false;
      this.tab_refund = true;
    }
  }

}
