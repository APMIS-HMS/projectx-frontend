import { Employee } from './../../models/facility-manager/setup/employee';
import { EmployeeService } from './../../services/facility-manager/setup/employee.service';
import { PersonService } from 'app/services/facility-manager/setup';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { UserFacadeService } from 'app/system-modules/service-facade/user-facade.service';
import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError, ActivatedRoute } from '@angular/router';
import { Facility } from '../../models';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

  authData: any;
  pgMenuToggle = false;
  basicData_popup = false;
  basicData_update = false;
  tab1 = true;
  tab2 = false;
  selectedUser;
  selectedEmployee;
  selectedPerson;

  listOfFacilities: Facility[] = [];
  listOfEmployees: Employee[] = [];

  constructor(private router: Router,  private authFacadeService:AuthFacadeService,
     private personService: PersonService, private employeeService: EmployeeService,
     private route: ActivatedRoute) { 
   
  }

  ngOnInit() {
    const page: string = this.router.url;
    this.checkPageUrl(page);
    this.authFacadeService.getLogingUser().then(payload =>{
      this.selectedUser = payload;
      this.getPerson();
      this.getEmployeeRecords();
    }).catch(error =>{});

    this.authFacadeService.getLogingEmployee().then(payload =>{
      this.selectedEmployee = payload;
    }).catch(error =>{

    });

    this.route.data.subscribe(data => {
      data['multipleUsers'].subscribe((payload: any) => {
        this.authData = payload.authData;
        this.selectedPerson = payload.selectedPerson;
        this.listOfFacilities = payload.listOfFacilities;
      });
    });

  }

  getPerson() {
    this.personService.get(this.selectedUser.personId,{}).subscribe(payload =>{
      this.selectedPerson = payload;
    });
  }
  
  getEmployeeRecords() {
    this.employeeService.find({query:{personId: this.selectedUser.personId}}).subscribe(payload =>{
      this.listOfEmployees = payload.data;
    })
  }
  pgMenu_click() {
    this.pgMenuToggle = !this.pgMenuToggle;
  }
  private checkPageUrl(param: string) {
    if (param.includes('facility/modules')) {
    } else if (param.includes('facility/departments')) {}
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);
    this.pgMenuToggle = false;
    if (value === '') {
      // this.dashboardContentArea = false;
    } else if (value === 'employees') {}
  }
  tab1_click() {
    this.tab1 = true;
    this.tab2 = false;
  }
  tab2_click() {
    this.tab1 = false;
    this.tab2 = true;
  }
  basicData_show() {
    this.basicData_popup = true;
  }
  basicDataUpdate_show() {
    this.basicData_update = true;
  }
  close_onClick() {
    this.basicData_popup = false;
    this.basicData_update = false;
  }

}
