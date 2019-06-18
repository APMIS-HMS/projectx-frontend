import { ProductInitialize } from './../../components/models/productInitialize';
import { ProductService } from './../../../../../services/facility-manager/setup/product.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import {
	FacilitiesServiceCategoryService,
	EmployeeService,
	InventoryInitialiserService,
	InventoryService
} from 'app/services/facility-manager/setup';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Subscription } from 'rxjs/Subscription';
import { Inventory } from '../../components/models/inventory';
import { InventoryTransaction } from '../../components/models/inventorytransaction';
import { APMIS_STORE_PAGINATION_LIMIT } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-initialize-store',
	templateUrl: './initialize-store.component.html',
	styleUrls: [ './initialize-store.component.scss' ]
})
export class InitializeStoreComponent implements OnInit {
	// item_to_show = true;
	clickItemIndex: number;
	expand_row = false;
	showConfigureProduct = false;
	newBatchEntry = false;
	showButton= false;
	productConfigSearch: FormControl = new FormControl();
	serviceCategorySearch: FormControl = new FormControl();
	productServiceControl = new FormControl('');
	productConfigs: any[] = [];
	selectedProductName: any;
	showProduct: boolean;
	searchHasBeenDone = false;
	selectedProduct: any;
	selectedProducts: any[];
	productForm: FormGroup;
	dateP;
	dateFormat = 'dd/MM/yyyy';
	selectedFacility: Facility;
	selectedFacilityService: any = <any>{};
	categories: any = <any>[];
	selelctedCategoryId: any = <any>{};
	subscription: Subscription;
	checkingObject: any = <any>{};
	inventoryModel: Inventory = <Inventory>{};
	InventoryTxnModel: InventoryTransaction = <InventoryTransaction>{};
	loginEmployee: any;
	selectedCategoryName: any;
	showCategory: boolean;
	existingProducts: any;
	limit = APMIS_STORE_PAGINATION_LIMIT;
	total = 0;
	skip = 0;
	numberOfPages = 0;
	saving = false;

