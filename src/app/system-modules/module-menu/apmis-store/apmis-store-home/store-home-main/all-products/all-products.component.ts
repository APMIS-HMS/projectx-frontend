import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Facility, Employee } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { ProductsToggle } from '../../../store-utils/global';
import { EmployeeService } from 'app/services/facility-manager/setup';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-all-products',
	templateUrl: './all-products.component.html',
	styleUrls: [ './all-products.component.scss' ]
})
export class AllProductsComponent implements OnInit, OnDestroy {
	showAdjustStock = false;
	showProductDistribution = false;
	clickItemIndex: number;
	expand_row = false;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	currentPage = 0;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	packTypes = [ { id: 1, name: 'Sachet' }, { id: 2, name: 'Cartoon' } ];
	selectedFacility: any;
	products: any = [];
	productToggles = [];
	selectedToggleIndex = 0;
	subscription: Subscription;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;

	constructor(
		private _inventoryService: InventoryService,
		private _locker: CoolLocalStorage,
		private storeUtilService: StoreGlobalUtilService,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this._locker.setObject('checkingObject', this.checkingStore);
						this.getInventoryList();
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
		if (this.checkingStore.storeId !== undefined) {
			this.getInventoryList();
		}

		this.productToggles = this.storeUtilService.getObjectKeys(ProductsToggle);
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	getInventoryList() {
		this._inventoryService
			.findFacilityProductList({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.checkingStore.storeId,
					limit: this.limit,
					skip: this.skip * this.limit
				}
			})
			.then(
				(payload) => {
					this.products = this.modifyProducts(payload.data);
					this.numberOfPages = payload.total / this.limit;
					this.total = payload.total;
				},
				(error) => {}
			);
	}

	modifyProducts(products: any[]) {
		return products.map((product) => {
			product.virtualAvailableQuantity = product.availableQuantity;
			return product;
		});
	}

	item_to_show(i) {
		return this.clickItemIndex === i;
	}
	toggle_tr(itemIndex, direction) {
		if (direction === 'down' && itemIndex === this.clickItemIndex) {
			this.expand_row = false;
			this.clickItemIndex = -1;
		} else {
			this.clickItemIndex = itemIndex;
			this.expand_row = !this.expand_row;
		}
	}

	loadCurrentPage(event) {
		this.skip = event;
		this.getInventoryList();
	}

	close_onClick(e) {
		this.showAdjustStock = false;
		this.showProductDistribution = false;
	}

	productDistribution() {
		this.showProductDistribution = true;
	}

	adjustStock() {
		this.showAdjustStock = true;
	}
	setSelectedToggle(index, toggle) {
		this.selectedToggleIndex = index;
	}

	itemChanged(event, product) {
		const selectedConfig = product.packSizes.find((x) => x.name === event.target.value);
		product.virtualAvailableQuantity = product.availableQuantity / selectedConfig.size;
	}
}
