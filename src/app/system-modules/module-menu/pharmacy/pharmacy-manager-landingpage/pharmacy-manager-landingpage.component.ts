import { Component, OnInit } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, MinorLocation } from '../../../../models/index';
import { FormControl } from '@angular/forms';
// import { PharmacyTypeService, PharmacyService } from '../../../../services/facility-manager/setup/index';
import { PharmacyEmitterService } from '../../../../services/facility-manager/pharmacy-emitter.service';

@Component({
  selector: 'app-pharmacy-manager-landingpage',
  templateUrl: './pharmacy-manager-landingpage.component.html',
  styleUrls: ['./pharmacy-manager-landingpage.component.scss']
})
export class PharmacyManagerLandingpageComponent implements OnInit {
  addPharmacy = false;
  productCat = false;
  generic = false;
  productRoute = false;
  manufacturer = false;
  presentation = false;
  slideProductDetails = false;

  deactivateButton = 'Deactivate';
  selectedFacility: Facility = <Facility>{};
  slidePharmacyDetails = false;
  selectedPharmacy: any = <any>{};


  productTypes: any[] = [];
  products: any[] = [];
  selPharmacyType = new FormControl();
  searchControl = new FormControl();
  selProductType = new FormControl();
  constructor(private locker: CoolLocalStorage, private _productEventEmitter: PharmacyEmitterService) {
    // this.productService.listenerUpdate.subscribe(payload => {
    //   this.getPharmacys();
    // });
    // this.productService.listenerCreate.subscribe(payload => {
    //   this.getPharmacys();
    // });
  }

  ngOnInit() {
    this._productEventEmitter.setRouteUrl('Pharmacy Manager');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    // this.getPharmacys();
    // this.getPharmacyTypes();

    // let subscribeForPerson = this.searchControl.valueChanges
    //   .debounceTime(200)
    //   .distinctUntilChanged()
    //   .switchMap((term: any[]) =>
    //     this.productService.find({
    //       query: {
    //         name: { $regex: this.searchControl.value, '$options': 'i' },
    //         facilityId: this.selectedFacility._id,
    //         $limit: 30
    //       }
    //     })
    //       .then(payload => {
    //         this.products = payload.data;
    //       }));

    // subscribeForPerson.subscribe((payload: any) => {
    // });
    // this.selPharmacyType.valueChanges.subscribe(value => {
    //   this.productService.find({ query: { facilityId: this.selectedFacility._id, productTypeId: value, $limit: 30 } }).then(payload => {
    //     this.products = payload.data;
    //   });
    // });
  }
  // getPharmacys() {
  //   this.productService.find({ query: { facilityId: this.selectedFacility._id, $limit: 30 } }).then(payload => {
  //     this.products = payload.data;
  //   });
  // }
  // getPharmacyTypes() {
  //   this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
  //     this.productTypes = payload.data;
  //   });
  // }


  slidePharmacyDetailsToggle(value, event) {
    this.selectedPharmacy = value;
    this.slidePharmacyDetails = !this.slidePharmacyDetails;
  }

  close_onClick() {
    this.selectedPharmacy = <any>{};
    this.addPharmacy = false;
  }
  onSelectPharmacy(pharmacy) {
    this.deactivateButton = pharmacy.isActive ? 'Deactivate' : 'Activate';
    this.selectedPharmacy = pharmacy;
    this.addPharmacy = true;
  }
  onDeactivate(pharmacy) {
    this.deactivateButton = pharmacy.isActive ? 'Activate' : 'Deactivate';
    this.selectedPharmacy.isActive = !this.selectedPharmacy.isActive;
    // this.productService.update(this.selectedPharmacy).then(payload => {
    //   this.selectedPharmacy = payload;
    // });
  }
  onEdit(pharmacy) {
    this.addPharmacy = true;
  }
  addPharmacyModal() {
    this.addPharmacy = true;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  productCatSlide() {
    this.addPharmacy = false;
    this.productCat = true;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  genericSlide() {
    this.addPharmacy = false;
    this.productCat = false;
    this.generic = true;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = false;
  }
  presentationSlide() {
    this.addPharmacy = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = false;
    this.presentation = true;
  }
  routeSlide() {
    this.addPharmacy = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = true;
    this.manufacturer = false;
    this.presentation = false;
  }
  manufacturerSlide() {
    this.addPharmacy = false;
    this.productCat = false;
    this.generic = false;
    this.productRoute = false;
    this.manufacturer = true;
    this.presentation = false;
  }
  refresh(): void {
    // window.location.reload();
  }
}
