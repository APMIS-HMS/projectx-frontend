import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opd-pg2',
  templateUrl: './opd-pg2.component.html',
  styleUrls: ['./opd-pg2.component.scss', '../../../../nhmis-summary/nhmis-summary.component.scss', '../../register-entry/register-entry.component.scss']
})
export class OpdPg2Component implements OnInit {

  @Output() switch: EventEmitter<number> = new EventEmitter<number>();
  showNewEntry = false;
  dateRange: any;
  loadIndicatorVisible = false;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  back_registers(){
    this._router.navigate(['/dashboard/reports/register']);
  }
  switcher_onClick() {
    this.switch.emit(1);
  }
  newEntry(){
    this.showNewEntry = true;
  }
  close_onClick(e){
    this.showNewEntry = false;
  }
  setReturnValue(e){}
}
