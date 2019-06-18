import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Employee, Facility, MinorLocation, ScheduleRecordModel, WorkSpace } from '../../models/index';
import { EmployeeService, SchedulerService, WorkSpaceService } from '../../services/facility-manager/setup/index';
import { LocationService } from '../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class LoginEmployeeResolverService implements Resolve<Employee> {
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
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    return this.employeeService.find({
      query:
      {
        facilityId: this.selectedFacility._id, personId: auth.data.personId
      }
    }).then(payload1 => {
      if (payload1.data.length > 0) {
        this.loginEmployee = payload1.data[0];

        return this.locationService.findAll().then(payload => {
          payload.data.forEach((itemm, m) => {
            if (itemm.name === 'Clinic') {
              this.clinic = itemm;

              this.clinicLocations = [];
              const inClinicLocations: MinorLocation[] = [];
              const minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
              minors.forEach((itemi, i) => {
                const minorLocation: MinorLocation = <MinorLocation>{};
                minorLocation._id = itemi._id;
                minorLocation.description = itemi.description;
                minorLocation.locationId = itemi.locationId;
                minorLocation.name = itemi.name;
                minorLocation.shortName = itemi.shortName;
                minorLocation.text = itemi.name;
                inClinicLocations.push(minorLocation);
              });

              return this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload3 => {
                this.schedules = payload3.data;


                this.schedules.forEach((items, s) => {
                  this.loginEmployee.units.forEach((itemu, u) => {
                    if (itemu === items.unit) {
                      // const res = inClinicLocations.filter(x => x._id === items.clinicObject.clinic.clinicLocation);
                      // if (res.length > 0) {
                      //   this.clinicLocations.push(res[0]);
                      // }
                    }
                  });
                });


                return this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } })
                .then(payloade => {
                  this.workSpaces = payloade.data;
                });



              });


            }
          });
          return Observable.of({ loginEmployee: payload1.data[0], clinicLocations: this.clinicLocations, workSpaces: this.workSpaces });
        });
      };

    }, error => {
      return Observable.of(null);
    });
  }
}


