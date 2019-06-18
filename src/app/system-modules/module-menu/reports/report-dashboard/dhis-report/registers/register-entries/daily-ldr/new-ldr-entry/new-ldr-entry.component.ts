import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-ldr-entry',
  templateUrl: './new-ldr-entry.component.html',
  styleUrls: ['./new-ldr-entry.component.scss']
})
export class NewLdrEntryComponent implements OnInit {

  public frmLDR_Update: FormGroup;
  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmLDR_Update = this.formBuilder.group({
      patient:  ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  next_onClick() {}
}
