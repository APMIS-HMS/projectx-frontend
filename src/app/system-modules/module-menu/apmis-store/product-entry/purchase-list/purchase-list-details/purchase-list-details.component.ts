import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-purchase-list-details',
	templateUrl: './purchase-list-details.component.html',
	styleUrls: [ './purchase-list-details.component.scss' ]
})
export class PurchaseListDetailsComponent implements OnInit {
	@Input() selectedPurchaseList;
	constructor() {}

	ngOnInit() {
		console.log(this.selectedPurchaseList);
	}
}
