import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { FacilityOwnershipService } from './../../../../services/module-manager/setup/facility-ownership.service';
import { FacilityTypeFacilityClassFacadeService } from './../../../service-facade/facility-type-facility-class-facade.service';
import { CountryServiceFacadeService } from './../../../service-facade/country-service-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import swal from 'sweetalert2';
import { ImageEmitterService } from '../../../../services/facility-manager/image-emitter.service';
import { ImageUploadService } from '../../../../services/facility-manager/setup';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-facility-basicinfo-edit',
	templateUrl: './facility-basicinfo-edit.component.html',
	styleUrls: [ './facility-basicinfo-edit.component.scss' ]
})
export class FacilityBasicinfoEditComponent implements OnInit {
	selectedLocation: any;
	@Input() selectedFacility: any = <any>{};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('successSwal') private deleteSwal: SwalComponent;
	mainErr = true;
	errMsg = '';
	countries: any[] = [];
	states: any[] = [];
	facilityTypes: any[] = [];
	facilityClasses: any[] = [];
	facilityOwnerships: any[] = [];
	public facilityForm1: FormGroup;
	userSettings: any = {
		geoCountryRestriction: [ GEO_LOCATIONS ],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		// inputPlaceholderText: 'Type anything and you will get a location',
		recentStorageName: 'componentData3'
	};
	showClose = true;
	selectedImageObject: any = <any>{};
	base64Image: String;
	hasChangedImage: Boolean = false;
	disableImageBtn: Boolean = false;
	saveImageBtn: Boolean = true;
	savingImageBtn: Boolean = false;

	constructor(
		private imageEmitterService: ImageEmitterService,
		private _imageUploadService: ImageUploadService,
		private formBuilder: FormBuilder,
		private _locker: CoolLocalStorage,
		private countryService: CountryServiceFacadeService,
		private facilityTypeService: FacilityTypeFacilityClassFacadeService,
		private facilityService: FacilitiesService,
		private facilityOwnershipService: FacilityOwnershipService,
		private systemModuleService: SystemModuleService,
		private authFacadeService: AuthFacadeService
	) {}

	ngOnInit() {
		const facility = this.authFacadeService.getSelectedFacility();
		if (facility.isValidRegistration === undefined || facility.isValidRegistration === false) {
			this.showClose = false;
		}
		this._getCountries();
		this._getFacilityTypes();
		if (this.selectedFacility.isHDO) {
			this.facilityForm1 = this.formBuilder.group({
				facilityname: [
					this.selectedFacility.name,
					[ <any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50) ]
				],
				facilityemail: [
					this.selectedFacility.email,
					[ <any>Validators.required, Validators.pattern(EMAIL_REGEX) ]
				],
				facilitywebsite: [ this.selectedFacility.website, [ <any>Validators.pattern(WEBSITE_REGEX) ] ],
				network: [ '', [] ],
				address: [ '', [] ],
				cac: [ this.selectedFacility.cacNo, [ <any>Validators.required ] ],
				facilitystreet: [ this.selectedFacility.street, [ <any>Validators.required ] ],
				facilitycity: [ this.selectedFacility.city, [ <any>Validators.required ] ],
				facilitystate: [ this.selectedFacility.state, [ <any>Validators.required ] ],
				facilitycountry: [ this.selectedFacility.country, [ <any>Validators.required ] ],
				facilityTypeId: [ this.selectedFacility.facilityTypeId, [ <any>Validators.required ] ],
				facilityClassId: [ this.selectedFacility.facilityClassId, [ <any>Validators.required ] ],
				facilityOwnershipId: [ this.selectedFacility.facilityOwnershipId, [ <any>Validators.required ] ],
				facilityShortName: [ this.selectedFacility.shortName, [ <any>Validators.required ] ],
				_id: [ this.selectedFacility._id, [] ],
				facilityphonNo: [
					this.selectedFacility.primaryContactPhoneNo,
					[ <any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$') ]
				]
			});
		} else {
			this.facilityForm1 = this.formBuilder.group({
				facilityname: [
					this.selectedFacility.name,
					[ <any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50) ]
				],
				facilityemail: [
					this.selectedFacility.email,
					[ <any>Validators.required, Validators.pattern(EMAIL_REGEX) ]
				],
				facilitywebsite: [ this.selectedFacility.website, [ <any>Validators.pattern(WEBSITE_REGEX) ] ],
				network: [ '', [] ],
				address: [ '', [] ],
				cac: [ this.selectedFacility.cacNo, [ <any>Validators.required ] ],
				facilitystreet: [ this.selectedFacility.street, [ <any>Validators.required ] ],
				facilitycity: [ this.selectedFacility.city, [ <any>Validators.required ] ],
				facilitystate: [ this.selectedFacility.state, [ <any>Validators.required ] ],
				facilitycountry: [ this.selectedFacility.country, [ <any>Validators.required ] ],
				facilityOwnershipId: [ this.selectedFacility.facilityOwnershipId, [ <any>Validators.required ] ],
				facilityShortName: [ this.selectedFacility.shortName, [ <any>Validators.required ] ],
				_id: [ this.selectedFacility._id, [] ],
				facilityphonNo: [
					this.selectedFacility.primaryContactPhoneNo,
					[ <any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$') ]
				]
			});
		}
		this.selectedLocation = this.selectedFacility.address;

		this._getStates(this.selectedFacility.country);
		this._getFacilityClasses(this.selectedFacility.facilityTypeId);
		this._getFacilityOwnerships();

		this.facilityForm1.controls.facilitycountry.valueChanges.subscribe((country) => {
			this._getStates(country);
		});

		if (this.facilityForm1.controls.facilityTypeId !== undefined) {
			this.facilityForm1.controls.facilityTypeId.valueChanges.subscribe((facilityType) => {
				this._getFacilityClasses(facilityType);
			});
		}
	}

