import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss']
})
export class PharmacyComponent implements OnInit {
  
  public paymentChartLabels:string[] = ['Fulfilled', 'Unfulfilled', 'Partial', 'External'];
  public paymentChartData:number[] = [4, 4, 10, 8];
  public paymentChartType:string = 'doughnut';
  constructor() { }

  ngOnInit() {
  }
  chartClicked(e){

  }
  chartHovered(e){
    
  }
}
