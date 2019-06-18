import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-facility-company-cover',
  templateUrl: './facility-company-cover.component.html',
  styleUrls: ['./facility-company-cover.component.scss']
})
export class FacilityCompanyCoverComponent implements OnInit {

  billDetail_show = false;
  billHistoryDetail_show = false;
  tab1 = true;
  tab2 = false;

  constructor() { }

  ngOnInit() {
  }

  billDetail() {
    this.billDetail_show = true;
  }
  billHistoryDetail() {
    this.billHistoryDetail_show = true;
  }
  close_onClick() {
    this.billDetail_show = false;
    this.billHistoryDetail_show = false;
  }
  tab1_click() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tab2_click() {
    this.tab1 = false;
    this.tab2 = true;
  }

}
