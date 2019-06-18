import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-rm-new-request',
  templateUrl: './rm-new-request.component.html',
  styleUrls: ['./rm-new-request.component.scss']
})
export class RmNewRequestComponent implements OnInit {

  mainErr = true;
  paymentStatus = false;
  sampleStatus = true;
  recievedStatus = true;
  resultStatus = false;
  loading = true;
  extList = false;
  isExternal = false;
  isLaboratory = false;
  isValidateForm = false;
  investigationRadio = false;
  requestLoading = false;
  disableBtn = false;
  makeRequestBtn = false;
  makingRequestBtn = false;
  errMsg = 'You have unresolved errors';

  investigations: any;
  bindInvestigations: any;
  suggestShow = false;
  item1 = false;
  item2 = false;
  item3 = false;
  item4 = false;

  mod1 = true;
  mod2 = false;
  mod3 = false;
  mod4 = false;
  mod5 = false;

  isMore = true;
  isWalkin = false;

  public frmNewRequest: FormGroup;
  searchInvestigation = new FormControl();
  searchPerson = new FormControl();
  searchModality = new FormControl();

  // tslint:disable-next-line:max-line-length
  clinicalInvestigation = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ';

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private _router: Router) { }

  ngOnInit() {
    this.frmNewRequest = this.formBuilder.group({
      patient: ['', [Validators.required]],
      labNo: ['', [Validators.required]],
      clinicalInfo: ['', [Validators.required]],
      diagnosis: ['', [Validators.required]],
      investigation: ['']
    });
  }

  userMore() {
    this.isMore = !this.isMore;
  }
  save(isvalid, val) { }
  search_call() {
    this.suggestShow = true;
  }
  suggestItem_click() {
    this.suggestShow = false;
  }
  investigation_click(val) {
    if (val === '1') {
      this.item1 = !this.item1;
    } else if (val === '2') {
      this.item2 = !this.item2;
    } else if (val === '3') {
      this.item3 = !this.item3;
    } else if (val === '4') {
      this.item4 = !this.item4;
    }
  }
  modality_click(val) {
    if (val === '1') {
      this.mod1 = true;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = false;
    } else if (val === '2') {
      this.mod1 = false;
      this.mod2 = true;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = false;
    } else if (val === '3') {
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = true;
      this.mod4 = false;
      this.mod5 = false;
    } else if (val === '4') {
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = true;
      this.mod5 = false;
    } else if (val === '5') {
      this.mod1 = false;
      this.mod2 = false;
      this.mod3 = false;
      this.mod4 = false;
      this.mod5 = true;
    }
  }
}
