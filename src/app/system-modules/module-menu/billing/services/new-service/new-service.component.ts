import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, FacilityService, ServiceCategory, ServiceItem } from '../../../../../models/index';
import { FormControl } from '@angular/forms';
import {
	FacilitiesServiceCategoryService,
	ServiceDictionaryService
} from '../../../../../services/facility-manager/setup/index';
import { constructDependencies } from '@angular/core/src/di/reflective_provider';

@Component({
	selector: 'app-new-service',
	templateUrl: './new-service.component.html',
	styleUrls: [ './new-service.component.scss' ]
})
export class NewServiceComponent implements OnInit {
	frmNewservice: FormGroup;
	addPanelFormGroup: FormGroup;

	facility: Facility = <Facility>{};
	categories: FacilityService[] = [];
	allServiceItems: any = <any>[];
	dictionaries: any[] = [];
	panelItems: any[] = [];
	showPanel = false;
	showServelLayout = true;
	selectedServiceItems: any[] = [];
	selectedIndex: any;
	priceItems: any[] = [];
	panelSearchControl = new FormControl();
	editPriceControl = new FormControl();
	newPanel = new FormControl();
	isDisableBtn = false;
	selectedServices: any[] = [];
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() refreshService: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedService: any;
	@Input() selectedCategory: any;
	serviceItemModel: ServiceItem = <ServiceItem>{};
	mainErr = true;
	errMsg = 'you have unresolved errors';
	btnTitle = 'CREATE SERVICE';
	btnPanel = 'ADD PANEL';
	searchText = '';
	showServiceDropdown = false;
	serviceDropdownLoading = false;

	constructor(
		private formBuilder: FormBuilder,
		private _locker: CoolLocalStorage,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
		private serviceDictionaryService: ServiceDictionaryService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.btnTitle = 'CREATE SERVICE';
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.addNew();
		// this.allServices();
		this.onEditService();

		const subscribeForServiceDictionary = this.frmNewservice.controls['serviceName'].valueChanges
			.debounceTime(200)
			.distinctUntilChanged()
			.subscribe((value) => {
				if (
					this.frmNewservice.controls['serviceName'].value !== null &&
					this.frmNewservice.controls['serviceName'].value !== undefined
				) {
					this.serviceDictionaryService
						.find({
							query: { word: { $regex: this.frmNewservice.controls['serviceName'].value, $options: 'i' } }
						})
						.then((payload) => {
							if (this.frmNewservice.controls['serviceName'].value.length === 0) {
								this.dictionaries = [];
							} else {
								this.dictionaries = payload.data;
							}
						});
				}
			});

		this.panelSearchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe((value) => {
			this.allServiceItems = [];
			this.systemModuleService.on();
			if (value !== '') {
				this._facilitiesServiceCategoryService
					.allServices({
						query: {
							facilityId: this.facility._id,
							isQueryService: true,
							searchString: value
						}
					})
					.then((payload) => {
						this.panelItemTemplate(payload);
						this.systemModuleService.off();
					});
			} else {
				this.allServiceItems = [];
				this.systemModuleService.off();
			}
		});

		this.getCategories();
		this.frmNewservice.controls['isPanel'].valueChanges.subscribe((value) => {
			if (value) {
				this.showPanel = true;
			} else {
				this.showPanel = false;
			}
		});
	}

	onRemoveServiceItem(item, i) {
		this.selectedIndex = i;
		this.systemModuleService.announceSweetProxy('You are about to delete this service', 'question', this);
	}
	sweetAlertCallback(result) {
		if (result.value) {
			this.selectedServiceItems.splice(this.selectedIndex, 1);
		}
	}

	onCheckPanelItem(event, item, index) {
		// if (event.srcElement.checked) {
		//   this.selectedServiceItems.push(item);
		// } else {
		//   this.selectedServiceItems.splice(index, 1);
		// }
	}

	compareCategory(l1: any, l2: any) {
		return l1.includes(l2);
	}

	onEditService() {
		if (this.selectedService.name !== undefined) {
			this.btnTitle = 'Update Service';
			this.frmNewservice.controls['serviceName'].setValue(this.selectedService.name);
			this.frmNewservice.controls['serviceCat'].setValue(this.selectedService.categoryId);
			this.frmNewservice.controls['serviceCode'].setValue(this.selectedService.code);
			const basedPrice = this.selectedService.price.filter((x) => x.isBase === true)[0];
			this.frmNewservice.controls['servicePrice'].setValue(basedPrice.price);
			this.priceItems = JSON.parse(JSON.stringify(this.selectedService.price));

			this.selectedServiceItems = this.selectedService.panels;
		}
		this.frmNewservice.controls['serviceCat'].setValue(this.selectedService.categoryId);
	}

	getCategories() {
		this._facilitiesServiceCategoryService
			.find({ query: { facilityId: this.facility._id, $select: [ 'categories._id', 'categories.name' ] } })
			.then((payload) => {
				if (payload.data.length > 0) {
					this.categories = payload.data[0].categories;
				}
			});
	}
	addNew() {
		this.frmNewservice = this.formBuilder.group({
			serviceName: [ '', [ <any>Validators.required ] ],
			serviceCat: [ '', [ <any>Validators.required ] ],
			serviceAutoCode: [ '', [] ],
			serviceCode: [ '', [] ],
			servicePrice: [ '', [] ],
			isPanel: [ false ]
		});

		this.addPanelFormGroup = this.formBuilder.group({
			panelService: [ '', [ <any>Validators.required ] ]
		});
	}
	onSelectDictionary(dic: any) {
		this.frmNewservice.controls['serviceName'].setValue(dic.word);
	}

