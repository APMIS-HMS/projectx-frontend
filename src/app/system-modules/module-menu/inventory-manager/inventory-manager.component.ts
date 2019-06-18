import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

import { Employee, Facility } from '../../../models/index';
import { InventoryEmitterService } from '../../../services/facility-manager/inventory-emitter.service';
import { EmployeeService, WorkSpaceService } from '../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../service-facade/auth-facade.service';

@Component({
	selector: 'app-inventory-manager',
	templateUrl: './inventory-manager.component.html',
	styleUrls: [ './inventory-manager.component.scss' ]
})
export class InventoryManagerComponent implements OnInit, OnDestroy {
	pageInView: String = '';
	initializeNavMenu = false;
	inventoryNavMenu = false;
	stockTakingNavMenu = false;
	stockTransferNavMenu = false;
	receiveStockNavMenu = false;
	requisitionNavMenu = false;
	contentSecMenuShow = false;
	stockHistoryNavMenu = false;
	purchaseManagerNavMenu = false;
	reorderLevelNavMenu = false;
	productNavMenu = false;
	modal_on = false;
	Ql_toggle = false;
	loginEmployee: any = <any>{};
	workSpace: any;
	selectedFacility: Facility = <Facility>{};
	checkedInStore: any;
	checkingStore: any;
	subscription: any = <any>{};

	constructor(
		private _inventoryEventEmitter: InventoryEmitterService,
		private route: ActivatedRoute,
		private _router: Router,
		private employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private locker: CoolLocalStorage,
		private workSpaceService: WorkSpaceService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		const auth: any = this.locker.getObject('auth');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
				}
			}
		});
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			// this.checkedInStore = checkIn.store;
			// if (Object.keys(checkIn).length > 0) {
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
						this.checkedInStore = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn({ typeObject: this.checkedInStore, type: 'store' });
						this.authFacadeService
							.getCheckedInEmployee(
								// tslint:disable-next-line:no-shadowed-variable
								this.loginEmployee._id,
								{ storeCheckIn: this.loginEmployee.storeCheckIn }
							)
							.then((payload) => {
								this.loginEmployee = payload;
								this.checkedInStore = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn({
									typeObject: this.checkedInStore,
									type: 'store'
								});
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this.authFacadeService
								.getCheckedInEmployee(
									this.loginEmployee._id,
									// tslint:disable-next-line:no-shadowed-variable
									{ storeCheckIn: this.loginEmployee.storeCheckIn }
								)
								.then((payload) => {
									this.loginEmployee = payload;
									this.checkedInStore = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkedInStore);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
		this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	onChangeCheckedIn() {
		this.modal_on = true;
		this.contentSecMenuShow = false;
	}

	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}

	toggleQl() {
		this.Ql_toggle = !this.Ql_toggle;
	}

	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
			this.modal_on = false;
		}
	}

	changeRoute(val) {
		if (val === '/dashboard/inventory-manager/inventory') {
			this.inventoryNavMenu = true;
			this.stockTakingNavMenu = false;
			this.stockHistoryNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/initialize-store') {
			this.stockTakingNavMenu = false;
			this.inventoryNavMenu = false;
			this.stockHistoryNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = true;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/stock-transfer') {
			this.stockTransferNavMenu = true;
			this.inventoryNavMenu = false;
			this.stockTakingNavMenu = false;
			this.stockHistoryNavMenu = false;
			this.receiveStockNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/stock-history') {
			this.stockHistoryNavMenu = true;
			this.inventoryNavMenu = false;
			this.stockTakingNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/receive-stock') {
			this.receiveStockNavMenu = true;
			this.stockHistoryNavMenu = false;
			this.inventoryNavMenu = false;
			this.stockTakingNavMenu = false;
			this.stockTransferNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/requisition') {
			this.requisitionNavMenu = true;
			this.stockHistoryNavMenu = false;
			this.inventoryNavMenu = false;
			this.stockTakingNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === '/dashboard/inventory-manager/reorder-level') {
			this.requisitionNavMenu = false;
			this.stockHistoryNavMenu = false;
			this.inventoryNavMenu = false;
			this.stockTakingNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = true;
			this._inventoryEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		}
	}

	private checkPageUrl(param: string) {
		if (param.includes('inventory-manager/inventory')) {
			this.inventoryNavMenu = true;
			this.stockTakingNavMenu = false;
			this.stockHistoryNavMenu = false;
			this.stockTransferNavMenu = false;
			this.receiveStockNavMenu = false;
			this.requisitionNavMenu = false;
			this.initializeNavMenu = false;
			this.reorderLevelNavMenu = false;
		} else if (param.includes('stock-taking')) {
			this.stockTakingNavMenu = true;
		} else if (param.includes('initialize-store')) {
			this.initializeNavMenu = true;
		} else if (param.includes('stock-transfer')) {
			this.stockTransferNavMenu = true;
		} else if (param.includes('receive-stock')) {
			this.receiveStockNavMenu = true;
		} else if (param.includes('requisition')) {
			this.requisitionNavMenu = true;
		} else if (param.includes('reorder-level')) {
			this.reorderLevelNavMenu = true;
		}
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
	pageInViewLoader(e) {}
}
