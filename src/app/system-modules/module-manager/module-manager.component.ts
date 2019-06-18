import { Component, OnInit } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



@Component({
  selector: 'app-module-manager',
  templateUrl: './module-manager.component.html',
  styleUrls: ['./module-manager.component.scss']
})
export class ModuleManagerComponent implements OnInit {
  scopeContentArea = true;
  typeContentArea = false;
  allModulesSubmenuActive = false;
  moduleAnalyticsSubmenuActive = false;
  newModuleSubmenuActive= false;
  constructor() {

  }

  ngOnInit() {
  }
  navFpScope() {
    this.scopeContentArea = true;
    this.typeContentArea = false;
  }
  navFpType() {
    this.scopeContentArea = false;
    this.typeContentArea = true;

  }
}
