import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-invoice-report',
  templateUrl: './invoice-report.component.html',
  styleUrls: ['./invoice-report.component.scss']
})
export class InvoiceReportComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  public pieChartLabels:string[] = ['HMO', 'Company', 'Family', 'Self (Out of Pocket)'];
  public pieChartData:number[] = [200000, 70000, 20000, 400000];
  public pieChartType:string = 'pie';
  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  public chartHovered(e:any):void {
    console.log(e);
  }

}