import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Employee, Facility } from '../../models/index';
import { EmployeeService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class EmployeesResolverService implements Resolve<Employee>, OnDestroy, OnInit {
  previousUrl = '/';
  selectedFacility: Facility = <Facility>{};
  pageSize = 1;
  limit = 10;
  index = 0;
  constructor(private employeeService: EmployeeService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    this.router.events
      .filter(e => e.constructor.name === 'RoutesRecognized')
      .pairwise()
      .subscribe((e: any[]) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });
  }
  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Employee> {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    return this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id, 
        $limit: this.limit,
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        payload.index = this.index;
        return Observable.of(payload);
      }
      return Observable.of(null);
    }, error => {
      this.router.navigateByUrl(this.previousUrl);
    });
  }
  ngOnDestroy() {
    this.selectedFacility = <Facility>{};
  }
}
