import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-immunizationTally',
  templateUrl: './immunizationTally.component.html',
  styleUrls: ['./immunizationTally.component.scss']
})
export class immunizationTallyComponent implements OnInit {
  dateRange: any;
  loadIndicatorVisible = false;
  showNewEntry: any;
  constructor() { }

  ngOnInit() {
  }
  back_registers() {}

  setReturnValue(event) {}

  newEntry() {}

  switcher_onClick() {}
}
