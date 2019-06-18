import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { WorkSpace, Facility } from '../../models/index';
import { WorkSpaceService } from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class WorkspaceResolverService implements Resolve<WorkSpace> {
  previousUrl = '/';
  selectedFacility: Facility = <Facility>{};

  constructor(private workSpaceService: WorkSpaceService,
    private locker: CoolLocalStorage,
    private workspaceService: WorkSpaceService,
    private router: Router) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WorkSpace> {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    return this.workspaceService.find({ query: { facilityId: this.selectedFacility._id, $limit: 100 } })
      .then(payload => {
        const result = payload.data.filter(x => x.isActive === true || x.isActive === undefined);
        result.forEach((itemi, i) => {
          itemi.locations = itemi.locations.filter(x => x.isActive === true);
        });
        return Observable.of(result);
      });
  }

}
