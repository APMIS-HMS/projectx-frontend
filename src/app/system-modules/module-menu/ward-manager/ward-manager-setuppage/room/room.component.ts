import { Component, OnInit, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { FacilitiesService, BedOccupancyService, RoomGroupService, FacilitiesServiceCategoryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { ArrayFunctionHelper } from '../../../../../shared-module/helpers/array-function-helper';

@Component({
	selector: 'app-room',
	templateUrl: './room.component.html',
	styleUrls: ['./room.component.scss']
})

export class RoomComponent implements OnInit {
	@Output() selectedRoom: any;
	addRoom = false;
	wardId: string;
	facility: Facility = <Facility>{};
	wardDetail: any = <any>{};
	rooms: any[] = <any>[];
	wardRoom: WardRoom = <WardRoom>{};
	wardServicePriceTags = [];
	roomNameEditShow: any;
	roomGroupItems = [];
	editRoomGroup = new FormControl();
	editRoomName = new FormControl();
	editServicePrice = new FormControl();
	loading: Boolean = true;
	roomToDelete: any = <any>{};

	constructor(
		private _route: ActivatedRoute,
		private router: Router,
		private _facilitiesService: FacilitiesService,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
		private _locker: CoolLocalStorage,
		private _bedOccupancyService: BedOccupancyService,
		private _wardEventEmitter: WardEmitterService,
		private systemModuleService: SystemModuleService,
		private arrayFunction: ArrayFunctionHelper,
		private _roomGroupService: RoomGroupService) {

	}

	ngOnInit() {
		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
		});
		this._wardEventEmitter.setRouteUrl('Room Setup');
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.getWardRooomItems();
	}

	editRoom(index: Number, selectedRoom: any) {
		this.addRoom = true;
		this.selectedRoom = selectedRoom;
	}

	getWardRooomItems() {
    this._facilitiesService.get(this.facility._id, {}).then(res => {
			this.loading = false;
			if (!!res._id) {
        const rooms = res.minorLocations.filter(x => x._id === this.wardId);
        this.wardDetail = rooms[0];
        if (!!rooms[0].wardSetup && !!rooms[0].wardSetup.rooms && rooms[0].wardSetup.rooms.length > 0) {
		  this.rooms = rooms[0].wardSetup.rooms.filter(x => !x.isDeleted);
		  this.rooms.map(item => {
			  item.activeBed = item.beds.filter(x => !x.isDeleted).length;
		  });
        }
			}
		});
	}

	confirmRoomDelete(selectedRoom) {
		this.roomToDelete = selectedRoom;
		this.roomToDelete.acceptFunction = true;
		this.systemModuleService.announceSweetProxy(`You are about to delete this room: '${selectedRoom.name}'`, 'question', this);

	}

	sweetAlertCallback(result) {
		if (result.value) {
		  if (this.roomToDelete.acceptFunction === true) {
				// proceed with the delete action after user has confirmed
				this.deleteRoom(true);
		  } else {
				this.deleteRoom(false);
		  }
			}
		}
	deleteRoom(isProceed: Boolean) {
		const activeBeds = this.roomToDelete.beds.filter(x => !x.isDeleted);
		if (isProceed && activeBeds.length < 1 && !this.roomToDelete.isDeleted) {
			this._facilitiesService.get(this.facility._id, {}).then(payload => {
				const facility = payload;
				const facilityMinorLocation = facility.minorLocations.filter(x => x._id === this.wardId);
				const minorLocationIndex = this.arrayFunction.getIndexofObjectInArray(facility.minorLocations, this.wardId);
				const roomIndex = this.arrayFunction.getIndexofObjectInArray(facilityMinorLocation[0].wardSetup.rooms, this.roomToDelete._id);
				const room = facilityMinorLocation[0].wardSetup.rooms.filter(x => x._id === this.roomToDelete._id);
				if (room.length > 0) {
					 const update = {
						 _id: room[0]._id,
						 name: room[0].name,
						 group: room[0].group,
						 facilityServiceId: room[0].facilityServiceId,
						 service: room[0].service,
						 categoryId: room[0].categoryId,
						 isDeleted: true,
						 beds: room[0].beds,
						 description: room[0].description,
					};
					facility.minorLocations[minorLocationIndex].wardSetup.rooms[roomIndex] = update;

					// this delete action only updates isDeleted property to true. Record is still intact in database
					this._facilitiesService.update(facility).then((pay) => {
						this.systemModuleService.announceSweetProxy(
							`Room: ${this.roomToDelete.name} has been deleted successfully`,
							'success',
							null,
							null,
							null,
							null,
							null,
							null,
							null
						);
						this.getWardRooomItems();
					});
				} else {
					this.systemModuleService.announceSweetProxy(
						`Room '${this.roomToDelete.name}' does not exist`,
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
			});
		} else {
			this.systemModuleService.announceSweetProxy(
				`You can not delete room: '${this.roomToDelete.name}'.Room has ${activeBeds.length} bed(s)`,
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
	addRoomModal() {
		this.addRoom = true;
	}

	close_onClick() {
    this.getWardRooomItems();
    this.selectedRoom = undefined;
		this.addRoom = false;
	}

}
