import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-new-fpr-entry',
  templateUrl: './new-fpr-entry.component.html',
  styleUrls: ['./new-fpr-entry.component.scss', '../../../../nhmis-summary/nhmis-summary.component.scss',
    '../../register-entry/register-entry.component.scss']
})
export class NewFprEntryComponent implements OnInit {

  public frm_UpdateFPR: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'You have unresolved errors';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {

  this.frm_UpdateFPR = this.formBuilder.group({
    
  });
}

close_onClick() {
  this.closeModal.emit(true);
}

next_onClick() {}

}
