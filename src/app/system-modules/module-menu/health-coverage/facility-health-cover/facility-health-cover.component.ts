import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';


@Component({
  selector: 'app-facility-health-cover',
  templateUrl: './facility-health-cover.component.html',
  styleUrls: ['./facility-health-cover.component.scss']
})
export class FacilityHealthCoverComponent implements OnInit {

  hmo = true;
  company = false;
  family = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  hmo_tab() {
    this.hmo = true;
    this.company = false;
    this.family = false;
    this.router.navigate(['/dashboard/health-coverage/cover/hmo']).then(payload => {
    }, error => {
    });
  }
  company_tab() {
    this.hmo = false;
    this.company = true;
    this.family = false;
    this.router.navigate(['/dashboard/health-coverage/cover/company-cover']).then(payload => {
    }, error => {
    });
  }
  family_tab() {
    this.hmo = false;
    this.company = false;
    this.family = true;
    this.router.navigate(['//dashboard/health-coverage/cover/family-cover']).then(payload => {
    }, error => {
    });
  }

}
