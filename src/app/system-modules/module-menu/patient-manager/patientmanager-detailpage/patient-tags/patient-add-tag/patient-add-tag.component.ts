import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-patient-add-tag',
  templateUrl: './patient-add-tag.component.html',
  styleUrls: ['./patient-add-tag.component.scss']
})
export class PatientAddTagComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'you have unresolved errors';
  public frmNewtag: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewtag = this.formBuilder.group({
      tagName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
