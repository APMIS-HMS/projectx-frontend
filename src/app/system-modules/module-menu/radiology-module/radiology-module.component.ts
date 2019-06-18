import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-radiology-module',
  templateUrl: './radiology-module.component.html',
  styleUrls: ['./radiology-module.component.scss']
})
export class RadiologyModuleComponent implements OnInit {

  requestContentArea = true;
  externalContentArea = false;
  reportContentArea = false;
  workbenchContentArea = false;
  investigationContentArea = false;
  pricingContentArea = false;
  templateContentArea = false;

  constructor() { }

  ngOnInit() {
  }
  changeRoute(r){}
  checkIntoWorkbench(){}

}
