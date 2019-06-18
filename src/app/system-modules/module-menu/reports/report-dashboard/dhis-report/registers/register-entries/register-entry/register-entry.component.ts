import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register-entry',
  templateUrl: './register-entry.component.html',
  styleUrls: ['./register-entry.component.scss']
})
export class RegisterEntryComponent implements OnInit {

  showNewEntry = false;
  dateRange;
  loadIndicatorVisible = true;
  constructor() { }

  ngOnInit() {
  }

  newEntry(){
    this.showNewEntry = true;
  }
  close_onClick(e){
    this.showNewEntry = false;
  }

  setReturnValue(e) {
    
  }
}
