import { ALPHABET_REGEX } from './../../../../../../shared-module/helpers/global-config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PHONE_REGEX, EMAIL_REGEX } from 'app/shared-module/helpers/global-config';
import { SupplierService, EmployeeService } from 'app/services/facility-manager/setup';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CountryServiceFacadeService } from 'app/system-modules/service-facade/country-service-facade.service';
import { Employee, Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

@Component({
	selector: 'app-new-supplier',
	templateUrl: './new-supplier.component.html',
	styleUrls: [ './new-supplier.component.scss' ]
})
export class NewSupplierComponent implements OnInit {
	supplierFormGroup: FormGroup;
	countries: any[] = [];
	states: any[] = [];
	cities: any;
	selectedCountry: any;
	selectedState: any;
	selectedCity: any;
	subscription: any;
	checkingStore: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	selectedFacility: any;
	suppliers: any[] = [];
	constructor(
		private formBuilder: FormBuilder,
		private supplier: SupplierService,
		private _systemModuleService: SystemModuleService,
		private _locker: CoolLocalStorage,
		private _countryServiceFacade: CountryServiceFacadeService,
		private authFacadeService: AuthFacadeService,
		private supplierService: SupplierService,
		private _employeeService: EmployeeService
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
							.then((payload) => {
								this.loginEmployee = payload;
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
								.then((payload) => {
									this.loginEmployee = payload;
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
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.supplierFormGroup = this.formBuilder.group({
			name: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(ALPHABET_REGEX)
				]
			],
			contactPerson: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(ALPHABET_REGEX)
				]
			],
			phone: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(PHONE_REGEX)
				]
			],
			email: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(EMAIL_REGEX)
				]
			],
			contactAddress: [
				'',
				[ <any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50) ]
			]
		});

		this._getCountries();
	}

	submit() {
		const form = this.supplierFormGroup.value;

		const facility: any = {
			name: form.name,
			email: form.email,
			cacNo: 'rc',
			primaryContactPhoneNo: form.phone,
			address: form.contactAddress,
			country: this.selectedCountry.name,
			state: this.selectedState.name,
			city: this.selectedCity.name,
			contactPerson: form.contactPerson,
			isHDO: false,
			street: 'Ikeja'
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
					this._systemModuleService.announceSweetProxy('Facility created successfully', 'success');
					this.supplierFormGroup.reset();
				}
				this._systemModuleService.off();
			})
			.catch((err) => {
				this._systemModuleService.off();
				this._systemModuleService.announceSweetProxy('An error occured', 'error');
			});
	}

	_getCountries() {
		this._countryServiceFacade
			.getOnlyCountries()
			.then((res: any) => {
				if (res.length > 0) {
					this.countries = res;
					const country = this.countries.find((x) => {
						return x.name === 'Nigeria';
					});
					this.selectedCountry = country;
					this._getState(country);
				}
			})
			.catch((error) => {});
	}

	_getState(country) {
		this._countryServiceFacade
			.getOnlyStates(country.name)
			.then((payload: any) => {
				this.states = payload;
				const state = this.states.find((x) => {
					return x.name === 'Lagos';
				});
				this.selectedState = state;
				this._getCities(country, state);
			})
			.catch((error) => {});
	}

	_getCities(country, state) {
		this._countryServiceFacade
			.getOnlyLGAndCities(country.name, state.name)
			.then((payload: any) => {
				this.cities = payload.cities;
				const city = this.cities.find((x) => {
					return x.name === 'Ikeja';
				});
				this.selectedCity = city;
			})
			.catch((error) => {});
	}

	getSuppliers() {
		this.supplierService
			.find({
				query: {
					facilityId: this.selectedFacility._id
				}
			})
			.then(
				(payload) => {
					this.suppliers = payload.data.map((c) => {
						return { id: c._id, label: c.supplier.name };
					});
				},
				(error) => {}
			);
	}
}
