import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-facility-options',
  templateUrl: './facility-options.component.html',
  styleUrls: ['./facility-options.component.scss']
})
export class FacilityOptionsComponent implements OnInit {
  @Input() name: string;
  constructor() { }

  ngOnInit() {
  }
  addScope(event, scopetext) {

  }
}
