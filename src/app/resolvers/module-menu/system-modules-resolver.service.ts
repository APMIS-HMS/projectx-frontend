import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { FacilityModule, Facility } from '../../models/index';
import { FacilityModuleService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class SystemModulesResolverService implements Resolve<FacilityModule> {
  previousUrl = '/';
  selectedFacility: Facility = <Facility>{};
  constructor(private facilityModuleService: FacilityModuleService,
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


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FacilityModule> {
    return this.facilityModuleService.findAll()
      .then((payload) => {
        return Observable.of(payload.data);
      }, error => {
        return Observable.of(null);
      });
  }

}
