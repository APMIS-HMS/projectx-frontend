import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import {
	InventoryService,
	InventoryTransferService,
	InventoryTransferStatusService,
	InventoryTransactionTypeService,
	StoreService,
	EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import {
	Facility,
	InventoryTransferStatus,
	InventoryTransactionType,
	InventoryTransferTransaction,
	InventoryTransfer,
	Employee
} from '../../../../models/index';
@Component({
	selector: 'app-stock-history',
	templateUrl: './stock-history.component.html',
	styleUrls: [ './stock-history.component.scss' ]
})
export class StockHistoryComponent implements OnInit {
	transferHistories = [ { transfer: '234sportmedia', value: 400, date: '23-1-2001', id: 'apmis-23401' } ];

	showDetails = false;
	loading = true;
	trdropDown = false;
	histories: any[] = [];
	historyDetailsToggle = false;
	selectedProduct: any = <any>{};
	resendButton = 'Resend';
	searchOpen = false;
	stores: any[] = <any>[];

	selectedFacility: Facility = <Facility>{};
	selectedInventoryTransfer: InventoryTransfer = <InventoryTransfer>{};
	checkingStore: any = <any>{};
	subscription: any = <any>{};
	loginEmployee: any = <any>{};
	searchControl = new FormControl();
	frmStore = new FormControl();
	constructor(
		private _inventoryEventEmitter: InventoryEmitterService,
		private inventoryService: InventoryService,
		private inventoryTransferService: InventoryTransferService,
		private inventoryTransactionTypeService: InventoryTransactionTypeService,
		private inventoryTransferStatusService: InventoryTransferStatusService,
		private employeeService: EmployeeService,
		private locker: CoolLocalStorage,
		private systemModuleService: SystemModuleService,
		private storeService: StoreService,
		private authFacadeService: AuthFacadeService
	) {
		this._inventoryEventEmitter.setRouteUrl('Stock History');
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this.getTransfers();
						this.getStores();
					}
				}
			}
		});
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			// this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
			if (this.loginEmployee.storeCheckIn !== undefined || this.loginEmployee.storeCheckIn.length > 0) {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						this.checkingStore = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingStore);

						// tslint:disable-next-line:no-shadowed-variable
						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
								this.checkingStore = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn(this.checkingStore);
								this.locker.setObject('checkingObject', this.checkingStore);
								// this.checkingStore = this.checkingStore.typeObject;
								this.getTransfers();
								this.getStores();
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							// tslint:disable-next-line:no-shadowed-variable
							this.employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload) => {
									this.loginEmployee = payload;
									this.checkingStore = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkingStore);
									this.locker.setObject('checkingObject', this.checkingStore);
									// this.checkingStore = this.checkingStore.typeObject;
									this.getTransfers();
									this.getStores();
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this.frmStore.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			this.loading = true;
			this.systemModuleService.on();
			this.inventoryTransferService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						destinationStoreId: value
					}
				})
				.then(
					(payload) => {
						this.loading = false;
						this.systemModuleService.off();
						this.transferHistories = payload.data;
					},
					(error) => {
						this.loading = false;
						this.systemModuleService.off();
					}
				);
		});

		this.searchControl.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			this.systemModuleService.on();
			if (this.checkingStore.storeId === undefined) {
				this.checkingStore = this.checkingStore.typeObject;
			}
			this.inventoryTransferService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						'inventoryTransferTransactions.productObject.name': {
							$regex: value,
							$options: 'i'
						}
					}
				})
				.then(
					(payload) => {
						this.systemModuleService.off();
						this.transferHistories = payload.data;
					},
					(error) => {
						this.systemModuleService.off();
					}
				);
		});
	}

	getTransfers() {
		this.loading = true;
		this.systemModuleService.on();
		this.inventoryTransferService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.checkingStore.storeId,
					$sort: { createdAt: -1 }
				}
			})
			.then(
				(payload) => {
					this.loading = false;
					this.systemModuleService.off();
					this.transferHistories = payload.data;
				},
				(error) => {
					this.loading = false;
					this.systemModuleService.off();
				}
			);
	}

	getStores() {
		this.loading = true;
		this.systemModuleService.on();
		this.storeService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					_id: { $ne: this.checkingStore.storeId }
				}
			})
			.then(
				(payload) => {
					this.loading = false;
					this.systemModuleService.off();
					if (payload.data !== undefined) {
						this.stores = payload.data;
					}
				},
				(error) => {
					this.loading = false;
					this.systemModuleService.off();
				}
			);
	}

	onClickViewHistoryDetails(value, event) {
		this.historyDetailsToggle = !this.historyDetailsToggle;
	}
	trCollapse() {
		this.trdropDown = !this.trdropDown;
	}
	onShowBatch(transfer) {
		this.selectedInventoryTransfer = transfer;
		this.selectedInventoryTransfer.isOpen = !this.selectedInventoryTransfer.isOpen;
	}

	ngOnDestroy() {
		if (this.loginEmployee.storeCheckIn !== undefined) {
			this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
				if (itemr.storeObject === undefined) {
					const store_ = this.loginEmployee.storeCheckIn.find(
						(x) => x.storeId.toString() === itemr.storeId.toString()
					);
					itemr.storeObject = store_.storeObject;
				}
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this.employeeService.update(this.loginEmployee).then(
						(payload) => {
							this.loginEmployee = payload;
						},
						(err) => {}
					);
				}
			});
		}
		this.employeeService.announceCheckIn(undefined);
		this.locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}
}
