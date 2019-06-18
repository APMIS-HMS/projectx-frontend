import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { EmployeeService, PurchaseOrderService } from 'app/services/facility-manager/setup';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Facility, Employee } from 'app/models';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-purchase-list',
	templateUrl: './purchase-list.component.html',
	styleUrls: [ './purchase-list.component.scss' ]
})
export class PurchaseListComponent implements OnInit {
	purchaseList = true;
	newPurcaseList = false;
	purchaseListDetails = false;
	back_to_purchaseList = false;
	subscription: any;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	selectedPurchaseList: any;
	selectedFacility: any;
	purchaseListCollection: any[] = [];
	constructor(
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private purchaseListService: PurchaseOrderService,
		private systemModuleService: SystemModuleService
	) {
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
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getPurchaseList();
	}

	getPurchaseList() {
		this.systemModuleService.on();
		this.purchaseListService
			.findPurchaseList({
				facilityId: this.selectedFacility._id,
				storeId: this.checkingStore.storeId
			})
			.then(
				(payload) => {
					this.purchaseListCollection = payload.data;
					this.systemModuleService.off();
				},
				(error) => {
					this.systemModuleService.off();
					const text = 'There was an error loading Purchase List';
					this.systemModuleService.announceSweetProxy(text, 'error');
				}
			);
	}
	deleteSelectedPurchaseList(purchaseList: any) {
		this.systemModuleService.announceSweetProxy(
			'Are you sure you want to delete this item?',
			'question',
			this,
			null,
			null,
			purchaseList
		);
	}

	sweetAlertCallback(result, purchaseList) {
		if (result.value) {
			this.purchaseListService.removePurchaseList(purchaseList._id, {}).subscribe(
				(payload) => {
					this.getPurchaseList();
				},
				(error) => {
					const text = 'There was an error removing this Purchase List';
					this.systemModuleService.announceSweetProxy(text, 'error');
				}
			);
		}
	}

	backPurchaseList() {
		this.purchaseList = true;
		this.newPurcaseList = false;
		this.purchaseListDetails = false;
		this.back_to_purchaseList = false;
	}

	showNewPurchaseList() {
		this.purchaseList = false;
		this.newPurcaseList = true;
		this.purchaseListDetails = false;
		this.back_to_purchaseList = true;
	}

	showPurchaseListDetail(purchaseList: any) {
		this.purchaseList = false;
		this.newPurcaseList = false;
		this.purchaseListDetails = true;
		this.back_to_purchaseList = true;
		this.selectedPurchaseList = purchaseList;
	}
}
