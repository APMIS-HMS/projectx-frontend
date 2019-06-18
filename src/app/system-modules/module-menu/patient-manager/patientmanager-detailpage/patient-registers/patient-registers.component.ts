import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-registers',
  templateUrl: './patient-registers.component.html',
  styleUrls: ['./patient-registers.component.scss']
})
export class PatientRegistersComponent implements OnInit {

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
