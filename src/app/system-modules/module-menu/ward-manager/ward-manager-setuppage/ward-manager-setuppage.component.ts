import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { FacilitiesService, BedOccupancyService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { LocationService } from 'app/services/module-manager/setup';

@Component({
	selector: 'app-ward-manager-setuppage',
	templateUrl: './ward-manager-setuppage.component.html',
	styleUrls: [ './ward-manager-setuppage.component.scss' ]
})
export class WardManagerSetuppageComponent implements OnInit {
	pageInView = 'Ward Setup';
	facility: Facility = <Facility>{};
	wards: any[] = [];
	facilityWardId = '';
	loading: Boolean = true;

	constructor(
		private _facilitiesService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _bedOccupancyService: BedOccupancyService,
		private _locationService: LocationService,
		private _wardEventEmitter: WardEmitterService,
		private _systemModuleService: SystemModuleService,
		private _route: Router,
		private _router: ActivatedRoute
	) {
		// this._bedOccupancyService.listenerCreate.subscribe(payload => {
		// 	this.getFacilityWard();
		// });
		// this._bedOccupancyService.listenerUpdate.subscribe(payload => {
		// 	this.getFacilityWard();
		// });
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Ward Setup');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._getMajorLocation();
	}

	goToFacility() {
		this._route.navigate([ '/dashboard/facility/locations' ]);
	}

	getFacilityWard(locationId) {
		this._facilitiesService
			.find({
				query: {
					_id: this.facility._id,
					'minorLocations.locationId': locationId
				}
			})
			.then((res) => {
				this.loading = false;
				//*Starday Check if no ward location has been set
				if (res.data.length > 0) {
					this.wards = res.data[0].minorLocations.filter((x) => x.locationId === locationId);
					this.wards.map((item) => {
						item.activeRoom = item.wardSetup.rooms.filter((x) => !x.isDeleted).length;
					});
				} else {
					const text = 'No ward location has been created, please create one!!';
					this._systemModuleService.announceSweetProxy(
						text,
						'info',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
					this._route.navigate([ '/dashboard/facility' ]);
				}
			})
			.catch((err) => {});
		// this._bedOccupancyService.find({query: {'facilityId._id': this.facility._id}}).then(res => {
		// 	this.loading = false;
		// 	if (res.data.length > 0) {
		// 		this.wards = res.data[0].locations;
		// 	}
		// });
	}

	private _getMajorLocation() {
		this._locationService
			.find({ query: { name: 'Ward' } })
			.then((res) => {
				if (res.data.length > 0) {
					const locationId = res.data[0]._id;
					this.getFacilityWard(locationId);
				}
			})
			.catch((err) => {});
	}
}
