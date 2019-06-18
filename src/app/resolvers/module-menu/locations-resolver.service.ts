import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Location } from '../../models/index';
import { LocationService } from '../../services/module-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class LocationsResolverService implements Resolve<Location> {
  previousUrl = '/';
  constructor(private locationService: LocationService,
    private locker: CoolLocalStorage,
    private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Location> {
    return this.locationService.findAll().then(payload => {
      if (payload.data.length > 0) {
        return Observable.of(payload.data);
      }
      return Observable.of(null);
    }, error => {
      this.router.navigateByUrl(this.previousUrl);
    });
  }

}
