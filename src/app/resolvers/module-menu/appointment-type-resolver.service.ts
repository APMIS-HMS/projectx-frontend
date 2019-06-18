import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AppointmentType, Facility } from '../../models/index';
import { AppointmentTypeService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Injectable()
export class AppointmentTypeResolverService implements Resolve<AppointmentType> {
  selectedFacility: Facility = <Facility>{};
  constructor(private appointmentTypeService: AppointmentTypeService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AppointmentType> {
    return this.appointmentTypeService.find({
      query: {
        facilityId: this.selectedFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        return Observable.of(payload.data);
      }
      return Observable.of(null);
    }, error => {
    });
  }
}
