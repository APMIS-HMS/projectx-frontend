import { PasswordValidation } from './../../../shared-common-modules/password-validation';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  show = false;

  @ViewChild('showhideinput') input;
  @ViewChild('showhideinputconfirm') inputConfirm;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_changePass: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService,
    private userService: UserService) { }

  ngOnInit() {
    this.frm_changePass = this.formBuilder.group({
      oldPass: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
      password: ['', [<any>Validators.required, <any>Validators.minLength(7)]],
      cpassword: ['', [<any>Validators.required, <any>Validators.minLength(7)]]
    }, {
        validator: PasswordValidation.MatchPassword
      });
  }

  changePword(valid, val) {
    if (valid) {
      const auth: any = this.locker.getObject('auth');
      const id = auth.data._id;
      const oldpassword = this.frm_changePass.controls['oldPass'].value;
      const password = this.frm_changePass.controls['password'].value;
      this.userService.changePassword({ oldpassword: oldpassword, password: password, _id: id }).then(payload => {
        if (payload === true) {
          this.userService.logOut();
          this.userService.announceMission('out');
          this.userService.isLoggedIn = false;
          this.systemModuleService.announceSweetProxy('Password Changed Successfully', 'info');
        }else{
          this.systemModuleService.announceSweetProxy('Invalid Password or Username', 'error');
        }
      }, error => {
        this.systemModuleService.announceSweetProxy('Invalid Password or Username', 'error');
      });
    }
  }
  close_onClick(event) {
    this.closeModal.emit(true);
  }
  toggleShow(e) {
    this.show = !this.show;
    if (this.show) {
      this.input.nativeElement.type = 'text';
    } else {
      this.input.nativeElement.type = 'password';
    }
  }

  toggleShowConfirm(e) {
    this.show = !this.show;
    if (this.show) {
      this.inputConfirm.nativeElement.type = 'text';
    } else {
      this.inputConfirm.nativeElement.type = 'password';
    }
  }

}
