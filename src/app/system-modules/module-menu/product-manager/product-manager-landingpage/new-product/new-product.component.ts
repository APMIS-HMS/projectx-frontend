import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
	ManufacturerService,
	PresentationService,
	GenericService,
	ProductTypeService,
	ProductService,
	DictionariesService,
	FacilitiesServiceCategoryService,
	StrengthService,
	DrugListApiService,
	DrugDetailsService,
	FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, FacilityService, User } from '../../../../../models/index';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-new-product',
	templateUrl: './new-product.component.html',
	styleUrls: [ './new-product.component.scss' ]
})
export class NewProductComponent implements OnInit {
	@Output() refreshProductList: EventEmitter<boolean> = new EventEmitter<boolean>();
	isManufacturer = false;
	isPresentation = false;
	isStrength = false;

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedProduct: any = <any>{};

	mainErr = true;
	errMsg = 'You have unresolved errors';
	productNameLabel = true;

	productName = '';
	presentationName = '';
	strengthName = '';
	productSugestion = false;
	ingridentSugestion = false;
	dictionaries: any[] = [];
	activeIngredients: any[] = [];

	manufacturers: any[] = [];
	presentations: any[] = [];
	generics: any[] = [];
	productTypes: any[] = [];
	categories: any[] = [];
	strengths: any[] = [];
	simpleProducts: any[] = [];
	productDetails: any = <any>{};
	mostRecentValue = <any>{};
	user: User = <User>{};
	public frm_newProduct: FormGroup;
	public ingredientForm: FormGroup;
	public variantsForm: FormGroup;

	selectedFacility: Facility = <Facility>{};
	selectedFacilityService: FacilityService = <FacilityService>{};

	createText = 'Create Product';

	constructor(
		private _locker: CoolLocalStorage,
		private formBuilder: FormBuilder,
		private manufacturerService: ManufacturerService,
		private genericService: GenericService,
		private presentationService: PresentationService,
		private productTypeService: ProductTypeService,
		private _facilityService: FacilitiesService,
		private _systemModuleService: SystemModuleService,
		private productService: ProductService,
		private dictionariesService: DictionariesService,
		private locker: CoolLocalStorage,
		private facilityServiceCategoryService: FacilitiesServiceCategoryService,
		private strengthService: StrengthService,
		private drugListApiService: DrugListApiService,
		private drugDetailsService: DrugDetailsService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');

		this.frm_newProduct = this.formBuilder.group({
			productTypeId: [ '', [ <any>Validators.required ] ],
			categoryId: [ '', [ <any>Validators.required ] ],
			name: [ '', [ <any>Validators.required, Validators.minLength(3) ] ],
			presentation: [ '' ],
			manufacturer: [ '', [ <any>Validators.required ] ],
			genericName: [ '' ],
			facilityId: [ this.selectedFacility._id, [ <any>Validators.required ] ]
		});

		this.initVariantForm();
		this.initIngredientsForm();

		this.frm_newProduct.controls['name'].valueChanges.subscribe((payload) => {
			this.ingridentSugestion = false;
			if (payload !== null && payload !== undefined && payload.length > 0) {
				this.mostRecentValue.product = payload;
				this.productSugestion = true;
				if (this.frm_newProduct.controls['name'].value !== null) {
					this.productName =
						this.presentationName +
						' ' +
						this.frm_newProduct.controls['name'].value +
						' ' +
						this.strengthName;
				}
			} else {
				this.productSugestion = false;
			}
		});
		this.frm_newProduct.controls['genericName'].valueChanges.subscribe((payload) => {
			this.productSugestion = false;
			if (payload !== null && payload !== undefined && payload.length > 0) {
				this.mostRecentValue.generic = payload;
				this.ingridentSugestion = true;
			} else {
				this.ingridentSugestion = false;
			}
			// this.subscribeToControls();
		});

		this.frm_newProduct.controls['presentation'].valueChanges.subscribe((value) => {
			this.mostRecentValue.presentation = value;
			const presentation = this.presentations.filter((x) => x._id === value);
			if (presentation.length > 0) {
				this.presentationName = presentation[0].name;
				if (this.frm_newProduct.controls['name'].value !== null) {
					this.productName =
						this.presentationName +
						' ' +
						this.frm_newProduct.controls['name'].value +
						' ' +
						this.strengthName;
				}
			}
		});
		this.frm_newProduct.controls['categoryId'].valueChanges.subscribe((payload) => {
			if (payload !== null && payload !== undefined && payload.length > 0) {
				this.mostRecentValue.category = payload;
			}
		});

		this.frm_newProduct.controls['manufacturer'].valueChanges.subscribe((payload) => {
			if (payload !== null && payload !== undefined && payload.length > 0) {
				this.mostRecentValue.manufacturer = payload;
			}
		});

		this.frm_newProduct.controls['productTypeId'].valueChanges.subscribe((payload) => {
			if (payload !== null && payload !== undefined && payload.length > 0) {
				this.mostRecentValue.productType = payload;
			}
		});
		this.frm_newProduct.valueChanges.subscribe((value) => {
			if (this.mostRecentValue !== null && this.mostRecentValue !== undefined) {
				this.locker.setObject('recentValues', this.mostRecentValue);
			}
			this.mainErr = true;
			this.productSugestion = false;
		});

		this.getManufacturers();
		this.getGenerics();
		this.getPresentations();
		this.getProductTypes();
		this.getServiceCategories();
		this.getStrengths();

		let recent = <any>this.locker.getObject('recentValues');
		if (recent !== null && recent !== undefined) {
			if (recent.presentation !== undefined) {
				this.frm_newProduct.controls['presentation'].setValue(recent.presentation);
			}
			if (recent.manufacturer !== undefined) {
				this.frm_newProduct.controls['manufacturer'].setValue(recent.manufacturer);
			}
			if (recent.generic !== undefined) {
				this.frm_newProduct.controls['genericName'].setValue(recent.generic);
			}
			if (recent.productType !== undefined) {
				this.frm_newProduct.controls['productTypeId'].setValue(recent.productType);
			}
			if (recent.category !== undefined) {
				this.frm_newProduct.controls['categoryId'].setValue(recent.category);
			}
		}
		this.populateProduct();
	}

