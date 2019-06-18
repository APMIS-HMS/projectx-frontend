import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rm-appointment',
  templateUrl: './rm-appointment.component.html',
  styleUrls: ['./rm-appointment.component.scss', '../rm-request-list.component.scss']
})
export class RmAppointmentComponent implements OnInit {

  searchPatient = new FormControl();
  tab1 = true;
  tab2 = false;
  tab3 = false;

  constructor() { }

  ngOnInit() {
  }

  tab_click(val){
    if(val==1){
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
    } else if(val==2){
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
    } else if(val==3){
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
    }
  }


}
