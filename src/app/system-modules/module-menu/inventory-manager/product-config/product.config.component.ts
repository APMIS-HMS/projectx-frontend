import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ProductService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { MatPaginator, PageEvent } from '@angular/material';

@Component({
	selector: 'app-product-config',
	templateUrl: './product.config.component.html',
	styleUrls: [ './product.config.component.scss' ]
})
export class ProductConfigComponent implements OnInit {
	content1 = true;
	content2 = false;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	pageEvent: PageEvent;
	packages = [];
	products = [];
	selectedFacility: any = {};
	selectedProduct: any = {};
	packageForm: FormGroup;
	searchProdductControl: FormControl = new FormControl();
	btnSave = new FormControl();
	btnShowStatus = true;
	existConfigItem = null;
	operatePackages = [];
	filteredPackages = [];

	pageSize = 10;
	pageSizeOptions = [ 5, 10, 25, 100 ];

	apmisLookupUrl = 'formulary-products';
	apmisLookupText = '';
	apmisLookupQuery = {};
	apmisLookupDisplayKey = 'name';
	apmisInvestigationLookupQuery: any = {};
	productConfigList = [];
	control;
	searchControl = new FormControl();
	constructor(
		private _fb: FormBuilder,
		private _inventoryEventEmitter: InventoryEmitterService,
		private productService: ProductService,
		private locker: CoolLocalStorage,
		private systemModuleService: SystemModuleService
	) {}

	initializeForm() {
		this.packageForm = this._fb.group({
			package: this._fb.array([
				this._fb.group({
					name: [ '', Validators.required ],
					size: [ 0, Validators.required ],
					packId: [ '', Validators.required ],
					id: [ '' ]
				})
			])
		});
		this.packageForm.controls['package'] = this._fb.array([]);
	}

