import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { FeatureModuleService } from '../../../../../services/module-manager/setup/index';
import { AccessControlService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';
// tslint:disable-next-line:max-line-length
import {
  FeatureModule, AccessControl, FeatureModuleViewModel, User, Facility
} from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-create-access',
  templateUrl: './create-access.component.html',
  styleUrls: ['./create-access.component.scss']
})
export class CreateAccessComponent implements OnInit {
  @Input() selectedRole: any;
  txtAccessName = new FormControl();
  searchFeature = new FormControl();
  // searchfeatureActive = false;
  selectedFacility: Facility = <Facility>{};
  // selectedAccessControl: AccessControl = <AccessControl>{};
  user: User = <User>{};
  modules: FeatureModule[] = [];
  actions: any = <any>[];
  selectedItems: any = <any>[];
  selectedModule: any = <any>{};
  loading: boolean = true;
  accessLoading: boolean = false;
  createRole: boolean = true;
  creatingRole: boolean = false;
  updateRole: boolean = false;
  updatingRole: boolean = false;
  disableBtn: boolean = true;
  routeId: string;
  facilitySubscriptions: any = <any>[];
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // superGroups: any[] = [];
  // btnTitle = 'Create Access';
  // innerMenuShow = false;

  constructor(
    private featureModuleService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private router: Router,
    private route: ActivatedRoute,
    private _facilityService: FacilitiesService,
    private accessControlService: AccessControlService,
    private _systemModuleService: SystemModuleService
  ) { }

  ngOnInit() {
    this.txtAccessName.valueChanges.subscribe(value => {
      if (value !== null) {
        if (value.length < 2) {
          this.disableBtn = true;
        } else {
          this.disableBtn = false;
        }
      }
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.getFacilitySubscription();
  }

  getFacilitySubscription() {
    this._facilityService.findValidSubscription({
      query: {
        facilityId: this.selectedFacility._id
      }
    }).then(payload => {
      this.facilitySubscriptions = payload.data;
      this.facilitySubscriptions.subscriptions_status = payload.data.subscriptions_status;
      this.getModules();
    },err=>{
      this.loading = false;
    });
  }

  getSubscribedModule(value) {
    if (this.facilitySubscriptions.subscriptions_status !== undefined) {
      if (this.facilitySubscriptions.subscriptions_status === true) {
        if (this.facilitySubscriptions.plans !== undefined) {
          let _modules = this.facilitySubscriptions.plans.filter(x => x.name === value && x.isConfirmed === true);
          if (_modules.length > 0) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  private _getRole(role: any) {
    const roleName = role.name;
    this.txtAccessName.setValue(roleName);
    this.populateAccessControl(role.features);
    this.updateRole = true;
    this.createRole = false;
    this.disableBtn = false
  }

  populateAccessControl(accessibilities: any) {
    if (accessibilities.length > 0) {
      this.modules.forEach(module => {
        accessibilities.forEach(item => {
          if (module.moduleId === item.moduleId) {
            module.actions.forEach(act => {
              if (act._id === item._id) {
                act.isChecked = true;
                const data = {
                  moduleName: module.name,
                  moduleId: module.moduleId,
                  accessName: act.name,
                  accessCode: act.code
                }
                this.selectedItems.push(data);
              }
            });
          }
        });
      });
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onClickCheckInput(action: any, checked: boolean) {
    // Check or uncheck items in the parent array.
    this.modules.forEach(module => {
      if (module._id === this.selectedModule._id) {
        module.actions.forEach(act => {
          if (act.code === action.code) {
            if (checked) {
              act.isChecked = true;
              const data = {
                moduleName: module.name,
                moduleId: module.moduleId,
                accessName: act.name,
                accessCode: act.code
              }
              this.selectedItems.push(data);
            } else {
              this.selectedItems = this.selectedItems.filter(x => x.accessCode !== act.code);
              act.isChecked = false;
            }
          }
        });
      }
    });
  }

  getModules() {
    this.featureModuleService.find({ query: { $limit: 100 } }).then(res => {
      this.loading = false;
      if (res.data.length > 0) {
        res.data.forEach(element => {
          if (this.getSubscribedModule(element.name)) {
            element.isSubscribed = true;
          } else {
            element.isSubscribed = false;
          }
        });
        this.modules = res.data;
        if (!!this.selectedRole) {
          this._getRole(this.selectedRole);
        }
      }
    });
  }

  create() {
    const roleName = this.txtAccessName.value;
    if (roleName !== '' && this.selectedItems.length > 0) {
      this.disableBtn = true;
      const accessControl: AccessControl = <AccessControl>{ features: [] };
      accessControl.name = roleName;
      accessControl.facilityId = this.selectedFacility._id;

      this.selectedItems.forEach(item => {
        const contains = this.modules.filter(x => x.moduleId === item.moduleId)[0].actions.filter(x => x.code === item.accessCode)[0];
        contains.moduleId = item.moduleId;
        contains.moduleName = item.moduleName;
        accessControl.features.push(contains);
      });

      if (this.selectedRole === undefined) {
        this.createRole = false;
        this.creatingRole = true;

        this.accessControlService.create(accessControl).then(res => {
          this.txtAccessName.reset();
          this.createRole = true;
          this.creatingRole = false;
          this.disableBtn = true;
          const text = `${roleName} role has been created successfully!`;
          this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          this.close_onClick();
        }, error => {
        }).catch(err => { });
      } else {
        this.updateRole = false;
        this.updatingRole = true;
        accessControl._id = this.selectedRole._id;
        this.accessControlService.update(accessControl).then(res => {
          this.updateRole = true;
          this.updatingRole = false;
          this.disableBtn = true;
          const text = `${roleName} role has been updated successfully!`;
          this._systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
          this.close_onClick();
        }).catch(err => { });
      }
    } else {
      this._notification('Error', 'Please fill all required fields!');
    }
  }


  onClickModule(module: FeatureModule, i) {
    if (this.getSubscribedModule(module.name)) {
      this.selectedModule = module;
      this.actions = module.actions;
    }
  }

  // Notification
  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

}
