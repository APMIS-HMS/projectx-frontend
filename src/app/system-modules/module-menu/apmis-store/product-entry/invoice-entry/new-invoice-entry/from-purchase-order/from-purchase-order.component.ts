import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee, PurchaseOrder } from 'app/models';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
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
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
@Component({
	selector: 'app-from-purchase-order',
	templateUrl: './from-purchase-order.component.html',
	styleUrls: [ './from-purchase-order.component.scss' ]
})
export class FromPurchaseOrderComponent implements OnInit {
	@Output() invoiceAmountEvent = new EventEmitter<number>();

	searchProductFormControl: FormControl;
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
	purchaseOrderFormControl: FormControl = new FormControl();
	supplierFormControl: FormControl = new FormControl();
	invoiceDate: FormControl = new FormControl();
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
	productConfigSearch: FormControl = new FormControl();
	purchaseListFormControl: FormControl = new FormControl();
	selectedProductName = '';
	showProduct: boolean;
	searchHasBeenDone = false;
	selectedProduct: any;
	checkedProduct: any;
	productConfigs: any[] = [];
	selectedProducts: any[] = [];
	suppliers: any[] = [];
	selectedSuppliers: any[] = [];
	selectedLocalStorageSuppliers: any[] = [];
	supplierSearchResult: any[] = [];
	purchaseOrderCollection: any;
	newOrder: any;

	productForm: FormGroup;

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
		private purchaseListService: PurchaseOrderService,
		private formBuilder: FormBuilder
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

		this.quantityFormControl = new FormControl(0, [ Validators.minLength(0) ]);
		this.costPriceFormControl = new FormControl(0, [ Validators.minLength(0) ]);
		this.apmisFilterService.clearItemsStorage(true);
		this.checkingStore = (<any>this._locker.getObject('checkingObject')).typeObject;
		this.invoiceDate = new FormControl(new Date().toISOString().substring(0, 10));
		this.storeFilters = this.storeUtilService.getObjectKeys(Filters);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');

		this.supplierFormControl.valueChanges.subscribe((value) => {
			this.selectedProducts = [];
			this.productConfigs = this.modifyProducts(this.productConfigs);
			this.getSupplierPurchaseOrders(value);
		});

