import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-staff-cover',
  templateUrl: './staff-cover.component.html',
  styleUrls: ['./staff-cover.component.scss']
})
export class StaffCoverComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
    this.pageInView.emit('Employee Health Cover');
  }

}
