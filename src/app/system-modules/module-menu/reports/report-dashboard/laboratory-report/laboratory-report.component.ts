import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { ILabReportOption } from '../../../../../core-ui-modules/ui-components/LabReportModel';
import { IDateRange } from 'ng-pick-daterange';
import { LabReportDetails } from '../../../../../core-ui-modules/ui-components/LabReportSummaryComponent';
import { ReportGeneratorService } from '../../../../../core-ui-modules/ui-components/report-generator-service';

@Component({
	selector: 'app-laboratory-report',
	templateUrl: './laboratory-report.component.html',
	styleUrls: [ './laboratory-report.component.scss' ]
})
export class LaboratoryReportComponent implements OnInit {
	searchControl = new FormControl();
	searchCriteria = new FormControl('Search');
	locations: any[] = [];
	pageInView = 'Laboratory Report';
	processing: boolean = false;
	@ViewChild('lrd') labRptComponentRef: LabReportDetails;
	reportOptions: ILabReportOption = {
		filterByDate: true,
		startDate: new Date(2018, 8, 20, 0, 30, 10),
		endDate: new Date(),
		paginate: true,
		paginationOptions: { skip: 0, limit: 20 },
		searchBy: 'all',
		queryString: ''
	};

	constructor(private _router: Router, private rptService: ReportGeneratorService) {}

	ngOnInit() {
		this.locations = this.rptService.getLocations();
		/* .then(x => {
             
         });*/
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	back_dashboard() {
		this._router.navigate([ '/dashboard/reports/report-dashboard' ]);
	}

	assignDate(date: IDateRange) {
		this.reportOptions.startDate = date.from;
		this.reportOptions.endDate = date.to;
		/* console.log("Parent Component Option: ", this.reportOptions);
         this.labRptComponentRef.getReportData();*/
	}

	search() {
		// this.labRptComponentRef.processing
		this.reportOptions.queryString = this.searchControl.value;
		this.reportOptions.searchBy = this.searchCriteria.value;
		this.labRptComponentRef.getReportData();
	}
	setLocation(value) {
		console.log(value);
		this.reportOptions.queryString = value;
		this.reportOptions.searchBy = 'location';
		this.reportOptions.location = value;
	}
}
