import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EmployeeService, FacilitiesService, PersonService } from '../../../../../../services/facility-manager/setup/index';
import { Facility, Employee } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-lookup',
  templateUrl: './employee-lookup.component.html',
  styleUrls: ['./employee-lookup.component.scss']
})
export class EmployeeLookupComponent implements OnInit {

  @Output() selectedEmployee: EventEmitter<any> = new EventEmitter<any>();
  employees: any;
  items: Observable<{}>;
  selectedFacility: Facility = <Facility>{};
  searchControl = new FormControl();
  loadIndicatorVisible = false;
  constructor(private employeeService: EmployeeService,
    private router: Router,
    public facilityService: FacilitiesService,
    private personService: PersonService,
    private locker: CoolLocalStorage) {
    employeeService.listner.subscribe(payload => {
      this.loadIndicatorVisible = true;
      let index = -1;
      this.employees.forEach((item, i) => {
        if (item._id === payload._id) {
          index = i;
        }
      })
      this.employees[index] = payload;
      this.loadIndicatorVisible = false;
    });
    personService.updateListener.subscribe(payload => {
      this.getEmployees();
    });
  }


  ngOnInit() {
    this.getEmployees();
    const away = this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Employee[]) => this.employeeService.searchEmployee(this.selectedFacility._id, this.searchControl.value, true));

    away.subscribe((payload: any) => {
      this.employees = payload.body;
    });






    // this.searchControl.valueChanges
    //   .debounceTime(200)
    //   .distinctUntilChanged()
    //   .switchMap((term) => Observable.fromPromise(this.employeeService.searchEmployee(this.selectedFacility._id, term)))
    //   .subscribe((payload: any) => {
    //     this.employees = payload.data;
    //   });







  }
  getEmployees() {
    this.loadIndicatorVisible = true;
    this.employees = [];
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.employeeService.find({ query: { facilityId: this.selectedFacility._id, showbasicinfo: true } }).then(payload => {
      this.employees = payload.data;
      this.loadIndicatorVisible = false;
    });
  }

  navEpDetail(val: Employee) {
    // this.router.navigate(['/modules/employee-manager/employee-manager-detail', val.personId]);
    this.employeeService.announceEmployee(val);
  }
}