	ngOnInit() {
		var x = document.getElementById('searchuctControl');
		this._inventoryEventEmitter.setRouteUrl('Product Configuration');
		this.selectedFacility = <any>this.locker.getObject('selectedFacility');
		this.initializeForm();

		const control = <FormArray>this.packageForm.controls['package'];
		this.searchProdductControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			if (value !== undefined) {
				if (value.toString().length >= 3) {
					this.apmisInvestigationLookupQuery = {
						name: this.searchProdductControl.value
					};
				}
			}
		});

		this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			if (value !== undefined) {
				if (value.toString().length >= 3) {
					this.systemModuleService.on();
					this.productService
						.findProductConfigs({
							query: {
								facilityId: this.selectedFacility._id,
								'productObject.name': { $regex: value, $options: 'i' },
								$sort: { updatedAt: -1 },
								$limit: false
							}
						})
						.then(
							(payload) => {
								this.systemModuleService.off();
								this.productConfigList = payload.data;
							},
							(err) => {
								this.systemModuleService.off();
							}
						);
				} else {
					this.getProductConfig();
				}
			}
		});
		this.getPackagesizes();
		this.getProductConfig();
	}

	onPaginateChange(event) {
		let _pageIndex = 1;
		_pageIndex += event.pageIndex;
		let _pageLength = _pageIndex * event.pageSize;
		if (_pageLength < this.packages.length) {
			const startIndex = event.pageIndex * event.pageSize;
			this.operatePackages = JSON.parse(JSON.stringify(this.packages));
			this.filteredPackages = JSON.parse(
				JSON.stringify(this.operatePackages.splice(startIndex, this.paginator.length))
			);
		} else {
			this.systemModuleService.on();
			this.productService
				.findPackageSize({
					query: {
						$skip: event.length
					}
				})
				.then(
					(payload) => {
						this.packages = JSON.parse(JSON.stringify(this.packages.concat(payload.data)));
						this.packages.forEach((element) => {
							element.checked = false;
						});
						const startIndex = event.pageIndex * 10;
						this.operatePackages = JSON.parse(JSON.stringify(this.packages));
						this.filteredPackages = JSON.parse(
							JSON.stringify(this.operatePackages.splice(startIndex, this.paginator.length))
						);
						this.systemModuleService.off();
					},
					(err) => {
						this.systemModuleService.off();
					}
				);
		}
	}

	removePack(i: number, itm: any) {
		const control = <FormArray>this.packageForm.controls['package'];
		let _packages = this.packages;
		_packages.forEach((item) => {
			if (item._id.toString() === itm.value.packId.toString()) {
				item.checked = false;
			}
		});
		this.packages = JSON.parse(JSON.stringify(_packages));
		control.removeAt(i);
	}

	getPackagesizes() {
		this.productService.findPackageSize({}).then((payload) => {
			this.packages = JSON.parse(JSON.stringify(payload.data));
			this.packages.forEach((element) => {
				element.checked = false;
			});
			const startIndex = 0 * 10;
			this.operatePackages = JSON.parse(JSON.stringify(this.packages));
			if (this.paginator !== undefined) {
				this.filteredPackages = JSON.parse(
					JSON.stringify(this.operatePackages.splice(startIndex, this.paginator.pageSize))
				);
			}
		});
	}
	onEditConfig(item) {
		this.packageForm.controls['package'].reset();
		this.initializeForm();
		this.content2 = true;
		this.content1 = false;
		if (item.productObject !== undefined) {
			this.apmisLookupText = item.productObject.name;
		}

		this.existConfigItem = item;
		let _packages = this.packages;
		item.packSizes.forEach((element) => {
			if (item.packSizes.length > 0) {
				(<FormArray>this.packageForm.controls['package']).push(
					this._fb.group({
						name: [ element.name, [ <any>Validators.required ] ],
						size: [ element.size, [ <any>Validators.required ] ],
						packId: [ element.packId ]
					})
				);
				_packages.forEach((item) => {
					if (item._id.toString() === element.packId.toString()) {
						item.checked = true;
					}
				});
			}
		});
		this.packages = JSON.parse(JSON.stringify(_packages));
		const startIndex = 0 * 10;
		this.operatePackages = JSON.parse(JSON.stringify(this.packages));
		if (this.paginator !== undefined) {
			this.filteredPackages = JSON.parse(
				JSON.stringify(this.operatePackages.splice(startIndex, this.paginator.pageSize))
			);
		}
	}

	getProductConfig() {
		this.systemModuleService.on();
		this.productService
			.findProductConfigs({
				query: {
					facilityId: this.selectedFacility._id,
					$sort: { updatedAt: -1 },
					$limit: false
				}
			})
			.then(
				(payload) => {
					this.systemModuleService.off();
					if (payload.data.length > 0) {
						this.productConfigList = payload.data;
					}
				},
				(err) => {
					this.systemModuleService.off();
				}
			);
	}

	apmisLookupHandleSelectedItem(value) {
		this.apmisLookupText = value.name;
		this.selectedProduct = JSON.parse(JSON.stringify(value));
		this.initializeForm();
		this.getPackagesizes();
		if (value !== '' && value !== null) {
			this.productService
				.findProductConfigs({
					query: {
						facilityId: this.selectedFacility._id,
						productId: this.selectedProduct.id
					}
				})
				.then((payload) => {
					if (payload.data.length > 0) {
						this.existConfigItem = payload.data[0];
						let _packages = this.packages;
						payload.data[0].packSizes.forEach((element) => {
							if (payload.data[0].packSizes.length > 0) {
								(<FormArray>this.packageForm.controls['package']).push(
									this._fb.group({
										name: [ element.name, [ <any>Validators.required ] ],
										size: [ element.size, [ <any>Validators.required ] ],
										packId: [ element.packId ]
									})
								);
								_packages.forEach((item) => {
									if (item._id.toString() === element.packId.toString()) {
										item.checked = true;
									}
								});
							}
						});
						this.packages = JSON.parse(JSON.stringify(_packages));
						const startIndex = 0 * 10;
						this.operatePackages = JSON.parse(JSON.stringify(this.packages));
						if (this.paginator !== undefined) {
							this.filteredPackages = JSON.parse(
								JSON.stringify(this.operatePackages.splice(startIndex, this.paginator.pageSize))
							);
						}
					}
				});
		}
	}

	onSelectProduct(value) {
		this.selectedProduct = value;
	}

	addPackage(event, item, i): void {
		item.checked = event.target.checked;
		if (event.target.checked === true) {
			(<FormArray>this.packageForm.controls['package']).push(
				this._fb.group({
					name: [ item.name, [ <any>Validators.required ] ],
					size: [ 0, [ <any>Validators.required ] ],
					packId: [ item._id ]
				})
			);
		} else {
			let indexToRemove = 0;
			(<FormArray>this.packageForm.controls['package']).controls.forEach((item: any, i) => {
				const packagelValue: any = (<any>item).controls['packId'].value;
				if (packagelValue.toString() === item.value.packId.toString()) {
					indexToRemove = i;
				}
			});
			const count = (<FormArray>this.packageForm.controls['package']).controls.length;
			if (count === 1) {
				this.packageForm.controls['package'] = this._fb.array([]);
			} else {
				(<FormArray>this.packageForm.controls['package']).removeAt(indexToRemove);
			}
		}
	}

	createPackage(item): FormGroup {
		return this._fb.group({
			name: [ item.name, Validators.required ],
			size: [ 0, Validators.required ]
		});
	}

	onMoveDown(i, item) {
		if (i + 1 < (<FormArray>this.packageForm.controls['package']).length) {
			(<FormArray>this.packageForm.controls['package']).value[0].size = 1;
			(<FormArray>this.packageForm.controls['package']).value[i] = (<FormArray>this.packageForm.controls[
				'package'
			]).value[i + 1];
			(<FormArray>this.packageForm.controls['package']).value[i + 1] = item.value;
			(<FormArray>this.packageForm.controls['package']).setValue(
				JSON.parse(JSON.stringify((<FormArray>this.packageForm.controls['package']).value))
			);
		} else {
			this.systemModuleService.announceSweetProxy('Cannot move item out of range', 'error');
		}
	}

	onMoveUp(i, item) {
		if (i > 0) {
			(<FormArray>this.packageForm.controls['package']).value[0].size = 1;
			(<FormArray>this.packageForm.controls['package']).value[i] = (<FormArray>this.packageForm.controls[
				'package'
			]).value[i - 1];
			(<FormArray>this.packageForm.controls['package']).value[i - 1] = item.value;
			(<FormArray>this.packageForm.controls['package']).setValue(
				JSON.parse(JSON.stringify((<FormArray>this.packageForm.controls['package']).value))
			);
		} else {
			this.systemModuleService.announceSweetProxy('Cannot move item out of range', 'error');
		}
	}

	save() {
		if ((<FormArray>this.packageForm.controls['package']).value.length > 0) {
			if (this.existConfigItem === null) {
				(<FormArray>this.packageForm.controls['package']).value[0].isBase = true;
				(<FormArray>this.packageForm.controls['package']).value[0].size = 1;
				this.btnShowStatus = false;
				this.systemModuleService.on();
				let productConfig: any = {};
				productConfig.productId = this.selectedProduct.id;
				productConfig.productObject = this.selectedProduct;
				productConfig.facilityId = this.selectedFacility._id;
				productConfig.rxCode = this.selectedProduct.code;
				productConfig.packSizes = (<FormArray>this.packageForm.controls['package']).value;
				this.productService.createProductConfig(productConfig).then(
					(payload) => {
						this.systemModuleService.off();
						this.btnShowStatus = true;
						this.packageForm.controls['package'] = this._fb.array([]);
						this.packages = JSON.parse(JSON.stringify(this.packages));
						this.selectedProduct = {};
						this.apmisLookupText = '';
						this.systemModuleService.announceSweetProxy('Configuration created', 'success');
					},
					(err) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'Failed to create configuration for product',
							'error'
						);
					}
				);
			} else {
				this.btnShowStatus = false;
				this.systemModuleService.on();
				(<FormArray>this.packageForm.controls['package']).value[0].isBase = true;
				(<FormArray>this.packageForm.controls['package']).value[0].size = 1;
				let _packSizes = (<FormArray>this.packageForm.controls['package']).value;
				this.productService.patchProductConfig(this.existConfigItem._id, { packSizes: _packSizes }, {}).then(
					(payload) => {
						this.systemModuleService.off();
						this.btnShowStatus = true;
						this.packageForm.controls['package'] = this._fb.array([]);
						this.packages = JSON.parse(JSON.stringify(this.packages));
						this.selectedProduct = {};
						this.apmisLookupText = '';
						this.systemModuleService.announceSweetProxy('Configuration created', 'success');
						this.getProductConfig();
					},
					(err) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'Failed to create configuration for product',
							'error'
						);
					}
				);
			}
		} else {
			this.systemModuleService.off();
			this.systemModuleService.announceSweetProxy('One or more field(s) missing', 'error');
		}
	}

	onChange(event) {}
	tab1() {
		this.content1 = true;
		this.content2 = false;
	}
	tab2() {
		this.content1 = false;
		this.content2 = true;
	}
}
