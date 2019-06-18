import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SystemModuleService } from './../../../../../../services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../../models/index';
import {
	FacilitiesService,
	ProductService,
	FacilityPriceService,
	InventoryService,
	AssessmentDispenseService
} from '../../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-order-bill-item',
	templateUrl: './order-bill-item.component.html',
	styleUrls: [ './order-bill-item.component.scss' ]
})
export class OrderBillItemComponent implements OnInit {
	@Input() prescriptionData: any = <any>{};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	facility: Facility = <Facility>{};
	user: any = <any>{};
	addBillForm: FormGroup;
	costForm = new FormControl();
	drugs: any[] = [];
	selectedDrug: string = '';
	itemCost: number = 0;
	title: string = '';
	cost: number = 0; // Unit price for each drug.
	totalCost: number = 0; // Total price for each drug selected.
	totalQuantity: number = 0;
	batchNumber: string = '';
	qtyInStores: number = 0;
	storeId: string = '';
	stores: any = [];
	loading: boolean = true;
	serviceId: string = '';
	facilityServiceId: string = '';
	categoryId: string = '';

	mainErr: boolean = true;
	errMsg = 'You have unresolved errors';
	editPrice = false;

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _assessmentDispenseService: AssessmentDispenseService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		this.getProductsForGeneric();

		this.addBillForm = this._fb.group({
			drug: [ '', [ <any>Validators.required ] ],
			qty: [ 0, [ <any>Validators.required ] ]
		});

		this.addBillForm.controls['qty'].valueChanges.subscribe((val) => {
			if (val > 0) {
				this.totalQuantity = val;
				this.totalCost =
					(this.addBillForm.controls['drug'].value.price !== undefined
						? this.addBillForm.controls['drug'].value.price.price
						: 0) * val;
			} else {
				this._facilityService.announceNotification({
					users: [ this.user._id ],
					type: 'Error',
					text: 'Quantity should be greater than 0!'
				});
			}
		});

		this.addBillForm.controls['drug'].valueChanges.subscribe((val) => {
			this.cost = val.price.price;
			this.stores = [];
			this._inventoryService
				.find({ query: { facilityId: this.facility._id, 'productObject.name': val.productObject.name } })
				.then((payload) => {
					payload.data.forEach((x) => {
						this.stores.push({ name: x.store, price: x.price, qty: x.availableQuantity });
					});
					this.loading = false;
				})
				.catch((err) => {});
		});

		this.costForm.valueChanges.subscribe((val) => {});
	}

	//costForm.value * addBillForm.controls['qty'].value
	getAdjustedTotalPrice() {
		return this.costForm.value * this.addBillForm.controls['qty'].value;
	}

	onEditPrice() {
		this.editPrice = !this.editPrice;
	}

	//
	onClickSaveCost(valid: boolean, value: any) {
		if (valid) {
			if (
				(this.costForm.value !== null || this.cost > 0) &&
				value.qty > 0 &&
				(value.drug !== undefined || value.drug === '')
			) {
				let index = this.prescriptionData.index;
				this.prescriptionData.prescriptionItems[index].productId = this.addBillForm.controls['drug'].value.productId;
				this.prescriptionData.prescriptionItems[index].serviceId = this.addBillForm.controls['drug'].value.serviceId;
				this.prescriptionData.prescriptionItems[index].facilityServiceId = this.addBillForm.controls['drug'].value.facilityServiceId;
				this.prescriptionData.prescriptionItems[index].categoryId = this.addBillForm.controls['drug'].value.categoryId;
				this.prescriptionData.prescriptionItems[index].productName = this.addBillForm.controls['drug'].value.productObject;
				this.prescriptionData.prescriptionItems[index].quantity = value.qty;
				this.prescriptionData.prescriptionItems[index].quantityDispensed = 0;
				this.prescriptionData.prescriptionItems[index].cost = this.cost;
				this.prescriptionData.prescriptionItems[index].changedPrice = this.costForm.value;
				this.prescriptionData.prescriptionItems[index].totalCost = this.cost * value.qty;
				this.prescriptionData.prescriptionItems[index].isBilled = true;
				this.prescriptionData.prescriptionItems[index].facilityId = this.facility._id;
				this.prescriptionData.totalCost += this.prescriptionData.prescriptionItems[index].totalCost;
				this.prescriptionData.totalQuantity += this.prescriptionData.prescriptionItems[index].quantity;
				this.closeModal.emit(true);
			} else if (this.costForm.value === null || (this.cost === null && this.cost === 0)) {
				this.systemModuleService.announceSweetProxy(
					'There was an error while billing on an invalid price, kindly edit price!',
					'error'
				);
			} else {
				this._notification('Error', 'Unit price or Quantity is less than 0!');
			}
		} else {
			this.mainErr = false;
		}
	}

	getProductsForGeneric() {
		const index = this.prescriptionData.index;
		this.title = this.prescriptionData.prescriptionItems[index].genericName;
		const ingredients = this.prescriptionData.prescriptionItems[index].ingredients;

		this._inventoryService
			.find({
				query: {
					facilityId: this.facility._id,
					'productObject.name': {
						$regex: this.prescriptionData.prescriptionItems[index].genericName.split(' ')[0],
						$options: 'i'
					}
				}
			})
			.then((payload) => {
				payload.data.forEach((x) => {
					this.stores.push({ name: x.store, price: x.price, qty: x.availableQuantity });
				});
				this.drugs = payload.data;
				this.loading = false;
			})
			.catch((err) => console.error(err));

		// Get the list of products from a facility, and then search if the generic
		// that was entered by the doctor in contained in the list of products
		// this._assessmentDispenseService.find({ query: { ingredients: JSON.stringify(ingredients) }}).then(res => {
		// 	this.loading = false;
		// 	if (res.length > 0) {
		// 		this.stores = res[0].availability;
		// 		this.drugs = res;
		// 	} else {
		// 		this.drugs = [];
		// 	}
		// }).catch(err => console.error(err));
	}

	getTotalQtyInStores(stores) {
		this.qtyInStores = 0;
		if (stores.length > 0) {
			stores.forEach((element) => {
				this.qtyInStores += element.qty;
			});
			return this.qtyInStores;
		}
	}

	onClickCustomSearchItem(event, drugId) {
		this.selectedDrug = drugId.viewValue;
		const pId = drugId._element.nativeElement.getAttribute('data-p-id');
		this.serviceId = drugId._element.nativeElement.getAttribute('data-p-sId');
		this.facilityServiceId = drugId._element.nativeElement.getAttribute('data-p-fsid');
		this.categoryId = drugId._element.nativeElement.getAttribute('data-p-cid');
		this.cost = parseInt(drugId._element.nativeElement.getAttribute('data-p-price'));
		this.qtyInStores = parseInt(drugId._element.nativeElement.getAttribute('data-p-tqty'));
		const pAqty = drugId._element.nativeElement.getAttribute('data-p-aqty');
	}

	onClickClose(e) {
		this.closeModal.emit(true);
	}

	private _notification(type: string, text: string) {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
}
