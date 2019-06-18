import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX } from 'app/shared-module/helpers/global-config';

@Component({
  selector: 'app-biodata-update',
  templateUrl: './biodata-update.component.html',
  styleUrls: ['./biodata-update.component.scss']
})
export class BiodataUpdateComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  show = false;
  errMsg: string;
  mainErr = true;
  tab1= true;
  tab2 = false;
  tab3 = false;
  public frmPerson: FormGroup;
  public frmPersonNok: FormGroup;
  public frmPersonSecQst: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmPerson = this.formBuilder.group({
      persontitle: [new Date(), [<any>Validators.required]],
      firstname: ['', [<any>Validators.required, <any>Validators.minLength(3),
        <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      lastname: ['', [<any>Validators.required, <any>Validators.minLength(3),
        <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      otherNames: [[]],
      gender: [[<any>Validators.minLength(2)]],
      dob: [new Date(), [<any>Validators.required]],
      addressStreet: ['', [<any>Validators.required]],
			addressCity: ['', [<any>Validators.required]],
			addressState: ['', [<any>Validators.required]],
			addressCountry: ['', [<any>Validators.required]],
      motherMaidenName: ['', [<any>Validators.required, <any>Validators.minLength(3),
        <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      securityQuestion: ['', [<any>Validators.required]],
      securityAnswer: ['', [<any>Validators.required]],
      // email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]]
    });

    this.frmPersonNok = this.formBuilder.group({
      nok_firstname: ['', [<any>Validators.required, <any>Validators.minLength(3),
        <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      nok_lastname: ['', [<any>Validators.required, <any>Validators.minLength(3),
        <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
      nok_otherNames: [[]],
      nok_phone: [[]],
      nok_gender: [[]]
    });

    this.frmPersonSecQst = this.formBuilder.group({
      securityQuestion: ['', [<any>Validators.required]],
      securityAnswer: ['', [<any>Validators.required]],
    });
  }

  tab1_click() {
    this.tab1 = true;
    this.tab2 = false;
    this.tab3 = false;
  }
  tab2_click() {
    this.tab1 = false;
    this.tab2 = true;
    this.tab3 = false;
  }
  tab3_click() {
    this.tab1 = false;
    this.tab2 = false;
    this.tab3 = true;
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

}
