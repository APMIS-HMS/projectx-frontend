import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clinic',
  templateUrl: './clinic.component.html',
  styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit {
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['A&E', 'Cardiology', 'ENT', 'GS', 'Gynaecology', 'Nephrology', 'Orthopaedics'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Patients'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Income(thousands of ₦)'}
  ];
  constructor() { }

  ngOnInit() {
  }
	chartClicked(e){

	}
	chartHovered(e){
	  
	}
}
