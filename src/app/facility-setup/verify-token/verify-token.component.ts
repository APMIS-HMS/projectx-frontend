import { SystemModuleService } from "app/services/module-manager/setup/system-module.service";
import { CoolLocalStorage } from "angular2-cool-storage";
import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from "@angular/forms";
import { FacilitiesService } from "../../services/facility-manager/setup/index";
import { Facility } from "../../models/index";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-verify-token",
  templateUrl: "./verify-token.component.html",
  styleUrls: [
    "./verify-token.component.scss",
    "../facility-setup.component.scss"
  ]
})
export class VerifyTokenComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() inputFacility: Facility = <Facility>{};
  @Input() backBtnVisible: boolean;
  @Input() tokenValue = "";
  frm_numberVerifier: FormGroup;
  facility: Facility = <Facility>{};
  InputedToken: string;
  errMsg: string;
  verify_show = true;
  back_verify_show = false;
  sg3_show = false;
  mainErr = true;

  constructor(
    private formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _facilityService: FacilitiesService,
    private locker: CoolLocalStorage,
    private systemModuleService: SystemModuleService
  ) {}

  ngOnInit() {
    this.frm_numberVerifier = this.formBuilder.group({
      txt_numberVerifier: [
        "",
        [
          <any>Validators.required,
          <any>Validators.minLength(6),
          <any>Validators.maxLength(6),
          <any>Validators.pattern("^[0-9]+$")
        ]
      ]
    });
    this.InputedToken = this.tokenValue;
  }

  numberVerifier(valid) {
    if (valid) {
      if (this.InputedToken === "" || this.InputedToken === " ") {
        this.mainErr = false;
        this.errMsg = "Kindly key in the code sent to your mobile phone";
      } else if (true) {
        this._facilityService
          .find({ query: { verificationToken: this.InputedToken } })
          .then(payload => {
            if (payload.data.length > 0) {
              this.mainErr = true;
              this.errMsg = "";
              // this.sg3_show = true;
              this.verify_show = false;
              this.inputFacility.isTokenVerified = true;
              this._facilityService
                .update(this.inputFacility)
                .then(payload2 => {
                  this.locker.setObject("selectedFacility", payload2);
                  this.systemModuleService.announceSweetProxy(
                    "Facility has been verified successfully",
                    "success",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                  );
                  this._router.navigate(["/accounts"]);
                  this.close_onClick();
                });
            } else {
              // this.mainErr = false;
              // this.errMsg = 'Wrong Token, try again.';
              const errMsg =
                "There was an error while verifying this facility, please try again!";
              this.systemModuleService.announceSweetProxy(errMsg, "error");
            }
          });
      }
    } else {
      this.mainErr = false;
    }
  }
  resendToken() {
    const selectedFacility = <Facility>this.locker.getObject(
      "selectedFacility"
    );
    this._facilityService
      .resendToken(selectedFacility)
      .then(payload => {})
      .catch(error => {});
  }

  back_verifier() {
    this.sg3_show = false;
    this.verify_show = false;
    this.back_verify_show = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.verify_show = false;
    this.back_verify_show = false;
    this.sg3_show = false;
  }
}
