import { AuthFacadeService } from './../../../../../service-facade/auth-facade.service';
import { error } from "selenium-webdriver";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { CoolLocalStorage } from "angular2-cool-storage";
import { SystemModuleService } from "app/services/module-manager/setup/system-module.service";

import { FeatureModuleService } from "../../../../../../services/module-manager/setup/index";

import {
  CountriesService,
  FacilitiesService,
  UserService,
  PersonService,
  EmployeeService,
  GenderService,
  RelationshipService,
  MaritalStatusService
} from "../../../../../../services/facility-manager/setup/index";

@Component({
  selector: "app-employee-access-roles",
  templateUrl: "./employee-access-roles.component.html",
  styleUrls: ["./employee-access-roles.component.scss"]
})
export class EmployeeAccessRolesComponent implements OnInit {
  public userPrivileges: FormGroup;
  FormBuilder;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedEmployee;
  mainErr = true;
  errMsg = "";
  roles: any = [];

  rolesPicked: any = [];
  checboxLen: any;
  rolesRemoved: any = [];

  selectedFacility: any;
  // selectedEmployee: any;
  loggedInUser: any;
  loading: any;

  constructor(
    private formBuilder: FormBuilder,
    private featureService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private facilityService: FacilitiesService,
    private systemModuleService: SystemModuleService,
    private authFacadeService:AuthFacadeService
  ) {}

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject("selectedFacility");
    let auth = <any>this.locker.getObject("auth");
    this.loggedInUser = auth.data;
    this.getRoles();
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  getRoles() {
    this.featureService
      .getFacilityRoles(this.selectedEmployee.personId, {
        query: {
          facilityId: this.selectedFacility._id
        }
      })
      .then(payload => {
        if (payload.status === "success") {
          this.roles = payload.data;
        }
      });
  }

  pickRoles(event, id) {
    var checkedStatus = event.checked;
    if (checkedStatus) {
      let ind = this.rolesPicked.indexOf(id.toString());

      if (ind > -1) {
      } else {
        this.rolesPicked.push(id.toString());
      }
    } else {
      let ind = this.rolesPicked.indexOf(id.toString());
      this.rolesPicked.splice(ind, 1);

      let indr = this.rolesRemoved.indexOf(id.toString());
      if (indr > -1) {
      } else {
        this.rolesRemoved.push(id.toString());
      }
    }

    this.checboxLen = this.rolesPicked.length;
  }

  saveRoles() {
    this.loading = true;
    let text = "You are about to assign roles to this employee";
    this.systemModuleService.announceSweetProxy(text, "question", this);
  }

  createRoles() {
    var data = {
      personId: this.selectedEmployee.personId,
      facilityId: this.selectedFacility._id,
      roles: this.rolesPicked,
      rolesRemoved:this.rolesRemoved
    };
    this.featureService.assignUserRole(data,{facilityId:this.selectedFacility._id}).then(
      payload => {
        this.loading = false;
        let text = "Selected roles applied to this employee successfully";
        this.systemModuleService.announceSweetProxy(text, 'success', null, null, null, null, null, null, null);
        this.authFacadeService.getUserAccessControls(true).then(payload =>{
          this.closeModal.emit(true);
        });
      },
      error => {}
    );
  }

  sweetAlertCallback(result) {
    if (result.value) {
      this.createRoles();
    }
  }

  enable(){
    const result = this.loading;
    return !result;
  }
  disable(){
    const result = this.loading;
    return result;
  }
}
