import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-history',
  templateUrl: './add-history.component.html',
  styleUrls: ['./add-history.component.scss']
})
export class AddHistoryComponent implements OnInit {

  historyFormCtrl: FormControl;

  mainErr = true;
  errMsg = 'you have unresolved errors';

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private formBuilder: FormBuilder) { 
  }

  ngOnInit() {
  }

  close_onClick() {
      this.closeModal.emit(true);
  }

}
