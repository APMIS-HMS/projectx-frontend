import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apmis-store-landingpage',
  templateUrl: './apmis-store-landingpage.component.html',
  styleUrls: ['./apmis-store-landingpage.component.scss']
})
export class ApmisStoreLandingpageComponent implements OnInit {

  homeContentArea = true;
  storeContentArea = false;
  productContentArea = false;
  productEntryContentArea = false;
  productMovementContentArea = false;
  productExitContentArea = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
        
      }
    ).catch(error => { 
    });
    
    if (value === '' || value === 'home') {
      this.homeContentArea = true;
      this.storeContentArea = false;
      this.productContentArea = false;
      this.productEntryContentArea = false;
      this.productMovementContentArea = false;
      this.productExitContentArea = false;
    } else if(value === 'store'){
      this.homeContentArea = false;
      this.storeContentArea = true;
      this.productContentArea = false;
      this.productEntryContentArea = false;
      this.productMovementContentArea = false;
      this.productExitContentArea = false;
    } else if(value === 'product'){
      this.homeContentArea = false;
      this.storeContentArea = false;
      this.productContentArea = true;
      this.productEntryContentArea = false;
      this.productMovementContentArea = false;
      this.productExitContentArea = false;
    } else if(value === 'productEntry'){
      this.homeContentArea = false;
      this.storeContentArea = false;
      this.productContentArea = false;
      this.productEntryContentArea = true;
      this.productMovementContentArea = false;
      this.productExitContentArea = false;
    } else if(value === 'product-movement'){
      this.homeContentArea = false;
      this.storeContentArea = false;
      this.productContentArea = false;
      this.productEntryContentArea = false;
      this.productMovementContentArea = true;
      this.productExitContentArea = false;
    } else if(value === 'productExit'){
      this.homeContentArea = false;
      this.storeContentArea = false;
      this.productContentArea = false;
      this.productEntryContentArea = false;
      this.productMovementContentArea = false;
      this.productExitContentArea = true;
    }
  }

}
