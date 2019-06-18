import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { FacilitiesService } from "../../../../services/facility-manager/setup/index";
import {
  Facility,
  Department,
  MinorLocation,
  Location
} from "../../../../models/index";
import { LocationService } from "../../../../services/module-manager/setup/index";
import { CoolLocalStorage } from "angular2-cool-storage";
import { ActivatedRoute } from "@angular/router";
import { SystemModuleService } from "app/services/module-manager/setup/system-module.service";

@Component({
  selector: "app-facilitypage-departmentspage",
  templateUrl: "./facilitypage-departmentspage.component.html",
  styleUrls: ["./facilitypage-departmentspage.component.scss"]
})
export class FacilitypageDepartmentspageComponent implements OnInit {
  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild("unititem") unititem;
  modal_on = false;
  newDeptModal_on = false;
  newUnitModal_on = false;

  innerMenuShow = false;
  deptsObj: Department[] = [];
  deptObj: Department = <Department>{};

  // Department icons nav switches
  deptHomeContentArea = true;
  deptDetailContentArea = false;
  deptEditContentArea = false;

  // Department list fields edit icon states
  deptEditNameIcoShow = false;
  deptEditShortNameIcoShow = false;
  deptEditDescIcoShow = false;

  unitEditNameIcoShow = false;
  unitEditShortNameIcoShow = false;
  unitEditDescIcoShow = false;

  deptNameEdit = new FormControl();
  deptshortNameEdit = new FormControl();
  deptDescEdit = new FormControl();

  unitNameEdit = new FormControl();
  unitshortNameEdit = new FormControl();
  unitDescEdit = new FormControl();
  facilityObj: Facility = <Facility>{};

