import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-appnt-history',
  templateUrl: './rm-appnt-history.component.html', 
  styleUrls: ['./rm-appnt-history.component.scss', '../rm-appnt-appointments/rm-appnt-appointments.component.scss', '../../rm-request-list.component.scss']
}) 
export class RmAppntHistoryComponent implements OnInit {

  valGroup = false;

  constructor() { }

  ngOnInit() {
  }

  valGroup_click(){
    this.valGroup = !this.valGroup;
  }

}
