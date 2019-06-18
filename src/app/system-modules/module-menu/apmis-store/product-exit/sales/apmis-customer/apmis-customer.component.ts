import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-apmis-customer',
  templateUrl: './apmis-customer.component.html',
  styleUrls: ['./apmis-customer.component.scss']
})
export class ApmisCustomerComponent implements OnInit {

  clickItemIndex: number;
  expand_row = false;
  constructor() { }

  ngOnInit() {
  }


  item_to_show(i) {
		return this.clickItemIndex === i;
  }

  toggle_tr(itemIndex, direction) {
		if (direction === 'down' && itemIndex === this.clickItemIndex) {
			this.expand_row = false;
			this.clickItemIndex = -1;
		} else {
			this.clickItemIndex = itemIndex;
			this.expand_row = !this.expand_row;
		}
	}

}
