import { CountryServiceFacadeService } from './../../../../service-facade/country-service-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  CountriesService, FacilitiesService, UserService,
  PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService,
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';

@Component({
  selector: 'app-empmanager-detailpage',
  templateUrl: './empmanager-detailpage.component.html',
  styleUrls: ['./empmanager-detailpage.component.scss']
})
export class EmpmanagerDetailpageComponent implements OnInit, OnDestroy {
  selectedValue: string;


  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() employee: any;

  editDepartment = false;
  biodatas = false;
  contacts = false;
  nextofkin = false;


  externalContentArea = false;
  contentSecMenuShow = false;
  reportContentArea = false
  modal_on = false;
  changeUserImg = false;
  logoutConfirm_on = false;
  empDetailPg = true;
  selectedDepartment: any;
  selectedNationality: Country;
  selectedState: any;
  selectedLGA: any;
  selectedPerson: Person;
  selectedFacility: Facility = <Facility>{};
  searchControl = new FormControl();
  countryControl = new FormControl();
  stateControl = new FormControl();
  homeCountryControl = new FormControl();
  homeStateControl = new FormControl();
  employees: Employee[] = [];
  genders: Gender[] = [];
  relationships: Relationship[] = [];
  maritalStatuses: MaritalStatus[] = [];
  countries: Country[] = [];
  states: any[] = [];
  lgs: any[] = [];

  homeCountries: Country[] = [];
  homeStates: any[] = [];
  homeCities: any[] = [];
  homeAddress = '';
  selectedUser: User = <User>{};
  loadIndicatorVisible = false;

  createWorkspace = false;
  assignUnitPop = false;
  editBasicPop = false;
  userPrivileges = false;


  departmentbool = false;

  employeeSubscription: Subscription;
  departments: any[] = [];
  constructor(private countryService: CountriesService,
    private employeeService: EmployeeService,
    public facilityService: FacilitiesService,
    private userService: UserService,
    private personService: PersonService,
    private router: Router, private route: ActivatedRoute,
    private toastr: ToastsManager,
    private genderService: GenderService,
    private relationshipService: RelationshipService,
    private maritalStatusService: MaritalStatusService,
    private systemService: SystemModuleService,
    private countryFacadeService: CountryServiceFacadeService,
    private locker: CoolLocalStorage) {
    this.employeeService.listner.subscribe(payload => {
      this.getEmployees();
    });
    this.personService.updateListener.subscribe(payload => {
      this.getEmployee(this.employee);
    });

    this.employeeSubscription = this.employeeService.employeeAnnounced$.subscribe(employee => {
      this.getEmployee(employee);
    });

    this.employeeService.employeeAnnounced$.subscribe(payload =>{
      this.employee = payload;
    });
  }

