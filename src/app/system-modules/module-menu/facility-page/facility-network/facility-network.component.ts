import { Component, OnInit } from '@angular/core';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../services/facility-manager/setup/index';

import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-facility-network',
  templateUrl: './facility-network.component.html',
  styleUrls: ['./facility-network.component.scss']
})
export class FacilityNetworkComponent implements OnInit {

  addMember = false;
  addOther = false;

  LoggedInFacility;

  members = [];
  others = [];

  constructor(public facilityService: FacilitiesService, private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService) {
      this.facilityService.patchListner.subscribe(payload =>{
        this.LoggedInFacility = payload;
        this.locker.setObject('selectedFacility', payload);
        this.ngOnInit();
      });
     }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject('selectedFacility');

    this.getNetworks(true);
    this.getNetworks(false);
  }

  close_onClick(e) {
    this.addMember = false;
    this.addOther = false;
  }

  addMember_click() {
    this.addMember = true;
  }
  addOther_click() {
    this.addOther = true;
  }

  leaveNetwork(id) {
    this.systemModuleService.on();
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: [id]
    }
    this.facilityService.joinNetwork(fac, true).then(payl => {
      this.getNetworks(true);
      this.systemModuleService.off();
    },error =>{
      this.systemModuleService.off();
    })
  }

  removeMember(id) {
    this.systemModuleService.on();
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: [id]
    }
    this.facilityService.addNetwork(fac, true).then(payl => {
      this.getNetworks(false);
      this.systemModuleService.off();
    },error =>{
      this.systemModuleService.off();
    })
  }

  getNetworks(isMemberOf){
    this.facilityService.getNetwork(this.LoggedInFacility._id, isMemberOf).then((payload:any) => {
      if(isMemberOf){
        this.others = payload;
      } else {
        this.members = payload;
      }
      this.systemModuleService.off();
    },error =>{
      this.systemModuleService.off();
    });
  }

  confirmRemove(id) {
    const question = 'Are you sure you want to remove this facility from the network?';
    this.systemModuleService.announceSweetProxy(question, 'question', this, null, null, id);
  }

  sweetAlertCallback(result, from) {
    if (result.value) {
      this.removeMember(from);
    }
  }
  memberAdded(val){
    this.getNetworks(true);
  }

  networkJoined(event){
    this.getNetworks(false);
  }
}
