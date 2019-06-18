import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-new-child-entry',
  templateUrl: './new-child-entry.component.html',
  styleUrls: ['./new-child-entry.component.scss']
})
export class NewChildEntryComponent implements OnInit {

  public frm_UpdateCIR: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.frm_UpdateCIR = this.formBuilder.group({
    
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
