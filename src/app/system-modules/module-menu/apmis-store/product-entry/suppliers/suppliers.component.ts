import { FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {
	SupplierService,
	PurchaseEntryService,
	InventoryInitialiserService,
	InventoryService,
	EmployeeService,
	PurchaseOrderService
} from 'app/services/facility-manager/setup';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-suppliers',
	templateUrl: './suppliers.component.html',
	styleUrls: [ './suppliers.component.scss' ]
})
export class SuppliersComponent implements OnInit {
	showViewInvoice = false;
	showNewSupplier = false;
	main_content = true;
	selectedFacility: any;
	suppliers: any[] = [];
	selectedSupplier: any;
	fromDate: FormControl;
	toDate: FormControl;
	pendingFromDate: FormControl;
	pendingToDate: FormControl;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	invoices: any;
	loginEmployee: any;
	checkingObject: { typeObject: any; type: string };
	subscription: Subscription;
	selectedInvoice: any;
	invoiceProduct: any;
	orders: any;
	constructor(
		private supplierService: SupplierService,
		private _locker: CoolLocalStorage,
		private _invoiceEntryService: PurchaseEntryService,
		private authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService,
		private employeeService: EmployeeService,
		private _purchaseOrderService: PurchaseOrderService,
		private _inventoryService: InventoryService
	) {
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingObject = res.typeObject;
				}
			}
		});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			if (this.loginEmployee.storeCheckIn !== undefined || this.loginEmployee.storeCheckIn.length > 0) {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						this.checkingObject = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingObject);

						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload2) => {
								this.loginEmployee = payload2;
								this.checkingObject = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn(this.checkingObject);
								this._locker.setObject('checkingObject', this.checkingObject);
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this.employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload3) => {
									this.loginEmployee = payload3;
									this.checkingObject = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkingObject);
									this._locker.setObject('checkingObject', this.checkingObject);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this.fromDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.toDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.pendingFromDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.pendingToDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
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
					this.suppliers = payload.data;
					// .map((c) => {
					//   return { id: c._id, label: c.supplier.name };
					// });
				},
				(error) => {}
			);
	}

	close_onClick(e) {
		this.showViewInvoice = false;
	}

	viewInvoice(invoice: any) {
		this.selectedInvoice = invoice;
		this._invoiceEntryService
			.get(invoice._id, {
				query: {
					$select: [ 'products', 'transactions' ]
				}
			})
			.then(
				(payload) => {
					console.log(payload);
					this.invoiceProduct = payload;
					this.showViewInvoice = true;
				},
				(error) => {
					console.log(error);
				}
			);
	}

	onShowNewSupplier() {
		this.showNewSupplier = true;
		this.main_content = false;
	}

	onSearchSelectedItems(data) {
		if (data.length > 0) {
			// this.isBaseUnitSet = true;
			// this.showConfigContainer = true;
			// this.showSaveConfig = false;
			// // TODO: Send base name from parent to child component
			// this.baseName = data[0].label;
			// this.basePackType = data[0];
			// this.selectedPackSizes = [...data];
			// this.packConfigurations = [...data];
			// this.packConfigurations.splice(0, 1);
			// if (this.packConfigurations.length > 0) { this.showSaveConfig = true; }
		}
	}

	onCreateNewItem(item) {
		if (item !== '' || item !== undefined) {
			const newPackSize = {
				name: item
			};
			// this.productService.createPackageSize(newPackSize).then(payload => {
			//   this.getProductPackTypes();
			// });
		}
	}

	loadCurrentPage(event) {
		if (event.index === -1) {
			this.onShowNewSupplier();
		} else {
			this.selectedSupplier = event.supplier;
			this.showNewSupplier = false;
			this.main_content = true;
			this.getInvoices();
			this.getPurchaseOrders();
		}
	}

	getInvoices() {
		this._invoiceEntryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					supplierId: this.selectedSupplier._id,
					$select: [
						'amountPaid',
						'createdAt',
						'facilityId',
						'invoiceAmount',
						'invoiceNumber',
						'paymentCompleted',
						'storeId',
						'supplierId'
					],
					$limit: this.limit,
					$skip: this.skip * this.limit
				}
			})
			.then(
				(payload) => {
					this.invoices = payload.data;
					console.log(payload);
					this.total = payload.total;
				},
				(error) => {
					console.log(error);
				}
			);
	}

	getPurchaseOrders() {
		this._purchaseOrderService
			.find({
				query: {
					supplierId: this.selectedSupplier._id,
					$select: [ 'createdAt', 'isSupplied' ]
				}
			})
			.then(
				(payload) => {
					this.orders = payload.data;
					console.log(payload);
				},
				(error) => {
					console.log(error);
				}
			);
	}
}
