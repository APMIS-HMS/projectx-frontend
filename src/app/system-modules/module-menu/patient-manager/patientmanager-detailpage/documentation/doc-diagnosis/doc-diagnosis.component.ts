import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-doc-diagnosis',
  templateUrl: './doc-diagnosis.component.html',
  styleUrls: ['./doc-diagnosis.component.scss']
})
export class DocDiagnosisComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() diagnosis: EventEmitter<any> = new EventEmitter<any>();
  @Output() removediagnosis: EventEmitter<any> = new EventEmitter<any>();

  _tempDiagnosis;

  diagnoses = [];
  // <mat-option [value]="Principal">Principal</mat-option>
  // <mat-option [value]="Associated">Associated</mat-option>
  // <mat-option [value]="Complication">Complication</mat-option>
  // <mat-option [value]="Working">Working</mat-option>
  // <mat-option [value]='Rule Out'>Rule Out</mat-option>
  types = [
    {
      value: 'Principal',
      name: 'Principal'
    },
    {
      value: 'Associated',
      name: 'Associated'
    },
    {
      value: 'Complication',
      name: 'Complication'
    },
    {
      value: 'Working',
      name: 'Working'
    },
    {
      value: 'Rule Out',
      name: 'Rule Out'
    },
  ]

  tab_all = true;
  tab_favourite = false;
  tab_patient = false;
  tab_recent = false;

  addDiagnosisForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'diagnosises';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';

  favorite_type = new FormControl();
  recently_type = new FormControl();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.addDiagnosisForm = this.fb.group({
      type: ['', [<any>Validators.required]],
      diagnosis: ['', [<any>Validators.required]]
    });

    this.addDiagnosisForm.controls['diagnosis'].valueChanges.subscribe(value => {

      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          name: { $regex: -1, '$options': 'i' }, $sort:{name:1},
          $limit: 100
        }
      } else {
        this.apmisLookupQuery = {
          name: { $regex: value, '$options': 'i' }, $sort:{name:1},
          $limit: 100
        }
      }
    });
  }

  tabAll_click() {
    this.tab_all = true;
    this.tab_favourite = false;
    this.tab_patient = false;
    this.tab_recent = false;
  }
  tabFavourite_click() {
    this.tab_all = false;
    this.tab_favourite = true;
    this.tab_patient = false;
    this.tab_recent = false;
  }
  tabPatient_click() {
    this.tab_all = false;
    this.tab_favourite = false;
    this.tab_patient = true;
    this.tab_recent = false;
  }
  tabRecent_click() {
    this.tab_all = false;
    this.tab_favourite = false;
    this.tab_patient = false;
    this.tab_recent = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this._tempDiagnosis = value;
  }

  add_onClick() {
    if (this._tempDiagnosis.name && this._tempDiagnosis.code) {
      const type = this.addDiagnosisForm.controls.type.value;
      const obj = this._tempDiagnosis;
      obj.name = obj.name + '---' + type;
      this.diagnoses.push(obj);
      this.diagnosis.emit(obj);
    }
  }

  deleteDiagonis(item) {
    this.diagnoses = this.diagnoses.filter(e => e !== item);
    this.removediagnosis.emit(item);
  }

  done() {
    this.closeModal.emit(true);
  }
}
