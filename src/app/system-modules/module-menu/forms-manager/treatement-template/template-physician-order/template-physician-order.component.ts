import { Component, OnInit, EventEmitter, Output, Input, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { OrderSetSharedService } from '../../../../../services/facility-manager/order-set-shared-service';

@Component({
  selector: 'app-template-physician-order',
  templateUrl: './template-physician-order.component.html',
  styleUrls: ['./template-physician-order.component.scss']
})
export class TemplatePhysicianOrderComponent implements OnInit {
  addPhysicianOrderForm: FormGroup;
  addProcedureForm: FormGroup;
  apmisLookupQuery = {};
  apmisLookupUrl = '';
  apmisLookupDisplayKey = '';
  apmisLookupText = '';
  newTemplate = true;
  physicianOrders: any = [];

  constructor(
    private fb: FormBuilder,
    private _orderSetSharedService: OrderSetSharedService
  ) {}

  ngOnInit() {
    this.addPhysicianOrderForm = this.fb.group({
      physicianOrder: ['', [<any>Validators.required]]
    });
  }

  onClickAddPhysicianOrder(valid: boolean, value: any) {
    if (valid) {
      const physicianOrder = {
        name: value.physicianOrder,
        comment: '',
        status: 'Not Done',
        completed: false
      };

      this.physicianOrders.push(physicianOrder);
      this._orderSetSharedService.saveItem({ physicianOrders: this.physicianOrders});
      this.addPhysicianOrderForm.reset();
    }
  }
}
