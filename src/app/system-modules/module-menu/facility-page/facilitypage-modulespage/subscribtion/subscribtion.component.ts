import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-subscribtion',
  templateUrl: './subscribtion.component.html',
  styleUrls: ['./subscribtion.component.scss']
})
export class SubscribtionComponent implements OnInit {
  mainErr = true;
  errMsg = 'You have unresolved errors';
  searchAccount = new FormControl();
  plan = new FormControl();
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  subscribe_click() {

  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
