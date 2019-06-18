import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-manager-report',
  templateUrl: './store-manager-report.component.html',
  styleUrls: ['./store-manager-report.component.scss']
})
export class StoreManagerReportComponent implements OnInit {

	stockReport = false;
  storeSalesReport = false;

    pageInView = 'Store Report';

  constructor(private _router: Router) { }

  ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
  }

  checkPageUrl(param: string) {
		if (param.includes('storeSales')) {
			this.stockReport = false;
			this.storeSalesReport = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeManagerReport/salesReport' ]);
		} else if (param.includes('stockReport')) {
			this.stockReport = true;
			this.storeSalesReport = false;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeReport/stockReport' ]);
		} else {
			this.stockReport = false;
			this.storeSalesReport = true;
			this._router.navigate([ '/dashboard/reports/report-dashboard/storeReport/salesReport' ]);
		}
  }

	route(link) {
		if (link === 'storeSales') {
			this.storeSalesReport = true;
			this.stockReport = false;
		} else if (link === 'stockReport') {
			this.storeSalesReport = false;
			this.stockReport = true;
		} else {
			this.storeSalesReport = false;
			this.stockReport = true;
		}
		this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/stockReport' + link ]);
	}

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
  }

	storeSales() {
		this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/salesReport']);
	 }


 StockReport() {
		this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/stockReport']);
 }

 pageInViewLoader(title) {
  this.pageInView = title;
}

}

