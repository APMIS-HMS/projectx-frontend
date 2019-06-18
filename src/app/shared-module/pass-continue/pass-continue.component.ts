import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CoolLocalStorage} from 'angular2-cool-storage';
import {SystemModuleService} from 'app/services/module-manager/setup/system-module.service';

var AES = require('crypto-js/aes');
var CryptoJS = require('crypto-js');

import {AuthorizationType} from './../../models/facility-manager/setup/documentation';
import {UserService} from './../../services/facility-manager/setup/user.service';

var parse = require('date-fns/parse');
var isPast = require('date-fns/is_past');
@Component({
  selector: 'app-pass-continue',
  templateUrl: './pass-continue.component.html',
  styleUrls: ['./pass-continue.component.scss']
})
export class PassContinueComponent implements OnInit {
  @Input() headerText = 'Confirm password to continue';
  @Input() btnText = 'Confirm Password';
  @Input() authorizationType: AuthorizationType = AuthorizationType.Medical;
  @Input() patientId: any;
  @Input() employeeId: any;
  @Input() facilityId: any;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frm_conpass: FormGroup;
  authorizationTypeText = '';
  constructor(
      private formBuilder: FormBuilder, private userService: UserService,
      private locker: CoolLocalStorage,
      private systemModuleService: SystemModuleService) {}

  ngOnInit() {
    this.frm_conpass = this.formBuilder.group({
      otp: ['', [<any>Validators.required]],
      pac: ['', [<any>Validators.required]],
      password: ['', [<any>Validators.required]]
    });
    if (this.authorizationType === AuthorizationType.Patient) {
      this.btnText = 'Authorize By Patient';
      this.authorizationTypeText = 'Patient';
      const dataE: any = this.locker.getObject('docApprovalE');
      const dataP: any = this.locker.getObject('docApprovalP');
      if (dataE !== null && dataP !== null) {
        // // decrypt docApproval
        // const dataPlainE =
        //     AES.decrypt(dataE, '@apmis!simpa').toString(CryptoJS.enc.Utf8);
        // const dataPlainP =
        //     AES.decrypt(dataP, '@apmis!simpa').toString(CryptoJS.enc.Utf8);
        // if (!isPast(parse(dataPlainE)) && this.patientId == dataPlainP) {
        //   this.closeModal.emit(true);
        // } else {
        //   this.locker.removeItem('docApprovalE');
        //   this.locker.removeItem('docApprovalP');
        //   this.userService
        //       .generatePatientAuthorizationToken(
        //           {
        //             patientId: this.patientId,
        //             employeeId: this.employeeId,
        //             facilityId: this.facilityId
        //           },
        //           'patient')
        //       .then(payload => {});
        // }
      } else {
        this.userService
            .generatePatientAuthorizationToken(
                {
                  patientId: this.patientId,
                  employeeId: this.employeeId,
                  facilityId: this.facilityId
                },
                'patient')
            .then(payload => {
              if (payload.status === 'success') {
                if (payload.data !== undefined &&
                    payload.data.stillValid == true) {
                  const expires = parse(payload.data.expires);
                  if (!isPast(expires)) {
                    const encrptDataExpires =
                        AES.encrypt(payload.data.expires, '@apmis!simpa');
                    const encrptDataPatientId =
                        AES.encrypt(payload.data.patientId, '@apmis!simpa');
                    this.locker.setObject(
                        'docApprovalE', encrptDataExpires.toString());
                    this.locker.setObject(
                        'docApprovalP', encrptDataPatientId.toString());
                    this.closeModal.emit(true);
                  } else {
                  }
                }
              } else {
              }
            });
      }
    } else {
      const dataE: any = this.locker.getObject('docApprovalE');
      const dataEm: any = this.locker.getObject('docApprovalEm');
      if (dataE !== null && dataEm !== null) {
        // decrypt docApproval
        const dataPlainE =
            AES.decrypt(dataE, '@apmis!simpa').toString(CryptoJS.enc.Utf8);
        const dataPlainEm =
            AES.decrypt(dataEm, '@apmis!simpa').toString(CryptoJS.enc.Utf8);
        if (!isPast(parse(dataPlainE)) && this.employeeId == dataPlainEm) {
          this.closeModal.emit(true);
        } else {
          this.locker.removeItem('docApprovalE');
          this.locker.removeItem('docApprovalEm');
          this.userService
              .generatePatientAuthorizationToken(
                  {
                    patientId: this.patientId,
                    employeeId: this.employeeId,
                    facilityId: this.facilityId
                  },
                  'medical')
              .then(payload => {});
        }
      } else {
        this.userService
            .generatePatientAuthorizationToken(
                {
                  patientId: this.patientId,
                  employeeId: this.employeeId,
                  facilityId: this.facilityId
                },
                'medical')
            .then(payload => {
              if (payload.status === 'success') {
                if (payload.data !== undefined &&
                    payload.data.stillValid == true) {
                  const expires = parse(payload.data.expires);
                  if (!isPast(expires)) {
                    const encrptDataExpires =
                        AES.encrypt(payload.data.expires, '@apmis!simpa');
                    const encrptDataEmployeeId =
                        AES.encrypt(payload.data.employeeId, '@apmis!simpa');
                    this.locker.setObject(
                        'docApprovalE', encrptDataExpires.toString());
                    this.locker.setObject(
                        'docApprovalEm', encrptDataEmployeeId.toString());
                    this.closeModal.emit(true);
                  } else {
                  }
                }
              } else {
              }
            });
      }
      this.btnText = 'Confirm Password';
      this.authorizationTypeText = 'Medical';
    }
  }

