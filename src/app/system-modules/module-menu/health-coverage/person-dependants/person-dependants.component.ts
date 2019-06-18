import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Person, PersonPrincipal, PersonDependant, Relationship, CompanyHealthCover, FamilyHealthCover } from '../../../../models/index';
import { FacilitiesService, PersonService, RelationshipService, FamilyHealthCoverService, CompanyHealthCoverService }
  from '../../../../services/facility-manager/setup/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-person-dependants',
  templateUrl: './person-dependants.component.html',
  styleUrls: ['./person-dependants.component.scss']
})
export class PersonDependantsComponent implements OnInit {
  mainErr = true;
  errMsg = 'you have unresolved errors';
  showFrmDependant = false;
  public frmAddDepd: FormGroup;
  selectedPerson: Person = <Person>{};
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedPersonPrincipal: PersonPrincipal = <PersonPrincipal>{};
  @Input() selectedActiveCompanyHealthCover: CompanyHealthCover = <CompanyHealthCover>{};
  @Input() selectedActiveFamilyHealthCover: FamilyHealthCover = <FamilyHealthCover>{};
  @Input() dependantType: string = '';

  relationships: Relationship[] = [];
  dependants: PersonDependant[] = [];

  constructor(private formBuilder: FormBuilder,
    private relationshipService: RelationshipService,
    private companyHealthCoverService: CompanyHealthCoverService,
    private familyHealthCoverService: FamilyHealthCoverService,
    private personService: PersonService,
    public facilityService: FacilitiesService) { }


  ngOnInit() {
    if (this.dependantType === 'Company') {
      this.companyHealthCoverService.get(this.selectedActiveCompanyHealthCover._id, {})
        .then(payload => {
          this.fillDependants(this.getPrincipalFromCompanyCover(payload));
        });
    }
    if (this.dependantType === 'Family') {
      if (this.selectedActiveFamilyHealthCover._id !== undefined) {
        this.familyHealthCoverService.get(this.selectedActiveFamilyHealthCover._id, {})
          .then(payload => {
            this.fillDependants(this.selectedPersonPrincipal);
          });
      }
    }
    this.getRelationships();
    this.addNew();
    this.frmAddDepd.controls['dependant'].valueChanges.debounceTime(300).subscribe(value => {
      this.validateApmis(value);
    });
  }
  fillDependants(model: PersonPrincipal) {
    if (this.dependantType === 'Company') {
      this.dependants = [];
      model.dependants.forEach((item, i) => {
        this.dependants.push(item);
      });
    } else {
      this.selectedActiveFamilyHealthCover.dependents.forEach(item => {
        this.dependants.push(item);
      });
    }

  }
  getPrincipalFromCompanyCover(model: CompanyHealthCover) {
    let retVal: PersonPrincipal;
    model.personFacilityPrincipals.forEach((item, i) => {
      if (item._id === this.selectedPersonPrincipal._id) {
        retVal = item;
      }
    });
    this.selectedPersonPrincipal = retVal;
    return retVal;
  }
  getPrincipalFromFamilyCover(model: any) {
    let retVal: PersonPrincipal = model.familyPrincipalPerson;
    return retVal;
  }
  getRelationships() {
    this.relationshipService.findAll().then(payload => {
      this.relationships = payload.data;
    });
  }
  addNew() {
    this.frmAddDepd = this.formBuilder.group({
      dependant: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      relationship: [0, [<any>Validators.required]],
      personId: ['', [<any>Validators.required]]
    });
  }
  validateApmis(value) {
    this.personService.find({
      query: { apmisId: value }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.selectedPerson = payload.data[0];
        this.frmAddDepd.controls['personId'].setValue(this.selectedPerson._id);
      }
    });
  }
  newDepd(valid, val) {
    if (valid) {
      if (val.dependant === '' || val.dependant === ' ' || val.relationship === '' || val.relationship === ' ') {
        this.mainErr = false;
        this.errMsg = 'you left out a required field';
      } else {
        let dependant: PersonDependant = <PersonDependant>{};
        dependant.dependantPersonId = this.selectedPerson._id;
        dependant.relationshipId = this.frmAddDepd.controls['relationship'].value;
        if (this.dependantType === 'Company') {
          this.selectedActiveCompanyHealthCover.personFacilityPrincipals
            .forEach((item, i) => {
              if (item._id === this.selectedPersonPrincipal._id) {
                item.dependants.push(dependant);
                this.companyHealthCoverService.update(this.selectedActiveCompanyHealthCover)
                  .then(payload => {
                    this.selectedActiveCompanyHealthCover = payload;
                    this.selectedPersonPrincipal = this.getPrincipalFromCompanyCover(payload);
                    this.fillDependants(this.selectedPersonPrincipal);
                    this.showFrmDependant = false;
                    this.mainErr = true;
                    this.errMsg = '';
                  }, error => {
                    this.showFrmDependant = true;
                    this.mainErr = false;
                    this.errMsg = 'Dependant not saved, try again!';
                  });
              }
            });
        } else if (this.dependantType === 'Family') {
          let dependant: PersonDependant = <PersonDependant>{};
          dependant.dependantPersonId = this.selectedPerson._id;
          dependant.relationshipId = this.frmAddDepd.controls['relationship'].value;
          this.selectedActiveFamilyHealthCover.dependents.push(dependant);
          this.familyHealthCoverService.update(this.selectedActiveFamilyHealthCover)
            .then(payload => {
              this.selectedActiveFamilyHealthCover = payload;
              this.selectedPersonPrincipal = this.getPrincipalFromFamilyCover(payload);
              this.fillDependants(this.selectedPersonPrincipal);
              this.showFrmDependant = false;
              this.mainErr = true;
              this.errMsg = '';
            },
            error => {
              this.showFrmDependant = true;
              this.mainErr = false;
              this.errMsg = 'Dependant not saved, try again!';
            });
        }
      }
    } else {
      this.mainErr = false;
    }

  }
  removeDependant(model: PersonDependant) {
    if (this.dependantType === 'Company') {
      this.selectedActiveCompanyHealthCover.personFacilityPrincipals.forEach((item, i) => {
        if (item._id === this.selectedPersonPrincipal._id) {
          item.dependants.forEach((itemi, ii) => {
            if (itemi._id === model._id) {
              item.dependants.splice(ii, 1);
              this.dependants.forEach((jitem, jj) => {
                if (jitem._id === model._id) {
                  this.dependants.splice(jj, 1);
                }
              });
            }
          });
        }
      });
      this.companyHealthCoverService.update(this.selectedActiveCompanyHealthCover).then(payload => {
       
      });
    } else {
      this.dependants.forEach((itemi, i) => {
        if (itemi._id === model._id) {
          this.dependants.splice(i, 1);
          this.selectedActiveFamilyHealthCover.dependents.forEach((itemk, k) => {
            if (itemk._id === model._id) {
              this.selectedActiveFamilyHealthCover.dependents.splice(k, 1);
              this.familyHealthCoverService.update(this.selectedActiveFamilyHealthCover)
                .then(kPayload => {
                });
            }
          });
        }
      });
    }
  }
  frmDependantToggle() {
    this.showFrmDependant = !this.showFrmDependant;
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

}
