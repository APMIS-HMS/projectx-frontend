import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Facility } from '../../models/index';
import { FacilitiesService }
  from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class FacilityResolverService implements Resolve<Facility> {
  previousUrl = '/';
  selectedFacility: Facility = <Facility>{};
  constructor(public facilityService: FacilitiesService,
    private locker: CoolLocalStorage,
    private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Facility> {
    const tokenObj: any =  <Facility> this.locker.getObject('selectedFacility');
    return this.facilityService.get(tokenObj._id, {}).then(payload => {
      if (payload) {
        return Observable.of(payload);
      }
      return Observable.of(null);
    }, error => {
      return Observable.of(null);
    });
  }
}
