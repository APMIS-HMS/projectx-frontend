import { Component, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, BedOccupancyService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { ArrayFunctionHelper } from '../../../../../shared-module/helpers/array-function-helper';

@Component({
	selector: 'app-bed',
	templateUrl: './bed.component.html',
	styleUrls: ['./bed.component.scss']
})
export class BedComponent implements OnInit {
	@Output() selectedBed: any;
	addbed = false;
	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	user: User = <User>{};
	beds: any[] = [];
	wardRoom: WardRoom = <WardRoom>{};
	bedNameEditShow: any;
	editBedName = new FormControl();
	loading = false;
	bedToDelete: any = <any>{};

	constructor(private _route: ActivatedRoute,
		private router: Router,
		public facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
		private _bedOccupancyService: BedOccupancyService,
		private _wardEventEmitter: WardEmitterService,
		private systemModuleService: SystemModuleService,
		private arrayFunction: ArrayFunctionHelper
  ) {
	}

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');
		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
			this.roomId = params.roomId;
		});
		this._wardEventEmitter.setRouteUrl('Bed Setup');
		this.getRooomBedItems();
	}

	bedNameEdit(index: Boolean, selectedBed: any) {
		this.selectedBed = selectedBed;
		this.addBedModal();
	}

	// Confirm if the user wants to delete bed first
	confirmBedDelete(selectedBed) {
		this.bedToDelete = selectedBed;
		this.bedToDelete.acceptFunction = true;
		this.systemModuleService.announceSweetProxy(`You are about to delete this bed: '${selectedBed.name}'`, 'question', this);
	}

	sweetAlertCallback(result) {
		if (result.value) {
		  if (this.bedToDelete.acceptFunction === true) {
				// proceed with the delete action after user has confirmed
				this.deleteBed(true);
		  } else {
			this.deleteBed(false);
		  }
			}
		}
	deleteBed(isProceed: Boolean) {
		if (isProceed && this.bedToDelete.isDeleted === false) {
				this.facilityService.get(this.facility._id, {}).then(payload => {
				const facility = payload;
				const facilityMinorLocation = facility.minorLocations.filter(x => x._id === this.wardId);
				const minorLocationIndex = this.arrayFunction.getIndexofObjectInArray(facility.minorLocations, this.wardId);
				const room = facilityMinorLocation[0].wardSetup.rooms.filter(x => x._id === this.roomId);
				const roomIndex = this.arrayFunction.getIndexofObjectInArray(facilityMinorLocation[0].wardSetup.rooms, this.roomId);
				if (room.length > 0) {
					const bedIndex = this.arrayFunction.getIndexofObjectInArray(room[0].beds, this.bedToDelete._id);
					const bed = room[0].beds.filter(x => x._id === this.bedToDelete._id);
					 const update = {
						 _id: bed[0]._id,
						name: bed[0].name,
						isDeleted: true
					};
					facility.minorLocations[minorLocationIndex].wardSetup.rooms[roomIndex].beds[bedIndex] = update;

					// this delete action only updates isDeleted property to true. Record is still intact in database
					this.facilityService.update(facility).then((pay) => {
						this.systemModuleService.announceSweetProxy(
							'Bed has been deleted successfully',
							'success',
							null,
							null,
							null,
							null,
							null,
							null,
							null
						);
						this.getRooomBedItems();
					});
				}
			});

		} else {
			this._notification(
				'Error',
				`You can not delete bed: ${this.bedToDelete.name}`
			);
			this.systemModuleService.announceSweetProxy(
				`You can not delete bed: ${this.bedToDelete.name}`,
				'error',
				null,
				null,
				null,
				null,
				null,
				null,
				null
			);
		}
	}

	getRooomBedItems() {
    this.facilityService.get(this.facility._id, {}).then(res => {
      this.loading = false;
      if (!!res._id) {
				const minorLocation = res.minorLocations.filter(x => x._id === this.wardId);
        if (minorLocation.length > 0) {
          const room = minorLocation[0].wardSetup.rooms.filter(x => x._id === this.roomId);
          if (room.length > 0) {
						this.wardRoom = room[0];
						this.beds = room[0].beds.filter(d => !d.isDeleted);
          }
        }
      }
    });
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
		  users: [this.user._id],
		  type: type,
		  text: text
		});
	  }

	addBedModal() {
		this.addbed = true;
	}

	close_onClick() {
    this.getRooomBedItems();
		this.selectedBed = undefined;
		this.addbed = false;
	}

}
