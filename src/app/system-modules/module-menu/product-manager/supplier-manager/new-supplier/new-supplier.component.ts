import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { SupplierService } from '../../../../../services/facility-manager/setup/index';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';
import { CountryServiceFacadeService } from 'app/system-modules/service-facade/country-service-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, Employee } from '../../../../../models/index';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-new-supplier',
	templateUrl: './new-supplier.component.html',
	styleUrls: [ './new-supplier.component.scss' ]
})
export class NewSupplierComponent implements OnInit {
	mainErr = true;
	errMsg = 'You have unresolved errors';
	loadIndicatorVisible = false;
	public frm_newSupplier: FormGroup;
	loginEmployee: Employee;
	selectedLocation: any = <any>{};
	addBtn = true;
	addingBtn = false;
	updateBtn = false;
	updatingBtn = false;
	disableAddBtn = true;
	showSearchResult = false;
	countries: any[] = [];
	states: any[] = [];
	suppliers: any[] = [];
	pickedSupplier: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() refreshSupplier: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedSupplier: any = <any>{};
	selectedFacility: Facility = <Facility>{};
	userSettings: any = {
		geoCountryRestriction: [ GEO_LOCATIONS ],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};
	constructor(
		private formBuilder: FormBuilder,
		private locker: CoolLocalStorage,
		private _countryServiceFacade: CountryServiceFacadeService,
		private _systemModuleService: SystemModuleService,
		private supplierService: SupplierService,
		private _facilityServiceFacade: FacilityFacadeService,
		private titleCasePipe: TitleCasePipe,
		private upperCasePipe: UpperCasePipe,
		private _authFacadeService: AuthFacadeService
	) {
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				if (!!res._id) {
					this.loginEmployee = res;
				}
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.frm_newSupplier = this.formBuilder.group({
			name: [ '', [ <any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50) ] ],
			frmState: [ '', [ <any>Validators.required ] ],
			cac: [ '', [ <any>Validators.required ] ],
			frmCountry: [ '', [ <any>Validators.required ] ],
			frmCity: [ '', [ <any>Validators.required ] ],
			frmContact: [
				'',
				[ <any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$') ]
			],
			frmStreet: [ '', [ <any>Validators.required ] ],
			email: [ '', [ <any>Validators.required, Validators.pattern(EMAIL_REGEX) ] ],
			facilityId: [ this.selectedFacility._id ]
		});
		this.populateSupplier();

		this.frm_newSupplier.controls['frmCountry'].valueChanges.subscribe((country) => {
			this._countryServiceFacade
				.getOnlyStates(country)
				.then((payload: any) => {
					this.states = payload;
				})
				.catch((error) => {});
		});
		this._getCountries();
		this.frm_newSupplier.controls['name'].valueChanges
			.debounceTime(200)
			.distinctUntilChanged()
			.subscribe((payload: any) => {
				if (payload) {
					if (payload.length > 0) {
						this.showSearchResult = true;
						this.supplierService
							.searchSuppliers({
								query: {
									facilityId: this.selectedFacility._id,
									supplierName: payload
								}
							})
							.then((supplierpayload) => {
								this.suppliers = supplierpayload;
							})
							.catch((err) => {});
					} else {
						this.showSearchResult = false;
						this.frm_newSupplier.controls['email'].enable();
						this.frm_newSupplier.controls['frmContact'].enable();
						this.frm_newSupplier.controls['frmCountry'].enable();
						this.frm_newSupplier.controls['frmStreet'].enable();
						this.frm_newSupplier.controls['frmCity'].enable();
						this.frm_newSupplier.controls['cac'].enable();
					}
				} else {
					this.showSearchResult = false;
					this.frm_newSupplier.controls['email'].enable();
					this.frm_newSupplier.controls['frmContact'].enable();
					this.frm_newSupplier.controls['frmCountry'].enable();
					this.frm_newSupplier.controls['frmStreet'].enable();
					this.frm_newSupplier.controls['frmCity'].enable();
					this.frm_newSupplier.controls['cac'].enable();
				}
			});
	}
	populateSupplier() {
		if (this.selectedSupplier._id !== undefined) {
			// this.btnLabel = 'Update';
			this.addBtn = false;
			this.addingBtn = false;
			this.updateBtn = true;
			this.updatingBtn = false;
			this.disableAddBtn = false;
			this.frm_newSupplier.controls['name'].setValue(this.selectedSupplier.name);
			this.frm_newSupplier.controls['email'].setValue(this.selectedSupplier.email);
			this.frm_newSupplier.controls['frmContact'].setValue(this.selectedSupplier.contact);
			this.frm_newSupplier.controls['frmCountry'].setValue(this.selectedSupplier.address.country);
			this._countryServiceFacade
				.getOnlyStates(this.selectedSupplier.address.country)
				.then((payload: any) => {
					this.states = payload;
				})
				.catch((error) => {});
			this.frm_newSupplier.controls['frmState'].setValue(this.selectedSupplier.address.state);
			this.frm_newSupplier.controls['frmStreet'].setValue(this.selectedSupplier.address.street);
			this.frm_newSupplier.controls['frmCity'].setValue(this.selectedSupplier.address.city);
		} else {
			this.addBtn = true;
			this.addingBtn = false;
			this.updateBtn = false;
			this.updatingBtn = false;
			this.disableAddBtn = false;
			this.frm_newSupplier.reset();
		}
	}
	close_onClick() {
		this.selectedSupplier = {};
		this.closeModal.emit(true);
	}

