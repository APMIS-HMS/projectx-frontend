import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import {
	SupplierService,
	ProductService,
	StoreService,
	PurchaseOrderService,
	StrengthService,
	PurchaseEntryService,
	InventoryService,
	FacilitiesServiceCategoryService,
	EmployeeService
} from '../../../../services/facility-manager/setup/index';
import {
	Facility,
	PurchaseOrder,
	PurchaseEntry,
	Inventory,
	InventoryTransaction,
	Employee
} from '../../../../models/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';

@Component({
	selector: 'app-purchase-entry',
	templateUrl: './purchase-entry.component.html',
	styleUrls: [ './purchase-entry.component.scss' ]
})
export class PurchaseEntryComponent implements OnInit {
	mainErr = true;
	errMsg = 'You have unresolved errors';

	flyout = false;

	public frm_purchaseOrder: FormGroup;
	suppliers: any[] = [];
	strengths: any[] = [];
	selectedFacility: Facility = <Facility>{};
	value: Date = new Date(1981, 3, 27);
	now: Date = new Date();
	min: Date = new Date(1900, 0, 1);
	dateClear = new Date(2015, 11, 1, 6);
	maxLength = null;
	totalCost = 0;
	orderId: any = undefined;
	invoiceId: any = undefined;
	additionalProducts = [];

	searchControl = new FormControl();
	packSizeVariant = new FormControl();
	checkAll = new FormControl();
	zeroQuantity = new FormControl();
	reOrderLevelQuantity = new FormControl();
	myInventory = new FormControl();
	expired = new FormControl();
	productTableForm: FormGroup;
	products: any[] = [];
	productTables: any[] = [];
	superGroups: any[] = [];
	stores: any[] = [];
	orders: any[] = [];
	checkBoxLabels: any[] = [];
	selectedFacilityService = [];
	categories = [];

