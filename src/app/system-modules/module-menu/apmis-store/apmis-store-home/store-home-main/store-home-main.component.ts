import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-store-home-main',
	templateUrl: './store-home-main.component.html',
	styleUrls: [ './store-home-main.component.scss' ]
})
export class StoreHomeMainComponent implements OnInit {
	tab_all_products = true;
	tab_expiring = false;
	tab_expired = false;
	tab_requisition = false;
	tab_restock_level = false;

	constructor() {}

	ngOnInit() {}

	tab_click(tab) {
		if (tab === 'products') {
			this.tab_all_products = true;
			this.tab_expiring = false;
			this.tab_expired = false;
			this.tab_requisition = false;
			this.tab_restock_level = false;
		} else if (tab === 'expiring') {
			this.tab_all_products = false;
			this.tab_expiring = true;
			this.tab_expired = false;
			this.tab_requisition = false;
			this.tab_restock_level = false;
		} else if (tab === 'expired') {
			this.tab_all_products = false;
			this.tab_expiring = false;
			this.tab_expired = true;
			this.tab_requisition = false;
			this.tab_restock_level = false;
		} else if (tab === 'requisition') {
			this.tab_all_products = false;
			this.tab_expiring = false;
			this.tab_expired = false;
			this.tab_requisition = true;
			this.tab_restock_level = false;
		} else if (tab === 'restock') {
			this.tab_all_products = false;
			this.tab_expiring = false;
			this.tab_expired = false;
			this.tab_requisition = false;
			this.tab_restock_level = true;
		}
	}
}
