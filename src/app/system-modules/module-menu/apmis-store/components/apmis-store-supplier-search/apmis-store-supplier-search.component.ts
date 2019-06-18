import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SupplierService } from 'app/services/facility-manager/setup';
import { Facility } from 'app/models';

@Component({
	selector: 'app-apmis-store-supplier-search',
	templateUrl: './apmis-store-supplier-search.component.html',
	styleUrls: [ './apmis-store-supplier-search.component.scss' ]
})
export class ApmisStoreSupplierSearchComponent implements OnInit {
	@Output() emitCurrentPage: EventEmitter<any> = new EventEmitter<any>();

	selectedFacility: any;
	suppliers: any[] = [];
	selectedIndex: any;

	constructor(private supplierService: SupplierService, private _locker: CoolLocalStorage) {
		this.supplierService.listenerCreate.subscribe((payload) => {
			console.log(payload);
			this.getSuppliers();
		});
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getSuppliers();
	}

	getSuppliers() {
		this.supplierService
			.find({
				query: {
					facilityId: this.selectedFacility._id
				}
			})
			.then(
				(payload) => {
					console.log(payload);
					this.suppliers = payload.data;
					console.log(this.suppliers);
				},
				(error) => {}
			);
	}
	setSelectedIndex(i, supplier?) {
		this.selectedIndex = i;
		this.emitCurrentPage.emit({ index: i, supplier: supplier });
	}
}
