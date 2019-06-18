import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentReportGenerator } from '../../../../../../core-ui-modules/ui-components/report-generator-service';
import {
	IPaymentReportModel,
	IPaymentReportOptions
} from '../../../../../../core-ui-modules/ui-components/PaymentReportModel';
import { IDateRange } from 'ng-pick-daterange';
import { IApiResponse } from '../../../../../../core-ui-modules/ui-components/ReportGenContracts';
import { IPagerSource } from '../../../../../../core-ui-modules/ui-components/PagerComponent';

@Component({
	selector: 'app-invoice-list-details',
	templateUrl: './invoice-list-details.component.html',
	styleUrls: [ './invoice-list-details.component.scss' ]
})
export class InvoiceListDetailsComponent implements OnInit {
	loading = false;
	pagerSource: IPagerSource = {
		totalPages: 0,
		currentPage: 0,
		pageSize: 20,
		totalRecord: 0
	};
	apiResponse: IApiResponse<IPaymentReportModel[]> = { data: [] };

	reportOptions: IPaymentReportOptions = {
		isSummary: false,
		filterByDate: false,
		startDate: new Date(),
		endDate: new Date(),
		paginate: true,
		paginationOptions: {
			skip: 0,
			limit: 20
		}
	};

	constructor(private _router: Router, private paymentReportService: PaymentReportGenerator) {}

	ngOnInit() {
		this.getPaymentReport();
	}

	getPaymentReport() {
		console.log(this.reportOptions);
		this.loading = true;
		this.paymentReportService.getInvoicePaymentReport(this.reportOptions).then((x) => {
			this.loading = false;
			this.apiResponse = x;
			this.apiResponse.data[0].isExpanded = true;
			this.pagerSource.totalRecord = x.total;

			console.log(this.apiResponse, 'API Response');
		});
	}

	toggleExpandFor(payment: IPaymentReportModel) {
		// Colaspe all and expand the selected payment details
		this.apiResponse.data.forEach((x) => {
			if (x._id !== payment._id) {
				x.isExpanded = false;
			}
		});
		payment.isExpanded = !payment.isExpanded;
	}

	assignDate(date: IDateRange) {
		this.reportOptions.filterByDate = true;
		this.reportOptions.startDate = date.from;
		this.reportOptions.endDate = date.to;
		/* console.log("Parent Component Option: ", this.reportOptions);
         this.labRptComponentRef.getReportData();*/
	}

	gotoPage(index: number) {
		this.pagerSource.currentPage = index;
		this.reportOptions.paginationOptions.skip = index * this.pagerSource.pageSize;
		this.getPaymentReport();
	}
}
