import { FormControl } from '@angular/forms';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { PurchaseEntryService } from 'app/services/facility-manager/setup';

@Component({
	selector: 'app-view-invoice',
	templateUrl: './view-invoice.component.html',
	styleUrls: [ './view-invoice.component.scss' ]
})
export class ViewInvoiceComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedInvoice: any = {};
	@Input() loginEmployeeId: any = '';

	@Input() invoiceProduct: any = {};
	amountToPay = 0;
	amountToPayFormControl: FormControl = new FormControl(0);
	constructor(private _invoiceEntryService: PurchaseEntryService) {}

	ngOnInit() {
		this.amountToPayFormControl.valueChanges.distinctUntilChanged().debounceTime(200).subscribe((value) => {
			if (value > this.selectedInvoice.invoiceAmount - this.selectedInvoice.amountPaid) {
				this.amountToPay = this.selectedInvoice.invoiceAmount - this.selectedInvoice.amountPaid;
			}
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	makePayment() {
		const transaction = {
			paidBy: this.loginEmployeeId,
			amount: this.amountToPay
		};
		this.invoiceProduct.transactions.push(transaction);
		this.selectedInvoice.amountPaid += this.amountToPay;
		this._invoiceEntryService
			.patch(this.selectedInvoice._id, {
				transactions: this.invoiceProduct.transactions,
				amountPaid: this.selectedInvoice.amountPaid
			})
			.then(
				(payload) => {
					this.invoiceProduct.products = payload.products;
					this.invoiceProduct.transactions = payload.transactions;
					this.amountToPay = 0;
				},
				(error) => {
					console.log(error);
				}
			);
	}
}
