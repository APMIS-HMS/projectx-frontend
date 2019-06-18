import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-tags',
  templateUrl: './patient-tags.component.html',
  styleUrls: ['./patient-tags.component.scss']
})
export class PatientTagsComponent implements OnInit {

  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;
  docDetail_view = false;
  addTag_pop = false;
  patient:any;
  selectedDocument:any;
  constructor() { }

  ngOnInit() {
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
  addTag_popup() {
    this.addTag_pop = true;
  }

  close_onClick(message: boolean): void {
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
    this.addTag_pop = false;
  }

}
