import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Patient, Facility } from '../../models/index';
import { PatientService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class PatientResolverService implements Resolve<Patient> {

  selectedFacility: Facility = <Facility>{};
  constructor(private patientService: PatientService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Patient> {
    const id = route.params['id'];
    if (id === undefined) {
      this.router.navigate(['/login']);
      return Observable.of(null);
    }
    return this.patientService.find({ query: { personId: id, facilityId: this.selectedFacility._id } }).then(payload => {
      if (payload.data.length > 0) {
        return Observable.of(payload.data[0]);
      }
      return Observable.of(null);
    }, error => {
    });
  }
}



