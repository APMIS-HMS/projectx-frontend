import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cover-payment',
  templateUrl: './cover-payment.component.html',
  styleUrls: ['./cover-payment.component.scss']
})
export class CoverPaymentComponent implements OnInit {

  tabInsurance = true;
  tabCompany = false;
  tabFamily = false;

  hmo_list = true;
  hmo_bill = false;

  company_list = true;
  company_bill = false;

  family_list = true;
  family_bill = false;

  constructor() { }

  ngOnInit() {
  }

  toggler() {
    this.hmo_bill = !this.hmo_bill;
    this.hmo_list = !this.hmo_list;
  }
  toggler2() {
    this.company_bill = !this.company_bill;
    this.company_list = !this.company_list;
  }
  toggler3() {
    this.family_bill = !this.family_bill;
    this.family_list = !this.family_list;
  }
  tabCompany_click() {
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabFamily_click() {
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
  }
  tabInsurance_click() {
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
  }

  hmoList_click() {
    this.hmo_bill = true;
    this.hmo_list = false;
  }

}
