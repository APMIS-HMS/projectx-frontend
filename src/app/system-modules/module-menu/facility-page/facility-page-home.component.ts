import { Department } from './../../../models/facility-manager/setup/department';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FacilitiesService } from './../../../services/facility-manager/setup/facility.service';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Facility } from '../../../models/index';
import { Observable } from 'rxjs/Observable';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';

import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { EmployeeService } from '../../../services/facility-manager/setup/index';
@Component({
  selector: 'app-facility-page-home',
  templateUrl: './facility-page-home.component.html',
  styleUrls: ['./facility-page-home.component.scss']
})
export class FacilityPageHomeComponent implements OnInit {
  empContentArea: boolean;
  loadIndicatorVisible = false;
  contentSecMenuShow = false;
  pageInView = 'Facility';
  homeContentArea = false;
  modulesContentArea = false;
  contentSecMenuToggle = false;
  optionsContentArea = false;
  departmentsContentArea = false;
  locationsContentArea = false;
  workspaceContentArea = false;
  professionContentArea = false;
  dashboardContentArea = false;
  networkContentArea = false;
  accessContentArea = false;
  hmoContentArea = false;
  patientBulkUploadContentArea = false;
  nhmisContentArea = false;

  showUnit = false;
  showLoc = false;

  selectedFacility: any;
  selectedDepartment: any;
  selectedUnit: any;
  hasModules = false;
  hasDepartments = false;
  hasUnits = false;
  hasMinorLocations = false;
  hasAssignedEmployees = false;
  hasWorkSpaces = false;

  newDept = false;
  newUnit = false;
  newSubLocModal_on = false;
  createWorkspace = false;
  pgMenuToggle = false;

  searchControl: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder, private router: Router, private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage, private employeeService: EmployeeService,
    private facilityService: FacilitiesService) {
    this.facilityService.patchListner.subscribe(payload => {
      this.selectedFacility = payload;
      this.locker.setObject('selectedFacility', payload);
    });
    this.facilityService.listner.subscribe(payload => {
      this.selectedFacility = payload;
      this.locker.setObject('selectedFacility', payload);
    });
    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        const page: string = event.url;
        this.checkPageUrl(page);
      });
  }
  ngOnInit() {
    const page: string = this.router.url;
    this.checkPageUrl(page);

    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.getModules();
    this.getDepartments();
    this.getUnits();
    this.getMinorLocations();
    this.getEmployees();

  }

  deptDetalContentArea_remove(model: Department) {
    this.systemModuleService.on();
    const index = this.selectedFacility.departments.findIndex(x => x._id === model._id);
    this.selectedFacility.departments.splice(index, 1);
    this.facilityService.update(this.selectedFacility).then(payload => {
      this.systemModuleService.off();
    }).catch(err => {
      this.systemModuleService.off();
    });
  }

  showUnit_click(dept) {
    this.showUnit = false;
    this.selectedDepartment = dept;
    this.showUnit = true;
  }
  showUnit_hide() {
    this.showUnit = false;
    this.selectedDepartment = undefined;
  }
  showLoc_click() {
    this.showLoc = true;
  }
  showLoc_hide() {
    this.showLoc = false;
  }
  showUnit_selectedDepartmentUnit(dept) {
    if (this.selectedDepartment !== undefined) {
      return dept._id === this.selectedDepartment._id;
    }
    return false;
  }
  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]).then(
      payload => {
      }
    ).catch(error => {
    });
    this.pgMenuToggle = false;
    if (value === '') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'employees') {
      this.empContentArea = true;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'departments') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'locations') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'workspaces') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'options') {
      this.modulesContentArea = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'profession') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'subsribtion') {
      this.modulesContentArea = true;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'network') {
      // this.dashboardContentArea = false;
    } else if (value == 'network') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = true;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value === 'access') {
      // this.dashboardContentArea = false;
    } else if (value == 'access') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = true;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (value == 'health-coverage') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = true;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value == 'patient-bulk-upload') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = true;
      this.nhmisContentArea = false;
    } else if (value == 'nhmis-summary') {
      this.modulesContentArea = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = true;
    }
  }
  getModules() {
    this.hasModules = this.selectedFacility.facilitymoduleId.length > 0 ? true : false
  }
  getDepartments() {
    this.hasDepartments = this.selectedFacility.departments.length > 0 ? true : false;
  }
  getUnits() {
    if (this.selectedFacility.departments !== undefined) {
      this.selectedFacility.departments.forEach((dept, d) => {
        if (dept.units !== undefined && dept.units.length > 0) {
          this.hasUnits = true;
        }
      })
    }
  }
  getMinorLocations() {
    // this.hasMinorLocations = this.selectedFacility.minorLocations.length > 0 ? true : false;
  }
  getEmployees() {
    this.employeeService.find({ query: { $limit: 1 } }).then(payload => {
      if (payload.data.length > 0) {
        this.hasAssignedEmployees = true;
      }
    })
  }

  private checkPageUrl(param: string) {
    if (param.includes('facility/subsribtion')) {
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/departments')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/locations')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.accessContentArea = false;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/workspaces')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/options')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/profession')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/employee')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = true;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
      // this.dashboardContentArea = false;
    } else if (param.includes('facility/network')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = true;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (param.includes('facility/access')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.accessContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = true;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (param.includes('health-coverage')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = true;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = false;
    } else if (param.includes('facility/patient-bulk-upload')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = true;
      this.nhmisContentArea = false;
    }  else if (param.includes('facility/nhmis-summary')) {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.accessContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      this.nhmisContentArea = true;
    } else {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      this.hmoContentArea = false;
      this.patientBulkUploadContentArea = false;
      // this.dashboardContentArea = false;
    }
  }
  close_onClick(e) {
    this.newDept = false;
    this.newUnit = false;
    this.newSubLocModal_on = false;
    this.createWorkspace = false;
  }
  newDept_onClick() {
    this.newDept = true;
  }
  newUnit_onClick(dept) {
    this.selectedDepartment = dept;
    this.newUnit = true;
  }
  editUnit_onClick(dept, unit) {
    this.selectedDepartment = dept;
    this.selectedUnit = unit;
    this.newUnit = true;
  }
  newLoc_onClick() {
    this.newSubLocModal_on = true;
  }
  newWorkspace_onClick() {
    this.createWorkspace = true;
  }
  autoCompleteCallback1(selectedData: any) {
  }
  pgMenu_click() {
    this.pgMenuToggle = !this.pgMenuToggle;
  }
}
