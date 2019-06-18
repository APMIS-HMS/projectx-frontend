import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../services/facility-manager/setup/index';
// tslint:disable-next-line:max-line-length
import { FeatureModule, AccessControl, FeatureModuleViewModel, FacilityModule, Facility, Address, Profession, Relationship, Employee, Person, MaritalStatus, Department, MinorLocation, Gender, Title, Country } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';


@Component({
  selector: 'app-view-access',
  templateUrl: './view-access.component.html',
  styleUrls: ['./view-access.component.scss']
})
export class ViewAccessComponent implements OnInit {

  searchAccess = new FormControl();
  innerMenuShow = false;

  nav_access_documentation = false;
  selectedFacility: Facility = <Facility>{};
  selectedAccessControl: AccessControl = <AccessControl>{};
  accessControlList: AccessControl[] = [];
  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private accessControlService: AccessControlService) { }

  ngOnInit() {
    this.searchAccess.valueChanges.subscribe(value => {
      // do something with value here
    });
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    this.getAccessList();

  }
  getAccessList() {
    this.accessControlService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.accessControlList = payload.data;
      if (this.accessControlList.length > 0) {
        this.selectedAccessControl = this.accessControlList[0];
      }
    });
  }
  show(item: any) {
    this.selectedAccessControl = item;
  }
  isSelected(item: AccessControl) {
    return this.selectedAccessControl._id === item._id;
  }

  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }

}
