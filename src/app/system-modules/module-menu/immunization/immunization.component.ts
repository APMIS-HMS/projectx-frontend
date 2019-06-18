import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-immunization',
  templateUrl: './immunization.component.html',
  styleUrls: ['./immunization.component.scss']
})
export class ImmunizationComponent implements OnInit {
  // pageInView = 'Immunization Schedule';
  pageInView = 'Batch Schedule';
  immunizationSchedule: Boolean = true;
  constructor() { }

  ngOnInit() {
  }

  pageInViewLoader(title) {
    this.pageInView = title;
  }

  onClickImmunizationMenuShow(item: String) {
    if (item === 'immunization-schedule') {
      this.immunizationSchedule = true;
    }
  }

  private checkPageUrl(param: string) {
    if (param.includes('immunization-schedule')) {
      // this.pageInView = 'Immunization Schedule';
      this.pageInView = 'Batch Schedule';
    }
  }

}