	onClickChangeImage(fileName, fileList) {
		this.selectedImageObject = fileList[0];
		const reader = new FileReader();
		reader.onload = (e: any) => {
			this.base64Image = e.target.result;
			this.imageEmitterService.setSrc(e.target.result);
		};

		reader.readAsDataURL(fileList[0]);
		// This instance variable is to know if a user has selected an image
		// this will determine if to show upload button or not.
		this.hasChangedImage = true;
	}

	onClickUploadLogo() {
		this.disableImageBtn = true;
		this.saveImageBtn = false;
		this.savingImageBtn = true;
		const payload = {
			container: 'facilityfolder',
			base64: this.selectedImageObject,
			facilityId: this.selectedFacility._id,
			uploadType: 'logo',
			docName: this.selectedImageObject.name,
			size: this.selectedImageObject.size,
			id: this.selectedFacility._id, // facilityId or patientId or personId
			docType: 'logo',
			mimeType: this.selectedImageObject.type
		};

		// Make a request to the server to save image
		this._imageUploadService
			.createImageFacade(payload)
			.then(
				(res) => {
					this.disableImageBtn = false;
					this.saveImageBtn = true;
					this.savingImageBtn = false;
					this.hasChangedImage = false;
					if (res.status && res.status === 'success' && res.data) {
						this._locker.setObject('selectedFacility', res.data);
						this.systemModuleService.announceSweetProxy('Image upload was successful.', 'success');
					} else {
						if (!!this.selectedFacility.logoObject) {
							this.imageEmitterService.setSrc(this.selectedFacility.logoObject.thumbnail);
						} else {
							this.imageEmitterService.setSrc('');
						}
						this.systemModuleService.announceSweetProxy(res.msg, 'error');
					}
				},
				(err) => {
				}
			)
			.catch((err) => {});
	}

	onClickCancel() {
		this.hasChangedImage = false;
		if (!!this.selectedFacility.logoObject) {
			this.imageEmitterService.setSrc(this.selectedFacility.logoObject.thumbnail);
		} else {
			this.imageEmitterService.setSrc('');
		}
	}

	_getFacilityOwnerships() {
		this.facilityOwnershipService.find({}).then(
			(payload) => {
				this.facilityOwnerships = payload.data;
			},
			(error) => {}
		);
	}
	_getFacilityTypes() {
		this.facilityTypeService
			.getFacilityTypes()
			.then((payload: any) => {
				this.facilityTypes = payload;
			})
			.catch((error) => {});
	}

	_getFacilityClasses(facilityType: string) {
		this.facilityTypeService
			.getFacilityClasses(facilityType, true)
			.then((payload: any) => {
				this.facilityClasses = payload;
			})
			.catch((error) => {});
	}
	_getStates(country: string) {
		this.countryService
			.getOnlyStates(country, true)
			.then((payload: any) => {
				this.states = payload;
			})
			.catch((error) => {});
	}
	_getCountries() {
		this.countryService
			.getOnlyCountries()
			.then((payload: any) => {
				this.countries = payload;
			})
			.catch((err) => {});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	compareState(l1: any, l2: any) {
		return l1.includes(l2);
	}

	save(form) {
		const facility: any = {
			name: form.facilityname,
			email: form.facilityemail,
			cacNo: form.cac,
			primaryContactPhoneNo: form.facilityphonNo,
			address: this.selectedLocation,
			country: form.facilitycountry,
			state: form.facilitystate,
			city: form.facilitycity,
			shortName: form.facilityShortName,
			street: form.facilitystreet,
			facilityTypeId: form.facilityTypeId,
			facilityClassId: form.facilityClassId,
			facilityOwnershipId: form.facilityOwnershipId,
			website: form.facilitywebsite,
			isValidRegistration: true,
			_id: form._id,
			isHostFacility: form.network,
			isNetworkFacility: form.network === true ? true : false
		};
		this.systemModuleService.on();
		this.facilityService.patch(facility._id, facility, {}).then(
			(payload) => {
				this.authFacadeService.setSelectedFacility(payload);
				this.systemModuleService.off();
				this.systemModuleService.announceSweetProxy(
					'Facility updated successfully',
					'success',
					null,
					null,
					null,
					null,
					null,
					null,
					null
				);
				this.close_onClick();
			},
			(error) => {
				this.systemModuleService.off();
			}
		);
	}

	public callBack(value) {}
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
}
