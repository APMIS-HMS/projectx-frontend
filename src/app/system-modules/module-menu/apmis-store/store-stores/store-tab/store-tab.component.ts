import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';
import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { Facility } from 'app/models';

@Component({
	selector: 'app-store-tab',
	templateUrl: './store-tab.component.html',
	styleUrls: [ './store-tab.component.scss' ]
})
export class StoreTabComponent implements OnInit {

	enableEdit = false;
	editDone = true;
	showProductConfiguration = false;
	@Input() locationId: any = <any>{};
	@Input() minorLocationId: any = <any>{};
	selectedFacility: any;
	stores: any = [];
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	constructor(private _storeService: StoreService, private _locker: CoolLocalStorage) {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this._storeService.store$.subscribe((minorLocationId) => {
			this.getStores(this.selectedFacility._id, minorLocationId);
		});
	}

	ngOnInit() {
		this.getStores(this.selectedFacility._id);
	}

	getStores(facilityId, minorLocationId?) {
		this._storeService
			.getStoreList({
				query: {
					facilityId: facilityId,
					minorLocationId: minorLocationId,
					$limit: this.limit,
					$skip: this.skip * this.limit
				}
			})
			.then(
				(payload) => {
					this.stores = payload.data.data;
					this.numberOfPages = this.stores.length / this.limit;
					this.total = payload.data.total;
				},
				(error) => {}
			);
	}
	loadCurrentPage(event) {
		this.skip = event;
		this.getStores(this.selectedFacility._id);
	}

	onEdit(){
		this.enableEdit = true;
		this.editDone = false;
	}

	onDoneEdit(){
		this.enableEdit = false;
		this.editDone = true;
	}

	onShowProductConfiguration(){
		this.showProductConfiguration = true;
	}
	
	close_onClick(e) {		
		this.showProductConfiguration = false;
	}

}
