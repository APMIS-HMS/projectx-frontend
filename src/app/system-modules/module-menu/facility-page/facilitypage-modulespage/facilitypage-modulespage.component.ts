import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FacilitiesService, FacilityModuleService } from '../../../../services/facility-manager/setup/index';
import { FacilityModule, Facility } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-facilitypage-modulespage',
  templateUrl: './facilitypage-modulespage.component.html',
  styleUrls: ['./facilitypage-modulespage.component.scss']
})
export class FacilitypageModulespageComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  allModulesShow = true;
  integratedModulesShow = false;
  unintegratedModulesShow = false;
  facility: any = <any>{};
  systemModules: any = [];
  facilityModules: any = [];
  idToRemove: any = <any>{}
  subscribe = false;

  constructor(private facilityModuleService: FacilityModuleService,
    private locker: CoolLocalStorage,
    private route: ActivatedRoute,
    private systemModuleService: SystemModuleService,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.pageInView.emit('Facility Modules');
    this.facility = this.locker.getObject('selectedFacility');
    this.getFacility();
    this.getModules();
  }
  isIntegrated(value: any): boolean {
    let obj = this.facilityModules.find(x => x._id === value.toString());
    if (obj == null) {
      return true;
    }
    return false;
  }
  getModules() {
    this.systemModuleService.on();
    this.facilityService.getModule(this.facility._id, { query: { isAll: true }}).then((payload) => {
      this.systemModuleService.off();
      this.systemModules = payload;
    }, err => {
      this.systemModuleService.off();
    });
  }
  getFacility() {
    this.systemModuleService.on();
    this.facilityService.getModule(this.facility._id, { query: { isAll: false }}).then((payload) => {
      this.systemModuleService.off();
      if (payload.facilitymoduleId !== undefined && payload.facilitymoduleId.length > 0) {
        this.facilityModules = payload.facilitymoduleId;
      }
    }, error => {
      this.systemModuleService.off();
    })
  }

  activate(id) {
    let facility = <any>this.locker.getObject("selectedFacility");
    facility.facilityModulesId.push(id);

    this.facilityService.update(facility).then(payload => {
      this.getModules();
      this.getFacility();
    });

  }

  deactivate(id) {
    
  }
  
  onActive(value) {
    this.facilityService.createModule({}, {
      query: {
        isRemove: false,
        moduleId: value._id,
        facilityId: this.facility._id
      }
    }).then((payload) => {
      this.getModules();
      this.getFacility();
    }, error => {
    })
  }

  onDeactive(value) {
    this.systemModuleService.on();
    this.idToRemove = value;
    this.systemModuleService.announceSweetProxy('Are you sure you want to disable this module', 'question', this);
  }

  sweetAlertCallback(result) {
    if (result.value) {
      this.facilityService.createModule({}, {
        query: {
          isRemove: true,
          moduleId: this.idToRemove._id,
          facilityId: this.facility._id
        }
      }).then((payload) => {
        this.getModules();
        this.getFacility();
        this.idToRemove = <any>{};
      }, error => {
      })
    }
  }

  allModuleTab() {
    this.allModulesShow = true;
    this.integratedModulesShow = false;
    this.unintegratedModulesShow = false;
  }
  integratedModuleTab() {
    this.allModulesShow = false;
    this.integratedModulesShow = true;
    this.unintegratedModulesShow = false;
  }
  unintegratedModuleTab() {
    this.allModulesShow = false;
    this.integratedModulesShow = false;
    this.unintegratedModulesShow = true;
  }

  close_onClick(e){
    this.subscribe = false;
  }
  subscribe_onClick(){
    this.subscribe = true;
  }

} 
