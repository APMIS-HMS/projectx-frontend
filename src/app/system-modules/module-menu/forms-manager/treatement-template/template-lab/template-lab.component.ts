import { CoolLocalStorage } from 'angular2-cool-storage';
import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';
import { Facility } from '../../../../../models/index';

@Component({
  selector: 'app-template-lab',
  templateUrl: './template-lab.component.html',
  styleUrls: ['./template-lab.component.scss']
})
export class TemplateLabComponent implements OnInit {
  addInvestigationForm: FormGroup;
  facility: Facility = <Facility>{};
  apmisLookupQuery = {};
  apmisLookupUrl = 'investigations';
  apmisLookupDisplayKey = 'name';
  apmisLookupText = '';
  newTemplate = true;
  investigations: any = [];
  selectedInvestigation: any = <any>{};

  constructor(
    private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _orderSetSharedService: OrderSetSharedService,
  ) { }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.addInvestigationForm = this.fb.group({
      investigation: ['', [<any>Validators.required]]
    });

    this.addInvestigationForm.controls['investigation'].valueChanges.subscribe(value => {
      this.apmisLookupQuery = { name: { $regex: value, '$options': 'i' }, facilityId: this.facility._id }
    });
  }

  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    this.selectedInvestigation = value;
    this.addInvestigationForm.controls['investigation'].setValue(value.name);
  }

  onClickAddInvestigation(valid: boolean, value: any) {
    if (valid) {
      this.selectedInvestigation.comment = '';
      this.selectedInvestigation.status = 'Not Done';
      this.selectedInvestigation.completed = false;

      this.investigations.push(this.selectedInvestigation);
      this._orderSetSharedService.saveItem({ investigations: this.investigations});

      this.apmisLookupText = '';
      this.addInvestigationForm.reset();
      this.addInvestigationForm.controls['investigation'].setValue('');
    }
  }
}
