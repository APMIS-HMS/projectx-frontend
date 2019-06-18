import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-quick-links',
  templateUrl: './store-quick-links.component.html',
  styleUrls: ['./store-quick-links.component.scss']
})
export class StoreQuickLinksComponent implements OnInit {
  addProduct: Boolean = false;
  isProductCat: Boolean = false;
  isGeneric: Boolean = false;
  isProductRoute: Boolean = false;
  isManufacturer: Boolean = false;
  isPresentation: Boolean = false;
  isStrength: Boolean = false;
  productCatPop: Boolean = false;
  showStoreProductType: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(message: boolean): void {
    this.isProductCat = false;
    this.isGeneric = false;
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = false;
    this.isProductRoute = false;
  }

  productCatPopShow() {
    this.addProduct = false;
    this.isProductCat = true;
    this.isGeneric = false;
    this.isProductRoute = false;
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = false;
    this.productCatPop = false;
  }

  genericSlide() {
    this.addProduct = false;
    this.isProductCat = false;
    this.isGeneric = true;
    this.isProductRoute = false;
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = false;
  }
  presentationSlide() {
    this.addProduct = false;
    this.isProductCat = false;
    this.isGeneric = false;
    this.isProductRoute = false;
    this.isManufacturer = false;
    this.isPresentation = true;
    this.isStrength = false;
  }
  routeSlide() {
    this.addProduct = false;
    this.isProductCat = false;
    this.isGeneric = false;
    this.isProductRoute = true;
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = false;
  }
  manufacturerSlide() {
    this.addProduct = false;
    this.isProductCat = false;
    this.isGeneric = false;
    this.isProductRoute = false;
    this.isManufacturer = true;
    this.isPresentation = false;
    this.isStrength = false;
  }

  onClickShowStoreProductType() {
    this.showStoreProductType = !this.showStoreProductType;
  }

  strengthSlide() {
    this.addProduct = false;
    this.isProductCat = false;
    this.isGeneric = false;
    this.isProductRoute = false;
    this.isManufacturer = false;
    this.isPresentation = false;
    this.isStrength = !this.isStrength;
  }

  closeOnClick(message: boolean): void {
    this.showStoreProductType = !this.showStoreProductType;
  }
}