  locations: Location[] = [];
  selectedLocation: Location = <Location>{};
  minorLocations: MinorLocation[] = [];
  selectedUnit: any = <any>{};
  selectedDepartment: any;
  showUnit = false;
  newDept = false;
  newUnit = false;
  clinic = "";
  constructor(
    public facilityService: FacilitiesService,
    private locationService: LocationService,
    private route: ActivatedRoute,
    private systemService: SystemModuleService,
    private locker: CoolLocalStorage
  ) {
    this.facilityService.listner.subscribe(payload => {
      this.facilityObj = payload;
      this.getCurrentDepartment();
      this.deptsObj = payload.departments;
    });
  }
  getCurrentDepartment() {
    let deptObj = this.deptObj;

    this.facilityObj.departments.forEach((item, i) => {
      if (item._id === deptObj._id) {
        deptObj = item;
      }
    });
    this.deptObj = deptObj;
  }
  updateFacility() {
    this.facilityService.update(this.facilityObj).then(payload => {
      this.facilityObj = payload;
      this.getCurrentDepartment();
    });
  }
  getLocations() {
    this.locationService.findAll().then(payload => {
      this.locations = payload.data;
      this.locations.forEach(item => {
        if (item.name === "Clinic") {
          this.selectedLocation = item;
          const facility: Facility = <Facility>this.locker.getObject(
            "selectedFacility"
          );
          facility.minorLocations.forEach((itemi: MinorLocation) => {
            if (itemi.locationId === this.selectedLocation._id) {
              this.minorLocations.push(itemi);
            }
          });
        }
      });
    });
  }
  updateDepartmentProperties(prop: any, value: any) {
    const id = this.deptObj._id;
    this.facilityObj.departments.forEach((item, i) => {
      if (item._id === id) {
        item[prop] = value;
        this.updateFacility();
      }
    });
  }
  updateUnitProperties(prop: any, value: any) {
    const units = this.deptObj.units;
    units.forEach((item, i) => {});
  }
  ngOnInit() {
    this.pageInView.emit("Departments");

    this.deptNameEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties("name", value);
    });
    this.deptshortNameEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties("shortName", value);
    });
    this.deptDescEdit.valueChanges.subscribe(value => {
      this.updateDepartmentProperties("description", value);
    });

    this.unitNameEdit.valueChanges.subscribe(value => {
      this.updateUnitProperties("name", "Hardwares");
    });
    this.unitshortNameEdit.valueChanges.subscribe(value => {});
    this.unitDescEdit.valueChanges.subscribe(value => {
      // do something with value here
    });

    this.route.data.subscribe(data => {
      data["facility"].subscribe((payload: any) => {
        this.facilityObj = payload;
        this.deptsObj = this.facilityObj.departments;
      });
    });

    // this.getFacility();
    // this.facilityObj = this.facilityService.getSelectedFacilityId();
    // this.deptsObj = this.facilityObj.departments;
  }
  getFacility(evnt?) {
    const facility = <Facility>this.locker.getObject("selectedFacility"); //selected facility undefined
    this.facilityService.get(facility._id, {}).then(
      payload => {
        this.facilityObj = payload;
        this.deptsObj = this.facilityObj.departments;
      },
      error => {}
    );
  }

  deptDetalContentArea_show(model: any) {
    this.deptHomeContentArea = false;
    this.deptDetailContentArea = true;
    this.deptEditContentArea = false;
    this.innerMenuShow = false;
    this.deptObj = model;
  }

  deptHomeContentArea_show() {
    this.deptHomeContentArea = true;
    this.deptDetailContentArea = false;
    this.deptEditContentArea = false;
    this.innerMenuShow = false;
  }

  deptDetalContentArea_remove(model: Department) {
    this.systemService.on();
    let index = this.facilityObj.departments.findIndex(
      x => x._id === model._id
    );
    this.facilityObj.departments[index].isActive = false;
    this.facilityService
      .update(this.facilityObj)
      .then(payload => {
        this.systemService.off();
      })
      .catch(err => {
        this.systemService.off();
      });
  }
  removeDeptDepartmentFacade(dept) {
    const question = "Are you sure you want to remove from department?";
    this.systemService.announceSweetProxy(
      question,
      "question",
      this,
      null,
      null,
      { from: "department", dept: dept }
    );
  }
  removeUnitFacade(dept, unit) {
    const question = "Are you sure you want to remove from unit?";
    this.systemService.announceSweetProxy(
      question,
      "question",
      this,
      null,
      null,
      { from: "unit", dept: dept, unit: unit }
    );
  }
  sweetAlertCallback(result, payload) {
    if (result.value) {
      if (payload.from === "unit") {
        this.remove(payload.dept, payload.unit);
      } else if (payload.from === "department") {
        this.deptDetalContentArea_remove(payload.dept);
      }
    }
  }
  remove(dept, unit) {
    this.systemService.on();
    let index = this.facilityObj.departments.findIndex(x => x._id === dept._id);
    let department = this.facilityObj.departments[index];
    let unitIndex = department.units.findIndex(x => x._id === unit._id);
    department.units[unitIndex].isActive = false;

    // department.units.splice(unitIndex, 1);
    this.facilityObj.departments[index] = department;
    this.facilityService
      .update(this.facilityObj)
      .then(payload => {
        this.systemService.off();
        this.systemService.announceSweetProxy(
          "Unit removed successfully",
          "info"
        );
      })
      .catch(err => {
        this.systemService.off();
        this.systemService.announceSweetProxy(
          "There was an error while removing this unit",
          "error"
        );
      });
  }
  deptEditNameToggle() {
    this.deptEditNameIcoShow = !this.deptEditNameIcoShow;
  }
  deptEditShortNameToggle() {
    this.deptEditShortNameIcoShow = !this.deptEditShortNameIcoShow;
  }
  deptEditDescToggle() {
    this.deptEditDescIcoShow = !this.deptEditDescIcoShow;
  }

  unitEditNameToggle() {
    this.unitEditNameIcoShow = !this.unitEditNameIcoShow;
  }
  unitEditShortNameToggle() {
    this.unitEditShortNameIcoShow = !this.unitEditShortNameIcoShow;
  }
  unitEditDescToggle() {
    this.unitEditDescIcoShow = !this.unitEditDescIcoShow;
  }

  newDeptModal_show() {
    this.modal_on = false;
    this.newDeptModal_on = true;
    this.innerMenuShow = false;
  }
  newUnitModal_show() {
    this.modal_on = false;
    this.newUnitModal_on = true;
    this.innerMenuShow = false;
  }
  close_onClick(message: boolean): void {
    this.newDept = false;
    this.newUnit = false;
    if (message === true) {
      this.getFacility();
    }
  }
  editUnit(unit) {
    this.selectedUnit = unit;
    this.modal_on = false;
    this.newUnitModal_on = true;
    this.newDeptModal_on = false;
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== "submenu_ico") {
      this.innerMenuShow = false;
    }
  }
  getClinicCount(unit) {
    return unit.clinics.length;
  }

  showUnit_selectedDepartmentUnit(dept) {
    if (this.selectedDepartment !== undefined) {
      return dept._id === this.selectedDepartment._id;
    }
    return false;
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
  newDept_onClick() {
    this.selectedDepartment = undefined;
    this.selectedUnit = undefined;
    this.newDept = true;
  }
  newUnit_onClick(dept) {
    this.selectedDepartment = dept;
    this.selectedUnit = undefined;
    this.newUnit = true;
  }
  editUnit_onClick(dept, unit) {
    this.selectedDepartment = dept;
    this.selectedUnit = unit;
    this.newUnit = true;
  }
  editDept_onClick(dept) {
    this.selectedDepartment = dept;
    this.newDept = true;
  }
  getActiveDepartments() {
    return this.facilityObj.departments.filter(x => x.isActive);
  }
  getActiveUnits(units) {
    this.getClinics(units.filter(x => x.isActive));
    return units.filter(x => x.isActive);
  }

  getClinics(units){
    units.forEach(unit => {
      unit.clinics.forEach(clinics => {
        this.clinic = clinics.clinicName;
      });
    });
  }
}
