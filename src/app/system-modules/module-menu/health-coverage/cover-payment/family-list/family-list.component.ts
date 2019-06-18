import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-family-list',
  templateUrl: './family-list.component.html',
  styleUrls: ['./family-list.component.scss']
})
export class FamilyListComponent implements OnInit {

  @Output() toBill: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  hmoList_click(){
    this.toBill.emit(true);
  }

}
