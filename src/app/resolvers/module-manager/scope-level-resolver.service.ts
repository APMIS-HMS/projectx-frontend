import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Facility } from '../../models/index';
import { ScopeLevelService } from '../../services/module-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Injectable()
export class ScopeLevelResolverService implements Resolve<any> {
  selectedFacility: Facility = <Facility>{};
  constructor(private scopeLevelService: ScopeLevelService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.scopeLevelService.findAll().then(payload => {
      if (payload.data.length > 0) {
        return Observable.of(payload.data);
      }
      return Observable.of(null);
    }, error => {
    });
  }
}