	allServices() {
		this.systemModuleService.on();
		this._facilitiesServiceCategoryService
			.allServices({
				query: {
					facilityId: this.facility._id
				}
			})
			.then(
				(payload) => {
					this.systemModuleService.off();
					this.panelItemTemplate(payload);
				},
				(error) => {
					this.systemModuleService.off();
				}
			);
	}

	panelItemTemplate(payload) {
		this.allServiceItems = [];
		if (payload.length > 0) {
			const len = payload.length - 1;
			for (let l = 0; l <= len; l++) {
				if (payload[l].services.length > 0) {
					const len2 = payload[l].services.length - 1;
					for (let i = 0; i <= len2; i++) {
						this.allServiceItems.push({
							category: payload[l].name,
							categoryId: payload[l]._id,
							service: payload[l].services[i].name,
							serviceId: payload[l].services[i]._id,
							price: payload[l].services[i].price,
							checked: false
						});
						this.compare(this.allServiceItems, this.selectedServiceItems);
					}
				}
			}
		}
	}

	newService(model: any, valid: boolean) {
		if (valid) {
			const value = {
				name: this.frmNewservice.controls['serviceName'].value,
				code: this.frmNewservice.controls['serviceCode'].value,
				categoryId: this.frmNewservice.controls['serviceCat'].value,
				isCategory: false,
				price: this.frmNewservice.controls['servicePrice'].value
			};
			this.onCreate(value);
		} else {
			this.systemModuleService.announceSweetProxy('Missing field', 'error');
		}
	}

	onCreate(data) {
		this.systemModuleService.on();
		this.isDisableBtn = true;
		if (this.selectedService.name === undefined) {
			data.panels = this.selectedServiceItems;
			this._facilitiesServiceCategoryService
				.create(data, {
					query: {
						facilityId: this.facility._id,
						isCategory: data.isCategory,
						categoryId: data.categoryId
					}
				})
				.then(
					(payload) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'Service added successful',
							'success',
							null,
							null,
							null,
							null,
							null,
							null,
							null
						);
						this.isDisableBtn = false;
						this.frmNewservice.reset();
						this.refreshService.emit(data.categoryId);
					},
					(error) => {
						this.isDisableBtn = false;
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy('Failed to add Service', 'error');
					}
				);
		} else {
			this.serviceItemModel.code = data.code;
			this.serviceItemModel._id = this.selectedService._id;
			this.serviceItemModel.name = data.name;
			this.serviceItemModel.panels = this.selectedServiceItems;
			this.serviceItemModel.price = {};
			this.serviceItemModel.price.base = this.priceItems.filter((x) => x.isBase === true)[0];
			this.serviceItemModel.price.base.price = data.price;
			if (this.selectedService.price !== undefined) {
				if (this.selectedService.price.length > 0) {
					this.serviceItemModel.price.others = this.priceItems.filter((x) => x.isBase === false);
				}
			}

			this._facilitiesServiceCategoryService
				.update2(this.facility._id, this.serviceItemModel, {
					query: {
						facilityId: this.facility._id,
						isCategory: false,
						serviceId: this.selectedService._id,
						categoryId: this.selectedCategory._id,
						name: data.name
					}
				})
				.then(
					(payload) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							'Service added successful',
							'success',
							null,
							null,
							null,
							null,
							null,
							null,
							null
						);
						this.isDisableBtn = false;
						this.refreshService.emit(this.selectedCategory._id);
						this.frmNewservice.reset();
						this.close_onClick();
					},
					(error) => {
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy('Failed to add service', 'error');
						this.isDisableBtn = false;
					}
				);
		}
	}

	onEditPrice(event, i) {
		this.priceItems[i].price = <number>event.target.value;
	}

	compare(arrayA, arrayB) {
		if (arrayA !== undefined && arrayB !== undefined && (arrayA !== null && arrayB !== null)) {
			if (arrayA.length > 0) {
				if (arrayB.length > 0) {
					const len1 = arrayA.length - 1;
					for (let index = 0; index <= len1; index++) {
						const len2 = arrayB.length - 1;
						for (let index2 = 0; index2 <= len2; index2++) {
							if (arrayA[index].serviceId.toString() === arrayB[index2].serviceId.toString()) {
								arrayA[index].checked = true;
							}
						}
					}
				}
			}
		}
	}

	onServiceSelected(item) {
		this.allServiceItems = [];
		const index = this.selectedServiceItems.filter((x) => x.serviceId.toString() === item.serviceId.toString());
		if (index.length === 0) {
			this.selectedServiceItems.push(item);
		} else {
			this.systemModuleService.announceSweetProxy('This service has been selected', 'error');
		}
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	onClickShowPanel() {
		this.showPanel = !this.showPanel;
	}
}
