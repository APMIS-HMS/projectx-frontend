import { EmployeeService } from './../../../services/facility-manager/setup/employee.service';
import { Person } from 'app/models/index';
import { Component, OnInit, Input } from '@angular/core';
import { AppointmentService } from '../../../services/facility-manager/setup';

@Component({
  selector: 'app-person-landing',
  templateUrl: './person-landing.component.html',
  styleUrls: ['./person-landing.component.scss']
})
export class PersonLandingComponent implements OnInit {
  @Input() selectedPerson: Person = <Person>{};
  @Input() listOfFacilities: any[] = [];
  @Input() listOfEmployees: any[] = [];
  schedule_appointment = false;
  set_inavailability = false;
  myAppointments: any[] = [];
  constructor(private appointmentService:AppointmentService, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployeeRecords();
  }

  close_onClick(message: boolean): void {
    this.schedule_appointment = false;
    this.set_inavailability = false;
  }
  set_appointment() {
    this.schedule_appointment = true;
  }

  getFacilityName(id){
    const facility = this.listOfFacilities.filter(x =>x._id == id);
    if(facility.length > 0){
      return facility[0].name;
    }
    return '';
  }

  getUnits(units){
    return units.join(' | ');
  }

  getMyAppointments(){
    this.appointmentService.find({query:{
      doctorId: { $in: this.listOfEmployees.map(x => x._id) }
    }}).subscribe(payload =>{
      this.myAppointments = payload.data;
    });
  }

  getEmployeeRecords() {
    this.employeeService.find({query:{personId: this.selectedPerson._id}}).subscribe(payload =>{
      this.listOfEmployees = payload.data;
      this.getMyAppointments();
    });
  }
  inavailability_click(){
    this.set_inavailability = true;
  }
}
