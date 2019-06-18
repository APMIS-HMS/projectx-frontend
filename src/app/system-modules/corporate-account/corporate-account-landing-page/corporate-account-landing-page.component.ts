import { Component, OnInit } from '@angular/core';
import { FacilitiesService, CompanyHealthCoverService } from '../../../services/facility-manager/setup/index';
import { CorporateEmitterService } from '../../../services/facility-manager/corporate-emitter.service';
import { Facility, CompanyHealthCover } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-corporate-account-landing-page',
  templateUrl: './corporate-account-landing-page.component.html',
  styleUrls: ['./corporate-account-landing-page.component.scss']
})
export class CorporateAccountLandingPageComponent implements OnInit {

  contentListings = true;
  detailSect = false;
  successAlert = false;
  contentSecMenuShow = false;
  selectedFacility: Facility = <Facility>{};
  selectedDetailFacility: Facility = <Facility>{};
  facilities: Facility[] = [];
  healthCovers = false;
  pendingCovers = false;
  pendingHealthCovers: CompanyHealthCover[] = [];
  activeHealthCovers: CompanyHealthCover[] = [];
  selectedState: any;
  selectedCity: any;
  alertMsg = '';
  logoutConfirm_on = false;
  hasPending = false;

  constructor(public facilityService: FacilitiesService,
    private companyHealthCoverService: CompanyHealthCoverService,
    private router: Router,
    private locker: CoolLocalStorage,
    private _corporateEventEmitter: CorporateEmitterService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this._corporateEventEmitter.setRouteUrl('Available Facilities');
    this.getFacilities();
  }
  getState() {
    const stateId = this.selectedDetailFacility.address.state;
    const cityId = this.selectedDetailFacility.address.city;
    const filteredState = this.selectedDetailFacility.countryItem.states.
      filter(x => x._id === stateId);
    if (filteredState.length > 0) {
      this.selectedState = filteredState[0];
      if (this.selectedState.cities.length > 0) {
        const filteredCity = this.selectedState.cities.filter(x => x._id === cityId);
        if (filteredCity.length > 0) {
          this.selectedCity = filteredCity[0];
        }
      }
    }
  }
  loadDetail(facility: Facility) {
    this.hasPending = false;
    this.logoutConfirm_on = false;
    this.contentListings = false;
    this.detailSect = true;
    this.healthCovers = false;
    this.pendingCovers = false;
    this.selectedDetailFacility = facility;
    this.getState();
    this.companyHealthCoverService.find({
      query: {
        facilityId: facility._id, corporateFacilityId: this.selectedFacility._id
      }
    })
      .then(payload => {
        if (payload.data.length > 0) {
          const companyHealthCover: CompanyHealthCover = payload.data[0];
          if (companyHealthCover.isAccepted === false) {
            this.hasPending = true;
          } else {
            this.router.navigate(['/dashboard/corporate/covering-facility']);
          }
        }
      });
  }
  deptsShow() {
    this.router.navigate(['/dashboard/corporate/department'])
  }
  homeShow() {
    this.logoutConfirm_on = false;
    this.contentListings = true;
    this.detailSect = false;
    this.healthCovers = false;
    this.pendingCovers = false;
  }
  activeCoversShow() {
    this.logoutConfirm_on = false;
    this.contentListings = false;
    this.detailSect = false;
    this.healthCovers = true;
    this.pendingCovers = false;
    this.companyHealthCoverService.find({ query: { corporateFacilityId: this.selectedFacility._id, isAccepted: true } })
      .then(payload => {
        this.activeHealthCovers = payload.data;
      });
  }
  pendingCoversShow() {
    this.logoutConfirm_on = false;
    this.contentListings = false;
    this.detailSect = false;
    this.healthCovers = false;
    this.pendingCovers = true;

    this.companyHealthCoverService.find({ query: { corporateFacilityId: this.selectedFacility._id, isAccepted: false } })
      .then(payload => {
        this.pendingHealthCovers = payload.data;
      });
  }
  logOutShow() {
    this.logoutConfirm_on = true;
  }
  close_onClick(event: any) {
    this.logoutConfirm_on = false;
  }
  getFacilities() {
    this.facilityService.findAll().then(payload => {
      this.facilities = payload.data;
    });
  }
  getPendingState(facility: Facility) {
    if (facility !== undefined) {
      const stateId = facility.address.state;
      const states: any[] = facility.countryItem.states;
      const selectedState = states.filter(x => x._id === stateId);
      if (selectedState.length > 0) {
        return selectedState[0].name;
      }
    }
  }
  requestCover() {
    const cHealthCover: CompanyHealthCover = <CompanyHealthCover>{
      corporateFacilityId: this.selectedFacility._id,
      facilityId: this.selectedDetailFacility._id,
      isAccepted: false,
      personFacilityPrincipals: []
    };
    this.companyHealthCoverService.create(cHealthCover).then(payload => {
      this.alertMsg = 'Your request for corporate health cover has been sent';
      this.successAlert = true;
    }, error => {
    });

  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  innerMenuHide(e) {
    if (
      e.srcElement.className === 'inner-menu1-wrap' ||
      e.srcElement.localName === 'i' ||
      e.srcElement.id === 'innerMenu-ul'
    ) { } else {
      this.contentSecMenuShow = false;
    }
  }

}
