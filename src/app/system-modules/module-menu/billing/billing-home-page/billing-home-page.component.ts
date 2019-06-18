import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesServiceCategoryService, ServicePriceService } from '../../../../services/facility-manager/setup/index';
import { FacilityService, Facility, CustomCategory, FacilityServicePrice } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-billing-home-page',
  templateUrl: './billing-home-page.component.html',
  styleUrls: ['./billing-home-page.component.scss']
})
export class BillingHomePageComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  loading= false;
  newPricePopup = false;
  newModefierPopup = false;
  serviceDetail = false;
  facility: Facility = <Facility>{};
  prices: FacilityServicePrice[] = [];
  selectedFacilityServicePrice: FacilityServicePrice = <FacilityServicePrice>{};
  constructor(private servicePriceService: ServicePriceService,
    private _locker: CoolLocalStorage) {
    this.servicePriceService.listenerCreate.subscribe(payload => {
      this.getPrices();
    });
    this.servicePriceService.listenerUpdate.subscribe(payload => {
      this.getPrices();
    });
  }




  ngOnInit() {
    this.pageInView.emit('Services/Billing Manager');
    this.facility =  <Facility> this._locker.getObject('selectedFacility');
    this.getPrices();
    // this.getServicePrice();
  }
  getPrices() {
    this.servicePriceService.find({ query: { facilityId: this.facility._id } })
      .then(payload => {
        this.prices = payload.data;
      });
  }
  getServicePrice(){
    let service_id = "58a7478c291aa72bccf4b7a3";
    this.servicePriceService.find({ query: { facilityId: this.facility._id, serviceId: service_id } })
    .then(payload => {
      //this.prices = payload.data;
    }).catch(err => {
    });
  }
  newPricePopup_show() {
    this.newPricePopup = true;
    this.newModefierPopup = false;
    this.serviceDetail = false;
  }
  newModefierPopup_show(price: FacilityServicePrice) {
    this.newModefierPopup = true;
    this.newPricePopup = false;
    this.serviceDetail = false;
    this.selectedFacilityServicePrice = price;
  }
  serviceDetail_show(price) {
    this.serviceDetail = true;
    this.newPricePopup = false;
    this.newModefierPopup = false;
    this.selectedFacilityServicePrice = price;
  }
  close_onClick(e) {
    this.newPricePopup = false;
    this.newModefierPopup = false;
    this.serviceDetail = false;
  }

}
