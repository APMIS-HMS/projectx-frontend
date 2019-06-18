import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-records',
  templateUrl: './med-records.component.html',
  styleUrls: ['./med-records.component.scss']
})
export class MedRecordsComponent implements OnInit {

  homeContentArea = true;
  docsContentArea= false;
  prescriptionContentArea = false;
  consultationContentArea = false;
  paymentContentArea = false;
  diagnosticsContentArea = false;

  login_on= false;
  constructor() { }

  ngOnInit() {
  }

  home(){
    this.homeContentArea = true;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
    this.diagnosticsContentArea = false;
  }
  doc(){
    this.homeContentArea = false;
    this.docsContentArea= true;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
    this.diagnosticsContentArea = false;
  }
  prescription(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = true;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
    this.diagnosticsContentArea = false;
  }
  diagnostics(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = false;
    this.diagnosticsContentArea = true;
  }
  consultation(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = true;
    this.paymentContentArea = false;
    this.diagnosticsContentArea = false;
  }
  payment(){
    this.homeContentArea = false;
    this.docsContentArea= false;
    this.prescriptionContentArea = false;
    this.consultationContentArea = false;
    this.paymentContentArea = true;
    this.diagnosticsContentArea = false;
  }

}
