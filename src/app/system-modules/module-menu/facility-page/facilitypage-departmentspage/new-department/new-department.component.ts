import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FacilitiesService } from "../../../../../services/facility-manager/setup/index";
import { Facility } from "../../../../../models/index";
import { CoolLocalStorage } from "angular2-cool-storage";
import { SystemModuleService } from "app/services/module-manager/setup/system-module.service";
 
@Component({
  selector: "app-new-department",
  templateUrl: "./new-department.component.html",
  styleUrls: ["./new-department.component.scss"]
})
export class NewDepartmentComponent implements OnInit {
  facilityObj: Facility = <Facility>{};
  mainErr = true;
  errMsg = "you have unresolved errors";

  @Input() selectedDepartment;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  newDeptModal_on = false;
  newUnitModal_on = false;
  modal_on = false;
  isBusy = false;
  btnText = "CREATE DEPARTMENT";
  public frmNewDept: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public facilityService: FacilitiesService,
    private locker: CoolLocalStorage,
    private systemService: SystemModuleService
  ) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
    });
  }

  ngOnInit() {
    this.addNew();
    this.facilityObj = this.facilityService.getSelectedFacilityId();
    if (
      this.selectedDepartment !== undefined &&
      this.selectedDepartment._id !== undefined
    ) {
      this.frmNewDept.controls.deptName.setValue(this.selectedDepartment.name);
      this.btnText = "UPDATE DEPARTMENT";
    }
  }
  addNew() {
    this.frmNewDept = this.formBuilder.group({
      deptName: [
        "",
        [
          <any>Validators.required,
          <any>Validators.minLength(3),
          <any>Validators.maxLength(50)
        ]
      ],
      deptAlias: ["", [<any>Validators.minLength(2)]],
      deptDesc: ["", [<any>Validators.minLength(10)]]
    });
  }

  newDept(valid, val) {
    if (valid) {
      console.log(val);
      this.isBusy = true;
      this.systemService.on();
      if (val.deptName === "" || val.deptName === " ") {
        this.mainErr = false;
        this.errMsg = "you left out a required field";
        this.isBusy = false;
      } else {
        if (
          this.selectedDepartment === undefined ||
          this.selectedDepartment._id === undefined
        ) {
          let department: any = { name: val.deptName, isActive: true };
          
          this.facilityObj.departments.push(department);
          
          this.facilityService
            .update(this.facilityObj)
            .then(payload => {
             
              this.locker.setObject("selectedFacility", payload);
              this.systemService.announceSweetProxy(
                "Department saved successfully",
                "success"
              );
              this.addNew();
              this.isBusy = false;
              this.systemService.off();
              this.close_onClick();
            })
            .catch(err => {
              console.log (err);
              this.mainErr = false;
              this.isBusy = false;
              this.systemService.off();
              this.systemService.announceSweetProxy(
                "There was an error while saving this department, try again!",
                "error"
              );
            });
          this.mainErr = true;
        } else {
          let index = this.facilityObj.departments.findIndex(
            x => x._id === this.selectedDepartment._id
          );
          let department = this.facilityObj.departments[index];
          department.name = val.deptName;
          this.facilityObj.departments[index] = department;
          this.facilityService
            .update(this.facilityObj)
            .then(payload => {
              this.systemService.off();
              this.isBusy = false;
              this.close_onClick();
              this.systemService.announceSweetProxy(
                "Department updated successfully",
                "success"
              );
            })
            .catch(err => {
              this.systemService.off();
              this.isBusy = false;
              this.systemService.announceSweetProxy(
                "There was an error while updating this department, try again!",
                "error"
              );
            });
        }
      }
    } else {
      this.mainErr = false;
      this.isBusy = false;
      this.systemService.off();
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
