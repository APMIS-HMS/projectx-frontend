import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Appointment, Facility } from '../../models/index';
import { AppointmentService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class AppointmentsResolverService implements Resolve<Appointment> {
  previousUrl = '/';
  selectedFacility: Facility = <Facility>{};
  constructor(private appointmentService: AppointmentService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.router.events
      .filter(e => e.constructor.name === 'RoutesRecognized')
      .pairwise()
      .subscribe((e: any[]) => {
        this.previousUrl = e[0].urlAfterRedirects;
      });
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Appointment> {
    return this.appointmentService.find({
      query: {
        facilityId: this.selectedFacility._id,
        attendance: { $exists: true }
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        return Observable.of(payload.data);
      }
      return Observable.of(null);
    }, error => {
      this.router.navigateByUrl(this.previousUrl);
    });
  }

}
