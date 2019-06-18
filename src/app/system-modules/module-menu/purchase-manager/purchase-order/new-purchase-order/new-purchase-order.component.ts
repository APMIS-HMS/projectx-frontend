import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	SupplierService,
	StrengthService,
	ProductService,
	PurchaseOrderService,
	StoreService,
	FacilitiesService,
	EmployeeService,
	InventoryService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../models/index';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PurchaseOrder } from '../../../../../models/index';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-new-purchase-order',
	templateUrl: './new-purchase-order.component.html',
	styleUrls: [ './new-purchase-order.component.scss' ]
})
export class NewPurchaseOrderComponent implements OnInit {
	mainErr = true;
	errMsg = 'you have unresolved errors';

	flyout = false;
	counter = 0;
	public frm_purchaseOrder: FormGroup;

	suppliers: any[] = [];
	strengths: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedPurchaseOrder: any = <any>{};

	productTableForm: FormGroup;
	checkingObject: any = <any>{};
	subscription: any = <any>{};
	searchControl = new FormControl();

	checkBoxLabels = [];

	value: Date = new Date(1981, 3, 27);
	now: Date = new Date();
	min: Date = new Date(1900, 0, 1);
	dateClear = new Date(2015, 11, 1, 6);
	maxLength = null;

	products: any[] = [];
	productTables: any[] = [];
	superGroups: any[] = [];
	stores: any[] = [];
	removingRecord = false;

	loginEmployee: Employee = <Employee>{};

	saveBtnText = 'Done';
	loading: boolean = false;

