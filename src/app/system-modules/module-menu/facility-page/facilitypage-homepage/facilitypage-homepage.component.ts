import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
// tslint:disable-next-line:max-line-length
import { CountriesService, FacilityTypesService, CorporateFacilityService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, FacilityType, Country } from '../../../../models/index';


@Component({
  selector: 'app-facilitypage-homepage',
  templateUrl: './facilitypage-homepage.component.html',
  styleUrls: ['./facilitypage-homepage.component.scss']
})

export class FacilitypageHomepageComponent implements OnInit {
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  facilityObj: Facility = <Facility>{};
  facilityTypes: FacilityType[] = [];
  facilityClassess: any[] = [];
  states: any[] = [];
  cities: any[] = [];
  countries: Country[] = [];
  selectedState: any = {};
  selectedCity: any = {};
  isCorporate = false;
  popup_verifyToken = false;

  facilityNameEdit = new FormControl('', [Validators.required, Validators.minLength(4)]);
  shortNameEdit = new FormControl();
  facilityEmailEdit = new FormControl();
  facilityWebsiteEdit = new FormControl();
  ContactFullNameEdit = new FormControl();
  phoneNoEdit = new FormControl();
  facilityTypeEdit = new FormControl();
  facilityClassEdit = new FormControl();
  facilityStreetEdit = new FormControl();
  facilityCityEdit = new FormControl();
  facilitylgaEdit = new FormControl();
  facilityStateEdit = new FormControl();
  facilityCountryEdit = new FormControl();
  facilityLandmarkEdit = new FormControl();

  facilityNameEditShow = false;
  shortNameEditShow = false;
  facilityEmailEditShow = false;
  facilityWebsiteEditShow = false;
  fullNameEditShow = false;
  phoneNoEditShow = false;
  facilityTypeEditShow = false;
  facilityClassEditShow = false;
  facilityStreetEditShow = false;
  facilityCityEditShow = false;
  facilityLgaEditShow = false;
  facilityStateEditShow = false;
  facilityCountryEditShow = false;
  facilityLandmarkEditShow = false;