	compareItems(l1: any, l2: any) {
		return l1.includes(l2);
	}

	initVariantForm() {
		this.variantsForm = this.formBuilder.group({
			variants: this.formBuilder.array([
				this.formBuilder.group({
					size: [ '' ],
					unit: [ '' ]
				})
			])
		});
		this.variantsForm.controls['variants'] = this.formBuilder.array([]);
	}

	initIngredientsForm() {
		this.ingredientForm = this.formBuilder.group({
			ingredients: this.formBuilder.array([
				this.formBuilder.group({
					name: [ '' ],
					strength: [ '' ],
					strengthUnit: [ '' ]
				})
			])
		});
		this.ingredientForm.controls['ingredients'] = this.formBuilder.array([]);
	}

	getStrengths() {
		this.strengthService.find({}).subscribe((payload) => {
			this.strengths = payload.data;
		});
	}
	getServiceCategories() {
		this.facilityServiceCategoryService
			.find({ query: { facilityId: this.selectedFacility._id } })
			.subscribe((payload) => {
				if (payload.data.length > 0) {
					this.selectedFacilityService = payload.data[0];
					this.categories = payload.data[0].categories;
				}
			});
	}

	populateProduct() {
		if (this.selectedProduct !== undefined && this.selectedProduct._id !== undefined) {
			this.createText = 'Update Product';
			this.frm_newProduct.controls['name'].setValue(this.selectedProduct.name);
			// this.frm_newProduct.controls['packLabel'].setValue(this.selectedProduct.packLabel);
			// this.frm_newProduct.controls['packSize'].setValue(this.selectedProduct.packSize);
			this.frm_newProduct.controls['presentation'].setValue(this.selectedProduct.presentation);
			this.frm_newProduct.controls['manufacturer'].setValue(this.selectedProduct.manufacturer);
			this.frm_newProduct.controls['genericName'].setValue(this.selectedProduct.genericName);
			this.frm_newProduct.controls['facilityId'].setValue(this.selectedProduct.facilityId);
			this.frm_newProduct.controls['productTypeId'].setValue(this.selectedProduct.productTypeId);
			this.frm_newProduct.controls['categoryId'].setValue(this.selectedProduct.categoryId);
			if (this.selectedProduct.productDetail !== undefined) {
				this.setIngredientItem(this.selectedProduct.productDetail.ingredients);
			}
			this.setVariantItem(this.selectedProduct.variants);
		} else {
			this.createText = 'Create Product';
			// this.frm_newProduct.reset();
			this.frm_newProduct.controls['facilityId'].setValue(this.selectedFacility._id);
		}
	}
	getManufacturers() {
		this.manufacturerService.find({}).then((payload) => {
			this.manufacturers = payload.data;
		});
	}
	getGenerics() {
		this.genericService.find({}).then((payload) => {
			this.generics = payload.data;
		});
	}
	getPresentations() {
		this.presentationService.findAll().then((payload) => {
			this.presentations = payload.data;
		});
	}
	getProductTypes() {
		this.productTypeService
			.find({ query: { facilityId: this.selectedFacility._id, isActive: true } })
			.then((payload) => {
				this.productTypes = payload.data;
			});
	}
	close_onClick() {
		this.closeModal.emit(true);
	}

	stringifyGeneric(values: any[]) {
		let generic = '';
		values.forEach((item) => {
			generic += item.name + ' ' + item.strength + ' ' + item.strengthUnit + '/ ';
		});
		return generic;
	}