	selectedPurchaseEntry: PurchaseEntry = <PurchaseEntry>{};
	selectedOrder: PurchaseOrder = <PurchaseOrder>{};
	loginEmployee: Employee = <Employee>{};
	checkingObject: any = <any>{};
	subscription: any = <any>{};
	constructor(
		private formBuilder: FormBuilder,
		private supplierService: SupplierService,
		private storeService: StoreService,
		private locker: CoolLocalStorage,
		private productService: ProductService,
		private purchaseOrderService: PurchaseOrderService,
		private strengthService: StrengthService,
		private route: ActivatedRoute,
		private purchaseEntryService: PurchaseEntryService,
		private inventoryService: InventoryService,
		private _purchaseEventEmitter: PurchaseEmitterService,
		private router: Router,
		private authFacadeService: AuthFacadeService,
		private systemModuleService: SystemModuleService,
		private employeeService: EmployeeService,
		private facilityServiceCategoryService: FacilitiesServiceCategoryService
	) {
		this._purchaseEventEmitter.setRouteUrl('Purchase Entry');
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingObject = res.typeObject;
					if (!!this.checkingObject.storeId) {
						this.getMyInventory(this.checkingObject.storeId, '');
						this.getSuppliers();
						this.getStores();
						this.getStrengths();
						this.route.params.subscribe((params) => {
							const id = params['id'];
							this.orderId = id;
							if (this.orderId !== undefined) {
								this.getOrderDetails(this.orderId, false);
							}
							const invoiceId = params['invoiceId'];
							if (invoiceId !== undefined) {
								this.invoiceId = invoiceId;
								this.checkAll.setValue(true);
								this.getInvoiceDetails(this.invoiceId);
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
								this.getMyInventory(this.checkingObject.storeId, '');
								this.getSuppliers();
								this.getStores();
								this.getStrengths();
								this.route.params.subscribe((params) => {
									const id = params['id'];
									this.orderId = id;
									if (this.orderId !== undefined) {
										this.getOrderDetails(this.orderId, false);
									}
									const invoiceId = params['invoiceId'];
									if (invoiceId !== undefined) {
										this.invoiceId = invoiceId;
										this.checkAll.setValue(true);
										this.getInvoiceDetails(this.invoiceId);
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
									this.getMyInventory(this.checkingObject.storeId, '');
									this.getSuppliers();
									this.getStores();
									this.getStrengths();
									this.route.params.subscribe((params) => {
										const id = params['id'];
										this.orderId = id;
										if (this.orderId !== undefined) {
											this.getOrderDetails(this.orderId, false);
										}
										const invoiceId = params['invoiceId'];
										if (invoiceId !== undefined) {
											this.invoiceId = invoiceId;
											this.checkAll.setValue(true);
											this.getInvoiceDetails(this.invoiceId);
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
			{ name: 'All', checked: false },
			{ name: 'Out of stock', checked: true },
			{ name: 'Out of stock', checked: false },
			{ name: 'Re-order Level', checked: false },
			{ name: 'Expired', checked: false }
		];
		this.myInventory.valueChanges.subscribe((value) => {
			if (value === true) {
				this.zeroQuantity.setValue(false);
				this.reOrderLevelQuantity.setValue(false);
				this.getMyInventory(this.checkingObject.storeId, '');
			}
		});

		this.zeroQuantity.valueChanges.subscribe((value) => {
			if (value === true) {
				this.myInventory.setValue(false);
				this.reOrderLevelQuantity.setValue(false);
				this.getProductsOutofStockInventory(this.checkingObject.storeId);
			}
		});

		this.reOrderLevelQuantity.valueChanges.subscribe((value) => {
			if (value === true) {
				this.myInventory.setValue(false);
				this.zeroQuantity.setValue(false);
				this.getProductsReorderInventory(this.checkingObject.storeId);
			}
		});

		// this.checkAll.valueChanges.subscribe(value => {
		//   if (value === true) {
		//     this.myInventory.setValue(false);
		//     this.getAllProducts();
		//   } else {

		//   }
		// });

		this.frm_purchaseOrder = this.formBuilder.group({
			orderId: [ , [] ],
			supplier: [ , [] ],
			deliveryDate: [ this.now, [ <any>Validators.required ] ],
			invoiceNo: [ '', [ <any>Validators.required ] ],
			amount: [ 0.0, [ <any>Validators.required ] ],
			config: new FormArray([]),
			desc: [ '', [] ],
			discount: [ 0.0, [] ],
			vat: [ 0.0, [] ]
		});

		this.addNewProductTables();

		this.frm_purchaseOrder.valueChanges.subscribe((value) => {
			this.mainErr = true;
			this.errMsg = '';
		});

		this.frm_purchaseOrder.controls['supplier'].valueChanges.subscribe((value) => {
			if (value !== undefined && value !== null) {
				this.purchaseOrderService
					.find({
						query: {
							storeId: this.checkingObject.storeId,
							facilityId: this.selectedFacility._id,
							isSupplied: false
						}
					})
					.subscribe((payload) => {
						this.orders = payload.data;
					});
			}
		});

		this.frm_purchaseOrder.controls['orderId'].valueChanges.subscribe((value) => {
			// console.log(value);
			// if (this.frm_purchaseOrder.controls['orderId'].value !== undefined && this.frm_purchaseOrder.controls['orderId'].value !== null) {
			//   if (this.orderId === undefined) {
			//     this.myInventory.setValue(false);
			//     this.checkAll.setValue(true);
			//     this.systemModuleService.on();
			//     this.getMyInventory(this.checkingObject.storeId, '');
			//   }
			//   this.addNewProductTables();
			//   this.getOrderDetails(value, true);
			// }
		});

		this.searchControl.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			this.getMyInventory(this.checkingObject.storeId, value);
		});
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
					availableQuantity: 0,
					$sort: { createdAt: -1 }
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

	getMyInventory(storeId, name) {
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

	getInvoiceDetails(id) {
		this.systemModuleService.on();
		this.purchaseEntryService.get(id, {}).then((payload) => {
			this.selectedPurchaseEntry = payload;
			this.frm_purchaseOrder.controls['store'].setValue(payload.storeId);
			this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
			this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.deliveryDate);
			this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
			this.frm_purchaseOrder.controls['orderId'].setValue(payload.orderId);
			this.frm_purchaseOrder.controls['invoiceNo'].setValue(payload.invoiceNumber);
			this.frm_purchaseOrder.controls['amount'].setValue(payload.invoiceAmount);
			payload.products.forEach((item, i) => {
				this.inventoryService
					.find({
						query: {
							facilityId: this.selectedFacility._id,
							storeId: payload.storeId,
							productId: item.productId
						}
					})
					.subscribe((result) => {
						let existingInventory = {};
						if (result.data.length > 0) {
							existingInventory = result.data[0];
						}

						this.superGroups.forEach((items, s) => {
							items.forEach((itemg, g) => {
								if (itemg._id === item.productId) {
									itemg.checked = true;
									const total = item.quantity * item.costPrice;
									(<FormArray>this.productTableForm.controls['productTableArray']).push(
										this.formBuilder.group({
											product: [ itemg.name, [ <any>Validators.required ] ],
											batchNo: [ item.batchNo, [ <any>Validators.required ] ],
											costPrice: [ item.costPrice, [ <any>Validators.required ] ],
											qty: [ item.quantity, [ <any>Validators.required ] ],
											expiryDate: [ item.expiryDate, [ <any>Validators.required ] ],
											config: this.initProductConfig(itemg.productConfigObject),
											total: [ { value: total, disabled: true } ],
											readOnly: [ false ],
											id: [ item.productId ],
											// existingInventory: [existingInventory],
											productObject: [ item.product ]
										})
									);
								}
							});
						});
					});
			});
			this.systemModuleService.off();
		});
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

	onPackageSize(i, packs) {
		let totalCost = 0;
		packs[i].controls.total.setValue(0);
		packs[i].controls.qty.setValue(0);
		packs[i].controls.config.controls.forEach((element) => {
			packs[i].controls.qty.setValue(
				packs[i].controls.qty.value +
					element.value.size *
						element.value.packsizes.find((x) => x._id.toString() === element.value.packItem.toString()).size
			);
			let subTotal = packs[i].controls.costPrice.value * packs[i].controls.qty.value;
			if (isNaN(subTotal)) {
				subTotal = 0;
			}
			let strSubTotal = '₦ ' + subTotal;
			packs[i].controls.total.setValue(strSubTotal);
		});
		packs.forEach((item, i) => {
			const productControlValue: any = item.value;
			totalCost = totalCost + +productControlValue.costPrice * +productControlValue.qty;
		});
		this.frm_purchaseOrder.controls['amount'].setValue(totalCost);
	}

	getFilterPack(schedule, item) {
		const val = schedule.controls.config;
		let value = false;
		const index = schedule.controls.config.controls.filter(
			(element) =>
				element.value.packItem._id !== 0 &&
				element.value.packItem._id.toString() === item.value.packItem._id.toString()
		);
		if (index.length > 0) {
			value = true;
		} else {
			value = false;
		}
		return value;
	}

	getOrderDetails(id, isHasVal) {
		this.systemModuleService.on();
		this.purchaseOrderService.get(id, {}).then((payload: any) => {
			this.selectedOrder = payload;
			this.frm_purchaseOrder.controls['supplier'].setValue(payload.supplierId);
			this.frm_purchaseOrder.controls['deliveryDate'].setValue(payload.expectedDate);
			this.frm_purchaseOrder.controls['desc'].setValue(payload.remark);
			this.frm_purchaseOrder.controls['orderId'].setValue(payload._id);
			this.addNewProductTables();
			payload.orderedProducts.forEach((item, i) => {
				this.superGroups.forEach((items, s) => {
					items.forEach((itemg, g) => {
						if (itemg._id === item.productId) {
							itemg.checked = true;
						}
					});
				});
				(<FormArray>this.productTableForm.controls['productTableArray']).push(
					this.formBuilder.group({
						product: [ item.productObject.name, [ <any>Validators.required ] ],
						batchNo: [ '', [ <any>Validators.required ] ],
						costPrice: [ 0.0, [ <any>Validators.required ] ],
						qty: [ item.quantity, [ <any>Validators.required ] ],
						expiryDate: [ this.now, [ <any>Validators.required ] ],
						config: this.existingProductConfig(item),
						total: [ '' ],
						readOnly: [ false ],
						productObject: [ item.productObject ],
						id: [ item.productId ]
					})
				);
				this.systemModuleService.off();
			});
		});
	}
	getStores() {
		this.systemModuleService.on();
		this.storeService
			.find({ query: { canReceivePurchaseOrder: true, facilityId: this.selectedFacility._id } })
			.subscribe((payload) => {
				this.systemModuleService.off();
				this.stores = payload.data;
				if (this.orderId === undefined) {
					// this.frm_purchaseOrder.controls['store'].setValue(this.checkingObject.storeId);
					if (this.orderId === undefined && this.invoiceId === undefined) {
						this.myInventory.setValue(true);
					}
				}
			});
	}
	getAllProducts() {
		this.systemModuleService.on();
		this.productService.find({ query: { loginFacilityId: this.selectedFacility._id } }).then((payload) => {
			this.systemModuleService.off();
			this.products = payload.data;
			if (this.additionalProducts.length > 0) {
				this.additionalProducts.forEach((item) => {
					const index = this.products.filter((x) => x._id.toString() === item._id.toString());
					if (index.length === 0) {
						this.products.push(item);
					}
				});
			}
			this.getProductTables(this.products);
		});
	}
	getProductTables(products: any[]) {
		this.systemModuleService.on();
		this.productTables = products;
		this.superGroups = JSON.parse(JSON.stringify([]));
		let group: any[] = [];
		let counter = 0;
		for (let i = 0; i < this.productTables.length; i++) {
			if (this.superGroups.length < 1) {
				group = [];
				let obj = <any>{
					checked: false,
					name: this.productTables[i].name,
					_id: this.productTables[i].id,
					product: this.productTables[i]
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
						product: this.productTables[i]
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
						product: this.productTables[i]
					};
					obj = this.mergeTable(obj);
					this.superGroups[counter].push(obj);
					counter = counter + 1;
				}
			}
		}
		if (this.superGroups.length > 0 && this.invoiceId !== undefined) {
		}
		this.systemModuleService.off();
	}
	getCostSummary(i, packs) {
		packs[i].controls.total.setValue(0);
		this.totalCost = 0;
		packs.forEach((item, i) => {
			const productControlValue: any = item.value;
			this.totalCost = this.totalCost + +productControlValue.costPrice * +productControlValue.qty;
		});
		this.frm_purchaseOrder.controls['amount'].setValue(this.totalCost);
		const total = '₦ ' + packs[i].controls.qty.value * packs[i].controls.costPrice.value;
		packs[i].controls.total.setValue(total);
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
		this.systemModuleService.on();
		this.supplierService
			.find({ query: { facilityId: this.selectedFacility._id, isActive: true }, $paginate: false })
			.then((payload) => {
				this.systemModuleService.off();
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
					batchNo: [ '', [ <any>Validators.required ] ],
					costPrice: [ '', [ <any>Validators.required ] ],
					total: [ '' ],
					qty: [ '', [ <any>Validators.required ] ],
					config: new FormArray([]),
					expiryDate: [ new Date(), [ <any>Validators.required ] ],
					readOnly: [ false ],
					id: [ '' ]
				})
			])
		});
		this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
	}
	onProductCheckChange(event, value, index?) {
		value.checked = event.checked;
		const storeId = this.checkingObject.storeId;

		if (event.checked === true) {
			// this.inventoryService.find({ query: { facilityId: this.selectedFacility._id, storeId: storeId, productId: value._id } })
			//   .subscribe(result => {
			//     let existingInventory = {};
			//     if (result.data.length > 0) {
			//       existingInventory = result.data[0];
			//     }

			//   });
			if (
				this.frm_purchaseOrder.controls['invoiceNo'].value !== null &&
				this.frm_purchaseOrder.controls['invoiceNo'].value.length > 0
			) {
				(<FormArray>this.productTableForm.controls['productTableArray']).push(
					this.formBuilder.group({
						product: [ value.name, [ <any>Validators.required ] ],
						batchNo: [ '', [ <any>Validators.required ] ],
						costPrice: [ 0.0, [ <any>Validators.required ] ],
						qty: [ 0, [ <any>Validators.required ] ],
						expiryDate: [ this.now, [ <any>Validators.required ] ],
						config: this.initProductConfig(value.product.productConfigObject),
						total: [ '' ],
						readOnly: [ false ],
						// existingInventory: [existingInventory],
						productObject: [ value.product ],
						id: [ value._id ]
					})
				);
			} else {
				value.checked = false;
				this.errMsg = 'Please enter invoice number for this entry';
				this.mainErr = false;
			}
		} else {
			const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
			if (count === 1) {
				this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
			} else {
				(<FormArray>this.productTableForm.controls['productTableArray']).removeAt(index);
			}
			let indx = index;
			if (index > 0) {
				indx = index - 1;
			}
			this.onPackageSize(indx, (<FormArray>this.productTableForm.controls['productTableArray']).controls);
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
	removeProduct(index, form) {
		const value = form[index];
		this.superGroups.forEach((parent, i) => {
			parent.forEach((group, j) => {
				if (group._id === value.id) {
					group.checked = false;
					this.onProductCheckChange({ checked: false }, value, index);
					const count = form.length;
					if (count === 0) {
						this.addNewProductTables();
					}
				}
			});
		});
		this.onPackageSize(index, form);
	}

	create(valid, value) {
		if (valid) {
			/* purchase entry object initialization*/
			this.systemModuleService.on();
			value.selectedPurchaseEntry = this.selectedPurchaseEntry;
			value.createdBy = this.loginEmployee._id;
			value.facilityId = this.selectedFacility._id;
			value.store = this.checkingObject.storeId;
			value.productForms = (<FormArray>this.productTableForm.controls['productTableArray']).value;

			value.productForms.forEach((element) => {
				element.qtyDetails = [];
				element.config.forEach((ele) => {
					element.qtyDetails.push({
						packId: ele.packItem,
						quantity: ele.size
					});
				});
			});
			this.purchaseEntryService.createEntry(value).then(
				(payload) => {
					this.frm_purchaseOrder.controls['invoiceNo'].reset();
					this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
					this.router.navigate([ 'dashboard/purchase-manager/invoices' ]);
				},
				(error) => {}
			);
		} else {
			this.systemModuleService.announceSweetProxy('Required field missing', 'error');
			// this.mainErr = false;
		}
	}

	cancelAll() {
		this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
		this.frm_purchaseOrder.controls['supplier'].setValue('');
		this.frm_purchaseOrder.controls['desc'].setValue('');
		this.frm_purchaseOrder.controls['orderId'].reset();
		this.superGroups[0].forEach((item, i) => {
			item.checked = false;
		});
		this.selectedOrder = <PurchaseOrder>{};
	}

	flyout_toggle(e) {
		if (this.selectedOrder === undefined || this.selectedOrder._id === undefined) {
			this.flyout = !this.flyout;
		}
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
}
