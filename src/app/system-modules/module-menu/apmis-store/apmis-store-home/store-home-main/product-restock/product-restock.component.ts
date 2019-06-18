import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-product-restock',
	templateUrl: './product-restock.component.html',
	styleUrls: [ './product-restock.component.scss' ]
})
export class ProductRestockComponent implements OnInit {
	clickItemIndex: number;
	expand_row = false;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	packTypes = [ { id: 1, name: 'Sachet' }, { id: 2, name: 'Cartoon' } ];
	storeId: string;
	selectedFacility: any;
	products: any = [];

	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.storeId = '5a88a0d26e6d17335cf318bc';
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getOutOfStockInventoryList();
	}

	getOutOfStockInventoryList() {
		this._inventoryService.getOutOfStockDetails(this.storeId, this.limit, this.skip).then(
			(payload) => {
				this.products = payload.data.data;
				this.numberOfPages = payload.data.data.total / this.limit;
				this.total = payload.data.data.total;
			},
			(error) => {}
		);
	}

	loadCurrentPage(event) {
		this.skip = event;
	}

	item_to_show(i) {
		// if (this.expand_row) {
		// 	return this.clickItemIndex === i;
		// }
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
