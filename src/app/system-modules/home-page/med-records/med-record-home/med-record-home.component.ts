import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-med-record-home',
  templateUrl: './med-record-home.component.html',
  styleUrls: ['./med-record-home.component.scss', '../med-records.component.scss']
})
export class MedRecordHomeComponent implements OnInit {

  schedule_appointment = false;

  constructor() { }

  ngOnInit() {
  }

  close_onClick(message: boolean): void {
    this.schedule_appointment = false;
  }
  set_appointment() {
    this.schedule_appointment = true;
  }

}