  ngOnInit() {
    this.prime();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.departments = this.selectedFacility.departments;

    this.countryControl.valueChanges.subscribe(value => {
      this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
        this.states = states;
      }).catch(err => { });
    });
    this.stateControl.valueChanges.subscribe(value => {
      let country = this.countryControl.value;
      if (country && value !== undefined) {
        this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
          this.lgs = lgsAndCities.lgs;
        }).catch(err => {
        });
      }
    });


    this.homeCountryControl.valueChanges.subscribe(value => {
      this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
        this.homeStates = states;
      }).catch(err => { });
    });
    this.homeStateControl.valueChanges.subscribe(value => {
      let country = this.homeCountryControl.value;
      this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
        this.homeCities = lgsAndCities.cities;
      }).catch(err => {
      });
    });

    this.loadRoute();

  }
  prime() {
    this.systemService.on();
    const gender$ = Observable.fromPromise(this.genderService.findAll());
    const relationship$ = Observable.fromPromise(this.relationshipService.findAll());
    const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
    const country$ = Observable.fromPromise(this.countryService.findAll());

    Observable.forkJoin([gender$, relationship$, maritalStatus$, country$]).subscribe((results: any) => {
      this.genders = results[0].data;
      this.relationships = results[1].data;
      this.maritalStatuses = results[2].data;
      this.countries = results[3].data;
      this.homeCountries = results[3].data;
      this.systemService.off();
    }, error => {
      this.systemService.off();
    })
  }
  getEmployee(id) {
    this.systemService.on();
    const auth = <any>this.locker.getObject('auth');
    const employee$ = this.employeeService.get(id, {});
    const user$ = this.userService.find({ query: { personId: auth.data.personId } });
    Observable.forkJoin([Observable.fromPromise(employee$), Observable.fromPromise(user$)]).subscribe(results => {
      this.employee = <Employee>{};
      this.selectedPerson = <Person>{};
      this.loadIndicatorVisible = false;
      this.employee = <any>results[0];
      this.selectedValue = this.employee.departmentId;
      if (this.employee.personDetails.homeAddress == undefined) {
        this.employee.personDetails.homeAddress = {};
      }
      this.selectedPerson = this.employee.personDetails;
      this.getCurrentUser(results[1]);
      this.systemService.off();
    }, error => {
      this.systemService.off();
    });
  }
  getCurrentUser(payload) {
    if (payload.data.length > 0) {
      this.selectedUser = payload.data[0];
    } else {
      this.selectedUser = <User>{};
    }
  }

  generateWorkSpace() {
    this.createWorkspace = !this.createWorkspace;
  }
  generateUnit() {
    this.assignUnitPop = !this.assignUnitPop;
  }
  loadRoute() {
    this.route.params.subscribe((params: any) => {
      this.getEmployee(params.id);
    })
  }
  navEpDetail(val: Employee) {
    this.router.navigate(['/dashboard/employee-manager/employee-manager-detail', val.personId]);
  }
  getEmployees() {
    this.employeeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.employees = payload.data;
    });
  }
  getRelationship(id) {
    const filterRel = this.relationships.filter(x => x._id === id);
    if (filterRel.length > 0) {
      return filterRel[0].name;
    }
    return '';
  }
  getSelectedState() {
    this.selectedNationality.states.forEach((item, i) => {
      if (item._id === this.employee.personDetails.stateOfOriginId) {
        this.selectedState = item;
        this.getSelectedLGA();
      }
    });
  }
  getSelectedLGA() {
    this.selectedState.lgs.forEach((item, i) => {
      if (item._id === this.employee.personDetails.lgaOfOriginId) {
        this.selectedLGA = item;
      }
    });
  }
  getEmployeeDetail(val: any) {
  }
  contentSecMenuToggle() {
    this.contentSecMenuShow = !this.contentSecMenuShow;
  }
  close_onClick(message: boolean): void {
    this.changeUserImg = false;
    this.assignUnitPop = false;
    this.createWorkspace = false;
    this.editBasicPop = false;
    this.userPrivileges = false;

  }
  show_changeUserImg() {
    this.changeUserImg = true;
  }
  innerMenuHide(e) {
    if (
      e.srcElement.className === 'inner-menu1-wrap' ||
      e.srcElement.localName === 'i' ||
      e.srcElement.id === 'innerMenu-ul'
    ) { } else {
      this.contentSecMenuShow = false;
    }
  }

  logoutConfirm_show() {
    this.modal_on = false;
    this.logoutConfirm_on = true;
    this.contentSecMenuShow = false;
  }
  generateUserShow() {
    this.router.navigate(['/dashboard/employee-manager/generate-user', this.employee.personDetails._id]);
    this.contentSecMenuShow = false;
  }
  editUserShow() {
    this.router.navigate(['/dashboard/facility/edit-user',
      this.selectedUser._id, this.employee.personDetails._id, this.employee._id]);
    this.contentSecMenuShow = false;
  }
  toggleActivate() {
    this.employee.isActive = !this.employee.isActive;

    this.employeeService.update(this.employee).then(payload => {
      this.employee = payload;
    },
      error => {
      });
    this.contentSecMenuShow = false;
  }
  empDetailShow(apmisId) {
    this.empDetailPg = true;
    this.contentSecMenuShow = false;
  }
  closeActivate(e) {
    if (e.srcElement.id !== 'contentSecMenuToggle') {
      this.contentSecMenuShow = false;
    }
  }
  ngOnDestroy() {
    this.employeeSubscription.unsubscribe();
  }
  updateEmployee() {
    this.employee.departmentId = this.selectedValue;
    this.employeeService.update(this.employee).then(value => {
      this.employee = value;
      this.systemService.announceSweetProxy('Employee information successfully updated.', 'success');
      this.editDepartment = !this.editDepartment;
    });
  }
  UpdatePerson() {
    // const person = this.employee.personDetails;
    // this.biodatas = !this.biodatas;
    // this.personService.update(person).then(payload => {
    // });
  }
  UpdatePersonContact() {
    // const person = this.employee.personDetails;
    // this.contacts = !this.contacts;
    // this.personService.update(person).then(payload => {
    // }, error => {
    // });
  }
  UpdatePersonNextOfKin() {
    // const person = this.employee.personDetails;
    // this.nextofkin = !this.nextofkin;
    // this.personService.update(person).then(payload => {
    // });
  }
  toggleDepartmentShow() {
    this.editDepartment = !this.editDepartment;
  }
  bioDataShow() {
    this.biodatas = !this.biodatas;
  }
  editBasicPop_show(dept) {
    this.editBasicPop = true;
    if(dept === true){
      this.departmentbool = true;
    }else{
      this.departmentbool = false;
    }

  }
  contactShow() {
    this.contacts = !this.contacts;
  }
  nextofkinShow() {
    this.nextofkin = !this.nextofkin;
  }
  employeeAccessRoleShow() {
    this.userPrivileges = !this.userPrivileges;

  }

}
