import { Component, OnInit } from '@angular/core';
import { StoreEmitterService } from '../../../services/facility-manager/store-emitter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  pageInView: string;
  contentSecMenuShow = false;
  homeContentArea = true;
  productsContentArea = false;
  ordersContentArea = false;
  inventoryContentArea = false;

  constructor(private _storeEventEmitter: StoreEmitterService, private _router: Router) { }

  ngOnInit() {
    this._storeEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });
  }

  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }

  navItemClick(value) {
    this.contentSecMenuShow = false;
  }


  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }
  changeRoute(val) {
    if (val == '') {
      this.homeContentArea = true;
      this.productsContentArea = false;
      this.ordersContentArea = false;
      this.inventoryContentArea = false;
      this._router.navigate(['/dashboard/store/' + val]);
    } else if (val == 'products') {
      this.homeContentArea = false;
      this.productsContentArea = true;
      this.ordersContentArea = false;
      this.inventoryContentArea = false;
      this._router.navigate(['/dashboard/product-manager/' + val])
    } else if (val == 'orders') {
      this.homeContentArea = false;
      this.productsContentArea = false;
      this.ordersContentArea = true;
      this.inventoryContentArea = false;
    } else if (val == 'inventory') {
      this.homeContentArea = false;
      this.productsContentArea = false;
      this.ordersContentArea = false;
      this.inventoryContentArea = true;
    }

  }

  // pageInViewLoader(title) {
  // 	this.pageInView = title;
  // }
}
