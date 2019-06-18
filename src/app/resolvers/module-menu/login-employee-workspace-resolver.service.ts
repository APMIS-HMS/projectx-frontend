import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Employee, Facility, MinorLocation, ScheduleRecordModel, WorkSpace } from '../../models/index';
import { EmployeeService, SchedulerService, WorkSpaceService } from '../../services/facility-manager/setup/index';
import { LocationService } from '../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class LoginEmployeeWorkspaceResolverService implements Resolve<Employee> {
  loginEmployee: Employee = <Employee>{};
  selectedFacility: Facility = <Facility>{};
  clinicLocations: MinorLocation[] = [];
  schedules: ScheduleRecordModel[] = [];
  workSpaces: WorkSpace[] = [];
  clinic: any = <any>{};
  constructor(private employeeService: EmployeeService,
    private locker: CoolLocalStorage, private scheduleService: SchedulerService,
    private locationService: LocationService, private workSpaceService: WorkSpaceService,
    private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const auth: any = this.locker.getObject('auth');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    return this.employeeService.find({
      query:
      {
        facilityId: this.selectedFacility._id, personId: auth.data.personId
      }
    }).then(payload1 => {
      if (payload1.data.length > 0) {
        this.loginEmployee = payload1.data[0];

        return this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } })
          .then(payloade => {
            this.workSpaces = payloade.data;
            return Observable.of({ workSpaces: this.workSpaces, loginEmployee: this.loginEmployee });
          });
      }

    }, error => {
      return Observable.of(null);
    });
  }
}
