import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProductService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-configured-products',
	templateUrl: './configured-products.component.html',
	styleUrls: [ './configured-products.component.scss' ]
})
export class ConfiguredProductsComponent implements OnInit {
	searchControl = new FormControl();
	selectedFacility: any = {};
	productConfigList = [];
	isEdit = false;
	productConfigItem: any = {};

	constructor(
		private productService: ProductService,
		private locker: CoolLocalStorage,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.selectedFacility = <any>this.locker.getObject('selectedFacility');
		this.getProductConfig();
	}

	getProductConfig() {
		this.systemModuleService.on();
		this.productService
			.findProductConfigs({
				query: {
					facilityId: this.selectedFacility._id,
					$sort: { updatedAt: -1 },
					$limit: false
				}
			})
			.then(
				(payload) => {
					this.systemModuleService.off();
					if (payload.data.length > 0) {
						this.productConfigList = payload.data;
					}
				},
				(err) => {
					this.systemModuleService.off();
				}
			);
	}
	onEditConfig(item) {
		this.isEdit = !this.isEdit;
		this.productConfigItem = item;
	}
}
