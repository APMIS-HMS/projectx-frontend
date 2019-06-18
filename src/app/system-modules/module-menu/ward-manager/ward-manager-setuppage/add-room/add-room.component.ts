import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	RoomGroupService, BedOccupancyService, FacilitiesServiceCategoryService, FacilitiesService, FacilityPriceService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-add-room',
	templateUrl: './add-room.component.html',
	styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedRoom: any;
	addRoomFormGroup: FormGroup;
	mainErr = true;
	wardId: string;
	groupId:any;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	wardDetail: WardDetail = <WardDetail>{};
	employeeDetails: any = <any>{};
	user: User = <User>{};
	room: Room = <Room>{};
	wardRoom: WardRoom = <WardRoom>{};
	servicePriceTags: any[] = [];
	serviceId: any = <any>{};
	groups: any[] = [];
	errMsg = 'You have unresolved errors';
	addRoom: boolean = true;
	addingRoom: boolean = false;
	editRoom: boolean = false;
	editingRoom: boolean = false;
	disableAddRoomBtn: boolean = false;
  serviceLoading: boolean = true;
  groupLoading: boolean = true;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _roomGroupService: RoomGroupService,
		private _bedOccupancyService: BedOccupancyService,
		public facilityService: FacilitiesService,
		private _locker: CoolLocalStorage,
    private fb: FormBuilder,
    private _facilityPrice: FacilityPriceService,
    private _systemModuleService: SystemModuleService,
		private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService
	) {
			this.facility = <Facility> this._locker.getObject('selectedFacility');
			this.employeeDetails = this._locker.getObject('loginEmployee');
	}

	ngOnInit() {
		this.user = <User>this._locker.getObject('auth');

		this.addRoomFormGroup = this.fb.group({
			room: ['', [<any>Validators.required]],
			group: ['', [<any>Validators.required]],
			service: ['', [<any>Validators.required]],
			desc: ['']
		});

		this._route.params.subscribe(params => {
			this.wardId = params['wardId'];
		});

		this.getWaitGroupItems();
    this.getServicePriceTag();

		setTimeout(x => {
			if (!!this.selectedRoom) {
				if (this.groups.length > 0 && this.servicePriceTags.length > 0) {
					this.addRoomFormGroup.controls['room'].setValue(this.selectedRoom.name);
					this.addRoomFormGroup.controls['group'].setValue(this.selectedRoom.group);
					this.addRoomFormGroup.controls['service'].setValue(this.selectedRoom.service);
					this.addRoomFormGroup.controls['desc'].setValue(this.selectedRoom.description);
					this.serviceId = this.selectedRoom.serviceId;
          this.editRoom = true;
          this.addRoom = false;
          this.disableAddRoomBtn = false;
				}
			}
		}, 2000);
  }

  compareGroup(l1: any, l2: any) {
    return l1._id === l2.groupId;
  }

  compareService(l1: any, l2: any) {
    return l1._id === l2.serviceId;
  }

	getWaitGroupItems() {
		this._roomGroupService.findAll().then(res => {
			this.groupLoading = false;
			if (res.data.length > 0) {
				this.groups = res.data;
			}
		});
	}

	getServicePriceTag() {
		const payload = { facilityId: this.facility._id };
    this._facilitiesServiceCategoryService.wardRoomPrices(payload).then(res => {
			this.serviceLoading = false;
			if (res.status === 'success' && res.data.length > 0) {
				this.servicePriceTags = res.data;
			}
		});
  }

	addroom(value: any, valid: boolean) {
		if (valid) {
      this.disableAddRoomBtn = true;
      const payload = {
        facilityId: this.facility._id,
        action: (!!this.selectedRoom && !!this.selectedRoom._id) ? 'edit-room' : 'create-room',
        name: value.room,
        group: value.group,
        service: value.service,
        minorLocationId: this.wardId,
        desc: value.desc,
        roomId: (!!this.selectedRoom && !!this.selectedRoom._id) ? this.selectedRoom._id : undefined
      };

      if (!!this.selectedRoom) {
        this.editRoom = false;
        this.editingRoom = true;

        this._roomGroupService.wardSetup(payload).then(res => {
          if (res.status === 'success') {
            this.close_onClick();
            this.addRoom = true;
            this.addingRoom = false;
            this.disableAddRoomBtn = true;
            const text = `${value.room} room has been edited successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          } else {
            this.disableAddRoomBtn = false;
            const text = `There was a problem editing ${value.room} room!`;
            this._systemModuleService.announceSweetProxy(text, 'error');
          }
        }).catch(err => {
        });
      } else {
        this.addRoom = false;
        this.addingRoom = true;

        this._roomGroupService.wardSetup(payload).then(res => {
          if (res.status === 'success') {
            this.close_onClick();
            this.addRoom = true;
            this.addingRoom = false;
            this.disableAddRoomBtn = true;
            const text = `${value.room} room has been created successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          } else {
            this.disableAddRoomBtn = false;
            const text = `There was a problem trying to create ${value.room} room!`;
            this._systemModuleService.announceSweetProxy(text, 'error');
          }
        }).catch(err => {
        });
      }
		} else {
      this._notification('Error', 'Please fill required fields');
    }
	}

	onChangeService(item, serviceId) {
	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
		  users: [this.user._id],
		  type: type,
		  text: text
		});
	  }

	close_onClick() {
    this.selectedRoom = undefined;
		this.closeModal.emit(true);
	}
}
