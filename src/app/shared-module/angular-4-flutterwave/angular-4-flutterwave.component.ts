import { Component, OnInit, Output, Input, ElementRef, EventEmitter } from '@angular/core';
import { FLUTTERWAVE_PUBLIC_KEY } from '../helpers/global-config';
import { WindowRef } from '../../services/facility-manager/setup/index';

@Component({
  selector: 'angular-4-flutterwave',
  templateUrl: './angular-4-flutterwave.component.html',
  styleUrls: ['./angular-4-flutterwave.component.scss']
})
export class Angular4FlutterwaveComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Output() callback: EventEmitter<any> = new EventEmitter();
  @Input() customer_email: string;
  @Input() amount: string;
  @Input() payment_method: string;
  @Input() currency: string;
  @Input() country: string;
  @Input() custom_logo: string;
  @Input() custom_description: string;
  @Input() custom_title: string;
  @Input() txref: string;
  @Input() PBFPubKey: string;
  @Input() exclude_banks: string;
  @Input() pay_button_text: string;
  @Input() btnColor: string;
  @Input() btnTitle: string = 'Pay with flutterwave';
  disableBtn: boolean = false;

  constructor(private _windowRef: WindowRef) {}

  ngOnInit() {
    this.btnTitle = this.btnTitle;
    this.btnColor = this.btnColor;
  }

  setup() {
    const _this = this;

    _this.onClickOpen();

    this._windowRef.nativeWindow.getpaidSetup({
      customer_email: this.customer_email,
      amount: this.amount,
      currency: this.currency,
      country: this.country,
      custom_logo: this.custom_logo,
      custom_description: this.custom_description,
      custom_title: this.custom_title,
      btnTitle: this.btnTitle,
      txref: this.txref,
      PBFPubKey: this.PBFPubKey,
      exclude_banks: this.exclude_banks,
      payment_method: this.payment_method,
      onclose: function() {
        _this.onClickClose();
        return _this.close.emit();
      },
      callback: function(res) {
        return _this.callback.emit(res);
      }
    });
  }

  onClickCallback(response) {
    this.callback.emit(response);
    // if (response.tx.chargeResponse === '00' || response.tx.chargeResponse === '0') {
    //   // redirect to a success page
    // } else {
    //   // redirect to a failure page.
    // }
  }

  onClickOpen() {
    this.btnTitle = 'Paying...';
    this.disableBtn = true;
  }

  onClickClose() {
    this.disableBtn = false;
    this.btnTitle = this.btnTitle;
  }
}
