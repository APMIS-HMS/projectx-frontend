import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lab',
  templateUrl: './lab.component.html',
  styleUrls: ['./lab.component.scss']
})
export class LabComponent implements OnInit {
  
  public paymentChartLabels:string[] = ['Specimen Taken', 'Working in Progress', 'Specimen Taken', 'Report Taken'];
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
