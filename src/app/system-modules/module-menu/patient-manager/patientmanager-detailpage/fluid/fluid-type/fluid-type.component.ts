import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import {
  FluidService, FacilitiesService
} from '../../../../../../services/facility-manager/setup/index';
import { ClinicModel, Facility, Location, ScheduleRecordModel, User } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Component({
  selector: 'app-fluid-type',
  templateUrl: './fluid-type.component.html',
  styleUrls: ['./fluid-type.component.scss']
})
export class FluidTypeComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  fluidsList: any;
  user: any;
  selectedFacility;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_addfluid: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private fluidService: FluidService,
    private facilityService: FacilitiesService,
    private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');

    this.frm_addfluid = this.formBuilder.group({
      fluidname: ['', [<any>Validators.required]],
      fluidType: ['', [<any>Validators.required]]
    });

    this.getFluids();
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  getFluids() {
    this.fluidService.find({
      query: {
        "facilityId": this.selectedFacility._id,
        $sort: {
          createdAt: -1
        }
      }
    }).then(payload => {
      this.fluidsList = payload.data;
    })
  }

  deleteFluid(id) {
    this.fluidService.remove(id, {}).then((payload) => {
      this._notification('Success', 'Fluid Successfully Deleted!!');
      this.getFluids();
    }).catch(err => {
      this._notification('Error', 'Something Went Wrong... Please Try Again!');
    });
  }

  addFluids() {
    let fluid = this.frm_addfluid.controls["fluidname"].value;
    let type = this.frm_addfluid.controls["fluidType"].value;

    let fluids = {
      name: fluid,
      type: type,
      facilityId: this.selectedFacility._id
    }

    this.fluidService.create(fluids).then(payload => {
      this._notification('Success', 'Fluid Successfully Deleted!!');
      this.frm_addfluid.reset();
      this.getFluids();
    }).catch(err => {
      this._notification('Error', 'Something Went Wrong... Please Try Again!');
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



}