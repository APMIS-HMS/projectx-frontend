import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {

  public appointmentChartLabels:string[] = ['Old Patient', 'New Patient'];
  public appointmentChartData:number[] = [350, 450];
  public appointmentChartType:string = 'doughnut';

  public patientChartLabels:string[] = ['Checked In', 'Checked Out', 'Suspend', 'Postponed'];
  public patientChartData:number[] = [34, 22, 2, 1];
  public patientChartType:string = 'doughnut';

  constructor() { }

  ngOnInit() {}

  chartClicked(e){

  }
  chartHovered(e){
    
  }
}