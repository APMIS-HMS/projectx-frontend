import {
	PurchaseEntryService,
	EmployeeService,
	ProductService,
	SupplierService,
	InventoryService,
	PurchaseOrderService
} from 'app/services/facility-manager/setup';
import { ApmisFilterBadgeService } from 'app/services/tools';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreGlobalUtilService } from '../../store-utils/global-service';
import { Filters } from '../../store-utils/global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Subscription } from 'rxjs/Subscription';
import { Facility } from 'app/models';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-invoice-entry',
	templateUrl: './invoice-entry.component.html',
	styleUrls: [ './invoice-entry.component.scss' ]
})
export class InvoiceEntryComponent implements OnInit {
	InvoiceEntryLanding = true;
	showViewInvoice = false;
	loginEmployee: any;
	subscription: Subscription;
	checkingStore: any;
	selectedFacility: any;
	storeFilters: any[];
	invoices: any[] = [];
	limit = APMIS_STORE_PAGINATION_LIMIT;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	invoiceProduct: any;
	selectedInvoice: any;

	constructor(
		private _invoiceEntryService: PurchaseEntryService,
		private storeUtilService: StoreGlobalUtilService,
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private _productService: ProductService,
		private supplierService: SupplierService,
		private apmisFilterService: ApmisFilterBadgeService,
		private systemModuleService: SystemModuleService,
		private purchaseListService: PurchaseOrderService
	) {
		this.apmisFilterService.clearItemsStorage(true);
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this._locker.setObject('checkingObject', this.checkingStore);
					}
				}
			}
		});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
				// this.modal_on = true;
			} else {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						let checkingObject = { typeObject: itemr, type: 'store' };
						this._employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload2) => {
								this.loginEmployee = payload2;
								checkingObject = { typeObject: itemr, type: 'store' };
								this._employeeService.announceCheckIn(checkingObject);
								this._locker.setObject('checkingObject', checkingObject);
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this._employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload2) => {
									this.loginEmployee = payload2;
									const checkingObject = { typeObject: itemr, type: 'store' };
									this._employeeService.announceCheckIn(checkingObject);
									this._locker.setObject('checkingObject', checkingObject);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		//this.getInvoices();
	}

	getInvoices() {
		this._invoiceEntryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
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
					this.total = payload.total;
				},
				(error) => {
					console.log(error);
				}
			);
	}
	toggleView() {
		this.InvoiceEntryLanding = !this.InvoiceEntryLanding;
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

	loadCurrentPage(event) {
		this.skip = event;
	}
}
