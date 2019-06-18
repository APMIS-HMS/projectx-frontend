import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee, PurchaseOrder } from 'app/models';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { FormControl, Validators } from '@angular/forms';
import {
	EmployeeService,
	ProductService,
	SupplierService,
	PurchaseOrderService,
	InventoryService
} from 'app/services/facility-manager/setup';
import { ApmisFilterBadgeService } from 'app/services/tools';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

import { StoreGlobalUtilService } from 'app/system-modules/module-menu/apmis-store/store-utils/global-service';
import { Filters } from 'app/system-modules/module-menu/apmis-store/store-utils/global';

@Component({
	selector: 'app-no-purchase-order',
	templateUrl: './no-purchase-order.component.html',
	styleUrls: [ './no-purchase-order.component.scss' ]
})
export class NoPurchaseOrderComponent implements OnInit {
	@Output() invoiceAmountEvent = new EventEmitter<number>();
	searchSuplier: FormControl = new FormControl();
	productConfigSearch: FormControl = new FormControl();
	purchaseOrderFormControl: FormControl = new FormControl();
	invoiceDate: FormControl = new FormControl();

	searchProductFormControl: FormControl;
	inProductConfigSearch: FormControl;
	inSearchProductFormControl: FormControl;
	marginFormControl: FormControl = new FormControl();
	sellingPriceFormControl: FormControl;
	batchFormControl: FormControl;
	expiryDateFormControl: FormControl;
	quantityFormControl: FormControl;
	costPriceFormControl: FormControl;
	isMarginFocused = false;
	isSellingPriceFocused = false;
	isBatchFocused = false;
	isExpiryDateFocused = false;
	isQuantityFocused = false;
	isCostPriceFocused = false;
	isProductFocused = false;

	inIsMarginFocused = false;
	inIsSellingPriceFocused = false;
	inIsBatchFocused = false;
	inIsExpiryDateFocused = false;
	inIsQuantityFocused = false;
	inIsCostPriceFocused = false;
	inIsProductFocused = false;
	supplierFormControl: FormControl = new FormControl();
	searchProduct = true;

	storeFilters = [];
	selectedFilterIndex = 0;
	filterType = '';
	currentDate: FormControl;
	sup_search = false;
	selectedFacility: any;
	storeId: string;
	products: any[] = [];
	numberOfPages = 0;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	total = 0;
	skip = 0;
	subscription: any;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	purchaseListFormControl: FormControl = new FormControl();
	selectedProductName = '';
	inSelectedProductName = '';
	showProduct: boolean;
	inShowProduct: boolean;
	searchHasBeenDone = false;
	inSearchHasBeenDone = false;
	selectedProduct: any;
	inSelectedProduct: any;
	checkedProduct: any;
	productConfigs: any[] = [];
	inProductConfigs: any[] = [];
	selectedProducts: any[] = [];
	suppliers: any[] = [];
	selectedSuppliers: any[] = [];
	selectedLocalStorageSuppliers: any[] = [];
	supplierSearchResult: any[] = [];
	purchaseOrderCollection: any;
	newOrder: any;
	selectedSupplier: any;

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
		this.sellingPriceFormControl = new FormControl(0, [ Validators.minLength(0) ]);
		this.marginFormControl = new FormControl(0, [ Validators.maxLength(100), Validators.minLength(0) ]);
		this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
		this.batchFormControl = new FormControl('', [ Validators.minLength(3) ]);
		this.searchProductFormControl = new FormControl('', [ Validators.minLength(3) ]);
		this.inSearchProductFormControl = new FormControl('', [ Validators.minLength(3) ]);
		this.inProductConfigSearch = new FormControl('', Validators.minLength(3));

		this.quantityFormControl = new FormControl(0, [ Validators.minLength(0) ]);
		this.costPriceFormControl = new FormControl(0, [ Validators.minLength(0) ]);
		this.apmisFilterService.clearItemsStorage(true);
		this.checkingStore = (<any>this._locker.getObject('checkingObject')).typeObject;
		this.invoiceDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');

