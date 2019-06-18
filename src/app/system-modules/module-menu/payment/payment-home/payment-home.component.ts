import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-payment-home',
  templateUrl: './payment-home.component.html',
  styleUrls: ['./payment-home.component.scss']
})
export class PaymentHomeComponent implements OnInit {
  paymentOverview = false;
  paymentHistory = false;
  pageInView = 'Payment';
  constructor(
    private _router: Router,
    private _systemModuleService: SystemModuleService
  ) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }

  onClickMenu(route: string) {
    this._systemModuleService.on();
    this.checkPageUrl(route);
    if (route === 'payment') {
      this._router.navigate(['/dashboard/payment']).then(res => {
        this._systemModuleService.off();
      });
    } else if (route === 'history') {
      this._router.navigate(['/dashboard/payment/history']).then(res => {
        this._systemModuleService.off();
      });
    }
  }

  checkPageUrl(param: string) {
    if (param.includes('history')) {
      this.paymentOverview = false;
      this.paymentHistory = true;
    } else if (param.includes('payment')) {
      this.paymentOverview = true;
      this.paymentHistory = false;
    }
  }

}
