import { Injectable } from '@angular/core';
import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Facility, Person } from '../../models/index';
import {
	FacilitiesService,
	PersonService,
	CorporateFacilityService
} from '../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class SwitchUserResolverService implements Resolve<Facility> {
	previousUrl = '/';
	selectedFacility: Facility = <Facility>{};
	authData: any;
	selectedPerson: Person = <Person>{};
	listOfFacilities: Facility[] = [];
	constructor(
		public facilityService: FacilitiesService,
		private locker: CoolLocalStorage,
		private corporateFacilityService: CorporateFacilityService,
		private personService: PersonService,
		private router: Router
	) {}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
		const auth: any = this.locker.getObject('auth');
		this.authData = auth.data;
		if (auth == null || auth === undefined) {
			this.router.navigate([ '/' ]);
			return Observable.of(null);
		}
		return this.personService
			.get(this.authData.personId, { query: { $select: [ 'updatedAt', 'profileImageObject' ] } })
			.then((payloadp) => {
				this.selectedPerson = payloadp;
				if (auth == null || auth === undefined) {
					this.router.navigate([ '/' ]);
				} else if (auth.corporateOrganisationId == null || auth.corporateOrganisationId === undefined) {
					const facilities = auth.data.facilitiesRole;
					const facilityList = [];
					facilities.forEach((item, i) => {
						facilityList.push(item.facilityId);
					});
					return this.facilityService
						.find({
							query: {
								_id: { $in: facilityList },
								$select: [
									'departments.name',
									'name',
									'logoObject',
									'facilitymoduleId',
									'facilityTypeId',
									'isTokenVerified',
									'isActivated'
								]
							}
						})
						.then((payload) => {
							this.listOfFacilities = payload.data;
							if (this.listOfFacilities.length === 1) {
								this.locker.setObject('selectedFacility', this.listOfFacilities[0]);
								return Observable.of({
									selectedPerson: this.selectedPerson,
									listOfFacilities: this.listOfFacilities,
									authData: this.authData
								});
								// if (true) {
								//   // this.router.navigate(['dashboard']);

								// }
								// I (Chisimdi) added this because you were returning same thing as the conditional up
								//  else {
								//   return Observable.of({
								//     selectedPerson: this.selectedPerson, listOfFacilities: this.listOfFacilities,
								//     authData: this.authData
								//   });
								// }
							} else {
								return Observable.of({
									selectedPerson: this.selectedPerson,
									listOfFacilities: this.listOfFacilities,
									authData: this.authData
								});
							}
						});
				} else {
					return this.corporateFacilityService.get(auth.corporateOrganisationId, {}).then((single) => {
						this.locker.setObject('selectedFacility', single);
						this.locker.setObject('isCorporate', true);
						this.router.navigate([ '/dashboard/corporate' ]);
						return Observable.of(null);
					});
				}
			});
	}
}
