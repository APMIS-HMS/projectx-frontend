import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-inavailability',
  templateUrl: './inavailability.component.html',
  styleUrls: ['./inavailability.component.scss']
})
export class InavailabilityComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  facility = new FormControl();
  apmisLookupDisplayKey: any;
  apmisLookupUrl: any;
  apmisLookupQuery: any;
  dateRange: any;
  loadIndicatorVisible: any;
  constructor() { }

  ngOnInit() {
  }
  close_onClick() {
    this.closeModal.emit(true);
  }
  inavailability_click(){}
  setReturnValue(e) {}
}
