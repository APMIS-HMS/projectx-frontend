import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-new-hfmrecords-entry',
  templateUrl: './new-hfmrecords-entry.component.html',
  styleUrls: ['./new-hfmrecords-entry.component.scss']
})
export class NewHfmrecordsEntryComponent implements OnInit {

  public frm_UpdateHFM: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.frm_UpdateHFM = this.formBuilder.group({
    
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
