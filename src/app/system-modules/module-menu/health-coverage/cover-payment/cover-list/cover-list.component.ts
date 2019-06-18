import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cover-list',
  templateUrl: './cover-list.component.html',
  styleUrls: ['./cover-list.component.scss']
})
export class CoverListComponent implements OnInit {

  @Output() toBill: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  hmoList_click(){
    this.toBill.emit(true);
  }

}
