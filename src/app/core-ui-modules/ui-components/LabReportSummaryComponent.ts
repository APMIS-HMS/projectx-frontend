import {
	Component,
	Input,
	OnInit,
	DoCheck,
	OnChanges,
	KeyValueDiffers,
	KeyValueDiffer,
	SimpleChanges
} from '@angular/core';
import { ILabReportModel, ILabReportOption, ILabReportSummaryModel } from './LabReportModel';
import { IPagerSource } from './PagerComponent';

import { PaymentReportGenerator, ReportGeneratorService } from './report-generator-service';

@Component({
	selector: 'app-lab-report-summary',
	template: `
        <div class="pad20">
            <h3>Lab Report Summary</h3>
            <table class="table">
                <tr>
                    <th></th>
                    <th>Request Type</th>
                    <th>Total</th>
                </tr>
                <tr *ngFor="let r of reportData">
                    <td colspan="3">
                        <h4>{{r.location}}</h4>
                        <hr>
                        <div>
                            <table class="table">
                                <tr *ngFor=" let s of r.summary">
                                    <td></td>
                                    <td>{{s.request}}</td>
                                    <td>{{s.total|number}}</td>
                                </tr>
                            </table>
                        </div>
                    </td>

                </tr>
            </table>

        </div>`,
	styles: [
		`
        .pad20 {
            padding: 20px;
            margin-top: 10px;
        }
    `
	]
})
export class LabReportSummaryComponent implements OnInit {
	reportData: ILabReportSummaryModel[] = [];
	@Input()
	reportOption: ILabReportOption = {
		paginate: false,
		isSummary: true
	};

	constructor(private reportSource: ReportGeneratorService, private paymentReprotService: PaymentReportGenerator) {}

	ngOnInit() {
		this.getReportSummary();
	}

	getReportSummary() {
		this.reportSource.getLabReportInvestigationSummary(this.reportOption).then((x: any) => {
			console.log(x);
			this.reportData = x.data;
		});
		
	}
}

/* Lab report for Patient */
@Component({
	selector: 'app-lab-report-detail',
	template: `
        <div class="tbl-resp-wrap" id="printableArea">
            <table class="" style="color:black;" cellpadding="0" cellspacing="0" border="0.5">
                <thead>
                <tr class="th-r1 th-xxx" >
                    <th>S/N</th>
                    <th>Patient Info</th>
                    <th>Date</th>
                    <th style="width:25%">Request</th>

                    <th>Referring Doctor</th>
                  	<th>Location</th>
                    <th>Status</th>
                </tr>
                </thead>

                <tbody>
                <tr *ngIf="processing">
                    <td colspan="7">
                        <div class="pad20 text-center" style="text-align:center">
							<apmis-spinner></apmis-spinner>
                        </div>
                    </td>
                </tr>

                <tr *ngFor="let r of reportData; let i = index ; " class="th-xxx text-left"
                    style="text-align:left;">
                    <td>
                        {{i+1}}
                    </td>
                    <td>
                    <span>{{r.patientName}}
                                </span>
                        <br>
                        <small>Apmis ID: <span
                                style="font-weight: bold; color : #2984ff;">{{r.apmisId}}</span></small>
                    </td>
                    <td><span>{{r.date | date:'MMM dd, yyyy'}}</span></td>
                    <td><span>{{r.request}}</span></td>
                    <td><span>{{r.doctor}}</span></td>
                    <td><span>{{r.location}}</span></td>
                    <td><span class="green highlight">{{r.status }}</span></td>
                </tr>

                </tbody>
            </table>
         


        </div>
        <div>
            <apmis-data-pager (onPageClick)="pagerButtonClick($event)"
                             [pager-source]="pagerSource"
                             color="blue"

            ></apmis-data-pager>
        </div>
    `
})
export class LabReportDetails implements OnInit, OnChanges, DoCheck {
	processing: boolean = false;
	reportData: ILabReportModel[] = [];
	@Input('options')
	reportOptions: ILabReportOption = {
		filterByDate: true,
		startDate: new Date(2018, 7, 20, 0, 30, 10),
		endDate: new Date(),
		paginate: true
	};

	pagerSource: IPagerSource = { totalPages: 0, totalRecord: 0, currentPage: 0, pageSize: 30 };
	constructor(private reportSource: ReportGeneratorService) {}

	ngOnInit() {
		this.getReportData();
	}

	getReportData() {
		this.processing = true;
		if (this.reportOptions.paginate) {
			this.reportOptions.paginationOptions = {
				limit: this.pagerSource.pageSize,
				skip: this.pagerSource.currentPage * this.pagerSource.pageSize
			};
		}
		this.reportSource.getLabReport(this.reportOptions).then((x: any) => {
			
			this.reportData = x.data;
			this.processing = false;
			this.pagerSource.totalRecord = x.total;
		}, x => {
			  this.processing  = false;
			  
			}
		);
	}

	pagerButtonClick(index: number) {
		// goto next page using the current index
		this.pagerSource.currentPage = index;
		this.reportOptions.paginationOptions.skip  = index * this.pagerSource.pageSize;
		this.getReportData();
	}

	ngDoCheck(): void {}

	ngOnChanges(changes: SimpleChanges): void {}
}
