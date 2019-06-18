import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  Facility
} from '../../../../../models/index';

@Component({
  selector: 'app-patient-immunization',
  templateUrl: './patient-immunization.component.html',
  styleUrls: ['./patient-immunization.component.scss']
})
export class PatientImmunizationComponent implements OnInit {
  @Input() patient;
  facility: Facility = <Facility>{};
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;
  docDetail_view = false;

  administer = true;
  documentation = false;

  constructor(
    private _locker: CoolLocalStorage
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
  }

  administer_click(){
    this.administer = true;
    this.documentation = false;
  }
  doc_click(){
    this.administer = false;
    this.documentation = true;
  }

  addProblem_show(e) {
    this.addProblem_view = true;
  }
  addAllergy_show(e) {
    this.addAllergy_view = true;
  }
  addHistory_show(e) {
    this.addHistory_view = true;
  }
  addVitals_show(e) {
    this.addVitals_view = true;
  }

  close_onClick(message: boolean): void {
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }

}
