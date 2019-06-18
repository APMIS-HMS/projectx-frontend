import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility, Inventory, InventoryTransaction } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import {
	ProductService,
	InventoryInitialiserService,
	FacilitiesServiceCategoryService,
	EmployeeService,
	InventoryService
} from '../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-initialize-store',
	templateUrl: './initialize-store.component.html',
	styleUrls: [ './initialize-store.component.scss' ]
})
export class InitializeStoreComponent implements OnInit {
	selectedFacility: Facility = <Facility>{};
	isEnable = false;
	saveAlert: true;
	products: any;
	selectedProduct: any = <any>{};
	selectedFacilityService: any = <any>{};
	categories: any = <any>[];
	selelctedCategoryId: any = <any>{};
	myForm: FormGroup;
	batchForm: FormGroup;
	productServiceControl = new FormControl('');
	editProductnameControl = new FormControl();
	ischeck: boolean;
	isEditProductName = false;
	name: any;
	isProcessing = false;
	isItemselected = true;
	checkingObject: any = <any>{};
	inventoryModel: Inventory = <Inventory>{};
	InventoryTxnModel: InventoryTransaction = <InventoryTransaction>{};
	// initializePriduct: InitProduct[];
	errorMessage = 'an error occured';
	addinside = false;
	productname: any;
	searchProduct: any;
	loginEmployee: any;
	subscription: any;
	searchControl = new FormControl();
	selectedPacks = [];

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _inventoryEventEmitter: InventoryEmitterService,
		private _productService: ProductService,
		private _inventoryInitialiserService: InventoryInitialiserService,
		private authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService,
		private employeeService: EmployeeService,
		private inventoryService: InventoryService,
		private facilityServiceCategoryService: FacilitiesServiceCategoryService
	) {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingObject = res.typeObject;
					this.getProducts();
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
						this.checkingObject = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingObject);

						// tslint:disable-next-line:no-shadowed-variable
						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
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
							// tslint:disable-next-line:no-shadowed-variable
							this.employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload) => {
									this.loginEmployee = payload;
									this.checkingObject = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkingObject);
									this._locker.setObject('checkingObject', this.checkingObject);
								});
						}
					});
				}
				this.getProducts();
			}
		});
	}

	ngOnInit() {
		this._inventoryEventEmitter.setRouteUrl('Initialize Store');
		this.myForm = this._fb.group({
			initproduct: this._fb.array([])
		});

		this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe((por: any) => {
			if (this.checkingObject.storeId === undefined) {
				if (!!this.checkingObject.typeObject) {
					this.checkingObject = this.checkingObject.typeObject;
				}
			}
			this.systemModuleService.on();
			this._productService
				.findProductConfigs({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingObject.storeId,
						'productObject.name': {
							$regex: por,
							$options: 'i'
						}
					}
				})
				.then(
					(payload) => {
						this.systemModuleService.off();
						this.products = payload.data;
					},
					(err) => {
						this.systemModuleService.off();
					}
				);
		});

		this.productServiceControl.valueChanges.subscribe((value) => {
			this.selelctedCategoryId = value;
		});
		this.getServiceCategories();
	}

	onChangeProductCategory(value) {
		this.productServiceControl.setValue(value._id);
	}

	getValid() {
		if (this.isEnable && !this.isItemselected && this.myForm.valid) {
			return false;
		}
		return true;
	}

	addBatch(i: number): void {
		const control = <FormArray>this.myForm.controls['initproduct'];
		control.push(this.createbatch());
	}

	createbatch(): FormGroup {
		if (this.selectedProduct.packSizes !== undefined) {
			return this._fb.group({
				batchNumber: [ '', Validators.required ],
				quantity: [ '', Validators.required ],
				config: this.initProductConfig(this.selectedProduct.packSizes),
				expiryDate: [ new Date() ]
			});
		} else {
			return this._fb.group({
				batchNumber: [ '', Validators.required ],
				quantity: [ '', Validators.required ],
				config: [],
				expiryDate: [ new Date() ]
			});
		}
	}

	async addProduct(product: any) {
		if (this.checkingObject.storeId === undefined) {
			if (!!this.checkingObject.typeObject) {
				this.checkingObject = this.checkingObject.typeObject;
			}
		}
		const isVended = await this.inventoryService.find({
			query: {
				productId: product.productId,
				storeId: this.checkingObject.storeId,
				facilityId: this.selectedFacility._id
			}
		});
		if (isVended.data.length === 0) {
			this.isEditProductName = false;
			this.isEnable = true;
			this.isItemselected = false;
			this.myForm = this._fb.group({
				initproduct: this._fb.array([])
			});
			this.selectedProduct = product;
			const control = <FormArray>this.myForm.controls['initproduct'];
			if (product.packSizes !== undefined) {
				let prodObj = this._fb.group({
					batchNumber: [ '', Validators.required ],
					quantity: [ '', Validators.required ],
					config: this.initProductConfig(product.packSizes),
					expiryDate: [ new Date() ]
				});

				control.push(prodObj);
			} else {
				control.push(
					this._fb.group({
						batchNumber: [ '', Validators.required ],
						quantity: [ '', Validators.required ],
						config: [],
						expiryDate: [ new Date() ]
					})
				);
			}
		} else {
			//This product exist in your inventory
			this.systemModuleService.announceSweetProxy('This product exist in your inventory', 'error');
		}
	}
	initProductConfig(config) {
		let frmArray = new FormArray([]);
		frmArray.push(
			new FormGroup({
				size: new FormControl(0),
				packsizes: new FormControl(config),
				packItem: new FormControl()
			})
		);
		return frmArray;
	}
	getProductConfig(form) {
		return form.controls.config.controls;
	}
	removeBatch(i: number) {
		const control = <FormArray>this.myForm.controls['initproduct'];
		control.removeAt(i);
		let indx = i;
		if (i > 0) {
			indx = i - 1;
		}
		this.onPackageSize(indx, (<FormArray>this.myForm.controls['initproduct']).controls);
	}

	getProducts() {
		if (this.checkingObject.storeId === undefined) {
			if (!!this.checkingObject.typeObject) {
				this.checkingObject = this.checkingObject.typeObject;
			}
		}
		this.systemModuleService.on();
		this._productService
			.findProductConfigs({
				query: { facilityId: this.selectedFacility._id, storeId: this.checkingObject.storeId }
			})
			.then(
				(payload) => {
					this.systemModuleService.off();
					this.products = payload.data;
				},
				(err) => {}
			);
	}

	onPackageSize(i, packs) {
		if (!!packs[i]) {
			packs[i].controls.quantity.setValue(0);
			packs[i].controls.config.controls.forEach((element) => {
				packs[i].controls.quantity.setValue(
					packs[i].controls.quantity.value +
						element.value.size *
							element.value.packsizes.find((x) => x._id.toString() === element.value.packItem.toString())
								.size
				);
			});
		}
	}

	compareItems(l1: any, l2: any) {
		return l1.includes(l2);
	}

	onAddPackSize(pack, form) {
		form.controls.config.controls.push(
			new FormGroup({
				size: new FormControl(0),
				packsizes: new FormControl(pack),
				packItem: new FormControl()
			})
		);
	}

	onRemovePack(pack, form, k, index) {
		pack.controls.config.removeAt(k);
		this.onPackageSize(index, form);
	}

	getServiceCategories() {
		this.facilityServiceCategoryService
			.find({ query: { facilityId: this.selectedFacility._id } })
			.subscribe((payload) => {
				if (payload.data.length > 0) {
					this.selectedFacilityService = payload.data[0];
					this.categories = payload.data[0].categories;
					this.productServiceControl.setValue(this.categories[0]._id);
				}
			});
	}

	getBasePackName(packConfig) {
		return packConfig.find((x) => x.isBase === true).name;
	}

	onEditProductName() {
		this.isEditProductName = !this.isEditProductName;
		this.editProductnameControl.setValue(this.selectedProduct.productObject.name);
	}

	onEditSaveProductName() {
		if (this.isEditProductName) {
			if (this.selectedProduct.productObject !== undefined) {
				this.selectedProduct.productObject.name = this.editProductnameControl.value;
			} else {
				this.selectedProduct.productObject = {};
				this.selectedProduct.productObject.name = this.editProductnameControl.value;
			}
		}
		this.isEditProductName = false;
	}

	save(valid, value, product) {
		this.isEnable = false;
		if (this.checkingObject.storeId === undefined) {
			if (!!this.checkingObject.typeObject) {
				this.checkingObject = this.checkingObject.typeObject;
			}
		}
		if (valid) {
			const batches = {
				batchItems: [],
				product: {},
				storeId: 0,
				facilityServiceId: this.selectedFacilityService._id,
				categoryId: this.selelctedCategoryId
			};
			value.initproduct.forEach((element) => {
				element.availableQuantity = element.quantity;
			});
			batches.batchItems = value.initproduct;
			batches.product = product;
			batches.storeId = this.checkingObject.storeId;
			this.isProcessing = true;
			this._inventoryInitialiserService.create(batches).then(
				(result) => {
					if (result != null) {
						if (result.inventory !== undefined) {
							this.getProducts();
							this.myForm = this._fb.group({
								initproduct: this._fb.array([])
							});
							this.isEnable = false;
							this.isProcessing = false;
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
						} else {
							const text = 'This product exist in your inventory';
							this.systemModuleService.announceSweetProxy(text, 'info');
							this.isEnable = false;
							this.isProcessing = false;
						}
					}
				},
				(error) => {
					const errMsg = 'There was an error while initialising product, please try again!';
					this.systemModuleService.announceSweetProxy(errMsg, 'error');
					this.isEnable = true;
					this.isItemselected = false;
				}
			);
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
		this._locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}
}
