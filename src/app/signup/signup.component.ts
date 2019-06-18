import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, PersonService, CorporateFacilityService } from '../services/facility-manager/setup/index';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  modal_on = false;
  corporateSignup_on = false;
  personAccount_on = false;
  pwdReset_on = false;
  login_on = false;

  constructor(private corporateFacilityService: CorporateFacilityService, private facilityService: FacilitiesService) {
  }

  ngOnInit() {
  }

  personAccount_show() {
    this.modal_on = false;
    this.personAccount_on = true;
    this.corporateSignup_on = false;
    this.pwdReset_on = false;
  }

  facilitySetup1_show() {
    this.modal_on = true;
    this.personAccount_on = false;
    this.corporateSignup_on = false;
    this.pwdReset_on = false;
  }
  corporateSignup_show() {
    this.modal_on = false;
    this.personAccount_on = false;
    this.corporateSignup_on = true;
    this.pwdReset_on = false;
  }
  pwdReset_show() {
    this.pwdReset_on = true;
    this.modal_on = false;
    this.corporateSignup_on = false;
    this.login_on = false;
  }
  overlay_onClick(e) {
    if (e.srcElement.id === 'form-modal') {
    }
  }

  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.personAccount_on = false;
    this.login_on = false;
    this.corporateSignup_on = false;
    this.pwdReset_on = false;
  }
  login_show() {
    this.login_on = true;
    this.pwdReset_on = false;
  }

}
