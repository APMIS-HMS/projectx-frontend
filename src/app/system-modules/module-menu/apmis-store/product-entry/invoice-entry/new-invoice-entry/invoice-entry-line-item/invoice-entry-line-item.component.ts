import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ProductService, EmployeeService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subscription } from 'rxjs/Subscription';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

@Component({
	selector: 'app-invoice-entry-line-item',
	templateUrl: './invoice-entry-line-item.component.html',
	styleUrls: [ './invoice-entry-line-item.component.scss' ]
})
export class InvoiceEntryLineItemComponent implements OnInit {
	@Output() pushConstructedProduct: EventEmitter<any> = new EventEmitter<any>();
	@Input() product: any;
	isMarginFocused = false;
	isSellingPriceFocused = false;
	isBatchFocused = false;
	isExpiryDateFocused = false;
	isQuantityFocused = false;
	isCostPriceFocused = false;
	isProductFocused = false;

	searchProductFormControl: FormControl;
	marginFormControl: FormControl = new FormControl();
	sellingPriceFormControl: FormControl;
	batchFormControl: FormControl;
	expiryDateFormControl: FormControl;
	quantityFormControl: FormControl;
	costPriceFormControl: FormControl;
	checkedProduct: any;
	selectedProduct: any;
	showProduct: any;
	selectedProductName: string;
	invoiceDate: FormControl;
	productConfigs: any[] = [];
	selectedProducts: any[] = [];
	searchHasBeenDone = false;
	loginEmployee: any;
	subscription: Subscription;
	checkingStore: any;
	constructor(
		private _productService: ProductService,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService
	) {
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
		this.sellingPriceFormControl = new FormControl(
			this.product.sellingPrice === '' ? 0 : this.product.sellingPrice,
			[ Validators.minLength(0), Validators.required, Validators.nullValidator ]
		);
		this.marginFormControl = new FormControl(this.product.margin === '' ? 0 : this.product.margin, [
			Validators.maxLength(100),
			Validators.minLength(0),
			Validators.required,
			Validators.nullValidator
		]);
		this.expiryDateFormControl = new FormControl(new Date().toISOString().substring(0, 10), [
			Validators.required,
			Validators.nullValidator
		]);
		this.batchFormControl = new FormControl(this.product.batchNumber, [
			Validators.minLength(3),
			Validators.nullValidator,
			Validators.required
		]);
		this.searchProductFormControl = new FormControl(this.product.productName, [
			Validators.minLength(3),
			Validators.required,
			Validators.nullValidator
		]);

		this.quantityFormControl = new FormControl(this.product.quantity === '' ? 0 : this.product.quantity, [
			Validators.minLength(0),
			Validators.required,
			Validators.nullValidator
		]);
		this.costPriceFormControl = new FormControl(this.product.costPrice === '' ? 0 : this.product.costPrice, [
			Validators.minLength(0),
			Validators.required,
			Validators.nullValidator
		]);

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
	}

	onKeydown(event, n) {
		if (n === 1) {
			if (this.marginFormControl.valid) {
				this.isSellingPriceFocused = true;
				this.isBatchFocused = false;
				this.isMarginFocused = false;
				this.isExpiryDateFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = false;
			}
		} else if (n === 2) {
			if (this.sellingPriceFormControl.valid) {
				this.isBatchFocused = true;
				this.isSellingPriceFocused = false;
				this.isMarginFocused = false;
				this.isExpiryDateFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = false;
			}
		} else if (n === 3) {
			if (this.batchFormControl.valid) {
				this.isExpiryDateFocused = true;
				this.isBatchFocused = false;
				this.isMarginFocused = false;
				this.isSellingPriceFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = false;
			}
		} else if (n === 4) {
			if (this.expiryDateFormControl.valid) {
				this.isExpiryDateFocused = true;
				this.isBatchFocused = false;
				this.isMarginFocused = false;
				this.isSellingPriceFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = false;
				const product = {
					costPrice: this.costPriceFormControl.value,
					isChecked: true,
					productId: !!this.selectedProduct ? this.selectedProduct.productId : '',
					productName: !!this.selectedProduct
						? this.selectedProduct.productObject.name
						: this.product.productName,
					quantity: this.quantityFormControl.value,
					sellingPrice: this.sellingPriceFormControl.value,
					margin: this.marginFormControl.value,
					expiryDate: this.expiryDateFormControl.value,
					batchNumber: this.batchFormControl.value,
					productPackType: !!this.selectedProduct
						? this.selectedProduct.packSizes.find((x) => x.isBase) !== undefined
							? this.selectedProduct.packSizes.find((x) => x.isBase).name
							: ''
						: this.product.productPackType
				};
				this.pushConstructedProduct.emit(product);
			}
		} else if (n === 5) {
			if (this.quantityFormControl.valid) {
				this.isExpiryDateFocused = false;
				this.isBatchFocused = false;
				this.isMarginFocused = false;
				this.isSellingPriceFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = true;
			}
		} else if (n === 6) {
			if (this.costPriceFormControl.valid) {
				this.isExpiryDateFocused = false;
				this.isBatchFocused = false;
				this.isMarginFocused = true;
				this.isSellingPriceFocused = false;
				this.isQuantityFocused = false;
				this.isCostPriceFocused = false;
			}
		}
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
}
