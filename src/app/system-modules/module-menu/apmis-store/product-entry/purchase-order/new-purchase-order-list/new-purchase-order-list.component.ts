import { InventoryService } from './../../../../../../services/facility-manager/setup/inventory.service';
import { Component, OnInit } from '@angular/core';
import { StoreGlobalUtilService } from '../../../store-utils/global-service';
import { Filters } from '../../../store-utils/global';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee, PurchaseOrder } from 'app/models';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { FormControl } from '@angular/forms';
import {
	EmployeeService,
	ProductService,
	SupplierService,
	PurchaseOrderService
} from 'app/services/facility-manager/setup';
import { ApmisFilterBadgeService } from 'app/services/tools';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { OrderedItem } from '../../../components/models/purchaseorder';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-new-purchase-order-list',
	templateUrl: './new-purchase-order-list.component.html',
	styleUrls: [ './new-purchase-order-list.component.scss' ]
})
export class NewPurchaseOrderListComponent implements OnInit {
	storeFilters = [];
	selectedFilterIndex = 0;
	filterType = '';
	currentDate: FormControl;
	sup_search = false;
	selectedFacility: any;
	storeId: string;
	products: any;
	numberOfPages = 0;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	total = 0;
	skip = 0;
	subscription: any;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	productConfigSearch: FormControl = new FormControl();
	supplierFormControl: FormControl = new FormControl();
	purchaseListFormControl: FormControl = new FormControl();
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
	purchaseListCollection: any;
	constructor(
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
		this.apmisFilterService.clearItemsStorage(true);
		this.checkingStore = (<any>this._locker.getObject('checkingObject')).typeObject;
		this.currentDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');

		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this.selectedProduct = undefined;
				this.selectedProductName = '';
				this.getInventoryList(value);
			} else {
				this.selectedProductName = '';
			}
		});
		this.supplierFormControl.valueChanges.subscribe((value) => {
			this.selectedProducts = [];
			this.productConfigs = this.modifyProducts(this.productConfigs);
			this.getSupplierPurchaseList(value);
		});

		this.purchaseListFormControl.valueChanges.subscribe((value) => {
			this.selectedProducts = value.listedProducts;
			this.productConfigs = this.modifyProducts(this.productConfigs);
		});
		this.getSuppliers();
		this.getInventoryList();
	}

	getSupplierPurchaseList(supplier) {
		this.purchaseListService
			.findPurchaseList({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.checkingStore.storeId,
					'suppliersId._id': supplier.supplier._id,
					$select: [ '_id', 'purchaseListNumber', 'listedProducts' ]
				}
			})
			.then((payload) => {
				this.purchaseListCollection = payload.data;
			});
	}

	getInventoryList(searchText?) {
		if (searchText) {
			this._inventoryService
				.findFacilityProductList({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						limit: this.limit,
						skip: this.skip * this.limit,
						searchText: searchText
					}
				})
				.then(
					(payload) => {
						this.productConfigs = this.modifyProducts(payload.data);
						this.numberOfPages = payload.total / this.limit;
						this.total = payload.total;
					},
					(error) => {}
				);
		} else {
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
						this.productConfigs = this.modifyProducts(payload.data);
						this.numberOfPages = payload.total / this.limit;
						this.total = payload.total;
					},
					(error) => {}
				);
		}
	}

	modifyProducts(configs: any[]) {
		return configs.map((config) => {
			config.isChecked = this.validateAgainstDuplicateProductEntry(config) ? false : true;
			config.quantityRequired = 0;
			config.quantity = 0;
			config.costPrice = !!config.costPrice ? config.costPrice : 0;
			return config;
		});
	}

	setSelectedFilter(index, filter) {
		this.selectedFilterIndex = index;
		this.filterType = filter;
		if (this.filterType === 'All') {
			this.getInventoryList();
		}
	}

	setSelectedOption(event, data: any) {
		if (event.target.checked && this.validateAgainstDuplicateProductEntry(data)) {
			this.selectedProducts.push(data);
		} else if (!event.target.checked) {
			const selectedIndex = this.selectedProducts.findIndex((x) => x.productId.toString() === data.productId);
			if (selectedIndex > -1) {
				this.selectedProducts.splice(selectedIndex, 1);
			}
		}
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = this.selectedProducts.find((x) => x.productId.toString() === product.productId.toString());
		return result === undefined ? true : false;
	}

	onFocus(focus) {
		if (focus === 'in') {
			this.selectedProductName = '';
			this.showProduct = true;
		} else {
			setTimeout(() => {
				this.showProduct = false;
			}, 300);
		}
	}

	onshowSup_search() {
		this.sup_search = !this.sup_search;
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
					this.supplierSearchResult = payload.data.map((c) => {
						return { id: c._id, label: c.supplier.name };
					});
				},
				(error) => {}
			);
	}

	onSearchSelectedItems(data: any[]) {
		if (data.length > 0) {
			this.selectedSuppliers = this.suppliers.filter((supplier) => {
				const res = data.find((dt) => dt.id.toString() === supplier._id.toString());
				if (res !== undefined) {
					return supplier;
				}
			});
			this.selectedLocalStorageSuppliers = data;
		} else {
			this.selectedSuppliers = [];
		}
	}

	submit() {
		this.systemModuleService.on();

		const supplierIds = this.selectedLocalStorageSuppliers.map((local) => local.id);
		const suppliersToSave = this.selectedSuppliers.map((supplier) => {
			const existObj = supplierIds.find((i) => i.toString() === supplier._id.toString());
			if (existObj) {
				return supplier.supplier;
			}
		});
		const purchaseOrder: PurchaseOrder = <PurchaseOrder>{};
		purchaseOrder.facilityId = this.selectedFacility._id;
		purchaseOrder.storeId = this.checkingStore.storeId;
		purchaseOrder.orderedProducts = [];
		purchaseOrder.purchaseOrderNumber = '';
		purchaseOrder.createdBy = this.loginEmployee._id;
		purchaseOrder.isSupplied = false;
		purchaseOrder.supplierId = this.supplierFormControl.value._id;
		this.selectedProducts.forEach((product) => {
			const listedItem: OrderedItem = <OrderedItem>{};
			listedItem.costPrice = product.costPrice;
			listedItem.productId = product.productId;
			listedItem.productName = product.productName;
			listedItem.quantity = product.quantity;
			listedItem.productPackType = product.productConfiguration.name;
			listedItem.productConfiguration = product.productConfiguration;
			purchaseOrder.orderedProducts.push(listedItem);
		});

		this.purchaseListService.create(purchaseOrder).then(
			(payload) => {
				this.selectedProducts = [];
				this.getInventoryList();
				this.systemModuleService.off();
				this.systemModuleService.announceSweetProxy(
					'Your product has been ordered successfully',
					'success',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
			},
			(error) => {
				this.systemModuleService.off();
			}
		);
	}

	loadCurrentPage(event) {
		this.skip = event;
		this.getInventoryList();
	}
}
