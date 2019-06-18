import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-gmp-list',
  templateUrl: './gmp-list.component.html',
  styleUrls: ['./gmp-list.component.scss', '../../../../nhmis-summary/nhmis-summary.component.scss', '../../register-entry/register-entry.component.scss']
})
export class GmpListComponent implements OnInit {

  @Output() switch: EventEmitter<number> = new EventEmitter<number>();
  showNewEntry = false;
  dateRange: any;
  loadIndicatorVisible: any = false;
  constructor(private _router: Router) { }

  ngOnInit() {
  }
  back_registers() {
    this._router.navigate(['/dashboard/reports/register']);
  }
  newEntry() {
    this.showNewEntry = true;
  }
  close_onClick(e) {
    this.showNewEntry = false;
  }
  setReturnValue(e) {
  }
}