	_getCountries() {
		this._countryServiceFacade
			.getOnlyCountries()
			.then((res: any) => {
				if (res.length > 0) {
					this.countries = res;
				}
			})
			.catch((error) => {});
	}

	autoCompleteCallback(selectedData: any) {
		if (selectedData.response) {
			const res = selectedData;
			this.selectedLocation = res.data;
			if (!!res.data.address_components) {
				if (res.data.address_components[0].types[0] === 'route') {
					const streetAddress = res.data.formatted_address;
					const city = res.data.address_components[1].long_name;
					const country = res.data.address_components[5].long_name;
					const state = res.data.address_components[4].long_name;

					this.frm_newSupplier.controls['frmState'].setValue(state);
					this.frm_newSupplier.controls['frmCountry'].setValue(country);
					this.frm_newSupplier.controls['frmStreet'].setValue(streetAddress);
					this.frm_newSupplier.controls['frmCity'].setValue(city);
				} else {
					const streetAddress = res.data.formatted_address;
					const city = res.data.address_components[0].long_name;
					const country = res.data.address_components[3].long_name;
					const state = res.data.address_components[1].long_name;

					this.frm_newSupplier.controls['frmState'].setValue(state);
					this.frm_newSupplier.controls['frmCountry'].setValue(country);
					this.frm_newSupplier.controls['frmStreet'].setValue(streetAddress);
					this.frm_newSupplier.controls['frmCity'].setValue(city);
				}
			}
		}
	}

	compareCountry(l1: any, l2: any) {
		return l1.includes(l2);
	}

	compareState(l1: any, l2: any) {
		return l1.includes(l2);
	}

