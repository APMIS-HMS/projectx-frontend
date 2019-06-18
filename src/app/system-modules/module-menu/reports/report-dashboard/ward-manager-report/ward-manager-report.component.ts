import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-ward-manager-report',
  templateUrl: './ward-manager-report.component.html',
  styleUrls: ['./ward-manager-report.component.scss']
})
export class WardManagerReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

  pageInView = 'Ward Report';

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }

  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

}
