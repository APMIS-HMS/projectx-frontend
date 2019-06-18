import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {

  apmisLookupUrl = "";
  apmisLookupText = "";
  apmisLookupQuery = {};
  apmisLookupDisplayKey ="";

  pannel_view = false;
  // reqDetail_view = false;
  // personAcc_view = false;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  Inactive= false;
  Active = false;
  reqDetail_view = false;
  personAcc_view = false;

  public frmNewPanel: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewPanel = this.formBuilder.group({
      panelName: ['', [Validators.required]]
    });
  }

  apmisLookupHandleSelectedItem(value){

  }
  pannel_show() {
    this.pannel_view = !this.pannel_view;
  }
  
  close_onClick(message: boolean): void {
  }
  reqDetail(){

  }
}

