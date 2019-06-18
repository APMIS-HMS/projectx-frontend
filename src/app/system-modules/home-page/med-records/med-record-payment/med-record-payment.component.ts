import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-med-record-payment',
  templateUrl: './med-record-payment.component.html',
  styleUrls: ['./med-record-payment.component.scss']
})
export class MedRecordPaymentComponent implements OnInit {

  paymentFormGroup: FormGroup;
  search: FormControl;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    this.paymentFormGroup = this._fb.group({
      fundAmount: [0, [<any>Validators.required]],
      paymentType: ['', [<any>Validators.required]]
    });
    this.search = new FormControl('', []);
  }

}
