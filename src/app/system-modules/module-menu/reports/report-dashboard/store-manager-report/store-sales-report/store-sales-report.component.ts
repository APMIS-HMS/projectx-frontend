import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-store-sales-report',
  templateUrl: './store-sales-report.component.html',
  styleUrls: ['./store-sales-report.component.scss']
})
export class StoreSalesReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

  dateRange: any;
  activeTabIndex: number;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

  //   storeSales() {
  //     this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/salesReport']);
  //    }

  //  StockReport() {
  //     this._router.navigate(['/dashboard/reports/report-dashboard/storeReport/stockReport']);
  //  }
}
