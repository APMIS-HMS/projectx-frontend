import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-antenatal-entry',
  templateUrl: './new-antenatal-entry.component.html',
  styleUrls: ['./new-antenatal-entry.component.scss']
})
export class NewAntenatalEntryComponent implements OnInit {

  public frm_UpdateCourse: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';
  newPg1 = true;
  newPg2 = false;
 
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_UpdateCourse = this.formBuilder.group({
      register: ['', [<any>Validators.required]],
      patient: ['', [<any>Validators.required]],
      tt: ['', [<any>Validators.required]],
      parity: ['', [<any>Validators.required]],
      comment: ['', [<any>Validators.required]],
      pregnancyAge: ['', [<any>Validators.required]],
      urinalysisSugar: ['', [<any>Validators.required]],
      urinalysisProtien: ['', [<any>Validators.required]],
      sel_tt: ['', [<any>Validators.required]],
      problem: ['', [<any>Validators.required]],
      referalReason: ['', [<any>Validators.required]],
      postnatal1: ['', [<any>Validators.required]],
    });
  }
  pg2(){
    this.newPg1 = false;
    this.newPg2 = true;
  }
  pg1(){
    this.newPg1 = true;
    this.newPg2 = false;
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  next_onClick(){}
  view(){}

}
