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
  selector: 'app-add-other',
  templateUrl: './add-other.component.html',
  styleUrls: ['./add-other.component.scss']
})
export class AddOtherComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() networkJoined: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = "";
  public facilityForm1: FormGroup;

  searchedFacilities: any;
  LoggedInFacility;
  selectedFacilityIds = [];
  facilityMember;
  searchedLength;

  removeFacilities = [];
  facRemove: any = <any>{};
  fac: any = <any>{};

  checboxLen;
  uncheck;

  loading;

  constructor(private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    public systemModuleService: SystemModuleService,
    private userService: UserService,
    private personService: PersonService,
    private locker: CoolLocalStorage,
    private systemService: SystemModuleService) { }

  ngOnInit() {
    this.LoggedInFacility = <any>this.locker.getObject("selectedFacility");
    this.facilityForm1 = this.formBuilder.group({
      facilitySearch: ['', []]
    });


    this.facilityForm1.controls['facilitySearch'].valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(value => this.searchEntries(value))
      .subscribe((por: any) => {
        this.searchedFacilities = por;
        this.searchedLength = por.length;
      })


  }
  searchEntries(value) {
    if (value.length < 3) {
      return Observable.of({ data: [] })
    }
    return this.facilityService.searchNetworks(this.LoggedInFacility._id, { query: { name: value, isMemberOf: true } });
  }
  close_onClick($event) {
    this.closeModal.emit(true);
  }


  update() {
    this.loading = true;
    this.systemModuleService.on();
    this.facRemove = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.removeFacilities
    }
    this.fac = {
      hostId: this.LoggedInFacility._id,
      memberFacilities: this.selectedFacilityIds
    }
    this.facilityService.joinNetwork(this.facRemove, true).then(paylRemove => {
      this.facilityService.joinNetwork(this.fac, false).then(payload => {
        this.facilityService.get(this.fac.hostId, {}).then(payl => {
          this.loading = false;
          let facc = payl.data;
          this.systemService.announceSweetProxy('Network has successfully been Updated!', 'success');
          this.close_onClick(true);
          this.systemModuleService.off();
        }, error => {
          this.systemModuleService.off();
        });

      }, error => {
        this.loading = false;
        this.systemModuleService.off();
        this.systemService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
      });

    }, error => {
      this.systemModuleService.off();
      this.systemService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
    });
  }

  pickFacilitiesMemberOf(event, id) {
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

  sweetAlertCallback(result) {
    this.update();
    this.networkJoined.emit(true);
  }
  confirmUpdate(from) {
    const question = 'Are you sure you want to join this netweork?';
    this.systemModuleService.announceSweetProxy(question, 'question', this, null, null, 'update');
  }
}
