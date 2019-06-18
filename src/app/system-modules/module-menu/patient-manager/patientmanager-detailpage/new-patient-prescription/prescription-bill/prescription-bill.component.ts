import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { InventoryService, StoreService } from 'app/services/facility-manager/setup';
import { FormControl } from '@angular/forms';
import { Facility, PrescriptionItem } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-prescription-bill',
	templateUrl: './prescription-bill.component.html',
	styleUrls: [ './prescription-bill.component.scss' ]
})
export class PrescriptionBillComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() drug: PrescriptionItem = <PrescriptionItem>{};

	productAvailable = true;
	searchProduct = false;
	searchShow = false;
	searchList = true;
	drugs: any[] = [];
	productSearchFormControl: FormControl = new FormControl();
	selectedFacility: any;
	stores: any;
	selectedStore: any;
	searchResults: any;

	constructor(
		private _inventoryService: InventoryService,
		private _storeService: StoreService,
		private _locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getStores(this.selectedFacility._id);

		this.productSearchFormControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			this._inventoryService
				.findFacilityProductList({
					query: {
						searchText: value,
						facilityId: this.selectedFacility._id,
						storeId: this.selectedStore.storeId,
						direct: true
					}
				})
				.then(
					(payload) => {
						this.searchResults = payload.data;
					},
					(error) => {}
				);
			// this.searchHasBeenDone = false;
			// const searchList = this.canSearchBeDone(value.split(','));
			// if (searchList.length > 1 && this.selectedProductName.length === 0) {
			// 	this.selectedProductName = '';
			// 	this._drugListApiService
			// 		.find({
			// 			query: {
			// 				searchtext: searchList,
			// 				po: false,
			// 				brandonly: false,
			// 				genericonly: true,
			// 				$limit: false
			// 			}
			// 		})
			// 		.then(
			// 			(payload) => {
			// 				this.products = this.modifyProducts(payload.data);
			// 				if (this.products.length === 0) {
			// 					this.searchHasBeenDone = true;
			// 				} else {
			// 					this.searchHasBeenDone = false;
			// 				}
			// 			},
			// 			(error) => {
			// 				this.searchHasBeenDone = false;
			// 			}
			// 		);
			// } else {
			// 	this.selectedProductName = '';
			// }
		});
	}

	getStores(facilityId, minorLocationId?) {
		this._storeService
			.getStoreList({
				query: {
					facilityId: facilityId,
					minorLocationId: minorLocationId
				}
			})
			.then(
				(payload) => {
					this.stores = payload.data.data;
				},
				(error) => {}
			);
	}

	getDrugList() {
		// query: { facilityId: this.facility._id, name: this.title, storeId: this.storeId }
		this._inventoryService
			.findList({
				query: { code: this.drug.code, facilityId: this.selectedFacility._id }
			})
			.then((res) => {
				this.drugs = res.data;
			})
			.catch((err) => {});
	}

	onClickClose(e) {
		this.closeModal.emit(true);
	}

	onShowSearchResult(product) {
		this.searchShow = true;
		this.searchList = false;
		this.drugs.push(product);
	}
	onClickPrd() {
		this.productAvailable = !this.productAvailable;
		this.searchProduct = !this.searchProduct;
	}

	receive_search_result_event(payload) {
		if (payload.drugs.length === 0) {
			this.onClickPrd();
		}
		this.selectedStore = payload.selectedStore;
	}
}