	create(valid, value) {
		if (valid) {
			this.addBtn = false;
			this.addingBtn = true;
			this.updateBtn = false;
			this.updatingBtn = false;
			this.disableAddBtn = true;
			this._systemModuleService.on();
			this.mainErr = true;
			// this.supplierService.create(form.value).then(payload => {
			//   this.frm_newSupplier.reset();
			// });
			// const facility: any = {
			//   facilityId: this.selectedFacility._id,
			//   name: this.frm_newSupplier.controls['name'].value,
			//   contact: this.frm_newSupplier.controls['frmContact'].value,
			//   email: this.frm_newSupplier.controls['email'].value,
			//   address: {
			//     street: this.frm_newSupplier.controls['frmStreet'].value,
			//     state: this.frm_newSupplier.controls['frmState'].value,
			//     country: this.frm_newSupplier.controls['frmCountry'].value,
			//     city: this.frm_newSupplier.controls['frmCity'].value,
			//     details: this.selectedLocation
			//   }
			// }

			const facility: any = {
				name: this.titleCasePipe.transform(value.name),
				email: this.titleCasePipe.transform(value.email),
				cacNo: this.upperCasePipe.transform(value.cac),
				primaryContactPhoneNo: this.titleCasePipe.transform(value.frmContact),
				address: this.selectedLocation,
				country: value.frmCountry,
				state: value.frmState,
				city: value.frmCity,
				isHDO: false,
				street: this.titleCasePipe.transform(value.frmStreet)
			};

			const payload = {
				facility: facility,
				apmisId: this.loginEmployee.personDetails.apmisId,
				personId: this.loginEmployee.personId,
				employeeId: this.loginEmployee._id,
				facilityId: this.selectedFacility._id
			};

			this.supplierService
				.customCreate(payload)
				.then((res) => {
					if (res.status === 'success') {
						this.frm_newSupplier.reset();
						this.userSettings['inputString'] = '';
						this.close_onClick();
						this._systemModuleService.announceSweetProxy('Facility created successfully', 'success');
					}
					this.addBtn = true;
					this.addingBtn = false;
					this.updateBtn = false;
					this.updatingBtn = false;
					this.disableAddBtn = false;
					this._systemModuleService.off();
				})
				.catch((err) => {
					this._systemModuleService.announceSweetProxy('An error occured', 'error');
				});

			// this._facilityServiceFacade.saveFacility(payload).then(res => {
			//   this.addBtn = true;
			//   this.addingBtn = false;
			//   this.updateBtn = false;
			//   this.updatingBtn = false;
			//   this.disableAddBtn = false;
			//   this.frm_newSupplier.reset();
			//   this.userSettings['inputString'] = '';
			//   this._systemModuleService.off();
			//   this.close_onClick();
			//   this._systemModuleService.announceSweetProxy('Facility created successfully', 'success');
			// }, error => {
			//   this._systemModuleService.off();
			//   const errMsg = 'There was an error while creating the facility, try again!';
			//   this._systemModuleService.announceSweetProxy(errMsg, 'error');
			// });

			// if (this.selectedSupplier._id === undefined) {
			//   this.supplierService.create(value).then(payload => {
			//     this.frm_newSupplier.reset();
			//     this.userSettings['inputString'] = '';
			//     this._systemModuleService.off();
			//     this._systemModuleService.announceSweetProxy('Supplier created successfully', 'success', this, null, null, null, null, null, null);
			//   }, err => {
			//     this._systemModuleService.announceSweetProxy('There was an error while creating supplier, try again!', 'error');
			//     this._systemModuleService.off();
			//   });
			// } else {
			//   value._id = this.selectedSupplier._id;
			//   this.supplierService.patch(value._id, {
			//     facilityId: value.facilityId,
			//     name: value.name,
			//     contact: value.contact,
			//     email: value.email,
			//     address: value.address
			//   }).then(payload => {
			//     this.frm_newSupplier.reset();
			//     this.userSettings['inputString'] = '';
			//     this._systemModuleService.off();
			//     this._systemModuleService.announceSweetProxy('Supplier updated successfully', 'success', this, null, null, null, null, null, null);
			//   }, err => {
			//     this._systemModuleService.announceSweetProxy('There was an error while updating supplier, try again!', 'error');
			//     this._systemModuleService.off();
			//   });
			// }
		} else {
			this.mainErr = false;
		}
	}
	sweetAlertCallback(result) {
		this.refreshSupplier.emit(true);
	}
	hideSuggestions() {
		this.showSearchResult = false;
	}
	fillingFormWithSearchInfo(supplier) {
		this.updateBtn = true;
		this.addBtn = false;
		this.selectedSupplier = supplier.supplier;
		this.pickedSupplier = supplier;
		let streetAddress, city, country, state;
		streetAddress = this.selectedSupplier.address.formatted_address;
		if (this.selectedSupplier.address.address_components[0].types[0] === 'route') {
			city = this.selectedSupplier.address.address_components[2].long_name;
			country = this.selectedSupplier.address.address_components[5].long_name;
			state = this.selectedSupplier.address.address_components[4].long_name;
		} else {
			city = this.selectedSupplier.address.address_components[2].long_name;
			country = this.selectedSupplier.address.address_components[6].long_name;
			state = this.selectedSupplier.address.address_components[5].long_name;
		}
		this.frm_newSupplier.controls['name'].setValue(this.selectedSupplier.name);
		this.frm_newSupplier.controls['email'].setValue(this.selectedSupplier.email);
		this.frm_newSupplier.controls['frmContact'].setValue(this.selectedSupplier.primaryContactPhoneNo);
		this.frm_newSupplier.controls['frmCountry'].setValue(country);
		this._countryServiceFacade
			.getOnlyStates(country)
			.then((payload: any) => {
				this.states = payload;
			})
			.catch((error) => {});
		this.frm_newSupplier.controls['frmState'].setValue(state);
		this.frm_newSupplier.controls['frmStreet'].setValue(streetAddress);
		this.frm_newSupplier.controls['frmCity'].setValue(city);
		this.frm_newSupplier.controls['cac'].setValue(this.selectedSupplier.cacNo);

		if (this.frm_newSupplier.controls['name'].value.length > 0) {
			this.frm_newSupplier.controls['email'].disable();
			this.frm_newSupplier.controls['frmContact'].disable();
			this.frm_newSupplier.controls['frmCountry'].disable();
			this.frm_newSupplier.controls['frmStreet'].disable();
			this.frm_newSupplier.controls['frmCity'].disable();
			this.frm_newSupplier.controls['cac'].disable();
		} else {
			this.frm_newSupplier.controls['email'].enable();
			this.frm_newSupplier.controls['frmContact'].enable();
			this.frm_newSupplier.controls['frmCountry'].enable();
			this.frm_newSupplier.controls['frmStreet'].enable();
			this.frm_newSupplier.controls['frmCity'].enable();
			this.frm_newSupplier.controls['cac'].enable();
		}
	}

	update(valid, value) {
		this.updatingBtn = true;
		const sup = {
			facilityId: this.selectedFacility._id,
			supplierId: this.pickedSupplier.supplierId,
			createdBy: this.loginEmployee._id
		};
		this.supplierService
			.createExistingSupplier(sup)
			.then((payload) => {
				if (payload.status !== 'error') {
					this.updatingBtn = false;
					this.updateBtn = false;
					this.frm_newSupplier.reset();
					this.userSettings['inputString'] = '';
					this.close_onClick();
					this._systemModuleService.announceSweetProxy('Facility updated successfully', 'success');
				} else {
					this.updatingBtn = false;
					this._systemModuleService.announceSweetProxy(payload.message, 'warning');
				}
			})
			.catch((err) => {});
	}
}
