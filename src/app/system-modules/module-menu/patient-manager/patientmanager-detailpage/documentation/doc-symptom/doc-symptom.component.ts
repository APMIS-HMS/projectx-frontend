import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { DurationUnits, DosageUnits } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-doc-symptom',
  templateUrl: './doc-symptom.component.html',
  styleUrls: ['./doc-symptom.component.scss']
})
export class DocSymptomComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() symptom: EventEmitter<any> = new EventEmitter<any>();

  _tempSympton;
  durationUnits: any[] = [];

  addSymptomForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = 'symptoms';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    //add years to duration unit
    this.durationUnits = DurationUnits;
    
    this.addSymptomForm = this.fb.group({
      symptom: ['', [<any>Validators.required]],
      symptomDuration: ['', [<any>Validators.required]],
      
			durationUnit: [ '', [ <any>Validators.required ] ]
    });

    this.addSymptomForm.controls['symptom'].valueChanges.subscribe(value => {
        //symptom might not be in the drop down, it can also be a phrase: rta x 3hrs!!
        //need to solve for this
      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          name: { $regex: -1, '$options': 'i' },
          $limit: 100
        }
      } else {
        this.apmisLookupQuery = {
          name: { $regex: value, '$options': 'i' },
          $limit: 100
        }
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  add_onClick() {
    //console.log(this.addSymptomForm.value);
    this.symptom.emit(this.addSymptomForm.value); //this._tempSympton
    //this.closeModal.emit(true);
   // this.apmisLookupText='';
    this.addSymptomForm.setValue({
      symptom: '',
      symptomDuration: '',
      durationUnit: ''
    });
  }


  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    const isExisting = false;
    this._tempSympton = value;
    //console.log(value);



    // this.loginHMOListObject.companyCovers.forEach(item => {
    //   if (item._id === value._id) {
    //     isExisting = true;
    //   }
    // });
    // if (!isExisting) {
    //   this.selectedCompanyCover = value;
    // } else {
    //   this.selectedCompanyCover = <any>{};
    //   this._notification('Info', 'Selected HMO is already in your list of Company Covers');
    // }
  }

  login_show() {

  }

}
