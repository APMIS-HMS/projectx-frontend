import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../services/facility-manager/setup/index';

import { Facility, User } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


@Component({
    selector: 'app-access-role-details',
    templateUrl: './access-role-details.component.html',
    styleUrls: ['./access-role-details.component.scss']
  })

export class AccessRoleDetailsComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  selectedRole: any;
  user: User = <User>{};
  roles: any = <any>[];
  loading: boolean = true;

  createAccessrole = false;

  constructor(
    private _locker: CoolLocalStorage,
    private _router: Router,
    private _route: ActivatedRoute,
    private _accessControlService: AccessControlService,
    private _systemModuleService: SystemModuleService
  ) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    this._getAllRoles();
  }


  private _getAllRoles() {
    this._accessControlService.find({ query: {facilityId: this.selectedFacility._id, $limit:100 } }).then(res => {
      this.loading = false;
      if (res.data.length > 0) {
        this.roles = res.data;
      }
    }).catch(err => {});
  }

  close_onClick(e) {
    this._getAllRoles();
    this.createAccessrole = false;
  }

  onClickDelete(role) {
    this.selectedRole = role;
    this._systemModuleService.announceSweetProxy('Are you sure you want to delete this item?', 'question', this);

  }

  sweetAlertCallback(result) {
    if (result.value) {
      const roleName = this.selectedRole.name;
      this._accessControlService.remove(this.selectedRole._id, {}).then(res => {
        this.roles = [];
        const text = `${roleName} role has been deleted successfully!`;
        this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
        this._getAllRoles();
      }).catch(err => {});
    }
  }

  newAccessrole_onClick(role?) {
    this.selectedRole = role;
    this.createAccessrole = true;
  }
}
