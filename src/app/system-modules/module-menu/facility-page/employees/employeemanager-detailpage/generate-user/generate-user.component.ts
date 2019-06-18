import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
  Feature, Role, Person, User, CrudModel,
  AccessControl, Facility, Employee
} from '../../../../../../models/index';
import { UserService, PersonService, FacilitiesService, EmployeeService } from '../../../../../../services/facility-manager/setup/index';
import { FeatureModuleService } from '../../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute, Router } from '@angular/router';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-generate-user',
  templateUrl: './generate-user.component.html',
  styleUrls: ['./generate-user.component.scss']
})
export class GenerateUserComponent implements OnInit {
  @Output() selectedEmployee: EventEmitter<Employee> = new EventEmitter<Employee>();
  selectedPerson: Person = <Person>{};

  selectedFacility: Facility = <Facility>{};
  selectedAccessControl: AccessControl = <AccessControl>{};
  accessControlList: AccessControl[] = [];
  accessControlListString: string[] = [];
  selectedEmployeeId: any;
  modal_on = false;

  simpleProducts: any[] = [];

  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private employeeService: EmployeeService,
    private personService: PersonService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    public facilityService: FacilitiesService,
    private systemModuleService:SystemModuleService,
    private accessControlService: AccessControlService) {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.selectedEmployeeId = params['empId'];
      if (isNaN(id)) {
        this.personService.get(id, {}).then(payload => {
          this.selectedPerson = payload;
          this.userService.find({ query: { personId: id } }).then(users => {
            if (users.data.length > 0) {
              users.data[0].facilitiesRole.forEach((item, i) => {
                if (item.feature !== undefined) {
                  if (!this.checkAccessControlList(item.feature.accessControlId)) {
                    this.accessControlListString.push(item.feature.accessControlId);
                  }
                }
              });
              this.getAccessList();
            } else {
              // this.getAccessList();
            }
          });
        });
      }
    });
  }
  checkAccessControlList(id: string) {
    return this.accessControlListString.filter(x => x === id).length > 0;
  }
  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  navEpDetail(val: Employee) {
    this.router.navigate(['/dashboard/facility/generate-user', val._id]);
  }
  getAccessList() {
    this.accessControlService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.accessControlList = payload.data;
      this.accessControlList.forEach((itemj, j) => {
        this.accessControlListString.forEach((itemk, k) => {
          if (itemk === itemj._id) {
            itemj.isChecked = true;
          }
        });
        itemj.featureList.forEach((item, i) => {
          item.cruds = [];
          for (let ii = 0; ii < 4; ii++) {
            if (ii === 0) {
              item.cruds.push(<CrudModel>{ id: ii + 1, isChecked: false, name: 'Create' });
            } else if (ii === 1) {
              item.cruds.push(<CrudModel>{ id: ii + 1, isChecked: false, name: 'Read' });
            } else if (ii === 2) {
              item.cruds.push(<CrudModel>{ id: ii + 1, isChecked: false, name: 'Update' });
            } else if (ii === 3) {
              item.cruds.push(<CrudModel>{ id: ii + 1, isChecked: false, name: 'Delete' });
            }

          }
        });
      });
    });
  }
  populateFacilityRole(selectedFeatures: any[], accessControlId: string) {
    const retVal = [];
    selectedFeatures.forEach((item, i) => {
      const innerChecked = item.cruds.filter(x => x.isChecked === true);
      const crudList = [];
      innerChecked.forEach((y, x) => {
        crudList.push(y.name);
      });
      retVal.push(<Role>{
        facilityId: this.selectedFacility._id,
        feature: <Feature>{
          featureId: item._id,
          accessControlId: accessControlId,
          crud: crudList
        }
      });
    });
    return retVal;
  }
  person_onClick() {
    this.router.navigate(['/dashboard/facility/employees', this.selectedEmployeeId]);
  }
  generate() {
    this.systemModuleService.on();
    const user = <User>{
      email: this.selectedPerson.apmisId,
      personId: this.selectedPerson._id,
      facilitiesRole: []
    };
    this.accessControlList.filter(y => y.isChecked).forEach((item, i) => {
      const checkedParent = item.featureList.filter(x => x.checked === true);
      this.populateFacilityRole(checkedParent, item._id).forEach((q, y) => {
        user.facilitiesRole.push(q);
      });
    });
    this.userService.generateUser(user).then(payload => {
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('User Generated Successfully', 'success', null, null, null, null, null, null, null);
      this.getAccessList();
    },error =>{
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('There was a problem creating user. Please try again later.','error');
    });
  }
}