		this.supplierFormControl.valueChanges.subscribe((value) => {
			this.selectedProducts = [];
			this.selectedSupplier = value;
			// this.productConfigs = this.modifyProducts(this.productConfigs);
			// // this.getSupplierPurchaseOrders(value);
		});

		this.purchaseOrderFormControl.valueChanges.subscribe((value) => {
			this.products = this.modifyProducts(value.orderedProducts);
		});

		this.marginFormControl.valueChanges.subscribe((value) => {
			this.sellingPriceFormControl.setValue(
				value * this.costPriceFormControl.value / 100 + this.costPriceFormControl.value
			);
		});

		this.searchProductFormControl.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this.selectedProduct = undefined;
				this.selectedProductName = '';
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' },
							storeId: this.checkingStore.storeId
						}
					})
					.then(
						(payload) => {
							this.productConfigs = payload.data;
							this.showProduct = true;
							if (this.productConfigs.length === 0) {
								this.searchHasBeenDone = true;
							} else {
								this.searchHasBeenDone = false;
							}
						},
						(error) => {
							this.showProduct = false;
							this.searchHasBeenDone = false;
						}
					);
			} else {
				this.selectedProductName = '';
			}
		});

		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this.selectedProduct = undefined;
				this.selectedProductName = '';
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' },
							storeId: this.checkingStore.storeId
						}
					})
					.then(
						(payload) => {
							this.productConfigs = payload.data;
							this.showProduct = true;
							if (this.productConfigs.length === 0) {
								this.searchHasBeenDone = true;
							} else {
								this.searchHasBeenDone = false;
							}
						},
						(error) => {
							this.showProduct = false;
							this.searchHasBeenDone = false;
						}
					);
			} else {
				this.selectedProductName = '';
			}
		});

		this.inProductConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.inSearchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.inSelectedProductName.length === 0) {
				this.inSelectedProduct = undefined;
				this.inSelectedProductName = '';
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' },
							storeId: this.checkingStore.storeId
						}
					})
					.then(
						(payload) => {
							this.inProductConfigs = payload.data;
							this.inShowProduct = true;
							if (this.inProductConfigs.length === 0) {
								this.inSearchHasBeenDone = true;
							} else {
								this.inSearchHasBeenDone = false;
							}
						},
						(error) => {
							this.inShowProduct = false;
							this.inSearchHasBeenDone = false;
						}
					);
			} else {
				this.inSelectedProductName = '';
			}
		});

		this.getSuppliers();
	}

	getSupplierPurchaseOrders(supplier) {
		this.purchaseListService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: this.checkingStore.storeId,
					supplierId: supplier._id,
					$select: [ '_id', 'purchaseOrderNumber', 'orderedProducts', 'facilityId' ]
				}
			})
			.then(
				(payload) => {
					this.purchaseOrderCollection = payload.data;
				},
				(error) => {}
			);
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
			config.costPrice = 0;
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

	productChecked(event, data: any) {
		if (event.target.checked && this.validateAgainstDuplicateProductEntry(data)) {
			// this.selectedProducts.push(data);
			this.checkedProduct = data;
			this.addProduct(data);
		} else if (!event.target.checked) {
			const selectedIndex = this.selectedProducts.findIndex((x) => x.productId.toString() === data.productId);
			if (selectedIndex > -1) {
				this.selectedProducts.splice(selectedIndex, 1);
			}
		}
	}

	setSelectedOption(data: any) {
		try {
			this.selectedProductName = data.productObject.name;
			this.selectedProduct = data;
			this.showProduct = false;
			this.productConfigSearch.setValue(this.selectedProductName);
			this.addProduct();
			if (!this.isQuantityFocused) {
				this.isSellingPriceFocused = false;
				this.isBatchFocused = false;
				this.isExpiryDateFocused = false;
				this.isMarginFocused = false;
				this.isCostPriceFocused = false;
				this.isProductFocused = false;
				this.isQuantityFocused = true;
			} else {
				this.isQuantityFocused = false;
			}
		} catch (error) {}
	}

	inSetSelectedOption(data: any) {
		try {
			this.inSelectedProductName = data.productObject.name;
			this.inSelectedProduct = data;
			this.inShowProduct = false;
			this.inProductConfigSearch.setValue(this.inSelectedProductName);
			// this.inAddProduct();
			if (!this.inIsQuantityFocused) {
				this.inIsSellingPriceFocused = false;
				this.inIsBatchFocused = false;
				this.inIsExpiryDateFocused = false;
				this.inIsMarginFocused = false;
				this.inIsCostPriceFocused = false;
				this.inIsProductFocused = false;
				this.inIsQuantityFocused = true;
			} else {
				this.inIsQuantityFocused = false;
			}
		} catch (error) {}
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = this.selectedProducts.find((x) => x.productId.toString() === product.productId.toString());
		return result === undefined ? true : false;
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

	addNewOrder() {
		this.newOrder = {};
	}

	onFocus(focus, type?) {
		if (focus === 'in') {
			this.selectedProductName = '';
			this.showProduct = true;
		} else {
			setTimeout(() => {
				this.showProduct = false;
			}, 300);
		}
	}

	inOnFocus(focus, type?) {
		if (focus === 'in') {
			this.inSelectedProductName = '';
			this.inShowProduct = true;
		} else {
			setTimeout(() => {
				this.inShowProduct = false;
			}, 300);
		}
	}

	onKeydown(event, i) {
		if (i === 1) {
			this.isSellingPriceFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isExpiryDateFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (i === 2) {
			this.isBatchFocused = true;
			this.isSellingPriceFocused = false;
			this.isMarginFocused = false;
			this.isExpiryDateFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (i === 3) {
			this.isExpiryDateFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (i === 4) {
			this.isExpiryDateFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
			this.addProduct();
		} else if (i === 5) {
			this.isExpiryDateFocused = false;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = true;
		} else if (i === 6) {
			this.isExpiryDateFocused = false;
			this.isBatchFocused = false;
			this.isMarginFocused = true;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		}
	}

	inOnKeydown(event, i) {
		if (i === 1) {
			this.inIsSellingPriceFocused = true;
			this.inIsBatchFocused = false;
			this.inIsMarginFocused = false;
			this.inIsExpiryDateFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = false;
		} else if (i === 2) {
			this.inIsBatchFocused = true;
			this.inIsSellingPriceFocused = false;
			this.inIsMarginFocused = false;
			this.inIsExpiryDateFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = false;
		} else if (i === 3) {
			this.inIsExpiryDateFocused = true;
			this.inIsBatchFocused = false;
			this.inIsMarginFocused = false;
			this.inIsSellingPriceFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = false;
		} else if (i === 4) {
			this.inIsExpiryDateFocused = true;
			this.inIsBatchFocused = false;
			this.inIsMarginFocused = false;
			this.inIsSellingPriceFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = false;
			this.inAddProduct();
		} else if (i === 5) {
			this.inIsExpiryDateFocused = false;
			this.inIsBatchFocused = false;
			this.inIsMarginFocused = false;
			this.inIsSellingPriceFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = true;
		} else if (i === 6) {
			this.inIsExpiryDateFocused = false;
			this.inIsBatchFocused = false;
			this.inIsMarginFocused = true;
			this.inIsSellingPriceFocused = false;
			this.inIsQuantityFocused = false;
			this.inIsCostPriceFocused = false;
		}
	}

	addProduct(comingProduct?) {
		if (comingProduct) {
			this.searchProductFormControl.setValue(comingProduct.productName);
			this.costPriceFormControl.setValue(comingProduct.costPrice);
			this.quantityFormControl.setValue(comingProduct.quantity);
			this.addNewOrder();
		} else {
			if (this.selectedProduct !== undefined) {
				const product = {
					costPrice: this.costPriceFormControl.value,
					isChecked: true,
					productId: this.selectedProduct.productId,
					productName: this.selectedProduct.productObject.name,
					quantity: this.quantityFormControl.value,
					sellingPrice: this.sellingPriceFormControl.value,
					margin: this.marginFormControl.value,
					expiryDate: this.expiryDateFormControl.value,
					batchNumber: this.batchFormControl.value,
					productPackType:
						this.selectedProduct.packSizes.find((x) => x.isBase) !== undefined
							? this.selectedProduct.packSizes.find((x) => x.isBase).name
							: ''
				};
				this.selectedProducts.push(product);
				this.searchProductFormControl.reset();
				this.costPriceFormControl.reset(0);
				this.quantityFormControl.reset(0);
				this.marginFormControl.reset(0);
				this.sellingPriceFormControl.reset(0);
				this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
				this.batchFormControl.reset('');
				this.sendInvoiceAmount();
				this.isProductFocused = true;
			} else if (this.checkedProduct !== undefined) {
				const product = {
					costPrice: this.costPriceFormControl.value,
					isChecked: true,
					productId: this.checkedProduct.productId,
					productName: this.checkedProduct.productName,
					quantity: this.quantityFormControl.value,
					sellingPrice: this.sellingPriceFormControl.value,
					margin: this.marginFormControl.value,
					expiryDate: this.expiryDateFormControl.value,
					batchNumber: this.batchFormControl.value,
					productPackType: this.checkedProduct.productPackType
				};
				this.selectedProducts.push(product);
				this.searchProductFormControl.reset();
				this.costPriceFormControl.reset(0);
				this.quantityFormControl.reset(0);
				this.marginFormControl.reset(0);
				this.sellingPriceFormControl.reset(0);
				this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
				this.batchFormControl.reset('');
				this.sendInvoiceAmount();
				this.isProductFocused = true;
			}
		}
	}

	inAddProduct(comingProduct?) {
		if (comingProduct) {
			this.inSearchProductFormControl.setValue(comingProduct.productName);
			this.costPriceFormControl.setValue(comingProduct.costPrice);
			this.quantityFormControl.setValue(comingProduct.quantity);
			this.addNewOrder();
		} else {
			if (this.inSelectedProduct !== undefined) {
				const product = {
					costPrice: this.costPriceFormControl.value,
					isChecked: true,
					productId: this.inSelectedProduct.productId,
					productName: this.inSelectedProduct.productObject.name,
					quantity: this.quantityFormControl.value,
					sellingPrice: this.sellingPriceFormControl.value,
					margin: this.marginFormControl.value,
					expiryDate: this.expiryDateFormControl.value,
					batchNumber: this.batchFormControl.value,
					productPackType:
						this.inSelectedProduct.packSizes.find((x) => x.isBase) !== undefined
							? this.inSelectedProduct.packSizes.find((x) => x.isBase).name
							: ''
				};
				this.selectedProducts.push(product);
				this.inProductConfigSearch.reset();
				this.costPriceFormControl.reset(0);
				this.quantityFormControl.reset(0);
				this.marginFormControl.reset(0);
				this.sellingPriceFormControl.reset(0);
				this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
				this.batchFormControl.reset('');
				this.sendInvoiceAmount();
				this.isProductFocused = true;
			} else if (this.checkedProduct !== undefined) {
				const product = {
					costPrice: this.costPriceFormControl.value,
					isChecked: true,
					productId: this.checkedProduct.productId,
					productName: this.checkedProduct.productName,
					quantity: this.quantityFormControl.value,
					sellingPrice: this.sellingPriceFormControl.value,
					margin: this.marginFormControl.value,
					expiryDate: this.expiryDateFormControl.value,
					batchNumber: this.batchFormControl.value,
					productPackType: this.checkedProduct.productPackType
				};
				this.selectedProducts.push(product);
				this.inSearchProductFormControl.reset();
				this.costPriceFormControl.reset(0);
				this.quantityFormControl.reset(0);
				this.marginFormControl.reset(0);
				this.sellingPriceFormControl.reset(0);
				this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10));
				this.batchFormControl.reset('');
				this.sendInvoiceAmount();
				this.isProductFocused = true;
			}
		}
	}

	submit() {}

	sendInvoiceAmount() {
		let sum = 0;
		this.selectedProducts.map((product) => {
			sum = sum + product.quantity * product.costPrice;
			return sum;
		});
		this.invoiceAmountEvent.emit(sum);
	}
}
