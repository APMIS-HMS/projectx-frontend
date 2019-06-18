import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-appnt-appointments',
  templateUrl: './rm-appnt-appointments.component.html',
  styleUrls: ['./rm-appnt-appointments.component.scss', '../../rm-request-list.component.scss']
})
export class RmAppntAppointmentsComponent implements OnInit {

  valGroup = false;

  constructor() { }

  ngOnInit() {
  }

  valGroup_click(){
    this.valGroup = !this.valGroup;
  }

}
