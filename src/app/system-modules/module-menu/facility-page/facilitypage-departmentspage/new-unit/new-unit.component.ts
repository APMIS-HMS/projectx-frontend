import { SystemModuleService } from "app/services/module-manager/setup/system-module.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { FormGroup, FormArray, FormBuilder, Validators } from "@angular/forms";
import { FacilitiesService } from "../../../../../services/facility-manager/setup/index";
import { Facility, Department } from "../../../../../models/index";
import { CoolLocalStorage } from "angular2-cool-storage";

@Component({
  selector: "app-new-unit",
  templateUrl: "./new-unit.component.html",
  styleUrls: ["./new-unit.component.scss"]
})
export class NewUnitComponent implements OnInit {
  @Input() department: Department;
  @Input() unit: any;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onRefresh: EventEmitter<boolean> = new EventEmitter<boolean>();
  deptsObj: Department[] = [];
  mainErr = true;
  errMsg = "you have unresolved errors";
  mainErrClinic = true;
  errMsgClinic = "you have unresolved errors";

  isClinic = false;
  btnText = "CREATE UNIT";

  facilityObj: Facility = <Facility>{};
  public frmNewUnit: FormGroup;
  clinicForm: FormGroup;
  clinicsToDelele: any[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService,
    public facilityService: FacilitiesService
  ) {}

  ngOnInit() {
    this.addNew();
    this.addNew2();
    this.frmNewUnit.controls["unitParent"].valueChanges.subscribe(payload => {
      this.frmNewUnit.controls["isClinic"].valueChanges.subscribe(value => {
        this.isClinic = value;
        if (
          (<FormArray>this.clinicForm.controls["clinicArray"]).controls
            .length === 0 &&
          this.unit !== undefined &&
          this.unit._id !== undefined
        ) {
          this.addNew2();
        }
      });
    });
    this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
    this.deptsObj = this.facilityObj.departments.filter(x => x.isActive);
    if (this.department !== undefined) {
      this.frmNewUnit.controls["unitParent"].setValue(this.department._id);
    }
    if (this.unit !== undefined) {
      this.frmNewUnit.controls["unitName"].setValue(this.unit.name);
      this.frmNewUnit.controls["unitAlias"].setValue(this.unit.shortName);
      this.frmNewUnit.controls["_id"].setValue(this.unit._id);
    }

    (<FormGroup>(<FormArray>this.clinicForm.controls["clinicArray"])
      .controls[0]).controls["clinicName"].valueChanges.subscribe(value => {
      this.mainErrClinic = true;
      this.errMsgClinic = "";
    });
    if (this.unit !== undefined && this.unit._id !== undefined) {
      this.btnText = "UPDATE UNIT";
      this.frmNewUnit.controls["unitName"].setValue(this.unit.name);
      this.frmNewUnit.controls["unitAlias"].setValue(this.unit.shortName);
      this.frmNewUnit.controls["_id"].setValue(this.unit._id);
      if (this.unit.clinics.length > 0) {
        this.frmNewUnit.controls["isClinic"].setValue(true);
        this.clinicForm.controls["clinicArray"] = new FormArray([]);
        this.unit.clinics.forEach(clinic => {
          (<FormArray>this.clinicForm.controls["clinicArray"]).push(
            this.formBuilder.group({
              clinicName: [
                clinic.clinicName,
                [
                  <any>Validators.required,
                  <any>Validators.minLength(3),
                  <any>Validators.maxLength(50)
                ]
              ],
              _id: [clinic._id, []],
              clinicCapacity: [clinic.clinicCapacity, []],
              readonly: [true]
            })
          );
        });
      }
    } else {
      this.btnText = "CREATE UNIT";
    }
    this.clinicsToDelele = [];
  }
  addNew() {
    this.frmNewUnit = this.formBuilder.group({
      unitName: [
        "",
        [
          <any>Validators.required,
          <any>Validators.minLength(3),
          <any>Validators.maxLength(50)
        ]
      ],
      unitAlias: ["", [<any>Validators.minLength(2)]],
      unitParent: ["", [<any>Validators.required]],
      _id: [, []],
      isClinic: [false, []]
    });
  }

