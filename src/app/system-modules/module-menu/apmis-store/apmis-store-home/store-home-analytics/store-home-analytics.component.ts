import { Component, OnInit, OnDestroy } from '@angular/core';
import { StoreService, InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee } from 'app/models';
import { EmployeeService } from '../../../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-store-home-analytics',
	templateUrl: './store-home-analytics.component.html',
	styleUrls: [ './store-home-analytics.component.scss' ]
})
export class StoreHomeAnalyticsComponent implements OnInit, OnDestroy {
	selectedFacility: Facility;
	storeStatistics: any;
	inventoryItemCount: number;
	expiredInventoryItemCount: any;
	expiredStatistics: any;
	aboutToExpiredStatistics: any;
	requireReOrderStatistics: any;
	aboutToExpiredInventoryItemCount: any;
	requireReOrderInventoryItemCount: any;
	outOfStockInventoryItemCount: any;
	transactionInventoryItemCount: any;
	revenueInventoryItemCount: any;
	storeId: any;

	modal_on = false;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	isRunningQuery = false;
	subscription: ISubscription;
	showDialog = false;
	constructor(
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this.getStoreStatistics();
					}
				}
			}
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
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
						this._employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
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
							this._employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
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

	ngOnInit() {
		 //this.getStoreStatistics();
		// this.storeId = '5a88a0d26e6d17335cf318bc';
	}

	getStoreStatistics() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');		
		this._inventoryService
			.getInventoryBriefStatus(120, {
				query: { storeId: this.checkingStore.storeId, facilityId: this.selectedFacility._id }
			})
			.then(
				(payload) => {					
					if (payload.status === 'success' && payload.data.length > 0) {
						this.extractInventoryCountItem(payload.data[0]);
						this.extractExpiredInventoryCountItem(payload.data[1]);
						this.extractAboutToExpiredInventoryCountItem(payload.data[2]);
						this.extractRequireReOrderInventoryCountItem(payload.data[3]);
						this.extractOutOfStockInventoryCountItem(payload.data[4]);
						this.extractTransactionInventoryCountItem(payload.data[5]);
						this.extractRevenueInventoryCountItem(payload.data[6]);
					}
				},
				(error) => {}
			);
	}
	extractInventoryCountItem(storeStatistics) {
		this.storeStatistics = storeStatistics;
		this.inventoryItemCount = this.storeStatistics.values[0].value;
	}

	extractExpiredInventoryCountItem(expiredStatistics) {
		this.expiredStatistics = expiredStatistics;
		this.expiredInventoryItemCount = expiredStatistics.values[0].value;
	}

	extractAboutToExpiredInventoryCountItem(aboutToExpiredStatistics) {
		this.aboutToExpiredInventoryItemCount = aboutToExpiredStatistics;
		this.aboutToExpiredInventoryItemCount = aboutToExpiredStatistics.values[0].value;
	}

	extractRequireReOrderInventoryCountItem(requireReOrderStatistics) {
		this.requireReOrderInventoryItemCount = requireReOrderStatistics;
		this.requireReOrderInventoryItemCount = requireReOrderStatistics.values[0].value;
	}

	extractOutOfStockInventoryCountItem(outOfStockStatistics) {
		this.outOfStockInventoryItemCount = outOfStockStatistics;
		this.outOfStockInventoryItemCount = outOfStockStatistics.values[0].value;
	}

	extractTransactionInventoryCountItem(transactionStatistics) {
		this.transactionInventoryItemCount = transactionStatistics;
		this.transactionInventoryItemCount = transactionStatistics.values[0].value;
	}

	extractRevenueInventoryCountItem(revenueStatistics) {
		this.revenueInventoryItemCount = revenueStatistics;
		this.revenueInventoryItemCount = revenueStatistics.values[0].value;
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
}