  constructor(public facilityService: FacilitiesService,
    private countryService: CountriesService,
    private facilityTypeService: FacilityTypesService,
    private corporateFacilityService: CorporateFacilityService,
    private locker: CoolLocalStorage) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    });
    this.facilityNameEdit.valueChanges.subscribe(value => {
      if (this.facilityNameEdit.valid) {
        this.facilityObj.name = this.facilityNameEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.shortNameEdit.valueChanges.subscribe(value => {
      if (this.shortNameEdit.valid) {
        this.facilityObj.shortName = this.shortNameEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityEmailEdit.valueChanges.subscribe(value => {
      if (this.facilityEmailEdit.valid) {
        this.facilityObj.email = this.facilityEmailEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityWebsiteEdit.valueChanges.subscribe(value => {
      if (this.facilityWebsiteEdit.valid) {
        this.facilityObj.website = this.facilityWebsiteEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.ContactFullNameEdit.valueChanges.subscribe(value => {
      if (this.ContactFullNameEdit.valid) {
        this.facilityObj.contactFullName = this.ContactFullNameEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.phoneNoEdit.valueChanges.subscribe(value => {
      if (this.phoneNoEdit.valid) {
        this.facilityObj.contactPhoneNo = this.phoneNoEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityStreetEdit.valueChanges.subscribe(value => {
      if (this.facilityStreetEdit.valid) {
        this.facilityObj.address.street = this.facilityStreetEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityLandmarkEdit.valueChanges.subscribe(value => {
      if (this.facilityLandmarkEdit.valid) {
        this.facilityObj.address.landmark = this.facilityLandmarkEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityTypeEdit.valueChanges.subscribe(value => {
      if (this.facilityTypeEdit.valid) {
        this.facilityObj.facilityTypeId = this.facilityTypeEdit.value;
        this.facilityService.update(this.facilityObj);
      }
    });

    this.facilityClassEdit.valueChanges.subscribe(value => {
      if (this.facilityClassEdit.valid) {
        this.facilityObj.facilityClassId = this.facilityClassEdit.value;
        this.facilityService.update(this.facilityObj);
        /// this.getFacility();
      }
    });

    this.facilityCountryEdit.valueChanges.subscribe(value => {
      if (this.facilityCountryEdit.valid) {
        this.facilityObj.address.country = this.facilityCountryEdit.value;
        this.facilityService.update(this.facilityObj);
        this.states = this.facilityObj.countryItem.states;
      }
    })

    this.facilityStateEdit.valueChanges.subscribe(value => {
      if (this.facilityStateEdit.valid) {
        this.facilityObj.address.state = this.facilityStateEdit.value;
        this.facilityService.update(this.facilityObj);
        // this.getFacility();
        const stateObj = this.states.find(x => x._id === this.facilityObj.address.state.toString());
        this.selectedState = stateObj;
        if (this.selectedState !== undefined) {
          this.cities = this.selectedState.cities;
          const cityObj = this.cities.find(x => x._id === this.facilityObj.address.city.toString());
          this.selectedCity = cityObj;
          this.facilityCityEdit.setValue(this.facilityObj.address.city)
        }

      }
    });

    this.facilityCityEdit.valueChanges.subscribe(value => {
      this.facilityObj.address.city = this.facilityCityEdit.value;
      this.facilityService.update(this.facilityObj).then(payload => {

      });
    });

  }

  ngOnInit() {
    this.getFacility();
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
    if (this.facilityObj.isTokenVerified === false) {
      this.popup_verifyToken = true;
    }
    this.pageInView.emit('Facility Details');
  }
  getCountries() {
    this.countryService.findAll().then((payload) => {
      this.countries = payload.data;
      this.facilityCountryEdit.setValue(this.facilityObj.country);
      this.states = this.facilityObj.countryItem.states;
      const stateObj = this.states.find(x => x._id === this.facilityObj.address.state.toString());
      this.selectedState = stateObj;
      this.facilityStateEdit.setValue(this.facilityObj.address.state)
    });
  }
  getFacilityTypes() {
    this.facilityTypeService.findAll().then((payload) => {
      this.facilityTypes = payload.data;
      this.facilityTypeEdit.setValue(this.facilityObj.facilityTypeId);
      if (this.facilityObj.facilityItem != null) {
        this.facilityClassess = this.facilityObj.facilityItem.facilityClasses;
      }

      this.facilityClassEdit.setValue(this.facilityObj.facilityClassId);
    });
  }
  getFacility() {
    const facility = <Facility>this.locker.getObject('selectedFacility');
    this.isCorporate = <boolean>this.locker.getObject('isCorporate');
    if (this.isCorporate) {
      // this.corporateFacilityService.get(facility.id, {}).then(cpayload => {
      //   this.facilityObj = cpayload;
      // });
    } else {
      this.facilityService.get(facility._id, {}).then((payload) => {
        this.facilityObj = payload;
        this.getFacilityTypes();
        this.getCountries();
      },
        error => {
        });
    }


  }
  facilityNameEditToggle() {
    this.facilityNameEditShow = !this.facilityNameEditShow;
  }
  shortNameEditToggle() {
    this.shortNameEditShow = !this.shortNameEditShow;
  }
  facilityEmailEditToggle() {
    this.facilityEmailEditShow = !this.facilityEmailEditShow;
  }
  facilityNameWebsiteToggle() {
    this.facilityWebsiteEditShow = !this.facilityWebsiteEditShow;
  }
  fullNameEditToggle() {
    this.fullNameEditShow = !this.fullNameEditShow;
  }
  phoneNoEditToggle() {
    this.phoneNoEditShow = !this.phoneNoEditShow;
  }
  facilityTypeEditToggle() {
    this.facilityTypeEditShow = !this.facilityTypeEditShow;
  }
  facilityClassEditToggle() {
    this.facilityClassEditShow = !this.facilityClassEditShow;
  }
  facilityStreetEditToggle() {
    this.facilityStreetEditShow = !this.facilityStreetEditShow;
  }
  facilityCityEditToggle() {
    this.facilityCityEditShow = !this.facilityCityEditShow;
  }
  facilityLgaEditToggle() {
    this.facilityLgaEditShow = !this.facilityLgaEditShow;
  }
  facilityStateEditToggle() {
    this.facilityStateEditShow = !this.facilityStateEditShow;
  }
  facilityCountryEditToggle() {
    this.facilityCountryEditShow = !this.facilityCountryEditShow;
  }
  facilityLandmarkEditToggle() {
    this.facilityLandmarkEditShow = !this.facilityLandmarkEditShow;
  }

}
