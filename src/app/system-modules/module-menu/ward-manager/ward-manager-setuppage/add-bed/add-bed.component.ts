import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
	RoomGroupService, BedOccupancyService, FacilitiesServiceCategoryService, FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, WardDetail, Room, WardRoom, Bed, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-add-bed',
	templateUrl: './add-bed.component.html',
	styleUrls: ['./add-bed.component.scss']
})
export class AddBedComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedBed: any;
	addBedFormGroup: FormGroup;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	wardId: string;
	roomId: string;
	facility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};
	employeeDetails: any = <any>{};
	user: User = <User>{};
	bed: Bed = <Bed>{};
  addBed: boolean = true;
  addingBed: boolean = false;
  editBed: boolean = false;
  editingBed: boolean = false;
	disableAddBtn: boolean = false;

	wardGroupItems: any[] = [];

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
    private _roomGroupService: RoomGroupService,
    private _systemModuleService: SystemModuleService,
    private _locker: CoolLocalStorage,
		private fb: FormBuilder,
		private facilityService: FacilitiesService
	) { }

	ngOnInit() {
		this.facility = <Facility> this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		this.employeeDetails = this._locker.getObject('loginEmployee');
		this.user = <User>this._locker.getObject('auth');

		this.addBedFormGroup = this.fb.group({
			bed: ['', [<any>Validators.required]]
		});

		this._route.params.subscribe(params => {
			this.wardId = params.wardId;
			this.roomId = params.roomId;
		});

		if (!!this.selectedBed) {
      this.addBedFormGroup.controls['bed'].setValue(this.selectedBed.name);
      this.editBed = true;
      this.addBed = false;
			// this.addBedBtnText = 'Edit bed';
		}
	}

	addbed(value: any, valid: boolean) {
		if (valid) {
      const bed = {
        facilityId: this.facility._id,
        action: (!!this.selectedBed && !!this.selectedBed._id) ? 'edit-bed' : 'create-bed',
        name: value.bed,
        minorLocationId: this.wardId,
        roomId: this.roomId,
        bedId: (!!this.selectedBed && !!this.selectedBed._id) ? this.selectedBed._id : undefined
      };

			// Edit bed
			if (!!this.selectedBed) {
        this.disableAddBtn = true;
        this.editBed = false;
        this.editingBed = false;

        this._roomGroupService.wardSetup(bed).then(res => {
          if (res.status === 'success') {
            this.close_onClick(true);
            this.editBed = true;
            this.editingBed = false;
            this.disableAddBtn = true;
            const text = `${value.bed} bed has been edited successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          } else {
            this.disableAddBtn = false;
            const text = `There was a problem editing ${value.bed} bed!`;
            this._systemModuleService.announceSweetProxy(text, 'error');
          }
        }).catch(err => {
        });
			} else {
				// Creating
        this.disableAddBtn = true;
        this.addBed = false;
        this.addingBed = true;

        this._roomGroupService.wardSetup(bed).then(res => {
          if (res.status === 'success') {
            this.close_onClick(true);
            this.addBed = true;
            this.addingBed = false;
            this.disableAddBtn = true;
            const text = `${value.bed} bed has been added successfully!`;
            this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          } else {
            this.disableAddBtn = false;
            const text = `There was a problem adding ${value.bed} bed!`;
            this._systemModuleService.announceSweetProxy(text, 'error');
          }
        }).catch(err => {
        });
			}
		} else {
      this._notification('Error', 'Please fill all required fields!');
    }

	}

	// Notification
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
		  users: [this.user._id],
		  type: type,
		  text: text
		});
	}

	close_onClick(event) {
		this.closeModal.emit(true);
	}
}
