import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreEmitterService } from '../../../../services/facility-manager/store-emitter.service';
import { SupplierService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'app-supplier-manager',
	templateUrl: './supplier-manager.component.html',
	styleUrls: [ './supplier-manager.component.scss' ]
})
export class SupplierManagerComponent implements OnInit {
	newSupply = false;
	selectedFacility: any = <any>{};
	selectedSupplier: any = <any>{};
	searchControl = new FormControl();
	suppliers: any[] = [];
	loading = true;
	searchOpen = false;

	constructor(
		private router: Router,
		private _productEventEmitter: ProductEmitterService,
		private _systemModuleService: SystemModuleService,
		private supplierService: SupplierService,
		private locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this._productEventEmitter.setRouteUrl('Supplier Manager');
		this.getSuppliers();
		this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe((item) => {
			this.supplierService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						name: {
							$regex: this.searchControl.value,
							$options: 'i'
						}
					}
				})
				.then((res) => {
					this.loading = false;
					this.suppliers = res.data;
				});
		});
	}
	getSuppliers() {
		this.supplierService
			.find({ query: { facilityId: this.selectedFacility._id, isActive: true, $sort: { createdAt: -1 } } })
			.then(
				(res) => {
					this.loading = false;
					if (res.data.length > 0) {
						this.suppliers = res.data;
					}
				},
				(error) => {}
			);
	}
	onSelect(supplier) {
		this.router.navigate([ '/dashboard/product-manager/supplier-detail', supplier._id ]);
	}
	onEdit(supplier) {
		this.selectedSupplier = supplier;
		this._systemModuleService.announceSweetProxy('You are about to edit this supplier', 'question', this);
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}

	onDelete(supplier) {
		this.selectedSupplier = supplier;
		this.selectedSupplier.isActive = false;
		const text = `Are you sure you want to deactivate ${this.selectedSupplier.supplier.name} as your supplier?`;
		this._systemModuleService.announceSweetProxy(text, 'question', this);
	}

	sweetAlertCallback(result) {
		if (result.value) {
			this._systemModuleService.on();
			this.supplierService.patch(this.selectedSupplier._id, this.selectedSupplier).then(
				(callback_remove) => {
					const text = `${this.selectedSupplier.supplier.name} has been deactivated successfully.`;
					this._systemModuleService.announceSweetProxy(text, 'success');
					this._systemModuleService.off();
					this.selectedSupplier = <any>{};
					this.getSuppliers();
				},
				(error) => {
					this._systemModuleService.off();
				}
			);
		}
	}

	close_onClick(message: boolean): void {
		this.getSuppliers();
		this.selectedSupplier = <any>{};
		this.newSupply = false;
	}
	newSupplyShow() {
		this.newSupply = true;
	}
	onRefreshSupplier(value) {
		this.getSuppliers();
	}
	refresh(): void {
		// window.location.reload();
	}
}
