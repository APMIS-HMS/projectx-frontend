import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FacilitiesService } from './../../services/facility-manager/setup/facility.service';

import { CountryServiceFacadeService } from './../../system-modules/service-facade/country-service-facade.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {
	EMAIL_REGEX,
	WEBSITE_REGEX,
	PHONE_REGEX,
	CACNO_REGEX,
	GEO_LOCATIONS
} from 'app/shared-module/helpers/global-config';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';

@Component({
	selector: 'app-facility-info',
	templateUrl: './facility-info.component.html',
	styleUrls: [ '../facility-setup.component.scss' ]
})
export class FacilityInfoComponent implements OnInit {
	isSaving = false;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};

	errMsg: string;
	mainErr = true;
	countries: any[] = [];
	states: any[] = [];
	public facilityForm1: FormGroup;
	selectedLocation: any;
	userSettings: any = {
		geoCountryRestriction: [ GEO_LOCATIONS ],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};
	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _countryServiceFacade: CountryServiceFacadeService,
		private _facilityService: FacilitiesService,
		private _facilityServiceFacade: FacilityFacadeService,
		private _systemModuleService: SystemModuleService,
		private titleCasePipe: TitleCasePipe,
		private upperCasePipe: UpperCasePipe
	) {}

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({
			facilityname: [
				'',
				[ <any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50) ]
			],
			facilityemail: [ '', [ <any>Validators.required, Validators.pattern(EMAIL_REGEX) ] ],
			// facilitywebsite: ['', [ <any>Validators.pattern(WEBSITE_REGEX)]],
			// network: ['', [<any>Validators.minLength(2)]],
			address: [ '', [] ],
			//cac: [ '', [ <any>Validators.required ] ],
			cac: [ '', [ <any>Validators.required, Validators.pattern(CACNO_REGEX) ] ],
			facilitystreet: [ '', [ <any>Validators.required ] ],
			facilitycity: [ '', [ <any>Validators.required ] ],
			facilitystate: [ '', [ <any>Validators.required ] ],
			facilitycountry: [ '', [ <any>Validators.required ] ],
			facilityhdo: [ true, [ <any>Validators.required ] ],
			facilityphonNo: [
				'',
				[ <any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$') ]
			]
		});
		this.facilityForm1.controls.facilitycountry.valueChanges.subscribe((country) => {
			this._countryServiceFacade
				.getOnlyStates(country, true)
				.then((payload: any) => {
					this.states = payload;
				})
				.catch((error) => {});
		});
		this._getCountries();
	}

	_getCountries() {
		this._countryServiceFacade
			.getOnlyCountries()
			.then((payload: any) => {
				this.countries = payload;
			})
			.catch((error) => {});
	}

	// cacCheck(control: FormControl) {
	// 	// console.log(control);
	// 	 if (control.value !== undefined) {
	// 		const cac = control.value;
	// 		const cacNo = cac.substr(0, 1);
	// 		if (cacNo !== 'RC' || cacNo !== 'BN') {
	// 			console.log(cac);
	// 			// return {error: true};
	// 			// control.valid = true;
	// 			return control;
	// 		}else {
	// 			console.log('Not valid');
	// 			return {error: false};
	// 		}
	// 	 }
	// }

	// 	cacCheck(c: AbstractControl): {[key: string]: boolean} | null {
	// 		if (c.value !== undefined) {
	// 		   const cac = c.value;
	// 		   const cacNo = cac.substr(0, 1);
	// 		   console.log(cac);
	// 		   if (cacNo !== 'RC' || cac !== 'BN') {
	// 			   return {error: true};
	// 		   }else {
	// 			   return {error: false};
	// 		   }
	// 		}
	//    }

	close_onClick() {
		this.closeModal.emit(true);
	}
	autoCompleteCallback1(selectedData: any) {
		if (selectedData.response) {
			const res = selectedData;
			this.selectedLocation = res.data;
			if (res.data.address_components[0].types[0] === 'route') {
				const streetAddress = res.data.address_components[0].long_name;
				const city = res.data.address_components[1].long_name;
				const country = res.data.address_components[4].long_name;
				const state = res.data.address_components[3].long_name;

				this.facilityForm1.controls.facilitystreet.setValue(streetAddress);
				this.facilityForm1.controls.facilitycity.setValue(city);
				this.facilityForm1.controls.facilitycountry.setValue(country);
				this.facilityForm1.controls.facilitystate.setValue(state);
			} else {
				const streetAddress = res.data.vicinity;
				const city = res.data.address_components[0].long_name;
				const country = res.data.address_components[3].long_name;
				const state = res.data.address_components[2].long_name;

				this.facilityForm1.controls.facilitystreet.setValue(streetAddress);
				this.facilityForm1.controls.facilitycity.setValue(city);
				this.facilityForm1.controls.facilitycountry.setValue(country);
				this.facilityForm1.controls.facilitystate.setValue(state);
			}
		}
	}

	compareState(l1: any, l2: any) {
		return l1.includes(l2);
	}

	save(form) {
		this._systemModuleService.on();
		this.isSaving = true;
		const facility: any = {
			name: this.titleCasePipe.transform(form.facilityname),
			email: this.titleCasePipe.transform(form.facilityemail),
			cacNo: this.upperCasePipe.transform(form.cac),
			primaryContactPhoneNo: this.titleCasePipe.transform(form.facilityphonNo),
			address: this.selectedLocation,
			country: form.facilitycountry,
			state: form.facilitystate,
			city: form.facilitycity,
			isHDO: form.facilityhdo,
			street: this.titleCasePipe.transform(form.facilitystreet)
		};
		const payload = {
			facility: facility,
			apmisId: this._facilityServiceFacade.facilityCreatorApmisID,
			personId: this._facilityServiceFacade.facilityCreatorPersonId
		};
		this._facilityServiceFacade.saveFacility(payload).then(
			(payload) => {
				this.isSaving = false;
				this.facilityForm1.reset();
				this.userSettings['inputString'] = '';
				this._systemModuleService.off();
				this.close_onClick();
				this._systemModuleService.announceSweetProxy(
					'Facility created successfully',
					'success',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
			},
			(error) => {
				console.log(error);
				this.isSaving = false;
				this._systemModuleService.off();
				const errMsg = 'There was an error while creating the facility, try again!';
				this._systemModuleService.announceSweetProxy(errMsg, 'error');
			}
		);
	}
}
