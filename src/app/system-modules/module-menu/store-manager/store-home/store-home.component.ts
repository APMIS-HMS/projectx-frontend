import { Subscription, ISubscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import {
	InventoryService,
	ProductService,
	EmployeeService,
	FacilitiesService,
	StoreService,
	PurchaseOrderService,
	InventoryTransferService,
	InventoryTransferStatusService,
	ProductRequisitionService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Inventory, Employee, User } from '../../../../models/index';
import { IStoreSummaryItem } from './new-store-manager-components/store-summary-model';

@Component({
	selector: 'app-store-home',
	templateUrl: './store-home.component.html',
	styleUrls: [ './store-home.component.scss' ]
})
export class StoreHomeComponent implements OnInit, OnDestroy {
	inventories: any[] = [];
	purchaseOrders: any[] = [];
	transfers: any[] = [];
	checkingStore: any = <any>{};
	completedInventoryStatus: any = <any>{};
	rejectedInventoryStatus: any = <any>{};
	transferStatuses: any[] = [];
	requisitions: any[] = [];
	inventoryLoading = true;
	purchaseOrderLoading = true;
	transferLoading = true;
	modal_on = false;
	inventoryCount = 0;
	purchaseOrderCount = 0;
	transferCount = 0;
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	Ql_toggle = false;
	isRunningQuery = false;
	/*Alfred : Changed storeStatusLabel type from any to IStoreSummaryItem array*/
	storeStatusLabel: IStoreSummaryItem[] = [];

	subscription: ISubscription;
	showDialog = false;
	selectedItem: IStoreSummaryItem;

	constructor(
		private _inventoryService: InventoryService,
		private _purchaseOrderService: PurchaseOrderService,
		private _storeService: StoreService,
		private _facilityService: FacilitiesService,
		// private _productService: ProductService,
		private _inventoryTransferService: InventoryTransferService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private inventoryTransferStatusService: InventoryTransferStatusService,
		private productRequisitionService: ProductRequisitionService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						if (!this.isRunningQuery) {
							this.inventoryLoading = true;
							this.purchaseOrderLoading = true;
							this.transferLoading = true;
							this.inventories = [];
							this.transfers = [];
							this.purchaseOrders = [];
							this.isRunningQuery = true;
							this.getInventories();
							this.getPurchaseOrders();
							this.getTransfers();
							this.getTransferStatus();
							this.getInventoryBriefStatus();
						}
					}
				}
			}
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		const auth: any = this._locker.getObject('auth');
		// this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			// if (this.checkingStore !== null) {
			//   this.getInventories();
			// }
			if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
				this.modal_on = true;
			} else {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						let checkingObject = { typeObject: itemr, type: 'store' };
						// this._employeeService.announceCheckIn(checkingObject);

						// tslint:disable-next-line:no-shadowed-variable
						this._employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							// tslint:disable-next-line:no-shadowed-variable
							.then((payload) => {
								this.loginEmployee = payload;
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
							// tslint:disable-next-line:no-shadowed-variable
							this._employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								// tslint:disable-next-line:no-shadowed-variable
								.then((payload) => {
									this.loginEmployee = payload;
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

	ngOnInit() {}

	getInventoryBriefStatus() {
		this._inventoryService
			.getInventoryBriefStatus('30', {
				query: { storeId: this.checkingStore.storeId }
			})
			.then((payload) => {
				this.transformStoreSummaryData(payload);
				this._inventoryService.getInventoryBriefStatus(this.checkingStore.storeId, {}).then((res) => {
					// this.transformStoreSummaryData(res);
				});
			});
	}

	private transformStoreSummaryData(payload) {
		if (payload.status === 'success') {
			// loop
			payload.data.forEach((obj) => {
				this.storeStatusLabel.push({
					key: obj.key,
					value: obj.batches ? obj.batches : obj.total,
					tag: obj.total ? 'total-items' : '',
					tagColor: obj.hex, // '#4fdc28'
					relativeUrl: obj.url
				});
			});
		}
	}

	getInventories() {
		if (!!this.checkingStore) {
			this._inventoryService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						availableQuantity: { $gt: 0 },
						$sort: { updatedAt: -1 }
					}
				})
				.then((res) => {
					this.inventoryLoading = false;
					this.inventoryCount = res.total;
					this.inventories = res.data;
					this.isRunningQuery = false;
				});
		}
	}

	getRequisitions() {
		let storeId = this.checkingStore.storeId;
		if (storeId === undefined) {
			storeId = this.checkingStore.typeObject.storeId;
		}
		this.productRequisitionService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					destinationStoreId: storeId
				}
			})
			.then((payload) => {
				this.requisitions = payload.data;
			});
	}

	getPurchaseOrders() {
		if (!!this.checkingStore) {
			this._purchaseOrderService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						isActive: true,
						$sort: { updatedAt: -1 }
					}
				})
				.then((res) => {
					this.purchaseOrderLoading = false;
					if (!!res.data && res.data.length > 0) {
						this.purchaseOrderCount = res.total;
						this.purchaseOrders = res.data;
					}
				})
				.catch((err) => {});
		}
	}

	getTransfers() {
		if (!!this.checkingStore) {
			this.productRequisitionService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						destinationStoreId: this.checkingStore.storeId,
						$sort: { updatedAt: -1 }
					}
				})
				.then((res) => {
					this.transferLoading = false;
					if (!!res.data && res.data.length > 0) {
						this.transferCount = res.total;
						this.requisitions = res.data;
					}
				});
		}
	}

	getTransferStatus() {
		this.inventoryTransferStatusService.findAll().subscribe((payload) => {
			this.transferStatuses = payload.data;
			this.transferStatuses.forEach((item, i) => {
				if (item.name === 'Completed') {
					this.completedInventoryStatus = item;
				}
				if (item.name === 'Rejected') {
					this.rejectedInventoryStatus = item;
				}
			});
		});
	}

	getStatus(transaction) {
		const receivedTransactions = transaction.inventoryTransferTransactions.filter(
			(item) => item.transferStatusId === this.completedInventoryStatus._id
		);
		if (receivedTransactions.length === transaction.inventoryTransferTransactions.length) {
			return this.completedInventoryStatus.name;
		}

		const rejectedTransactions = transaction.inventoryTransferTransactions.filter(
			(item) => item.transferStatusId === this.rejectedInventoryStatus._id
		);
		if (rejectedTransactions.length === transaction.inventoryTransferTransactions.length) {
			return this.rejectedInventoryStatus.name;
		}
		return 'Pending';
	}

	getMostRescentBatchNo(batch) {
		if (batch.transactions.length > 0) {
			return batch.transactions[batch.transactions.length - 1].batchNumber;
		} else {
			return '';
		}
	}

	onChangeCheckedIn() {
		this.modal_on = true;
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	toggleQl() {
		this.Ql_toggle = !this.Ql_toggle;
	}

	ngOnDestroy() {
		if (this.loginEmployee.storeCheckIn !== undefined) {
			this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this._employeeService.update(this.loginEmployee).then((payload) => {
						this.loginEmployee = payload;
					});
				}
			});
		}
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}

	logCurrentSelectedItem(item: IStoreSummaryItem) {
		this.selectedItem = item;
		this.showDialog = true;
		if (item.tag === 'total-items') {
			this._inventoryService.getInventoryCountDetails(this.checkingStore.storeId).then((response) => {});
		}
	}
	getPropFromArray(data: any, prop): any {
		const result = data.map((a) => a[prop]);
		return result;
	}
}
