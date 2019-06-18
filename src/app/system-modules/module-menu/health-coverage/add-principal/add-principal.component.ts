import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PersonService, FacilitiesService, FamilyHealthCoverService } from '../../../../services/facility-manager/setup/index';
import { Facility, PersonPrincipal, FamilyHealthCover, Person } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-principal',
  templateUrl: './add-principal.component.html',
  styleUrls: ['./add-principal.component.scss']
})
export class AddPrincipalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'you have unresolved errors';
  people: Person[] = [];
  selectedPerson: Person = <Person>{};
  selectedFacility: Facility = <Facility>{};
  public frmNewPrincipal: FormGroup;

  constructor(private formBuilder: FormBuilder,
    public facilityService: FacilitiesService,
    private locker: CoolLocalStorage,
    private familyHealthCoverService: FamilyHealthCoverService,
    private personService: PersonService) { }

  ngOnInit() {
    this.addNew();
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    const away = this.frmNewPrincipal.controls['principalName'].valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .switchMap((term: Person[]) => this.personService.find({
        query:
        { search: this.frmNewPrincipal.controls['principalName'].value }
      }).
        then(payload => {
          // this.selectedPerson = <Person>{};
          this.people = payload.data;
        }));

    away.subscribe((payload: any) => {
    });

  }
  onSelectPerson(person: Person) {
    this.frmNewPrincipal.controls['principalName'].setValue(person.lastName + ' ' + person.otherNames + ' ' +
      person.firstName + ' (' + person.apmisId + ')');
    this.selectedPerson = person;
  }
  addNew() {
    this.frmNewPrincipal = this.formBuilder.group({
      principalName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  newFamilyCover(model: any, valid: boolean) {
    const newFamilyCover: FamilyHealthCover = <FamilyHealthCover>{};
    newFamilyCover.facilityId = this.selectedFacility._id;
    newFamilyCover.familyPrincipalPersonId = this.selectedPerson._id;
    newFamilyCover.dependents = [];
    this.familyHealthCoverService.create(newFamilyCover).then(payload => {
    });
  }
}
