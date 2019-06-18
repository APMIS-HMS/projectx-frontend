import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import {
  FacilitiesService, BillingService, InvoiceService,
  PendingBillService, TodayInvoiceService, LocSummaryCashService
} from '../../../../services/facility-manager/setup/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import * as differenceInCalendarDays from "date-fns/difference_in_calendar_days";
@Component({
  selector: 'app-payment-chart',
  templateUrl: './payment-chart.component.html',
  styleUrls: ['./payment-chart.component.scss']
})
export class PaymentChartComponent implements OnInit {

  selectedFacility: any = <any>{};
  chartData: any = <any>{};
  dateOptionControl = new FormControl();
  public lineChartData: any[] = [
    { data: [0], label: '' }
  ];

  public lineChartLabels: string[] = [];

  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: any[] = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // cyan
      backgroundColor: 'rgba(77,208,225,0.2)',
      borderColor: 'rgba(77,208,225,1)',
      pointBackgroundColor: 'rgba(77,208,225,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,208,225,0.8)'
    },
    { // green
      backgroundColor: 'rgba(129,199,132,0.2)',
      borderColor: 'rgba(129,199,132,1)',
      pointBackgroundColor: 'rgba(129,199,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(129,199,132,0.8)'
    },
    { // lime
      backgroundColor: 'rgba(220,231,117,0.2)',
      borderColor: 'rgba(220,231,117,1)',
      pointBackgroundColor: 'rgba(220,231,117,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,231,117,0.8)'
    },
    { // purple
      backgroundColor: 'rgba(186,104,200,0.2)',
      borderColor: 'rgba(186,104,200,1)',
      pointBackgroundColor: 'rgba(186,104,200,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(186,104,200,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';


  dateOption = [
    {
      name: "30 Days",
      counter: 30
    },
    {
      name: "3 Months",
      counter: 90
    },
    {
      name: "6 Months",
      counter: 180
    },
    {
      name: "1 Year",
      counter: 365
    },
    {
      name: "2 Years",
      counter: 730
    },
    {
      name: "Life-time",
      counter: 30
    }
  ]

  constructor(
    private facilityService: FacilitiesService,
    private invoiceService: InvoiceService,
    private _pendingBillService: PendingBillService,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    let currentDate = Date.now();
    let lifeTimeDays = differenceInCalendarDays(this.selectedFacility.createdAt, currentDate);
    this.dateOption[5].counter = lifeTimeDays;
    this.dateOptionControl.setValue(30);
    this._getPaymentSummaryChartData();

    this.dateOptionControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(value => {
        this.lineChartData = [{ data: [0], label: '' }];
        this.systemModuleService.on();
        this._pendingBillService.getChartSummary(this.selectedFacility._id, {
          query: {
            days: value
          }
        }).then((payload: any) => {
          this.systemModuleService.off();
          this.loopChartData(payload);
        }).catch(err => {
          this.systemModuleService.off();
        });
      });
  }


  private _getPaymentSummaryChartData() {
    this.systemModuleService.on();
    this._pendingBillService.getChartSummary(this.selectedFacility._id, {
      query: {
        days: 30
      }
    }).then((payload: any) => {
      this.systemModuleService.off();
      this.loopChartData(payload);
    }).catch(err => {
      this.systemModuleService.off();
    });
  }

  private loopChartData(chartData) {
    if (chartData.lineChartData.length > 0) {
      this.lineChartData.splice(0, 1);
    }
    for (let index = 0; index < chartData.lineChartData.length; index++) {
      this.lineChartData.push({ data: [], label: '' });
    }
    for (let i = 0; i < chartData.lineChartData.length; i++) {
      this.lineChartData[i].label = chartData.lineChartData[i].label;
      for (let index = 0; index < chartData.lineChartData[i].data.length; index++) {
        this.lineChartData[i].data.push(chartData.lineChartData[i].data[index]);
      }
    }
    this.lineChartLabels = chartData.lineChartLabels;
  }

  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
}
