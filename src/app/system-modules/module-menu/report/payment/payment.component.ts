import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  public paymentChartLabels:string[] = ['Cash', 'E-Payment', 'Cheque', 'Transfer'];
  public paymentChartData:number[] = [350, 450, 100, 38];
  public paymentChartType:string = 'doughnut';

  public invoiceChartLabels:string[] = ['HMO', 'Company', 'Family', 'Self'];
  public invoiceChartData:number[] = [450, 100, 38, 350];
  public invoiceChartType:string = 'doughnut';

  constructor() { }

  ngOnInit() {
  }

  // events
  public chartClicked(e:any):void {
  }

  public chartHovered(e:any):void {
  }

}
