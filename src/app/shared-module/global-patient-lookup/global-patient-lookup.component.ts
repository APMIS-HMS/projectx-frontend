import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PersonService, FacilitiesService, PatientService } from '../../services/facility-manager/setup/index';
import { Person, Patient, Facility } from '../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-global-patient-lookup',
  templateUrl: './global-patient-lookup.component.html',
  styleUrls: ['./global-patient-lookup.component.scss']
})
export class GlobalPatientLookupComponent implements OnInit {

  txtPatientLookup = new FormControl();
  maximize = false;
  people: Person[] = [];
  selectedFacility: Facility = <Facility>{};
  constructor(private locker: CoolLocalStorage,
    private personService: PersonService,
    private patientService: PatientService,
    public facilityService: FacilitiesService, ) { }

  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    this.txtPatientLookup.valueChanges
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap((term) => Observable.fromPromise(this.patientService.find({
        query:
        {
          search: term,
          facilityId: this.selectedFacility._id
        }
      }))).subscribe((payload: any) => {
        this.people = payload.data;
      });
  }

  toggleLookup() {
    this.maximize = !this.maximize;
  }
  onSelectPerson(patient: Patient) {
    this.patientService.announcePatient(patient);
    this.toggleLookup();
  }
}
