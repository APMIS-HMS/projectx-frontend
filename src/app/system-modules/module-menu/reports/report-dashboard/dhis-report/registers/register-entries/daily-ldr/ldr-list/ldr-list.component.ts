import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ldr-list',
  templateUrl: './ldr-list.component.html',
  styleUrls: ['./ldr-list.component.scss']
})
export class LdrListComponent implements OnInit {

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
  newEntry(){
    this.showNewEntry = true;
  }
  close_onClick(e){
    this.showNewEntry = false;
  }

  setReturnValue(e) {
    
  }
}
