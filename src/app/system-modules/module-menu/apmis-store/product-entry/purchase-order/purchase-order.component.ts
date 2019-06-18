import { Component, OnInit } from '@angular/core';
import { Employee, Facility } from 'app/models';
import { StoreGlobalUtilService } from '../../store-utils/global-service';
import { InventoryService, EmployeeService, PurchaseOrderService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Subscription } from 'rxjs/Subscription';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-purchase-order',
	templateUrl: './purchase-order.component.html',
	styleUrls: [ './purchase-order.component.scss' ]
})
export class PurchaseOrderComponent implements OnInit {
	purchaseOrderList = true;
	newPurcaseOrderList = false;
	purchaseOrderListDetails = false;
	back_to_purchaseOrderList = false;

	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	selectedProductName: any;
	showProduct: boolean;
	searchHasBeenDone = false;
	selectedProduct: any;
	productConfigs: any[] = [];
	selectedProducts: any[] = [];
	suppliers: any[] = [];
	selectedSuppliers: any[] = [];
	selectedLocalStorageSuppliers: any[] = [];
	supplierSearchResult: any[] = [];
	purchaseOrderCollection: any;
	subscription: Subscription;
	checkingStore: any = <any>{};
	selectedFacility: any;
	selectedOrder: any;
	constructor(
		private storeUtilService: StoreGlobalUtilService,
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService,
		private purchaseOrderService: PurchaseOrderService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this._locker.setObject('checkingObject', this.checkingStore);
						this.getSupplierPurchaseList();
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
		this.checkingStore = (<any>this._locker.getObject('checkingObject')).typeObject;
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
	}

	getSupplierPurchaseList() {
		this.purchaseOrderService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.checkingStore.storeId,
					$select: [
						'_id',
						'purchaseOrderNumber',
						'orderedProducts',
						'supplierId',
						'facilityId',
						'storeId',
						'createdAt',
						'isSupplied'
					]
				}
			})
			.then((payload) => {
				this.purchaseOrderCollection = payload.data;
			});
	}

	backPurchaseOrderList() {
		this.purchaseOrderList = true;
		this.newPurcaseOrderList = false;
		this.purchaseOrderListDetails = false;
		this.back_to_purchaseOrderList = false;
	}

	showNewPurchaseOrderList() {
		this.purchaseOrderList = false;
		this.newPurcaseOrderList = true;
		this.purchaseOrderListDetails = false;
		this.back_to_purchaseOrderList = true;
	}

	showPurchaseOrderListDetail(order) {
		this.selectedOrder = order;
		this.purchaseOrderList = false;
		this.newPurcaseOrderList = false;
		this.purchaseOrderListDetails = true;
		this.back_to_purchaseOrderList = true;
	}
}
