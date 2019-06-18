import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-opd-entry2',
  templateUrl: './new-opd-entry2.component.html',
  styleUrls: ['./new-opd-entry2.component.scss', '../../daily-antenatal/new-antenatal-entry/new-antenatal-entry.component.scss']
})
export class NewOpdEntry2Component implements OnInit {

  public frm_OPDPgCourse: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';
  newPg1 = false;
  newPg2 = true;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_OPDPgCourse = this.formBuilder.group({
      /* register: ['', [<any>Validators.required]],
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
      postnatal1: ['', [<any>Validators.required]], */
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