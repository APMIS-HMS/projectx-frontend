import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonService, CompanyHealthCoverService, CorporateFacilityService,
   FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Person, PersonPrincipal, Department, CompanyHealthCover } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedCompanyHealthCover: CompanyHealthCover = <CompanyHealthCover>{};
  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmNewEmp: FormGroup;
  selectedPerson: Person = <Person>{};
  departments: Department[] = [];
  people: Person[] = [];

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private personService: PersonService,
    public facilityService: FacilitiesService,
    private companyHealthCoverService: CompanyHealthCoverService,
    private corporateFacilityService: CorporateFacilityService) { }

  ngOnInit() {
    this.getDepartment();
    this.addNew();
    this.frmNewEmp.controls['empName'].valueChanges.debounceTime(400).subscribe(value => {
      this.selectedPerson = <Person>{};
      this.validateApmis(value);
    });


    let subscribeForPerson = this.frmNewEmp.controls['empName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Person[]) => this.personService.find({
        query:
        { search: this.frmNewEmp.controls['empName'].value }
      }).
        then(payload => {
          this.people = payload.data;
        }));

    subscribeForPerson.subscribe((payload: any) => {
    });



  }
  retrievedPrincipalRecord(personId) {
    this.companyHealthCoverService.find({
      query: {
        'personFacilityPrincipals.personId': personId,
        corporateFacilityId: this.selectedCompanyHealthCover._id
      }
    })
      .then(payload => {
        if (payload.data.length > 0) {
          this.selectedCompanyHealthCover = payload.data[0];
        }
      });
  }
  addNew() {
    this.frmNewEmp = this.formBuilder.group({
      empName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      empDept: ['', []],
      empId: ['', [<any>Validators.required]],
      personId: ['', [Validators.required]]
    });
  }
  validateApmis(value) {
    this.personService.find({
      query: { apmisId: value }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.selectedPerson = payload.data[0];
        this.frmNewEmp.controls['personId'].setValue(this.selectedPerson._id);
        this.retrievedPrincipalRecord(this.selectedPerson._id);
      }
    });
  }
  onSelectPerson(person: Person) {
    this.selectedPerson = person;
    this.frmNewEmp.controls['empName'].setValue(this.selectedPerson.apmisId);
  }
  getDepartment() {
    this.departments = this.selectedCompanyHealthCover.corporateFacility.departments;
  }

  close_onClick() {
    this.closeModal.emit(true);
    if (this.selectedCompanyHealthCover.personFacilityPrincipals === undefined) {
      this.selectedCompanyHealthCover.personFacilityPrincipals = [];
    }
  }
  newUnit(model: any, valid: boolean) {
    if (valid) {
      let principal: PersonPrincipal = <PersonPrincipal>{};
      let principalList = this.selectedCompanyHealthCover.personFacilityPrincipals
        .filter(x => x.personId === this.selectedPerson._id);
      if (principalList.length > 0) {
        return;
      } else {
        principal.departmentId = this.frmNewEmp.controls['empDept'].value;
        principal.personId = this.frmNewEmp.controls['personId'].value;
        principal.dependants = [];
        this.selectedCompanyHealthCover.personFacilityPrincipals.push(principal);
        this.companyHealthCoverService.update(this.selectedCompanyHealthCover)
          .then(payload => {
            this.selectedCompanyHealthCover = payload;
            this.addNew();
            this.close_onClick();
          });
      }
    }
  }

}
