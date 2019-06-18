import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { PasswordValidation } from './../shared-common-modules/password-validation';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService, PersonService } from '../services/facility-manager/setup/index';
import { Person, User } from '../models/index';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';
  showInfo = true;
  isTokenAvailable: Boolean = false;
  selectedPerson: Person = <Person>{};

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() loginEmit: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_pwdReset1: FormGroup;
  public frm_pwdReset2: FormGroup;

  modal1_show = true;
  modal2_show = false;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private systemModuleService: SystemModuleService,
    private personService: PersonService) { }

  ngOnInit() {
    this.frm_pwdReset1 = this.formBuilder.group({
      apmisid: ['', [<any>Validators.required]],
      phoneNo: ['', [<any>Validators.required, <any>Validators.minLength(11), <any>Validators.pattern(PHONE_REGEX)]]
      // phoneNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
    });

    this.frm_pwdReset2 = this.formBuilder.group({
      token: ['', [<any>Validators.required, <any>Validators.minLength(6),
      <any>Validators.maxLength(7)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(7)]],
      cpassword: ['', [<any>Validators.required, <any>Validators.minLength(7)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });

    this.frm_pwdReset1.valueChanges.subscribe(value => {
      this.showInfo = true;
      this.mainErr = true;
    });
  }

  verify(valid, val) {
    if (valid) {
      this.systemModuleService.on();
      this.isTokenAvailable = false;
      const apmisId = this.frm_pwdReset1.controls['apmisid'].value;
      const telephone = this.frm_pwdReset1.controls['phoneNo'].value;
      this.userService.verifyUser({ apmisId: apmisId, primaryContactPhoneNo: telephone })
        .then(payload => {
          this.isTokenAvailable = payload.isToken;
          if (this.isTokenAvailable !== false) {
            this.modal1_show = false;
            this.modal2_show = true;
            this.systemModuleService.off();
          } else {
            this.mainErr = false;
            this.errMsg = 'Error while generating isTokenAvailable, please try again!';
            this.systemModuleService.off();
          }
        },error =>{
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Invalid APMIS ID or Telephone Number, please try again', 'error');
        });
    } else {
      this.mainErr = false;
      this.showInfo = false;
      this.systemModuleService.off();
    }

  }

  reset(valid: Boolean, val: any) {
    this.systemModuleService.on();
    const inputToken = this.frm_pwdReset2.controls['token'].value;
    const password = this.frm_pwdReset2.controls['password'].value;
    this.userService.resetPassword({ token: inputToken, password: password }).then(payload => {
      if (payload) {
        this.modal1_show = false;
        this.modal2_show = false;
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Your Password Has Been Reset Successfully', 'success', this, null, null, null, null, null, null);
      }
    }, error => {
      this.systemModuleService.off();
    });
  }

  sweetAlertCallback(result) {
    this.close_onClick();
  }

  back_resetFrm1() {
    this.modal1_show = true;
    this.modal2_show = false;
  }

  login() {
    this.loginEmit.emit(true);
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
