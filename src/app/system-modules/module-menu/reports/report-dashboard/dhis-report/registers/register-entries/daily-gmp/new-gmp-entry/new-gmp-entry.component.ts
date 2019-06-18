import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
  selector: 'app-new-gmp-entry',
  templateUrl: './new-gmp-entry.component.html',
  styleUrls: ['./new-gmp-entry.component.scss']
})
export class NewGmpEntryComponent implements OnInit {

  public frm_Update: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frm_Update = this.formBuilder.group({
      patient: ['', [<any>Validators.required]]
    });
  }
  
  close_onClick(){
    this.closeModal.emit(true);
  }
  next_onClick() {}
}
