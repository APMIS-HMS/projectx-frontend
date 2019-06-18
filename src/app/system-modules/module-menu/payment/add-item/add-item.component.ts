import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import {
	FacilitiesServiceCategoryService,
	ServicePriceService,
	InvoiceService
} from '../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ISubscription } from 'rxjs/Subscription';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-add-item',
	templateUrl: './add-item.component.html',
	styleUrls: [ './add-item.component.scss' ]
})
export class AddItemComponent implements OnInit, OnDestroy {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr = true;
	errMsg = 'You have unresolved errors';
	successMsg = 'Operation completed successfully';
	isCollapse = false;

	public frmAddItem: FormGroup;
	// itemName = new FormControl();
	facility: Facility = <Facility>{};
	services: CustomCategory[] = [];
	selectedService: any = <any>{};
	success = false;
	subscribeForService: ISubscription;
	items: any[] = [];
	constructor(
		private formBuilder: FormBuilder,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
		private _locker: CoolLocalStorage,
		private servicePriceService: ServicePriceService,
		private _systemModuleService: SystemModuleService,
		private invoiceService: InvoiceService
	) {}

	ngOnInit() {
		this.addNew();
		// this.frmAddItem.controls['unitPrice'].disable();
		// this.frmAddItem.controls['amount'].disable();
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.subscribeForService = this.frmAddItem.controls['itemName'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe((value) => {
				if (!!value && value.length > 2) {
					this._facilitiesServiceCategoryService
						.find({
							query: {
								'categories.services.name': { $regex: value, $options: 'i' },
								facilityId: this.facility._id
							}
						})
						.then((res) => {
							const innerValue = this.frmAddItem.controls['itemName'].value;
							if (innerValue === null || innerValue.length === 0) {
								this.services = [];
							} else {
								this.success = false;
								this.filterOutService(value, res);
							}
						});
				} else {
					this.services = [];
				}
			});

		// subscribeForService.subscribe((payload: any) => {
		// });

		this.frmAddItem.controls['qty'].valueChanges.subscribe((value) => {
			const unitPrice = this.frmAddItem.controls['unitPrice'].value;
			const qty = this.frmAddItem.controls['qty'].value;
			this.frmAddItem.controls['amount'].setValue(unitPrice * qty);
		});
	}
	onSelectService(service: any) {
		this.frmAddItem.controls['itemName'].setValue(service.service);
		this.selectedService = service;
		this.getPrice(service);
		this.isCollapse = false;
	}
	getPrice(service: any) {
		this.servicePriceService
			.find({
				query: {
					facilityId: this.facility._id,
					facilityServiceId: service.facilityServiceId,
					serviceId: service.serviceId
				}
			})
			.then((payload) => {
				console.log(payload);
				if (payload.data.length > 0) {
					console.log(payload.data[0].price);
					if (payload.data[0].price === 0 && payload.data[0].modifiers.length > 0) {
						this.frmAddItem.controls['unitPrice'].setValue(payload.data[0].modifiers[0].modifierValue);
						this.frmAddItem.controls['qty'].setValue(1);
					} else {
						this.frmAddItem.controls['unitPrice'].setValue(payload.data[0].price);
						this.frmAddItem.controls['qty'].setValue(1);
					}
				} else {
					this.frmAddItem.controls['unitPrice'].setValue(0);
					this.frmAddItem.controls['qty'].setValue(0);
				}
			});
	}
	addItem(val: any, valid: boolean) {
		const unitPrice = this.frmAddItem.controls['unitPrice'].value;
		const amount = this.frmAddItem.controls['amount'].value;
		val.unitPrice = unitPrice;
		val.amount = amount;
		val.facilityServiceObject = this.selectedService;
		// this.invoiceService.announceInvoice(val);
		this.items.push(val);
		this.frmAddItem.reset();
		// this.success = true;
		const text = `${val.itemName} has been added to patient's bill successfully`;
		this._systemModuleService.announceSweetProxy(text, 'success');
	}
	filterOutService(searchString, payload) {
		this.services = [];
		payload.data.forEach((itemi, i) => {
			itemi.categories.forEach((itemj, j) => {
				itemj.services.forEach((itemk, k) => {
					const serviceLowerCase = itemk.name.toLowerCase();
					const containsString = serviceLowerCase.includes(searchString);
					if (containsString) {
						const customCategory: CustomCategory = <CustomCategory>{};
						customCategory.service = itemk.name;
						customCategory.facilityServiceId = itemi._id;
						customCategory.serviceId = itemk._id;
						customCategory.category = itemj.name;
						customCategory.categoryId = itemj._id;
						customCategory.serviceCode = itemk.code;
						if (itemi.facilityId === undefined) {
							customCategory.isGlobal = true;
						} else {
							customCategory.isGlobal = false;
						}
						this.services.push(customCategory);
					}
				});
			});
		});
		this.isCollapse = true;
	}
	addNew() {
		this.frmAddItem = this.formBuilder.group({
			itemName: [ '', [ <any>Validators.required, <any>Validators.minLength(1), <any>Validators.maxLength(50) ] ],
			itemDesc: [ '', [] ],
			unitPrice: [ '', [ <any>Validators.required ] ],
			amount: [ '', [ <any>Validators.required ] ],
			qty: [ '', [ Validators.required ] ]
		});
	}

	close_onClick() {
		this.invoiceService.announceInvoice(this.items);
		this.closeModal.emit(true);
	}

	ngOnDestroy() {
		this.subscribeForService.unsubscribe();
	}
}