  send() {
    if (this.authorizationType === AuthorizationType.Patient) {
      const password =
          AES.encrypt(this.frm_conpass.value.password, 'endurance@pays@alot');
      this.userService
          .validatePatientAuthorizationToken(
              this.patientId, 'patient', this.frm_conpass.value.pac,
              this.employeeId, this.facilityId, password)
          .then(payload => {
            if (payload.status === 'success') {
              const expires = parse(payload.data.expires);
              if (!isPast(expires)) {
                const encrptDataExpires =
                    AES.encrypt(payload.data.expires, '@apmis!simpa');
                const encrptDataPatientId =
                    AES.encrypt(payload.data.patientId, '@apmis!simpa');
                this.locker.setObject(
                    'docApprovalE', encrptDataExpires.toString());
                this.locker.setObject(
                    'docApprovalP', encrptDataPatientId.toString());
                this.closeModal.emit(true);
              } else {
                this.systemModuleService.announceSweetProxy(
                    'Invalid authorization code or expired authorization code!',
                    'info');
              }
            } else {
              this.systemModuleService.announceSweetProxy(
                  'Invalid authorization code and/or password!', 'info');
            }
          });
    } else if (this.authorizationType === AuthorizationType.Medical) {
      const password =
          AES.encrypt(this.frm_conpass.value.password, 'endurance@pays@alot');
      this.userService
          .validatePatientAuthorizationToken(
              this.patientId, 'medical', this.frm_conpass.value.otp,
              this.employeeId, this.facilityId, password)
          .then(payload => {
            if (payload.status === 'success') {
              const expires = parse(payload.data.expires);
              if (!isPast(expires)) {
                const encrptDataExpires =
                    AES.encrypt(payload.data.expires, '@apmis!simpa');
                const encrptDataPatientId =
                    AES.encrypt(payload.data.patientId, '@apmis!simpa');
                this.locker.setObject(
                    'docApprovalE', encrptDataExpires.toString());
                this.locker.setObject(
                    'docApprovalEm', encrptDataPatientId.toString());
                this.closeModal.emit(true);
              } else {
                this.systemModuleService.announceSweetProxy(
                    'Invalid authorization code or expired authorization code!',
                    'info');
              }
            } else {
              this.systemModuleService.announceSweetProxy(
                  'Invalid authorization code and/or password!', 'info');
            }
          });
    }
  }
}