	create(valid, value) {
		if (valid) {
			this._systemModuleService.on();
			if (this.selectedProduct === undefined || this.selectedProduct._id === undefined) {
				const service: any = <any>{};
				service.name = value.name;
				this.productDetails.ingredients = [];
				this.productDetails.ingredients = this.ingredientForm.controls['ingredients'].value;
				value.variants = this.variantsForm.controls['variants'].value;
				if (value.genericName === null) {
					value.genericName = this.stringifyGeneric(this.productDetails.ingredients);
				}
				value.productDetail = this.productDetails;

				this.productService.create(value).then(
					(payload) => {
						this._systemModuleService.off();
						this._systemModuleService.announceSweetProxy(
							'Product has been created successfully!',
							'success'
						);
						this.selectedFacilityService.categories.forEach((item, i) => {
							if (item._id === value.categoryId) {
								item.services.push(service);
							}
						});
						this.facilityServiceCategoryService
							.update(this.selectedFacilityService)
							.subscribe((payResult: FacilityService) => {
								payResult.categories.forEach((itemi, i) => {
									if (itemi._id === value.categoryId) {
										itemi.services.forEach((items, s) => {
											if (items.name === service.name) {
												payload.serviceId = items._id;
												payload.facilityServiceId = this.selectedFacilityService._id;
												this.productService.update(payload).then((result) => {
													this.refreshProductList.emit(true);
													this.close_onClick();
												});
											}
										});
									}
								});
							});
					},
					(error) => {
						this._systemModuleService.off();
					}
				);
			} else {
				this._systemModuleService.off();
				value._id = this.selectedProduct._id;
				this.productService.update(value).then((payload) => {
					this._systemModuleService.announceSweetProxy('Product has been updated successfully!', 'success');
					this.refreshProductList.emit(true);
					this.close_onClick();
				});
			}
			this.mainErr = true;
		} else {
			this._systemModuleService.announceSweetProxy('One or more field(s) are missing', 'error');
			this._systemModuleService.off();
			this.mainErr = false;
		}
	}
	onSelectProductSuggestion(suggestion) {
		this.drugDetailsService.find({ query: { productId: suggestion.productId } }).subscribe(
			(payload) => {
				const data = JSON.parse(payload.body);
				payload.data = data;
				this.frm_newProduct.controls['name'].setValue(payload.data.brand + '-' + suggestion.activeIngredient);
				this.frm_newProduct.controls['genericName'].setValue(suggestion.activeIngredient);
				this.frm_newProduct.controls['presentation'].setValue(payload.data.form);
				this.frm_newProduct.controls['manufacturer'].setValue(payload.data.company);
				this.initIngredientsForm();
				this.setIngredientItem(payload.data.ingredients);
				this.productDetails = payload.data;
				// this.manufacturers = [];
				// var manufacturerItem : any = <any>{};
				// manufacturerItem = {};
				// manufacturerItem.name = payload.company;
				// manufacturerItem._id = "0";
				// this.manufacturers.push(manufacturerItem);
			},
			(error) => {}
		);
	}

	onSelectActiveIngredientSuggestion(active) {
		this.frm_newProduct.controls['genericName'].setValue(active.genericName);
		this.dictionaries = [];
		this.productSugestion = false;
		this.activeIngredients = [];
		this.ingridentSugestion = false;
	}
	presentationSlide() {
		this.isManufacturer = false;
		this.isPresentation = true;
		this.isStrength = false;
	}
	manufacturerSlide() {
		this.isManufacturer = true;
		this.isPresentation = false;
		this.isStrength = false;
	}

	strengthSlide() {
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = true;
	}

	addIngredient() {
		const control = <FormArray>this.ingredientForm.controls['ingredients'];
		control.push(this.ingredientItem());
	}

	addVariant() {
		const control = <FormArray>this.variantsForm.controls['variants'];
		control.push(this.variantItem());
	}

	variantItem() {
		return this.formBuilder.group({
			size: [ '' ],
			unit: [ '' ]
		});
	}

	ingredientItem() {
		return this.formBuilder.group({
			name: [ '' ],
			strength: [ '' ],
			strengthUnit: [ '' ]
		});
	}

	setIngredientItem(values: any[]) {
		const control = <FormArray>this.ingredientForm.controls['ingredients'];
		values.forEach((item) => {
			control.push(
				this.formBuilder.group({
					name: [ item.name ],
					strength: [ item.strength ],
					strengthUnit: [ item.strengthUnit ]
				})
			);
		});
	}

	setVariantItem(values: any[]) {
		const control = <FormArray>this.variantsForm.controls['variants'];
		values.forEach((item) => {
			control.push(
				this.formBuilder.group({
					size: [ item.size ],
					unit: [ item.unit ]
				})
			);
		});
	}

	removeIngredient(i: number) {
		const control = <FormArray>this.ingredientForm.controls['ingredients'];
		control.removeAt(i);
	}

	removeVariant(i: number) {
		const control = <FormArray>this.variantsForm.controls['variants'];
		control.removeAt(i);
	}

	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
}
