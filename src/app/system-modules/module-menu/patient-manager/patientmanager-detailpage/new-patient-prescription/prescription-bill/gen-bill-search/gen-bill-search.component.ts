import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InventoryService } from 'app/services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, PrescriptionItem } from 'app/models';

@Component({
	selector: 'app-gen-bill-search',
	templateUrl: './gen-bill-search.component.html',
	styleUrls: [ './gen-bill-search.component.scss' ]
})
export class GenBillSearchComponent implements OnInit {
	@Input() drugs = [];
	@Input() stores = [];
	@Input() selectedDrug: PrescriptionItem = <PrescriptionItem>{};
	@Output() searchResultEvent: EventEmitter<any> = new EventEmitter<any>();
	@Output() closeModalEvent: EventEmitter<any> = new EventEmitter<any>();
	selectedFacility: any;
	selectedStore: any;
	drugPicked: any;
	quantityToDispense: FormControl = new FormControl(0, [ <any>Validators.required ]);
	selectedConfig: any;
	constructor(private _inventoryService: InventoryService, private _locker: CoolLocalStorage) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.quantityToDispense.valueChanges.subscribe((value: number) => {
			if (!!this.selectedDrug) {
				const quantity = Math.floor(this.drugPicked.availableQuantity / this.selectedConfig.size);
				if (value > quantity || value < 0) {
					this.quantityToDispense.setValue(quantity);
				}
			}
		});
	}

	getDrugList() {
		this.drugs = [];
		this._inventoryService
			.findList({
				query: {
					code: this.selectedDrug.code,
					facilityId: this.selectedFacility._id,
					storeId: this.selectedStore.storeId
				}
			})
			.then((res) => {
				this.drugs = res.data;
				this.searchResultEvent.emit({ drugs: this.drugs, selectedStore: this.selectedStore });
			})
			.catch((err) => {});
	}
	selectStore(store) {
		this.selectedStore = store;
		this.getDrugList();
	}

	onItemChange(drug) {
		this.drugPicked = drug;
		this.selectedConfig = this.drugPicked.productObject.productConfigObject.find((x) => x.isBase === true);
		this.quantityToDispense.setValue(drug.availableQuantity);
	}

	itemChanged(event) {
		this.selectedConfig = this.drugPicked.productObject.productConfigObject.find(
			(x) => x.name === event.target.value
		);
		this.quantityToDispense.setValue(this.drugPicked.availableQuantity / this.selectedConfig.size);
	}

	bill() {
		const product = {
			id: this.drugPicked.productObject.id,
			code: this.drugPicked.productObject.code,
			name: this.drugPicked.productObject.name
		};
		this.selectedDrug.productId = this.drugPicked.productObject.id;
		this.selectedDrug.serviceId = this.drugPicked.serviceId;
		this.selectedDrug.facilityServiceId = this.drugPicked.facilityServiceId;
		this.selectedDrug.categoryId = this.drugPicked.categoryId;
		this.selectedDrug.productName = product;
		this.selectedDrug.quantity = this.quantityToDispense.value;
		this.selectedDrug.quantityDispensed = 0;
		this.selectedDrug.cost = this.drugPicked.price.price;
		this.selectedDrug.totalCost = this.drugPicked.price.price * this.quantityToDispense.value;
		this.selectedDrug.isBilled = true;
		this.selectedDrug.facilityId = this.selectedFacility._id;
		this.closeModalEvent.emit(true);
	}
}
