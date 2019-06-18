import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rm-modality',
  templateUrl: './rm-modality.component.html',
  styleUrls: ['./rm-modality.component.scss', '../rm-request-list.component.scss']
})
export class RmModalityComponent implements OnInit {

  mod1 = true;
  mod2 = false;
  mod3 = false;
  mod4 = false;
  mod5 = false; 

  gp1 = true;
  gp2 = false;

  searchPatient = new FormControl();
  clinicalInvestigation = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ";
  
  constructor() { }

  ngOnInit() {
  }

  gp_click(val){
    if(val == "1"){
      this.gp1 = !this.gp1;
    } else if(val == "2"){
      this.gp2 = !this.gp2;
    }
  }

  modality_click(val){
    if(val == "1"){
      this.mod1 = true;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = false;
    } else if(val == "2"){
      this.mod1 = false;
      this.mod2 = true;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = false;
    } else if(val == "3"){
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = true;
      this.mod4 = false;
      this.mod5 = false;
    } else if(val == "4"){
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = true;
      this.mod5 = false;
    } else if(val == "5"){
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = true;
    }
  }

}
