import { Component, OnInit } from '@angular/core';
import { CorporateEmitterService } from '../../../services/facility-manager/corporate-emitter.service';

@Component({
  selector: 'app-covering-facility',
  templateUrl: './covering-facility.component.html',
  styleUrls: ['./covering-facility.component.scss']
})
export class CoveringFacilityComponent implements OnInit {

  personDependants = false;
  addEmployee = false;

  constructor(
    private _corporateEventEmitter: CorporateEmitterService
  ) { }

  ngOnInit() {
    this._corporateEventEmitter.setRouteUrl('Covering Facilities');
  }

  dependants_popup() {
    this.personDependants = true;
  }
  addEmpShow(){
    this.personDependants = false;
    this.addEmployee = true;
  }
  close_onClick(e) {
    this.personDependants = false;
    this.addEmployee = false;
  }

}
