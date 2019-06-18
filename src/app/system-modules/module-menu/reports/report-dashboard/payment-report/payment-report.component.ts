import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-report',
  templateUrl: './payment-report.component.html',
  styleUrls: ['./payment-report.component.scss']
})
export class PaymentReportComponent implements OnInit {

  paymentSummary = false;
  invoiceListPage = false;
  invoiceReport = false;
  dashBoard = false;

  pageInView = 'Payment Report Page';

  constructor(private _router: Router) { }

  ngOnInit() {
    const page: string = this._router.url;
    this.checkPageUrl(page);
  }


  checkPageUrl(param: string) {
    if (param.includes('paymentSummary')) {
      this.paymentSummary = true;
      this.invoiceListPage = false;
      this.invoiceReport = false;
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
    } else if (param.includes('invoiceListPage')) {
      this.paymentSummary = false;
      this.invoiceListPage = true; 
      this.invoiceReport = false;
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceList']);
    } else if (param.includes('invoiceReport')) {
      this.paymentSummary = false;
      this.invoiceListPage = false; 
      this.invoiceReport = true;
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceReport']);
    } else {
      this.paymentSummary = true;
      this.invoiceListPage = false; 
      this.invoiceReport = false;
      this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
    }
  }


  call_paymentSummary(){
    this.paymentSummary = true;
    this.invoiceListPage = false;
    this.invoiceReport = false;
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/paymentSummary']);
  }

  call_invoiceList(){
    this.paymentSummary = false;
    this.invoiceListPage = true;
    this.invoiceReport = false;
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceList']);
  }

  call_invoiceReport(){
    this.paymentSummary = false;
    this.invoiceListPage = false;
    this.invoiceReport = true;
    this._router.navigate(['/dashboard/reports/report-dashboard/paymentReport/invoiceReport']);
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }
}