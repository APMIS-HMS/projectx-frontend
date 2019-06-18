import { Component, OnInit } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { BedOccupancyService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from 'app/services/module-manager/setup';

@Component({
	selector: 'app-ward-manager-listpage',
	templateUrl: './ward-manager-listpage.component.html',
	styleUrls: ['./ward-manager-listpage.component.scss']
})
export class WardManagerListpageComponent implements OnInit {
	facility: Facility = <Facility>{};
	wards: any[] = [];
	loading: Boolean = true;
	selectedIndex: Number = 0;

	constructor(
		private _route: Router,
		private _wardEventEmitter: WardEmitterService,
		private _facilitiesService: FacilitiesService,
    private _locker: CoolLocalStorage,
    private _locationService: LocationService
	) {

	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Wards');
    this.facility = <Facility>  this._locker.getObject('selectedFacility');
    this._getWardLocation();
	}

	getFacilityWard(wardId: string) {
    this._facilitiesService.get(this.facility._id, {}).then(res => {
      if (!!res._id) {
        this.wards = res.minorLocations.filter(x => x.locationId === wardId);
      }
    }).catch(err => {});
		// this._BedOccupancyService.find({ query: { 'facilityId._id': this.facility._id } }).then(res => {
    //   this.loading = false;
		// 	if (res.data.length > 0) {
    //     res.data[0].locations.forEach(ward => {
    //       ward.rooms.forEach(room => {
    //         let bedCount = 0;
		// 				if (room.beds.length > 0) {
    //           room.beds.forEach(bed => {
		// 						if (bed.isAvailable) {
		// 							room.availableBeds = ++bedCount;
		// 						} else {
    //               room.availableBeds = 0;
    //             }
		// 					});
		// 				} else {
		// 					room.availableBeds = 0;
		// 				}
		// 			});
		// 		});
    //     this.wards = res.data[0].locations;
		// 	}
		// });
  }

  private _getWardLocation() {
    this._locationService.findAll().then(res => {
      if (res.data.length > 0) {
        const ward = res.data.filter(x => x.name.toLowerCase() === 'ward');
        if (ward.length > 0) {
          this.getFacilityWard(ward[0]._id);
        }
      }
    }).catch(err => {
    });
  }

	goToFacility() {
		this._route.navigate(['/dashboard/facility/locations']);
	}

	showDetails(index: Number) {
		this.selectedIndex = index;
	}

}