	constructor(
		private formBuilder: FormBuilder,
		private supplierService: SupplierService,
		private facilitiesService: FacilitiesService,
		private storeService: StoreService,
		private route: ActivatedRoute,
		private router: Router,
		private strengthService: StrengthService,
		private locker: CoolLocalStorage,
		private productService: ProductService,
		private purchaseOrderService: PurchaseOrderService,
		private systemModuleService: SystemModuleService,
		private authFacadeService: AuthFacadeService,
		private employeeService: EmployeeService,
		private inventoryService: InventoryService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingObject = res.typeObject;
					if (!!this.checkingObject.storeId) {
						this.getStores();
						this.getAllProducts('', this.checkingObject.storeId);
						this.getStrengths();
						this.getSuppliers();
						this.route.params.subscribe((params) => {
							const id = params['id'];
							if (id !== undefined) {
								this.addNewProductTables();
								// this.getOrderDetails(id);
								this.saveBtnText = 'Update';
							}
						});
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
						this.checkingObject = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingObject);

						// tslint:disable-next-line:no-shadowed-variable
						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
								this.checkingObject = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn(this.checkingObject);
								this.locker.setObject('checkingObject', this.checkingObject);
								// this.checkingObject = this.checkingObject.typeObject;
								this.getStores();
								this.getAllProducts('', this.checkingObject.storeId);
								this.getStrengths();
								this.getSuppliers();
								this.route.params.subscribe((params) => {
									const id = params['id'];
									if (id !== undefined) {
										this.addNewProductTables();
										this.getOrderDetails(id);
										this.saveBtnText = 'Update';
									}
								});
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
									this.locker.setObject('checkingObject', this.checkingObject);
									// this.checkingObject = this.checkingObject.typeObject;
									this.getStores();
									this.getAllProducts('', this.checkingObject.storeId);
									this.getStrengths();
									this.getSuppliers();
									this.route.params.subscribe((params) => {
										const id = params['id'];
										if (id !== undefined) {
											this.addNewProductTables();
											this.getOrderDetails(id);
											this.saveBtnText = 'Update';
										}
									});
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this.checkBoxLabels = [
			{ name: 'All', checked: true },
			{ name: 'Out of stock', checked: false },
			{ name: 'Re-order Level', checked: false }
		];
		this.frm_purchaseOrder = this.formBuilder.group({
			supplier: [ '', [ <any>Validators.required ] ],
			config: new FormArray([]),
			deliveryDate: [ this.now, [ <any>Validators.required ] ],
			desc: [ '', [ <any>Validators.required ] ]
		});
		this.addNewProductTables();

		this.searchControl.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			let storeId = this.checkingObject.storeId;
			this.checkBoxLabels[0].checked = false;
			this.getAllProducts(value, storeId);
		});
	}

	getOrderDetails(id) {
		try {
			this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
			this.purchaseOrderService.get(id, {}).then(
				(payload: any) => {
					this.selectedPurchaseOrder = payload;
					this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
					this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.expectedDate);
					this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
					payload.orderedProducts.forEach((item, i) => {
						(<FormArray>this.productTableForm.controls['productTableArray']).push(
							this.formBuilder.group({
								product: [ item.productObject.name, [ <any>Validators.required ] ],
								qty: [ item.quantity, [ <any>Validators.required ] ],
								config: this.existingProductConfig(item),
								readOnly: [ false ],
								code: [ item.code ],
								id: [ item.productId ]
							})
						);
						this.superGroups.forEach((items, s) => {
							items.forEach((itemg, g) => {
								if (itemg._id === item.productId) {
									itemg.checked = true;
									this.flyout = true;
								}
							});
						});
					});
				},
				(error) => {}
			);
		} catch (e) {}
	}
	getStores() {
		this.storeService
			.find({ query: { canReceivePurchaseOrder: true, facilityId: this.selectedFacility._id } })
			.subscribe((payload) => {
				this.stores = payload.data;
			});
	}
	onProductCheckChange(event, value) {
		value.checked = event.checked;
		if (event.checked === true) {
			(<FormArray>this.productTableForm.controls['productTableArray']).push(
				this.formBuilder.group({
					product: [ value.name, [ <any>Validators.required ] ],
					qty: [ 0, [ <any>Validators.required ] ],
					config: this.initProductConfig(value.productConfigObject),
					readOnly: [ false ],
					code: [ value.code ],
					id: [ value._id ]
				})
			);
		} else {
			let indexToRemove = 0;
			(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
				const productControlValue: any = (<any>item).controls['id'].value;
				if (productControlValue === value._id || productControlValue === value.id) {
					indexToRemove = i;
				}
			});
			const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
			if (count === 1) {
				this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
			} else {
				(<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(indexToRemove, 1);
			}
			let indx = indexToRemove;
			if (indexToRemove > 0) {
				indx = indexToRemove - 1;
			}

			this.onPackageSize(indx, (<FormArray>this.productTableForm.controls['productTableArray']).controls);
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

	existingProductConfig(config) {
		let frmArray = new FormArray([]);
		config.qtyDetails.forEach((element) => {
			frmArray.push(
				new FormGroup({
					size: new FormControl(element.quantity),
					packsizes: new FormControl(config.productObject.productConfigObject),
					packItem: new FormControl(element.packId)
				})
			);
		});
		return frmArray;
	}

	getProductConfig(form) {
		return form.controls.config.controls;
	}

	compareItems(l1: any, l2: any) {
		return l1.includes(l2);
	}

	removeProduct(index, value) {
		this.superGroups.forEach((parent, i) => {
			parent.forEach((group, j) => {
				if (group._id === value.id) {
					group.checked = false;
					if (true) {
						const event: any = { checked: false };
						this.onProductCheckChange(event, value);
					}
					const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
					if (count === 0) {
						this.addNewProductTables();
					}
				}
			});
		});
	}
	unCheckedAllProducts() {
		this.superGroups.forEach((parent, i) => {
			parent.forEach((group, j) => {
				group.checked = false;
				if (this.selectedPurchaseOrder._id !== undefined) {
					const event: any = { checked: false };
					// this.onProductCheckChange(event, value);
				}
				const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
				if (count === 1) {
					this.addNewProductTables();
				}
			});
		});
	}
	login(valid) {
		if (valid) {
		} else {
			this.mainErr = false;
		}
	}
	getAllProducts(name, storeId) {
		this.systemModuleService.on();
		this.inventoryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					'productObject.name': {
						$regex: name,
						$options: 'i'
					},
					storeId: storeId,
					$sort: { createdAt: -1 }
				}
			})
			.then((payload) => {
				this.systemModuleService.off();
				if (payload.data.length > 0) {
					this.products = [];
					this.getProductTables(this.products);
					payload.data.forEach((item, i) => {
						if (!!item.productObject) {
							this.products.push(item.productObject);
						}
					});
					this.getProductTables(this.products);
				} else {
					this.superGroups = [];
				}
			});
	}

	onPackageSize(i, packs) {
		if (packs[i] !== undefined) {
			packs[i].controls.qty.setValue(0);
			packs[i].controls.config.controls.forEach((element) => {
				packs[i].controls.qty.setValue(
					packs[i].controls.qty.value +
						element.value.size *
							element.value.packsizes.find((x) => x._id.toString() === element.value.packItem.toString())
								.size
				);
			});
		}
	}

	onAddPackSize(pack, form) {
		form.controls.config.push(
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

	getProductTables(products: any[]) {
		this.productTables = products;
		this.superGroups = [];
		let group: any[] = [];
		let counter = 0;
		for (let i = 0; i < this.productTables.length; i++) {
			if (this.superGroups.length < 1) {
				group = [];
				let obj = <any>{
					checked: false,
					name: this.productTables[i].name,
					_id: this.productTables[i].id,
					code: this.productTables[i].code,
					productConfigObject: this.productTables[i].productConfigObject
				};
				obj = this.mergeTable(obj);
				group.push(obj);
				this.superGroups.push(group);
			} else {
				if (counter < 1) {
					let obj = <any>{
						checked: false,
						name: this.productTables[i].name,
						_id: this.productTables[i].id,
						code: this.productTables[i].code,
						productConfigObject: this.productTables[i].productConfigObject
					};
					obj = this.mergeTable(obj);
					this.superGroups[counter].push(obj);
					counter = counter + 1;
				} else {
					counter = 0;
					let obj = <any>{
						checked: false,
						name: this.productTables[i].name,
						_id: this.productTables[i].id,
						code: this.productTables[i].code,
						productConfigObject: this.productTables[i].productConfigObject
					};
					obj = this.mergeTable(obj);
					this.superGroups[counter].push(obj);
					counter = counter + 1;
				}
			}
		}
	}

	mergeTable(obj) {
		(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
			const productControlValue: any = (<any>item).controls['id'].value;
			if (productControlValue === obj._id) {
				obj.checked = true;
			}
		});
		return obj;
	}
	getSuppliers() {
		this.supplierService
			.find({ query: { facilityId: this.selectedFacility._id, isActive: true }, $paginate: false })
			.then((payload) => {
				this.suppliers = payload.data;
			});
	}
	getStrengths() {
		this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).then((payload) => {
			this.strengths = payload.data;
		});
	}
	addNewProductTables() {
		this.productTableForm = this.formBuilder.group({
			productTableArray: this.formBuilder.array([
				this.formBuilder.group({
					product: [ '', [ <any>Validators.required ] ],
					qty: [ 0, [ <any>Validators.required ] ],
					config: new FormArray([]),
					readOnly: [ false ],
					id: [ '' ]
				})
			])
		});
		this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
	}

	getInventories() {
		this.systemModuleService.on();
		this.products = [];
		if (this.checkingObject !== null) {
			this.inventoryService
				.findList({
					query: { facilityId: this.selectedFacility._id, name: '', storeId: this.checkingObject.storeId } // , $limit: 200 }
				})
				.then((payload) => {
					const products = payload.data.filter((x) => x.availableQuantity === 0);
					products.forEach((element) => {
						this.products.push(element.productObject);
						this.getProductTables(this.products);
					});
					this.systemModuleService.off();
				});
		}
	}

	getProductsReorderInventory(storeId) {
		this.systemModuleService.on();
		this.inventoryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: storeId,
					$sort: { createdAt: -1 }
				}
			})
			.then((payload) => {
				this.systemModuleService.off();
				if (payload.data.length > 0) {
					let reOrderProducts = payload.data.filter(
						(x) => x.reorder !== undefined && x.availableQuantity <= x.reorder
					);
					this.products = [];
					this.getProductTables(this.products);
					reOrderProducts.forEach((item, i) => {
						if (item.productObject !== undefined) {
							this.products.push(item.productObject);
						}
					});
					this.getProductTables(this.products);
				} else {
					this.superGroups = [];
				}
			});
	}

	getProductsOutofStockInventory(storeId) {
		this.systemModuleService.on();
		this.inventoryService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					storeId: storeId,
					availableQuantity: 0
				}
			})
			.then((payload) => {
				this.systemModuleService.off();
				if (payload.data.length > 0) {
					this.products = [];
					this.getProductTables(this.products);
					payload.data.forEach((item, i) => {
						if (item.productObject !== undefined) {
							this.products.push(item.productObject);
						}
					});
					this.getProductTables(this.products);
				} else {
					this.superGroups = [];
				}
			});
	}

	onChecked(e, item, checkBoxLabel, i) {
		item.checked = e.checked;
		this.products = [];

		this.getProductTables(this.products);
		if (e.checked) {
			let storeId = this.checkingObject.storeId;
			if (i === 0) {
				checkBoxLabel[1].checked = false;
				checkBoxLabel[2].checked = false;
				this.getAllProducts('', storeId);
			} else if (i === 1) {
				checkBoxLabel[0].checked = false;
				checkBoxLabel[2].checked = false;
				this.getProductsOutofStockInventory(storeId);
			} else if (i === 2) {
				checkBoxLabel[1].checked = false;
				checkBoxLabel[0].checked = false;
				this.products = [];
				this.getProductsReorderInventory(storeId);
			}
		} else {
			checkBoxLabel[0].checked = false;
			checkBoxLabel[1].checked = false;
			checkBoxLabel[2].checked = false;
			this.products = [];
			this.getProductTables(this.products);
		}
	}
	save() {
		this.flyout = false;
		this.loading = true;
		if (this.saveBtnText === 'Done') {
			const purchaseOrder: PurchaseOrder = <PurchaseOrder>{};
			purchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
			purchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
			purchaseOrder.remark = this.frm_purchaseOrder.value.desc;
			purchaseOrder.storeId = this.checkingObject.storeId;
			purchaseOrder.facilityId = this.selectedFacility._id;
			purchaseOrder.createdBy = this.loginEmployee._id;
			purchaseOrder.orderedProducts = [];
			(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
				const item = itemi.value;
				const product: any = <any>{};
				product.productId = item.id;
				let val = JSON.parse(JSON.stringify(item));
				val.name = val.product;
				delete val.product;
				product.productObject = val;
				product.quantity = item.qty;
				product.qtyDetails = [];
				item.config.forEach((element) => {
					product.qtyDetails.push({
						packId: element.packItem,
						quantity: element.size
					});
				});
				purchaseOrder.orderedProducts.push(product);
			});
			this.purchaseOrderService.create(purchaseOrder).then(
				(payload) => {
					this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
					this.systemModuleService.announceSweetProxy(
						'Purchase order ' + payload.purchaseOrderNumber + ' was created',
						'success',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
					this.frm_purchaseOrder.reset();
					this.router.navigate([ '/dashboard/purchase-manager/orders' ]);
					this.loading = false;
				},
				(error) => {
					this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
					this.loading = false;
				}
			);
		} else {
			this.selectedPurchaseOrder.expectedDate = this.frm_purchaseOrder.value.deliveryDate;
			this.selectedPurchaseOrder.supplierId = this.frm_purchaseOrder.value.supplier;
			this.selectedPurchaseOrder.remark = this.frm_purchaseOrder.value.desc;
			this.selectedPurchaseOrder.storeId = this.checkingObject.storeId;
			this.selectedPurchaseOrder.facilityId = this.selectedFacility._id;
			this.selectedPurchaseOrder.createdBy = this.loginEmployee._id;
			this.selectedPurchaseOrder.orderedProducts = [];
			(<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((itemi, i) => {
				const item = itemi.value;
				const product: any = <any>{};
				product.productId = item.id;
				let val = JSON.parse(JSON.stringify(item));
				val.name = val.product;
				delete val.product;
				product.productObject = val;
				product.quantity = item.qty;
				product.qtyDetails = [];
				item.config.forEach((element) => {
					let val: any = <any>{};
					val.packId = element.packItem;
					val.quantity = element.size;
					product.qtyDetails.push(val);
				});
				this.selectedPurchaseOrder.orderedProducts.push(product);
			});
			this.purchaseOrderService.patch(this.selectedPurchaseOrder._id, this.selectedPurchaseOrder).subscribe(
				(payload) => {
					this.systemModuleService.announceSweetProxy(
						'Purchase order ' + payload.purchaseOrderNumber + ' was updated',
						'success',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
					this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
					this.unCheckedAllProducts();
					this.router.navigate([ '/dashboard/purchase-manager/orders' ]);
					this.loading = false;
					// (<FormArray>this.productTableForm.controls['productTableArray']).set = this.formBuilder.array([]);
				},
				(error) => {
					this.systemModuleService.announceSweetProxy('Failed to create purchase order', 'error');
					this.loading = false;
				}
			);
		}
	}
	hasBeenRemoved() {
		const productRemoved: any[] = [];
		this.productTableForm.controls['productTableArray'].value.forEach((itemm, m) => {
			let isExisting = false;
			this.selectedPurchaseOrder.orderedProducts.forEach((itemi, i) => {
				if (itemi.productId === itemm.id) {
					isExisting = true;
				}
			});
			if (isExisting === false) {
				productRemoved.push(itemm);
			}
		});
		productRemoved.forEach((itemr, r) => {
			this.selectedPurchaseOrder.orderedProducts.forEach((itemp, p) => {
				if (itemr.id === itemp.productId) {
					this.selectedPurchaseOrder.orderedProducts.splice(p, 1);
				}
			});
		});
		return productRemoved;
	}
	flyout_toggle(e) {
		this.flyout = !this.flyout;
		e.stopPropagation();
	}
	flyout_close(e) {
		if (this.flyout === true) {
			this.flyout = false;
		}
	}

	ngOnDestroy() {
		if (this.loginEmployee.storeCheckIn !== undefined) {
			this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
				// if (itemr.storeObject === undefined) {
				//   const store_ = this.loginEmployee.storeCheckIn.find(x => x.storeId.toString() === itemr.storeId.toString());
				//   itemr.storeObject = store_.storeObject;
				//   console.log(itemr.storeObject);
				// }
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
}
