import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PurchaseEntry } from '../../../../../models/index';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedInvoice: PurchaseEntry = <PurchaseEntry>{};
  appointment: any
  constructor() { }

  ngOnInit() {
  }
  slideProductDetailsToggle(a, b) {
    this.closeModal.emit(true);
  }

  checkForOutstanding(value) {
    const val = value.invoiceAmount - value.amountPaid;
    if (isNaN(val)) {
      return 0;
    }else {
      return val;
    }
  }
}
