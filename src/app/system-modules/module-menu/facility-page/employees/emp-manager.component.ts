import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  EmployeeService,
  FacilitiesService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { EmpmanagerHomepageComponent } from './empmanager-homepage/empmanager-homepage.component';
import { Facility } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
@Component({
  selector: 'app-emp-manager',
  templateUrl: './emp-manager.component.html',
  styleUrls: ['./emp-manager.component.scss']
})
export class EmpManagerComponent implements OnInit, AfterViewInit {
  @ViewChild(EmpmanagerHomepageComponent)
  private employeeManagerComponent: EmpmanagerHomepageComponent;

  homeContentArea = true;
  employeeDetailArea = false;
  assignUnitPop = false;
  newEmp = false;
  mobileSort = false;
  employee: any;
  selectedFacility: any = <any>{};
  resetData: Boolean = false;
  selectedDepartment: any;

  searchControl = new FormControl();
  department = new FormControl();
  unit = new FormControl();

  pageInView = 'Home';

  departments: any[] = [];
  units: any[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private locker: CoolLocalStorage,
    private facilityService: FacilitiesService,
    private systemService: SystemModuleService
  ) {}
  ngAfterViewInit() {
    this.searchControl.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .subscribe(searchText => {
        this.employeeManagerComponent.searchEmployees(searchText);
      });
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    // if (
    //   this.selectedFacility.isValidRegistration === undefined ||
    //   this.selectedFacility.isValidRegistration === false
    // ) {
    //   this.facilityService.announcePopupEditFacility(true);
    // }
    this.departments = this.selectedFacility.departments;
    this.department.valueChanges.subscribe(value => {
      this.selectedDepartment = value;
      this.units = value.units;
      this.employeeManagerComponent.getByDepartment(value._id);
    });
    this.unit.valueChanges.subscribe(value => {
      const department = this.department.value;
      this.employeeManagerComponent.getByUnit(department._id, value._id);
    });
  }

  navEpHome() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
  }
  newEmpShow() {
    this.newEmp = true;
  }
  reset() {
    this.resetData = true;
  }
  close_onClick(e) {
    this.newEmp = false;
    this.assignUnitPop = false;
    // this.emp
    // this.employeeManagerComponent.getEmployees();
  }
  pageInViewLoader(title) {
    this.pageInView = title;
  }
  resetDataLoader(data) {
    this.resetData = data;
  }
  empDetailShow(val) {
    this.homeContentArea = false;
    this.employeeDetailArea = true;
    this.employee = val;
  }
  assignUnit_pop() {
    this.assignUnitPop = true;
    this.employee = undefined;
  }
  HomeContentArea_show() {
    this.homeContentArea = true;
    this.employeeDetailArea = false;
    this.pageInView = 'Employee Manager';
  }
  sort_pop() {
    this.mobileSort = !this.mobileSort;
  }
}
