import { DONT_USE_AUTH_GUARD } from "./../../../shared-module/helpers/global-config";
import { AuthFacadeService } from "./../../../system-modules/service-facade/auth-facade.service";
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { RouterStateSnapshot } from "@angular/router/src/router_state";

@Injectable()
export class CanActivateViaAuthGuardCompleteFacilityService
  implements CanActivate {
  constructor(private authFacadeService: AuthFacadeService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    let self = this;
    return new Promise(function(resolve, reject) {
      // Sunday said I should comment it.
      // self.authFacadeService.getLogingEmployee;
      self.authFacadeService.getUserAccessControls().then(
        (payload: any) => {
          let modules: any = payload.modules;
          const index = modules.findIndex(
            x => x.name.toLowerCase() === route.routeConfig.path
          );
          const facility = self.authFacadeService.getSelectedFacility();
          const validate = self.validateFacility(facility);
          resolve(validate || route.routeConfig.path === "facility");
        },
        error => {
          reject(error);
        }
      );
    });
  }
  validateFacility(facility) {
    const result =
      facility.isValidRegistration === undefined ||
      facility.isValidRegistration === false
        ? false
        : true;
    return result;
  }
}
