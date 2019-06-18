import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import {
	StoreService,
	ProductService,
	InventoryService,
	EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { ProductConfig } from '../../../../models/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-reorder-level',
	templateUrl: './reorder-level.component.html',
	styleUrls: [ './reorder-level.component.scss' ]
})
export class ReorderLevelComponent implements OnInit {
	productTableForm: FormGroup;
	reorderLevel = new FormControl();
	packType = new FormControl();
	product = new FormControl();

	public showNewForm = false;

	newReorderLevel = new FormControl('', [ <any>Validators.required ]);
	newPackType = new FormControl(0, [ <any>Validators.required ]);
	newProduct = new FormControl('', [ <any>Validators.required ]);
	editLevel = false;
	selectedPack = {};
	selectedFacility: any = <any>{};
	subscription: any = <any>{};
	products = <any>[];
	reorderProducts = <any>[];

	user: any = <any>{};
	loginEmployee: any = <any>{};
	checkingStore: any = <any>{};
	disableCreateBtn = false;

	collapseProductContainer = false;
	selectedProduct: any = <any>{};
	editSelectedProduct: any = <any>{};

	addBtnDisable = true;

	constructor(
		private formBuilder: FormBuilder,
		private productService: ProductService,
		private _locker: CoolLocalStorage,
		private authFacadeService: AuthFacadeService,
		private employeeService: EmployeeService,
		private systemModuleService: SystemModuleService
	) {
		this.selectedFacility = <any>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this.setExistingReorderData();
					}
				}
			}
		});

		this.initializeReorderProperties();
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			this.setExistingReorderData();
		});
	}

	ngOnInit() {
		this.newProduct.valueChanges.debounceTime(200).distinctUntilChanged().subscribe((value) => {
			if (
				this.products.filter((x) => x.name === this.newProduct.value).length === 1 ||
				this.newProduct.value === ' '
			) {
				this.collapseProductContainer = false;
			} else {
				this.systemModuleService.on();
				this.productService
					.findProductConfigs({
						query: {
							facilityId: this.selectedFacility._id,
							'productObject.name': {
								$regex: value,
								$options: 'i'
							},
							storeId: this.checkingStore.storeId
						}
					})
					.then((payload) => {
						this.collapseProductContainer = true;
						this.systemModuleService.off();
						this.products = JSON.parse(JSON.stringify(payload.data));
					});
			}
		});
	}

	initializeReorderProperties() {
		this.productTableForm = this.formBuilder.group({
			productTableArray: this.formBuilder.array([
				this.formBuilder.group({
					product: [ {}, [ <any>Validators.required ] ],
					reOrderLevel: [ 0, [ <any>Validators.required ] ],
					packTypeId: [ '', [ <any>Validators.required ] ],
					productItemConfigObject: [ {}, [ <any>Validators.required ] ],
					isEdit: [ false, [ <any>Validators.required ] ],
					id: [ '', [ <any>Validators.required ] ]
				})
			])
		});
		this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
	}

	setExistingReorderData() {
		this.initializeReorderProperties();
		// this.systemModuleService.on();
		this.productService
			.findReorder({ query: { facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId } })
			.then(
				(payload) => {
					this.systemModuleService.off();
					this.reorderProducts = payload.data.forEach((element) => {
						if (element.productConfigObject !== undefined) {
							if (!!element.productObject) {
								element.productObject.productConfigObject = element.productConfigObject;
								(<FormArray>this.productTableForm.controls['productTableArray']).push(
									this.formBuilder.group({
										product: [ element.productObject, [ <any>Validators.required ] ],
										reOrderLevel: [ element.reOrderLevel, [ <any>Validators.required ] ], // payload.data.length > 0 ? payload.data[0] : undefined
										packTypeId: [
											element.productItemConfigObject !== undefined
												? element.productItemConfigObject._id
												: element.productConfigObject.find((x) => x.isBase === true)._id,
											[ <any>Validators.required ]
										],
										productItemConfigObject: [
											element.productItemConfigObject !== undefined
												? element.productItemConfigObject
												: element.productConfigObject.find((x) => x.isBase === true),
											[ <any>Validators.required ]
										],
										isEdit: [ false, [ <any>Validators.required ] ],
										id: [ element._id ]
									})
								);
							}
						}
					});
				},
				(er) => {
					this.systemModuleService.off();
				}
			);
	}

	async onSelectProduct(product) {
		const existingReorder = await this.productService.findReorder({ query: { productId: product.productId } });
		if (existingReorder.data.length > 0) {
			this.systemModuleService.announceSweetProxy('Reorder level has been set on this product.', 'error');
			this.newProduct.reset();
			this.newPackType.reset();
		} else {
			this.collapseProductContainer = false;
			this.selectedProduct = product;
			this.newProduct.setValue(product.productObject.name);
			this.selectedProduct.productConfigObject = this.selectedProduct.packSizes;
		}
	}

	isReorderUniqueProducts(productId) {
		this.productService.findReorder({ query: { productId: productId } }).then((payload) => {
			if (payload.data !== undefined && payload.data.length > 0) {
				return true;
			} else {
				return false;
			}
		});
	}

	getProductConfig(form) {
		return form.controls.config.controls;
	}

	comparePack(l1: any, l2: any) {
		return l1.includes(l2);
	}

	setLevel_click() {
		if (!!this.checkingStore.typeObject) {
			this.checkingStore = this.checkingStore.typeObject;
		}
		if (this.newPackType.valid && this.newProduct.valid && this.newReorderLevel.valid) {
			this.disableCreateBtn = true;
			const packSize = this.selectedProduct.productConfigObject.find(
				(x) => x._id.toString() === this.newPackType.value.toString()
			);
			let reOrder: any = {};
			reOrder.productId = this.selectedProduct.productObject.id;
			reOrder.productObject = this.selectedProduct.productObject;
			reOrder.storeId = this.checkingStore.storeId;
			reOrder.facilityId = this.selectedFacility._id;
			reOrder.reOrderLevel = this.newReorderLevel.value;
			reOrder.reOrderSizeId = packSize._id;
			this.systemModuleService.on();
			this.productService.createReorder(reOrder).then((payload) => {
				this.systemModuleService.off();
				this.disableCreateBtn = false;
				this.addBtnDisable = true;
				this.newPackType.reset();
				this.newReorderLevel.reset();
				this.newProduct.setValue(' ');
				this.initializeReorderProperties();
				this.systemModuleService.announceSweetProxy('Product Re-order level created successfully', 'success');
				this.setExistingReorderData();
			});
		} else {
			this.systemModuleService.announceSweetProxy('Missing field(s)', 'error');
		}
	}

	onEdit_click(form) {
		form.value.isEdit = !form.value.isEdit;
		form.setValue(JSON.parse(JSON.stringify(form.value)));
	}

	onSaveEdit_click(form) {
		if (form.valid) {
			this.systemModuleService.on();
			this.productService
				.patchReorder(form.value.id, {
					reOrderLevel: form.value.reOrderLevel,
					reOrderSizeId: form.value.packTypeId
				})
				.then(
					(payload) => {
						this.systemModuleService.off();
						this.initializeReorderProperties();
						this.systemModuleService.announceSweetProxy(
							'Product Re-order level updated successfully',
							'success'
						);
						this.setExistingReorderData();
					},
					(error) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing--3', 'error');
					}
				);
		} else {
			this.systemModuleService.off();
			this.systemModuleService.announceSweetProxy('Update failed!!! field(s) is missing', 'error');
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
						(err) => {
							// console.log(err);
						}
					);
				}
			});
		}
		this.employeeService.announceCheckIn(undefined);
		this._locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}

	toggleNewForm() {
		this.showNewForm = !this.showNewForm;
	}
}
