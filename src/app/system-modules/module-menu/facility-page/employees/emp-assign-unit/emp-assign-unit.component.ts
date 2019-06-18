import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, EmployeeService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Employee, Department } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-emp-assign-unit',
  templateUrl: './emp-assign-unit.component.html',
  styleUrls: ['./emp-assign-unit.component.scss']
})
export class EmpAssignUnitComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  disableDepartment = false;
  checkBoxValue: boolean;
  searchControl: FormControl = new FormControl();

  public frmNewEmp1: FormGroup;
  checkAll: FormControl = new FormControl();
  selectedFacility: Facility = <Facility>{};
  selectedDepartment: Department = <Department>{};
  selectedUnit: any = undefined;

  departments: Department[] = [];
  units: any[] = [];
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  isSaving = false;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee: any = <any>{};

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private employeeService: EmployeeService,
    private systemModuleService:SystemModuleService,
    public facilityService: FacilitiesService) { }

  ngOnInit() {
    this.frmNewEmp1 = this.formBuilder.group({
      dept: ['', [Validators.required]],
      unit: ['', [Validators.required]]
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;
    if (this.selectedEmployee !== undefined) {
      this.disableDepartment = true;
      const deptList = this.departments.filter(x => x.name === this.selectedEmployee.departmentId);
      if (deptList.length > 0) {
        this.frmNewEmp1.controls['dept'].setValue(deptList[0].name);
        this.units = deptList[0].units;
      }
      this.selectedEmployee.isChecked = false;
      this.employees.push(this.selectedEmployee);
      this.filteredEmployees = this.employees;
    } else {
      this.disableDepartment = false;
    }

    this.frmNewEmp1.controls['unit'].valueChanges.subscribe((value: any) => {
      this.selectedUnit = value;
      this.filterDownEmployees(this.selectedUnit);

    });
    this.frmNewEmp1.controls['dept'].valueChanges.subscribe((value: any) => {
      const deptIndex = this.departments.findIndex(x => x.name === value);
      this.selectedDepartment = this.departments[deptIndex];
      this.units =  this.selectedDepartment.units;
      if (this.selectedEmployee === undefined) {
        this.getEmployees(value);
      }
    });
    this.checkAll.valueChanges.subscribe(value => {
      this.checkAllEmployees(value);
    });
  }
  filterDownEmployees(unit: any) {
    const filteredEmployees = [];
    this.employees.forEach((emp, i) => {
      let hasUnit = false;
      if (emp.units !== undefined) {
        emp.units.forEach((itemu, u) => {
          if (unit !== null && itemu === unit.name) {
            hasUnit = true;
          }
        });
      }
      if (!hasUnit) {
        filteredEmployees.push(emp);
      }
    });
    this.filteredEmployees = filteredEmployees;
  }
  checkAllEmployees(value: boolean) {
    this.employees.forEach((itemi, i) => {
      itemi.isChecked = value;
    });
    this.filteredEmployees = this.employees;
  }
  getEmployees(dept: any) {
    this.employeeService.find({
      query: {
        facilityId: this.selectedFacility._id,
        departmentId: dept
      }
    }).then(payload => {
      this.employees = payload.data;
      this.employees.forEach((itemi, i) => {
        itemi.isChecked = false;
      });
      this.filteredEmployees = this.employees;
      if (this.selectedUnit !== undefined) {
        this.filterDownEmployees(this.selectedUnit);
      }
    });
  }
  hasMinimumChecked() {
    return this.filteredEmployees.filter(x => x.isChecked).length > 0;
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  onValueChanged(e, employee: Employee) {
    employee.isChecked = e.checked;
  }
  assignUnit(valid, value) {
    this.isSaving = true;
    const checkedEmployees = this.filteredEmployees.filter(emp => emp.isChecked === true);

    this.employeeService.assignUnit({ unitId: this.selectedUnit.name, employees: checkedEmployees }).then(payload => {
      this.getEmployees(this.selectedDepartment.name);
      this.isSaving = false;
      if(this.selectedEmployee !== undefined && this.selectedEmployee._id !== undefined)
      {
        this.employeeService.announceEmployee(this.selectedEmployee);
      }
      this.systemModuleService.announceSweetProxy('Employee assigned successfully', 'success', null, null, null, null, null, null, null);
    }, error => {
      this.isSaving = false;
      this.systemModuleService.announceSweetProxy('There was an error assigning this employee to this unit','error');
    });
  }
}
