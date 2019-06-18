import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import {
	InventoryService,
	ProductService,
	EmployeeService,
	FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Inventory, Employee, User } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-landingpage',
	templateUrl: './landingpage.component.html',
	styleUrls: [ './landingpage.component.scss' ]
})
export class LandingpageComponent implements OnInit {
	adjustStock = false;
	showBatch = false;
	slideInventoryDetails = false;
	searchControl: FormControl = new FormControl();
	systemQuantity: FormControl = new FormControl();
	physicalQuantity: FormControl = new FormControl();
	comment: FormControl = new FormControl();
	inventories: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedInventory: Inventory = <Inventory>{};
	user: User = <User>{};
	selectedTransaction: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	selectedProduct: any = <any>{};
	checkingStore: any = <any>{};
	subscription: any = <any>{};
	loading: boolean = true;

	constructor(
		private _inventoryEventEmitter: InventoryEmitterService,
		private _facilityService: FacilitiesService,
		private inventoryService: InventoryService,
		private route: ActivatedRoute,
		private productService: ProductService,
		private locker: CoolLocalStorage,
		private authFacadeService: AuthFacadeService,
		private employeeService: EmployeeService,
		private systemModuleService: SystemModuleService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this.locker.getObject('auth');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this.getInventories();
					}
				}
			}
		});
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			// this.checkingObject = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
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
								// this.checkingObject = this.checkingObject.typeObject;
								this.getInventories();
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
									// this.checkingObject = this.checkingObject.typeObject;
									this.getInventories();
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this._inventoryEventEmitter.setRouteUrl('Inventory Manager');
		const subscribeForCategory = this.searchControl.valueChanges
			.debounceTime(200)
			.distinctUntilChanged()
			.switchMap((term: any[]) =>
				this.inventoryService
					.find({
						query: { search: this.searchControl.value, facilityId: this.selectedFacility._id }
					})
					.then((payload) => {
						this.loading = false;
						this.inventories = payload.data.filter((x) => x.totalQuantity > 0);
						// this.inventories = payload.data;
					})
			);

		subscribeForCategory.subscribe((payload: any) => {});
	}

	getInventories() {
		if (this.checkingStore !== undefined) {
			this.inventoryService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						availableQuantity: { $gt: 0 },
						$sort: { updatedAt: -1 }
					}
				})
				.then((res) => {
					this.loading = false;
					this.inventories = res.data;
				});
		}
	}
	onSelectProduct(product) {}
	slideInventoryDetailsToggle(value) {
		this.slideInventoryDetails = !this.slideInventoryDetails;
		if (value !== null && value !== undefined && value.productId !== undefined) {
			this.productService.get(value.productId, {}).subscribe((payload) => {
				this.selectedProduct = payload;
			});
		}
	}
	onAdjustStock(inventory, transaction) {
		this.selectedInventory = inventory;
		this.selectedTransaction = transaction;
		this.systemQuantity.setValue(this.selectedTransaction.quantity);
		this.adjustStock = true;
	}
	closeAdjustStock() {
		this.adjustStock = false;
	}
	onShowBatch(inventory) {
		this.selectedInventory = inventory;
		this.selectedInventory.isOpen = !this.selectedInventory.isOpen;
	}
	auditProduct() {
		this.systemModuleService.on();
		if (this.selectedTransaction.adjustStocks === undefined) {
			this.selectedTransaction.adjustStocks = [];
		}
		this.selectedTransaction.adjustStocks.push({
			systemQuantity: this.systemQuantity.value,
			physicalQuantity: this.physicalQuantity.value,
			comment: this.comment.value,
			adjustBy: this.loginEmployee._id,
			batchNumber: this.selectedTransaction.batchNumber
		});
		this.selectedInventory.transactions.forEach((itemi, i) => {
			if (itemi._id === this.selectedTransaction._id) {
				itemi = this.selectedTransaction;
				itemi.quantity = this.physicalQuantity.value;
				itemi.availableQuantity = this.physicalQuantity.value;
			}
		});
		let difference = 0;
		if (this.systemQuantity.value > this.physicalQuantity.value) {
			difference = this.systemQuantity.value - this.physicalQuantity.value;
			this.selectedInventory.totalQuantity = this.selectedInventory.totalQuantity - difference;
			this.selectedInventory.availableQuantity = this.selectedInventory.totalQuantity;
		} else {
			difference = this.physicalQuantity.value - this.systemQuantity.value;
			this.selectedInventory.totalQuantity = this.selectedInventory.totalQuantity + difference;
			this.selectedInventory.availableQuantity = this.selectedInventory.totalQuantity;
		}

		this.inventoryService.update(this.selectedInventory).then((result) => {
			this.systemModuleService.off();
			this.physicalQuantity.setValue(0);
			this.systemQuantity.setValue(0);
			this.comment.reset();
			this.closeAdjustStock();
			const message = 'Batch number "' + this.selectedTransaction.batchNumber + '" has been adjusted';
			this.systemModuleService.announceSweetProxy(message, 'success', null, null, null, null, null, null, null);
		});
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
					this.employeeService.update(this.loginEmployee).then((payload) => {
						this.loginEmployee = payload;
					});
				}
			});
		}
		this.employeeService.announceCheckIn(undefined);
		this.locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}

	// Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
}
