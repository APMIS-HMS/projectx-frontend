import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem } from '../../../../../models/index';
import {
	FacilitiesService,
	ProductService,
	FacilityPriceService,
	InventoryService,
	AssessmentDispenseService
} from '../../../../../services/facility-manager/setup/index';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-bill-prescription',
	templateUrl: './bill-prescription.component.html',
	styleUrls: [ './bill-prescription.component.scss' ]
})
export class BillPrescriptionComponent implements OnInit {
	@Input() prescriptionData: Prescription = <Prescription>{};
	@Input() storeId: string;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	// @Input() employeeDetails: any;
	facility: Facility = <Facility>{};
	user: any = <any>{};
	addBillForm: FormGroup;
	drugs: any[] = [];
	selectedDrug: any;
	itemCost = 0;
	title: string;
	cost: number; // Unit price for each drug.
	totalCost = 0; // Total price for each drug selected.
	totalQuantity = 0;
	batchNumber: string;
	qtyInStores = 0;
	stores: any = [];
	loading = true;
	serviceId: string;
	facilityServiceId: string;
	categoryId: string;

	mainErr = true;
	errMsg = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _systemsModuleService: SystemModuleService
	) // private _assessmentDispenseService: AssessmentDispenseService
	{
	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		// this.user = this._locker.getObject('auth');
		this.getProductsForGeneric();

		this.addBillForm = this._fb.group({
			drug: [ '', [ <any>Validators.required ] ],
			qty: [ 0, [ <any>Validators.required ] ]
		});

		this.addBillForm.controls['qty'].valueChanges.subscribe((val) => {
			if (val > 0) {
				this.totalQuantity = val;
				this.totalCost = this.cost * val;
			} else {
				this.mainErr = false;
				this.errMsg = 'Quantity should be greater than 0!!';
			}
		});
	}

	//
	onClickSaveCost(value, valid) {
		if (valid) {
			if (!!this.cost && this.cost > 0 && value.qty > 0 && (value.drug !== undefined || value.drug === '')) {
				const index = this.prescriptionData.index;
				const product = {
					id: this.selectedDrug.productObject.id,
					code: this.selectedDrug.productObject.code,
					name: this.selectedDrug.productObject.name
				};
				this.prescriptionData.prescriptionItems[index].productId = value.drug.productId;
				this.prescriptionData.prescriptionItems[index].serviceId = this.serviceId;
				this.prescriptionData.prescriptionItems[index].facilityServiceId = this.facilityServiceId;
				this.prescriptionData.prescriptionItems[index].categoryId = this.categoryId;
				this.prescriptionData.prescriptionItems[index].productName = product;
				this.prescriptionData.prescriptionItems[index].quantity = value.qty;
				this.prescriptionData.prescriptionItems[index].quantityDispensed = 0;
				this.prescriptionData.prescriptionItems[index].cost = this.cost;
				this.prescriptionData.prescriptionItems[index].totalCost = this.cost * value.qty;
				this.prescriptionData.prescriptionItems[index].isBilled = true;
				this.prescriptionData.prescriptionItems[index].facilityId = this.facility._id;
				this.prescriptionData.totalCost += this.totalCost;
				this.prescriptionData.totalQuantity += this.totalQuantity;

				this.closeModal.emit(true);
			} else {
				this.mainErr = false;
				this.errMsg = 'Unit price or Quantity is less than 0!';
			}
		} else {
			this.mainErr = false;
			this.errMsg = 'Unit price or Quantity is less than 0!';
		}
	}

	getProductsForGeneric() {
		const index = this.prescriptionData.index;
		this.title = this.prescriptionData.prescriptionItems[index].genericName;
		// const productId = this.prescriptionData.prescriptionItems[index].productId;
		// const ingredients = this.prescriptionData.prescriptionItems[index].ingredients;

		// Get the list of products from a facility, and then search if the generic
		// that was entered by the doctor in contained in the list of products
		this._inventoryService
			.findList({
				query: { facilityId: this.facility._id, name: this.title, storeId: this.storeId }
			})
			.then((res) => {
				this.loading = false;
				if (res.data.length > 0) {
					// this.stores = res.data[0].availableQuantity;
					this.drugs = res.data;
				} else {
					this.drugs = [];
				}
			})
			.catch((err) => {});
	}

	onClickCustomSearchItem(event, drug) {
		this.selectedDrug = drug;
		this.serviceId = drug.serviceId;
		this.facilityServiceId = drug.facilityServiceId;
		this.categoryId = drug.categoryId;

		this._facilityPriceService
			.find({
				query: {
					facilityId: this.facility._id,
					serviceId: drug.serviceId,
					facilityServiceId: drug.facilityServiceId,
					categoryId: drug.categoryId
				}
			})
			.then((res) => {
				if (res.data.length > 0) {
					this.cost = res.data[0].price;
				} else {
					this.cost = 0;
					this.mainErr = false;
					this.errMsg = 'Please go to billing manager to set price!';
				}
			});
	}

	onClickClose(e) {
		this.closeModal.emit(true);
	}
}
