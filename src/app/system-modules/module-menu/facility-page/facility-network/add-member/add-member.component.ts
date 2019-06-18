import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() memberAdded: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = "";
  public facilityForm1: FormGroup;

  searchedFacilities: any;
  LoggedInFacility;
  selectedFacilityIds = [];
  facilityMember;
  searchedLength;

  removeFacilities = [];

  checboxLen;
  uncheck;

  loading;

  constructor(private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private systemModuleService: SystemModuleService,
    private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject("selectedFacility");
    this.facilityForm1 = this.formBuilder.group({
      facilitySearch: ['', []]
    });

    this.selectedFacilityIds = this.LoggedInFacility.memberFacilities;

    this.facilityForm1.controls['facilitySearch'].valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(value => this.searchEntries(value))
      .subscribe((por: any) => {
        this.searchedFacilities = por;
        this.searchedLength = por.length;
      },err=>{
      })
  }
  searchEntries(value) {
    if (value.length < 3) {
      return Observable.of({ data: [] })
    }
    return this.facilityService.searchNetworks(this.LoggedInFacility._id, { query: { name: value, isMemberOf: false } });
  }
  close_onClick($event) {
    this.closeModal.emit(true);
  }

  pickMemberFacilities(event, id) {
    this.uncheck = true;
    var checkedStatus = event.srcElement.checked;
    if (checkedStatus) {
      let ind = this.selectedFacilityIds.indexOf(id.toString());
      let indr = this.removeFacilities.indexOf(id.toString());
      this.removeFacilities.splice(indr, 1);
      if (ind > -1) {

      } else {
        this.selectedFacilityIds.push(id.toString());
      }
    } else {
      let ind = this.selectedFacilityIds.indexOf(id.toString());
      this.selectedFacilityIds.splice(ind, 1);

      let indr = this.removeFacilities.indexOf(id.toString());
      if (indr > -1) {

      } else {
        this.removeFacilities.push(id.toString());
      }
    }

    this.checboxLen = this.selectedFacilityIds.length;
  }

  add() {
    this.systemModuleService.on();
    this.loading = true;
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.addNetwork(fac, false).then(payload => {
      this.facilityService.get(fac.hostId, {}).then(payl => {
        this.loading = false;
        this.systemModuleService.off();
        let facc = payl.data;
        this.close_onClick(true);
        this.systemModuleService.announceSweetProxy('Facility Network Updated Successfully', 'success', null, null, null, null, null, null, null);
      })
    }, error => {
      this.systemModuleService.off();
    });
  }

  confirmUpdate(from){
    const question = 'Are you sure you want to add/remove from netweork?';
    this.systemModuleService.announceSweetProxy(question, 'question', this, null, null, 'update');
  }
  update() {
    this.systemModuleService.on();
    this.loading = true;
    let facRemove = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.removeFacilities
    }
    let fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.addNetwork(facRemove, true).then(paylRemove => {
      this.facilityService.addNetwork(fac, false).then(payload => {
        this.facilityService.get(fac.hostId, {}).then(payl => {
          this.loading = false;
          let facc = payl.data;
          this.close_onClick(true);
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Facility Network Updated Successfully', 'success', null, null, null, null, null, null, null);
        })

      }, error => {
        this.systemModuleService.off();
      });

    }, error => {
      this.systemModuleService.off();
    });
  }

  sweetAlertCallback(result, from){
    if(result.value){
      if(from === 'update'){
        this.update();
      }else{
        this.add();
      }
    }
  }
}
