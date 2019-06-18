import { Component, OnInit } from '@angular/core';
import { Service } from './history.service';

@Component({
  selector: 'app-medication-history',
  templateUrl: './medication-history.component.html',
  providers: [Service],
  styleUrls: ['./medication-history.component.scss']
})
export class MedicationHistoryComponent implements OnInit {
  status: string[]
  medicationHistory = [
  ]
  prescription = true;
  nonprescription = false;
  employees: string[];
  dataSource: any;
  constructor(service: Service) {

    this.status = ['discontinue'];
    // this.dataSource = new dataSource({
    //   store: service.getTasks(),
    //   group: "Assigned"
    // });
    this.employees = service.getEmployees();

  }

  ngOnInit() {
  }
  /*onshowPrescription(){
    this.prescription= true;
    this.nonprescription = false;
  }
  onshownonPrescription() {
    this.prescription = false;
    this.nonprescription = true;
  }*/

}
