import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, EmployeeService, WorkSpaceService } from '../../../../services/facility-manager/setup/index';
import { Facility, Employee, MinorLocation, Location, WorkSpace, Department } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from '../../../../services/module-manager/setup/location.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.scss']
})
export class CreateWorkspaceComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  checkBoxValue: boolean;
  searchControl: FormControl = new FormControl();
  checkAll: FormControl = new FormControl();

  public frmNewEmp1: FormGroup;
  loadIndicatorVisible = false;
  disableDepartment = false;
  selectedFacility: Facility = <Facility>{};
  selectedDepartment: Department = <Department>{};
  selectedMajorLocation: Location = <Location>{};
  selectedMinorLocation: MinorLocation = <MinorLocation>{};
  selectedUnit: any = <any>{};

  departments: Department[] = [];
  units: any[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  majorLocations: Location[] = [];
  minorLocations: MinorLocation[] = [];
  workSpaces: WorkSpace[] = [];
  isSaving = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee: any;

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private locationService: LocationService,
    private employeeService: EmployeeService,
    private workspaceService: WorkSpaceService,
    private systemModuleService: SystemModuleService,
    public facilityService: FacilitiesService) {
     }

  ngOnInit() {
    this.frmNewEmp1 = this.formBuilder.group({
      dept: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      majorLoc: ['', [Validators.required]],
      minorLoc: ['', [Validators.required]]
    });
    this.frmNewEmp1.controls['dept'].valueChanges.subscribe((value: any) => {
      this.departments = this.selectedFacility.departments;
      const index = this.departments.findIndex(x => x.name === value);
      this.selectedDepartment = this.departments[index];
      this.units = this.selectedDepartment.units;
      this.employees = [];
      this.filteredEmployees = [];
    });
    this.frmNewEmp1.controls['unit'].valueChanges.subscribe((value: any) => {
      this.selectedUnit = value;

      if (this.selectedEmployee === undefined) {
        this.employees = [];
        this.filteredEmployees = [];
        this.getEmployees(this.selectedDepartment, this.selectedUnit);
      }
    });
    this.frmNewEmp1.controls['majorLoc'].valueChanges.subscribe((value: Location) => {
      this.selectedMajorLocation = value;
      this.selectedMinorLocation = undefined;
      this.getMinorLocation(this.selectedMajorLocation);
      this.filteredEmployees = this.employees;
    });
    this.frmNewEmp1.controls['minorLoc'].valueChanges.subscribe((value) => {
      this.selectedMinorLocation = value;
      this.getWorkSpace();
    });
    this.checkAll.valueChanges.subscribe(value => {
      this.checkAllEmployees(value);
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    this.getMajorLocations();

    if (this.selectedEmployee !== undefined && this.selectedEmployee._id !== undefined) {
      this.disableDepartment = true;
      this.frmNewEmp1.controls['dept'].setValue(this.selectedEmployee.departmentId);
      const deptList = this.departments.filter(x => x.name === this.selectedEmployee.departmentId);
      if (deptList.length > 0) {
        if (this.selectedEmployee.units !== undefined) {
          this.selectedEmployee.units.forEach((item, i) => {
            const unitsList = deptList[0].units.filter(x => x._id === item);
            if (unitsList.length > 0) {
              if (this.units === undefined) {
                this.units = [];
                this.units.push(unitsList[0]);
              }
            }
          });
        }
      }
      this.selectedEmployee.isChecked = false;
      this.employees.push(this.selectedEmployee);
      this.filteredEmployees = this.employees;
    } else {
      this.disableDepartment = false;
    }
  }
  checkAllEmployees(value: boolean) {
    this.employees.forEach((itemi, i) => {
      itemi.isChecked = value;
    });
  }
  getEmployees(dept: Department, unit: any) {
    this.loadIndicatorVisible = true;
    this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id,
        departmentId: dept.name,
        units: unit
      }
    }).then(payload => {
      this.employees = payload.data;
      this.employees.forEach((itemi, i) => {
        itemi.isChecked = false;
      });
      this.filteredEmployees = this.employees;
      this.loadIndicatorVisible = false;
    }, error => {
      this.loadIndicatorVisible = false;
    });

  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  getMajorLocations() {
    this.locationService.findAll().then(payload => {
      this.majorLocations = payload.data;
    });
  }
  getMinorLocation(majorLocation: Location) {
    this.facilityService.get(this.selectedFacility._id, {}).then(payload => {
      this.locker.setObject('selectedFacility', payload);
      this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
      this.minorLocations = this.selectedFacility.minorLocations.filter(x => x.locationId === majorLocation._id);
      this.getWorkSpace();
    });
  }
  onValueChanged(e, employee: Employee) {
    employee.isChecked = e.checked;
  }
  getWorkSpace() {
    if (this.selectedEmployee === undefined || this.selectedEmployee._id === undefined) {
      const minorLocationId = this.frmNewEmp1.controls['minorLoc'].value._id;
      this.filteredEmployees = this.employees;
      this.checkAllEmployees(false);
      if (minorLocationId !== undefined) {
        this.loadIndicatorVisible = true;
        this.workspaceService.find({
          query:
            {
              facilityId: this.selectedFacility._id,
              'locations.minorLocationId': minorLocationId, $limit: 100
            }
        }).then(payload => {
          const filteredEmployee: Employee[] = [];
          this.filteredEmployees.forEach((emp, i) => {
            let workInSpace = false;
            payload.data.forEach((work, j) => {
              if (work.employeeId === emp._id) {
                workInSpace = true;
              }
            });
            if (!workInSpace) {
              filteredEmployee.push(emp);
            }
          });
          this.filteredEmployees = filteredEmployee;
          this.loadIndicatorVisible = false;
        }, error => {
          this.loadIndicatorVisible = false;
        });
      } else {
        this.workSpaces = [];
        this.loadIndicatorVisible = false;
      }
    } else {
      const minorLocationId = this.frmNewEmp1.controls['minorLoc'].value._id;
      if (minorLocationId !== undefined) {
        this.loadIndicatorVisible = true;
        this.workspaceService.find({
          query:
            {
              facilityId: this.selectedFacility._id,
              employeeId: this.selectedEmployee._id,
              'locations.minorLocationId': minorLocationId, $limit: 100
            }
        }).then(payload => {
          if (payload.data.length > 0) {
            const filteredEmployee: Employee[] = [];
            this.filteredEmployees.forEach((emp, i) => {
              let workInSpace = false;
              payload.data.forEach((work, j) => {
                if (work.employeeId === emp._id) {
                  workInSpace = true;
                }
              });
              if (!workInSpace) {
                filteredEmployee.push(emp);
              }
            });
            this.filteredEmployees = filteredEmployee;
            this.loadIndicatorVisible = false;
          } else {
            this.filteredEmployees = this.employees;
          }
        }, error => {
          this.loadIndicatorVisible = false;
        });
      } else {
        this.workSpaces = [];
        this.loadIndicatorVisible = false;
      }
    }
  }
  isAnyChecked() {
    const checkedItems = this.filteredEmployees.filter(x => x.isChecked);
    return checkedItems.length > 0;
  }
  enable() {
    const result = (!this.frmNewEmp1.valid && !this.isSaving) || this.isSaving || !this.isAnyChecked();
    return !result;
  }
  disable() {
    const result = (!this.frmNewEmp1.valid && !this.isSaving) || this.isSaving || !this.isAnyChecked();
    return result;
  }
  getEmployeeIdFromFiltered(filtered: Employee[]) {
    const retVal: string[] = [];
    filtered.forEach((itemi, i) => {
      retVal.push(itemi._id);
    });
    return retVal;
  }
  setWorkspace(valid: boolean, value: any) {
    if (valid) {
      this.systemModuleService.on();
      this.isSaving = true;
      const filtered = this.filteredEmployees.filter(x => x.isChecked);
      const employeesId = this.getEmployeeIdFromFiltered(filtered);
      const facilityId = this.selectedFacility._id;
      const majorLocationId = this.frmNewEmp1.controls['majorLoc'].value;
      const minorLocationId = this.frmNewEmp1.controls['minorLoc'].value;

      const body = {
        filtered: filtered,
        employeesId: employeesId,
        facilityId: facilityId,
        majorLocationId: majorLocationId,
        minorLocationId: minorLocationId
      }

      this.workspaceService.assignworkspace(body).then(payload => {
        this.isSaving = false;
        this.systemModuleService.off();
        this.getWorkSpace();
        this.systemModuleService.announceSweetProxy('Workspace successfully set!', 'success', null, null, null, null, null, null, null);
        if(this.selectedEmployee !== undefined && this.selectedEmployee._id !== undefined)
        {
          this.employeeService.announceEmployee(this.selectedEmployee);
        }
        this.close_onClick();
      }, error => {
        this.isSaving = false;
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('There was an error while saving the workspace', 'error');
      });
    } else {
      this.mainErr = false;
      this.errMsg = 'An error occured while setting the workspace, please try again!';
      this.systemModuleService.announceSweetProxy(this.errMsg, 'error');
    }
  }

}