  addNew2() {
    this.clinicForm = this.formBuilder.group({
      clinicArray: this.formBuilder.array([
        this.formBuilder.group({
          clinicName: [
            "",
            [
              <any>Validators.required,
              <any>Validators.minLength(3),
              <any>Validators.maxLength(50)
            ]
          ],
          clinicCapacity: [0, []],
          readonly: [false]
        })
      ])
    });
  }
  onRemoveBill(clinic, i) {
    this.clinicsToDelele.push(clinic.value);
    (<FormArray>this.clinicForm.controls["clinicArray"]).controls.splice(i, 1);
    if (
      (<FormArray>this.clinicForm.controls["clinicArray"]).controls.length === 0
    ) {
      this.frmNewUnit.controls["isClinic"].reset(false);
      this.addNew2();
    }
  }
  onAddHobby(children: any, valid: boolean) {
    if (valid) {
      if (children.clinicName === "" || children.clinicName === " ") {
        this.mainErrClinic = false;
        this.errMsgClinic = "you left out a required field";
      } else {
        if (children != null) {
          children.value.readonly = true;
          (<FormArray>this.clinicForm.controls["clinicArray"]).push(
            this.formBuilder.group({
              clinicName: [
                "",
                [
                  <any>Validators.required,
                  <any>Validators.minLength(3),
                  <any>Validators.maxLength(50)
                ]
              ],
              clinicCapacity: [0, []],
              readonly: [false]
            })
          );
          this.mainErrClinic = true;
          this.errMsgClinic = "";
        } else {
          const innerChildren: any = children.value;
        }
      }
    } else {
      this.mainErrClinic = false;
      this.errMsgClinic = "you left out a required field";
    }
  }
  newUnit(valid, val) {
    if (valid) {
      if (val.unitName === "" || val.unitName === " ") {
        this.mainErr = false;
        this.errMsg = "you left out a required field";
      } else {
        if (this.unit === undefined) {
          const id = this.department._id;
          const clinics = (<FormArray>this.clinicForm.controls[
            "clinicArray"
          ]).controls.filter((x: any) => x.value.readonly);
          const clinicList = [];
          clinics.forEach((itemi, i) => {
            clinicList.push(itemi.value);
          });
          this.facilityObj.departments.forEach(function(item, i) {
            if (item._id === id) {
              item.units.push({
                isActive: true,
                name: val.unitName,
                shortName: val.unitAlias,
                description: val.unitDesc,
                clinics: clinicList
              });
            }
          });
          this.facilityService
            .patch(
              this.facilityObj._id,
              { departments: this.facilityObj.departments },
              {}
            )
            .then(
              payload => {
                this.facilityObj = payload;
                this.frmNewUnit.controls["isClinic"].reset(false);
                this.clinicForm.controls[
                  "clinicArray"
                ] = this.formBuilder.array([]);
                this.frmNewUnit.reset();
                this.onRefresh.emit(true);
                this.systemModuleService.announceSweetProxy(
                  "Unit saved successfully",
                  'success', null, null, null, null, null, null, null);
                this.closeModal.emit(true);
              },
              eror => {
                this.systemModuleService.announceSweetProxy(
                  "There was an eror saving the unit",
                  "error"
                );
              }
            );

          this.mainErr = true;
        } else {
          let that = this;
          const clinicList = [];
          this.facilityObj.departments.forEach(function(item, i) {
            if (item._id === val.unitParent) {
              item.units.forEach((unit, u) => {
                if (unit._id === val._id) {
                  unit.name = val.unitName;
                  unit.isActive = true;
                  unit.shortName = val.unitAlias;
                  unit.description = val.unitDesc;
                  const clinicsArray = (<FormArray>that.clinicForm.controls[
                    "clinicArray"
                  ]).controls.filter((x: any) => x.value.readonly);
                  clinicsArray.forEach((itemi: any, i) => {
                    let isExisting = false;
                    unit.clinics.forEach((clinic, c) => {
                      if (clinic._id === itemi.value._id) {
                        isExisting = true;
                        clinic.clinicName = itemi.value.clinicName;
                        clinic.clinicCapacity = itemi.value.clinicCapacity;
                      }
                    });
                    if (!isExisting) {
                      unit.clinics.push(itemi.value);
                    }
                  });
                  let realClinics: any[] = [];
                  if (that.clinicsToDelele.length > 0) {
                    unit.clinics.forEach((clinic, k) => {
                      let shouldDelete = false;
                      that.clinicsToDelele.forEach(toDelete => {
                        if (clinic._id === toDelete._id) {
                          shouldDelete = true;
                        }
                      });
                      if (!shouldDelete) {
                        realClinics.push(clinic);
                      }
                    });

                    unit.clinics = realClinics;
                  }
                }
              });
            }
          });
          this.facilityService
            .patch(
              this.facilityObj._id,
              { departments: this.facilityObj.departments },
              {}
            )
            .then(
              payload => {
                this.facilityObj = payload;
                this.frmNewUnit.controls["isClinic"].reset(false);
                this.clinicForm.controls[
                  "clinicArray"
                ] = this.formBuilder.array([]);
                this.frmNewUnit.reset();
                this.close_onClick();
                this.closeModal.emit(true);
                this.onRefresh.emit(true);
                this.systemModuleService.announceSweetProxy(
                  "Unit saved successfully",
                  'success', null, null, null, null, null, null, null);
              },
              err => {
                this.systemModuleService.announceSweetProxy(
                  "There was an error saving the unit, try again",
                  "error"
                );
              }
            );
        }
      }
    } else {
      this.mainErr = false;
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.btnText = "CREATE UNIT";
    this.unit = <any>{};
  }
}