	constructor(
		private _productService: ProductService,
		private formBuilder: FormBuilder,
		private facilityServiceCategoryService: FacilitiesServiceCategoryService,
		private _locker: CoolLocalStorage,
		private authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService,
		private employeeService: EmployeeService,
		private _inventoryInitialiserService: InventoryInitialiserService,
		private _inventoryService: InventoryService
	) {
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingObject = res.typeObject;
				}
			}
		});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			if (this.loginEmployee.storeCheckIn !== undefined || this.loginEmployee.storeCheckIn.length > 0) {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						this.checkingObject = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingObject);

						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload2) => {
								this.loginEmployee = payload2;
								this.checkingObject = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn(this.checkingObject);
								this._locker.setObject('checkingObject', this.checkingObject);
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this.employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload3) => {
									this.loginEmployee = payload3;
									this.checkingObject = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkingObject);
									this._locker.setObject('checkingObject', this.checkingObject);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		//this.saving = false;
		
		// console.log(this.selectedProducts.length);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.dateP = new DatePipe(navigator.language);
		this.selectedProducts = [];
		this.productConfigSearch.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			this.searchHasBeenDone = false;
			if (value !== null && value.length > 3 && this.selectedProductName.length === 0) {
				this.selectedProduct = undefined;
				this.selectedProductName = '';
				this._productService
					.findProductConfigs({
						query: {
							'productObject.name': { $regex: value, $options: 'i' },
							//storeId: this.checkingObject.storeId,
							facilityId: this.selectedFacility._id
						}
					})
					.then(
						(payload) => {
							this.productConfigs = payload.data;
							//this.selectedProducts = payload.data;
							//console.log(this.selectedProducts);
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

		this.productServiceControl.valueChanges.subscribe((value) => {
			this.selelctedCategoryId = value;
		});

		this.InitializeProductArray();
		this.removeProduct(0);
		this.getServiceCategories();
		this.getInitializedProductList();
	}

	getInitializedProductList() {
		let prop =[];
		let noprob=[];
	
		this._inventoryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					$select: [
						'availableQuantity',
						'categoryId',
						'facilityId',
						'facilityServiceId',
						'productId',
						'serviceId',
						'storeId',
						'totalQuantity',
						'margin',
						'productObject',
						'costPrice'
						
					],
					$limit: this.limit,
					$skip: this.skip * this.limit
				}
			})
			.then(
				(payload) => {
					console.log(payload);
					payload.data.forEach(x => {
						if  (x.hasOwnProperty('productObject')){
						 prop.push(x);
						 /* x.productObject.productConfig.forEach(y=>{
							  if (y.isBase){
								  x.baseUnit=y.name;
							  }
						  });
						  console.log(x.baseUnit);*/
						}else {
						 noprob.push(x);
						}
					});

					this.existingProducts = prop;    //payload.data;
					this.numberOfPages = payload.total / this.limit;
					this.total = payload.total;
				},
				(error) => {
					console.log(error);
				}
			);
	}

	close_onClick(e) {
		this.showConfigureProduct = false;
		this.newBatchEntry = false;
	}

	checkBatchValidation(batch: FormGroup) {
		batch.controls['complete'].setValue(true);
	}

	configureProduct() {
		this.showConfigureProduct = true;
	}

	showNewBatch() {
		this.newBatchEntry = true;
	}

	setSelectedOption(data: any) {
		if (!data.isVented) {
			try {
				this.selectedProductName = data.productObject.name;
				this.selectedProduct = data;
				this.showProduct = false;
				this.productConfigSearch.setValue(this.selectedProductName);
				console.log(this.selectedProduct);
				
			} catch (error) {}
		} else {
			const text = 'This product exist in your inventory';
			this.systemModuleService.announceSweetProxy(text, 'info');
			this.selectedProductName = '';
			this.selectedProduct = undefined;
			this.showProduct = false;
		}
	}

	setCategorySelectedOption(data: any) {
		try {
			this.selectedCategoryName = data.name;
			this.selelctedCategoryId = data;
			this.showCategory = false;
			this.serviceCategorySearch.setValue(this.selectedCategoryName);
		} catch (error) {}
	}

	onFocus(focus, type?) {
		if (type === 'category') {
			if (focus === 'in') {
				this.selectedCategoryName = '';
				this.showCategory = true;
			} else {
				setTimeout(() => {
					this.showCategory = false;
				}, 300);
			}
		} else {
			if (focus === 'in') {
				this.selectedProductName = '';
				this.showProduct = true;
			} else {
				setTimeout(() => {
					this.showProduct = false;
				}, 300);
			}
		}
	}

	addProduct() {
		console.log(this.selelctedCategoryId);
		
		const product: ProductInitialize = {
			configProduct: this.selectedProduct,
			batches: [],
			costPrice: 0,
			margin: 0,
			sellingPrice: 0,
			totalCostPrice: 0,
			totalQuantity: 0,
			basePackType: this.selectedProduct.packSizes[0].name //''
		};
		// this.selectedProducts.push(product);
		console.log(product);
		if (this.validateAgainstDuplicateProductEntry(product)) {
			this.pushProduct(product);
			this.selectedProducts.push(this.selectedProduct);
		}
		//set button inactive and clear search input
		this.selectedProduct = undefined;
		this.selectedProductName = '';
		this.productConfigSearch.setValue(this.selectedProductName);
	}

	validateAgainstDuplicateProductEntry(product) {
		const result = (<FormArray>this.productForm.get('productArray')).value.find(
			(x) => x.configProduct.id.toString() === product.configProduct.productObject.id.toString()
		);
		return result === undefined ? true : false;
	}

	InitializeProductArray() {
		try {
			this.productForm = this.formBuilder.group({
				productArray: this.formBuilder.array([
					this.formBuilder.group({
						configProduct: [ '', [ <any>Validators.required ] ],
						batches: new FormArray([ this.initBatch() ]),
						totalQuantity: [ 0, [ <any>Validators.required ] ],
						basePackType: [ '', [ <any>Validators.required ] ],
						costPrice: [ 0, [ <any>Validators.required ] ],
						totalCostPrice: [ 0, [ <any>Validators.required ] ],
						margin: [ 0, [ <any>Validators.required ] ],
						sellingPrice: [ 0, [ <any>Validators.required ] ]
					})
				])
			});
			this.subscribToFormControls();
		} catch (error) {}
	}

	initProduct(product?: ProductInitialize) {
		return new FormGroup({
			totalQuantity: new FormControl(product === undefined ? '' : product.totalQuantity),
			batches: new FormArray([ this.initBatch() ]),
			basePackType: new FormControl(
				product === undefined || product.basePackType === undefined ? '' : product.basePackType
			),
			costPrice: new FormControl(
				product === undefined || product.costPrice === undefined ? '' : product.costPrice
			),
			totalCostPrice: new FormControl(
				product === undefined || product.totalCostPrice === undefined ? '' : product.totalCostPrice
			),
			margin: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			sellingPrice: new FormControl(product === undefined || product.margin === undefined ? '' : product.margin),
			configProduct: new FormControl(
				product === undefined || product.configProduct.productObject === undefined
					? ''
					: product.configProduct.productObject
			),
			packSizes: new FormControl(product.configProduct.packSizes)
		});
	}

	getServiceCategories() {
		this.facilityServiceCategoryService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(
			(payload) => {
				if (payload.data.length > 0) {
					this.selectedFacilityService = payload.data[0];
					this.categories = payload.data[0].categories;
					this.productServiceControl.setValue(this.categories[0]._id);
				}
			},
			(error) => {}
		);
	}

	initBatch(batch?) {
		const newGrp = new FormGroup({
			batchNumber: new FormControl(
				batch === undefined || batch.batchNumber === undefined ? '' : batch.batchNumber
			),
			quantity: new FormControl(batch === undefined || batch.quantity === undefined ? 0 : batch.quantity),
			expiryDate: new FormControl(
				batch === undefined || batch.expiryDate === undefined
					? new Date().toISOString().substring(0, 10)
					: batch.expiryDate
			),
			unit:new FormControl(),
			complete: new FormControl(false, [])
		});
		this.subscribToFormControls();
		return newGrp;
	}

	pushBatch(picked: FormArray) {
		picked.controls['batches'].push(this.initBatch());
	}

	removeProduct(i) {
		const control = <FormArray>this.productForm.get('productArray');
		control.removeAt(i);
	}

	removeBatch(batches, i) {
		const control = <FormArray>batches;
		control.removeAt(i);
	}

	pushProduct(product?) {
		const control = <FormArray>this.productForm.get('productArray');
		console.log(control);
		control.push(this.initProduct(product));

		this.showButton=true;
		this.subscribToFormControls();
	}

	subscribToFormControls() {
		try {
			if (this.productForm !== undefined) {
				const formArray = (<FormArray>this.productForm.get('productArray')).controls;
				formArray.forEach((frmArray, i) => {
					(<FormGroup>frmArray).controls['costPrice'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							this.reCalculatePrices(frmArray, frmArray.value, 'costPrice');
						});

					(<FormGroup>frmArray).controls['totalCostPrice'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							this.reCalculatePrices(frmArray, frmArray.value, 'totalCostPrice');
						});

					(<FormGroup>frmArray).controls['margin'].valueChanges
						.pipe(tap((val) => {}), debounceTime(400), distinctUntilChanged())
						.subscribe((value) => {
							this.reCalculatePrices(frmArray, frmArray.value, 'margin');
						});
					(<FormArray>(<FormGroup>frmArray).controls['batches']).valueChanges.subscribe((value) => {
						(<FormGroup>frmArray).controls['totalQuantity'].setValue(this.getProductBatchQuantity(value));
						this.reCalculatePrices(frmArray, frmArray.value, 'totalQuantity');
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

	getProductBatchQuantity(batchFormArray) {
		let productQuantity = 0;
		batchFormArray.forEach((batchArray, j) => {
			const currentQuantity = batchArray.quantity;
			productQuantity = productQuantity + currentQuantity;
		});
		return productQuantity;
	}

	reCalculatePrices(array, value: ProductInitialize, control) {
		if (control === 'costPrice') {
			value.totalCostPrice = value.costPrice * value.totalQuantity;
			array.controls['totalCostPrice'].setValue(value.totalCostPrice);
		} else if (control === 'totalCostPrice') {
			// value.costPrice = value.totalCostPrice / value.totalQuantity;
			// array.controls['costPrice'].setValue(value.costPrice);
		} else if (control === 'margin') {
			value.sellingPrice = value.costPrice * (value.margin / 100) + value.costPrice;
			array.controls['sellingPrice'].setValue(value.sellingPrice);
		} else if (control === 'totalQuantity') {
			value.totalCostPrice = value.costPrice * value.totalQuantity;
			array.controls['totalCostPrice'].setValue(value.totalCostPrice);
		}
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

	save() {
		const value = this.productForm.controls['productArray'].value;
		this.saving = true;
		if (this.checkingObject.storeId === undefined) {
			if (!!this.checkingObject.typeObject) {
				this.checkingObject = this.checkingObject.typeObject;
			}
		}
		const batches = {
			batchItems: [],
			product: {},
			storeId: this.checkingObject.storeId,
			facilityServiceId: this.selectedFacilityService._id,
			categoryId: this.selelctedCategoryId._id
		};
		const _saveProductList = [];
		value.forEach((inproduct, i) => {
			console.log('value');
			console.log(this.selectedProducts);
		const mainProductObject = this.selectedProducts.find(
				(pro) => pro.productObject.id.toString() === inproduct.configProduct.id.toString()
			);
			const basePackType = mainProductObject.packSizes.find((pack) => pack.isBase === true);
			const _saveProduct = {
				categoryId: this.selelctedCategoryId._id,
				batchItems: [],
				facilityServiceId: this.selectedFacilityService._id,
				product: mainProductObject,
				storeId: this.checkingObject.storeId,
				margin: inproduct.margin,
				sellingPrice: inproduct.sellingPrice,
				costPrice: inproduct.costPrice,
				facilityId:this.selectedFacility._id
			};
			inproduct.batches.forEach((batch, j) => {
				const _saveBatch = {
					availableQuantity: batch.quantity,
					batchNumber: batch.batchNumber,
					config: basePackType, // product pack config
					expiryDate: batch.expiryDate,
					quantity: batch.quantity,
					costPrice: inproduct.costPrice,
					facilityId:this.selectedFacility._id
				};
				_saveProduct.batchItems.push(_saveBatch);
			});
			_saveProductList.push(_saveProduct);
		});
		console.log(_saveProductList);

	this._inventoryInitialiserService.create(_saveProductList, true).then(
			//this._inventoryService.create(_saveProductList).then(
			(result) => {
				console.log(result);
				if (result.status === 'success') {
					this.saving = false;
					this.productForm.controls['productArray'] = new FormArray([]);
					this.productConfigSearch.reset();
					this.selectedProducts = [];
					this.productConfigs = [];
					this.systemModuleService.announceSweetProxy(
						'Your product has been initialised successfully',
						'success',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
					this.productForm.controls['productArray'] = new FormArray([]);
					this.getInitializedProductList();
				} else {
					this.saving = false;
					const text = 'This product exist in your inventory';
					this.systemModuleService.announceSweetProxy(text, 'info');
				}
			},
			(error) => {
				this.saving = false;
				const errMsg = 'There was an error while initialising product, please try again!';
				this.systemModuleService.announceSweetProxy(errMsg, 'error');
			}
	);
	}

	onSubmit() {}

	loadCurrentPage(event) {
		this.skip = event;
		this.getInitializedProductList();
	}
}
