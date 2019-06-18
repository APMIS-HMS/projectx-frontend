import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-template-nursing-care',
  templateUrl: './template-nursing-care.component.html',
  styleUrls: ['./template-nursing-care.component.scss']
})
export class TemplateNursingCareComponent implements OnInit {
  addNursingCareForm: FormGroup;
  addProcedureForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';
  newTemplate = true;
  nursingCares: any = [];

  constructor(
    private fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService,
  ) {}

  ngOnInit() {
    this.addNursingCareForm = this.fb.group({
      nursingCare: ['', [<any>Validators.required]]
    });
  }

  onClickAddNursingCare(valid: boolean, value: any) {
    if (valid) {
      const nursingCare = {
        name: value.nursingCare,
        comment: '',
        status: 'Not Done',
        completed: false,
      };
      this.nursingCares.push(nursingCare);
      this._orderSetSharedService.saveItem({ nursingCares: this.nursingCares});
      this.addNursingCareForm.reset();
    }
  }
}
