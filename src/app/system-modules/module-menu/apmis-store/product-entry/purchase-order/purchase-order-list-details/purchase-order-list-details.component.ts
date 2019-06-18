import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-purchase-order-list-details',
	templateUrl: './purchase-order-list-details.component.html',
	styleUrls: [ './purchase-order-list-details.component.scss' ]
})
export class PurchaseOrderListDetailsComponent implements OnInit {
	@Input() selectedOrder;
	constructor() {}

	ngOnInit() {}
}
