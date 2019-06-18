import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-investigation',
  templateUrl: './rm-investigation.component.html',
  styleUrls: ['./rm-investigation.component.scss', '../rm-request-list.component.scss']
})
export class RmInvestigationComponent implements OnInit {

  clinicalInvestigation = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ";
  
  constructor() { }

  ngOnInit() {
  }

}