		this.purchaseOrderFormControl.valueChanges.subscribe((value) => {
			if (value !== '0') {
				console.log(value.orderedProducts);
				this.products = this.modifyProducts(value.orderedProducts);
			}
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

		this.getSuppliers();
		this.InitializeProductArray();
		this.removeProduct(0);
	}
	InitializeProductArray() {
		try {
			this.productForm = this.formBuilder.group({
				productArray: this.formBuilder.array([
					this.formBuilder.group({
						productName: [ '', [ <any>Validators.required ] ],
						quantity: [ 0, [ <any>Validators.required ] ],
						reOrderLevel: [ 0, [ <any>Validators.required ] ],
						costPrice: [ 0, [ <any>Validators.required ] ],
						margin: [ 0, [ <any>Validators.required ] ],
						sellingPrice: [ 0, [ <any>Validators.required ] ],
						batchNumber: [ '', [ <any>Validators.required ] ],
						expiryDate: [ new Date().toISOString().substring(0, 10), [ <any>Validators.required ] ],
						totalCostPrice: [ 0, [ <any>Validators.required ] ]
					})
				])
			});
			this.subscribToFormControls();
		} catch (error) {}
	}
	subscribToFormControls() {
		try {
			if (this.productForm !== undefined) {
				const formArray = (<FormArray>this.productForm.get('productArray')).controls;
				formArray.forEach((frmArray, i) => {
					(<FormGroup>frmArray).controls['costPrice'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							// this.reCalculatePrices(frmArray, frmArray.value, 'costPrice');
						});

					(<FormGroup>frmArray).controls['totalCostPrice'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							// this.reCalculatePrices(frmArray, frmArray.value, 'totalCostPrice');
						});

					(<FormGroup>frmArray).controls['margin'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							// this.reCalculatePrices(frmArray, frmArray.value, 'margin');
						});
					(<FormArray>(<FormGroup>frmArray).controls['batches']).valueChanges.subscribe((value) => {
						// (<FormGroup>frmArray).controls['totalQuantity'].setValue(this.getProductBatchQuantity(value));
						// this.reCalculatePrices(frmArray, frmArray.value, 'totalQuantity');
					});

					const batchFormArray = (<FormArray>(<FormGroup>frmArray).controls['batches']).controls;
					batchFormArray.forEach((batchArray, j) => {
						(<FormGroup>batchArray).controls['quantity'].valueChanges
							.pipe(tap((val) => {}), debounceTime(200), distinctUntilChanged())
							.subscribe((value) => {});
					});
				});
			}
		} catch (error) {}
	}
	showProdList(e) {
		if (e.value === '') {
			this.searchProduct = true;
		} else {
			this.searchProduct = false;
		}
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
			this.checkedProduct = data;
			// this.addProduct(data);
			const control = <FormArray>this.productForm.get('productArray');
			control.push(this.initProduct(data));
			this.subscribToFormControls();
		} else if (!event.target.checked) {
			const selectedIndex = this.selectedProducts.findIndex((x) => x.productId.toString() === data.productId);
			if (selectedIndex > -1) {
				this.selectedProducts.splice(selectedIndex, 1);
			}
		}
	}
	removeProduct(i) {
		const control = <FormArray>this.productForm.get('productArray');
		control.removeAt(i);
	}

	initProduct(product?: any) {
		return new FormGroup({
			productName: new FormControl(product === undefined ? '' : product.productName),
			quantity: new FormControl(product === undefined || product.quantity === undefined ? '' : product.quantity),
			costPrice: new FormControl(
				product === undefined || product.costPrice === undefined ? '' : product.costPrice
			),
			totalCostPrice: new FormControl(
				product === undefined || product.totalCostPrice === undefined ? '' : product.totalCostPrice
			),
			margin: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			sellingPrice: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			expiryDate: new FormControl(
				product === undefined ? new Date().toISOString().substring(0, 10) : product.expiryDate
			),
			batchNumber: new FormControl(product === undefined ? '' : product.expiryDate),
			productPackType: new FormControl(product === undefined ? '' : product.productPackType)
		});
	}

	setSelectedOption(data: any) {
		try {
			this.selectedProductName = data.productObject.name;
			this.selectedProduct = data;
			this.showProduct = false;
			this.searchProductFormControl.setValue(this.selectedProductName);
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
		// this.newOrder = {};
		const control = <FormArray>this.productForm.get('productArray');
		control.push(this.initProduct());
		this.subscribToFormControls();
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

	onKeydown(event, n, i) {
		console.log(i);
		if (n === 1) {
			this.isSellingPriceFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isExpiryDateFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (n === 2) {
			this.isBatchFocused = true;
			this.isSellingPriceFocused = false;
			this.isMarginFocused = false;
			this.isExpiryDateFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (n === 3) {
			this.isExpiryDateFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
		} else if (n === 4) {
			this.isExpiryDateFocused = true;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
			this.addProduct();
		} else if (n === 5) {
			this.isExpiryDateFocused = false;
			this.isBatchFocused = false;
			this.isMarginFocused = false;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = true;
		} else if (n === 6) {
			this.isExpiryDateFocused = false;
			this.isBatchFocused = false;
			this.isMarginFocused = true;
			this.isSellingPriceFocused = false;
			this.isQuantityFocused = false;
			this.isCostPriceFocused = false;
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

	submit() {}

	sendInvoiceAmount() {
		let sum = 0;
		this.selectedProducts.map((product) => {
			sum = sum + product.quantity * product.costPrice;
			return sum;
		});
		this.invoiceAmountEvent.emit(sum);
	}

	receiveConstructedProduct(event, i) {
		console.log(i);
		this.selectedProducts.push(event);
		this.sendInvoiceAmount();
		this.removeProduct(i);
	}
}
