import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, FacilityModuleService, DepartmentService } from '../../../../../services/facility-manager/setup/index';
import { FacilityModule, Facility, Department } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
    selector: 'app-unit-component',
    templateUrl: './unit-component.component.html',
    styleUrls: ['./unit-component.component.scss']
})
export class UnitComponentComponent implements OnInit {
    @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
    @ViewChild('unititem') unititem;
    @Input() unit: any;
    @Input() department: Department;
    @Input() facility: Facility;
    modal_on = false;
    newDeptModal_on = false;
    newUnitModal_on = false;
    count = '';

    innerMenuShow = false;

    deptsObj: Department[] = [];
    deptObj: Department = <Department>{};

    //Department icons nav switches
    deptHomeContentArea = true;
    deptDetailContentArea = false;
    deptEditContentArea = false;

    //Department list fields edit icon states
    deptEditNameIcoShow = false;
    deptEditShortNameIcoShow = false;
    deptEditDescIcoShow = false;

    unitEditNameIcoShow = false;
    unitEditShortNameIcoShow = false;
    unitEditDescIcoShow = false;
    unitEditClinicIcoShow = false;
    unitEditClinicIcoShow2 = false;

    deptNameEdit = new FormControl();
    deptshortNameEdit = new FormControl();
    deptDescEdit = new FormControl();

    unitNameEdit = new FormControl();
    unitshortNameEdit = new FormControl();
    unitDescEdit = new FormControl();
    constructor(private facilityService: FacilitiesService,
        private locker: CoolLocalStorage) {
        this.facilityService.listner.subscribe(payload => {
            this.facility = payload;
        })
    }

    updateFacility() {
        this.facilityService.update(this.facility).then(payload => {
        },
            error => {
            })
    }
    updateDepartmentProperties(value: any) {
        let id = value._id;
        this.facility.departments.forEach((item, i) => {
            if (item._id == id) {
                item = value;
            }
        })
    }
    updateUnitProperties(prop: any, value: any) {
        let units = this.department.units;

        this.unit[prop] = value;
        let unit = this.unit;
        units.forEach((item, i) => {
            if (item._id == unit._id) {
                item = unit;
            }
        })
        this.department.units = units;
        this.updateDepartmentProperties(this.department);
    }
    ngOnInit() {

        this.pageInView.emit('Departments');

        this.unitNameEdit.valueChanges.subscribe(value => {
            this.updateUnitProperties("name", value);
        });
        this.unitshortNameEdit.valueChanges.subscribe(value => {
            this.updateUnitProperties("shortName", value);
        });
        this.unitDescEdit.valueChanges.subscribe(value => {
            // do something with value here
        });
        //this.getFacility();
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
    unitEditNameSubmit() {
        this.updateFacility();
        this.unitEditNameIcoShow = !this.unitEditNameIcoShow;
    }
    unitEditShortNameToggle() {
        this.unitEditShortNameIcoShow = !this.unitEditShortNameIcoShow;
    }
    unitEditShortNameSubmit() {
        this.updateFacility();
        this.unitEditDescIcoShow = !this.unitEditDescIcoShow;
    }
    unitEditDescToggle() {
        this.unitEditDescIcoShow = !this.unitEditDescIcoShow;
    }
    unitEditDescSubmit() {
        this.updateFacility();
        this.unitEditDescIcoShow = !this.unitEditDescIcoShow;
    }
    unitEditClinicToggle(){
        this.unitEditClinicIcoShow = !this.unitEditClinicIcoShow;
    }
    unitEditClinicSubmit(){
        this.unitEditClinicIcoShow = !this.unitEditClinicIcoShow;
    }
    unitEditClinicToggle2(){
        this.unitEditClinicIcoShow2 = !this.unitEditClinicIcoShow2;
    }
    unitEditClinicSubmit2(){
        this.unitEditClinicIcoShow2 = !this.unitEditClinicIcoShow2;
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
        this.modal_on = false;
        this.newUnitModal_on = false;
        this.newDeptModal_on = false;
    }
    innerMenuToggle() {
        this.innerMenuShow = !this.innerMenuShow;
    }
    innerMenuHide(e) {
        if (e.srcElement.id != "submenu_ico") {
            this.innerMenuShow = false;
        }
    }

}