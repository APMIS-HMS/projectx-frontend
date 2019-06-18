import { FromPurchaseOrderComponent } from './from-purchase-order/from-purchase-order.component';
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InvoiceEntry, InvoicedItem } from '../../../components/models/invoice-entry';
import { PurchaseEntryService } from 'app/services/facility-manager/setup';
import { NoPurchaseOrderComponent } from './no-purchase-order/no-purchase-order.component';

@Component({
	selector: 'app-new-invoice-entry',
	templateUrl: './new-invoice-entry.component.html',
	styleUrls: [ './new-invoice-entry.component.scss' ]
})
export class NewInvoiceEntryComponent implements OnInit, AfterViewInit {
	@ViewChild(FromPurchaseOrderComponent) fromChild;
	@ViewChild(NoPurchaseOrderComponent) noChild;
	productConfigSearch: FormControl = new FormControl();
	purchaseListFormControl: FormControl = new FormControl();
	switchView;

	invoiceNo: FormControl = new FormControl();
	invoiceAmount: FormControl = new FormControl();
	discount: FormControl = new FormControl();
	vat: FormControl = new FormControl();
	remark: FormControl = new FormControl();
	selectedProducts: any;

	constructor(private purchaseEntryService: PurchaseEntryService, private cdRef: ChangeDetectorRef) {}

	ngOnInit() {
		this.switchView = true;
	}

	switcher1_click() {
		this.switchView = true;
		this.cdRef.detectChanges();
	}
	switcher2_click() {
		this.switchView = false;
		this.cdRef.detectChanges();
	}

	ngAfterViewInit() {
		// this.selectedProducts = this.fromChild.selectedProducts;
	}

	submit() {
		if (this.switchView) {
			const invEntry: InvoiceEntry = {
				facilityId: this.fromChild.selectedFacility._id,
				invoiceNumber: this.invoiceNo.value,
				invoiceAmount: this.invoiceAmount.value,
				amountPaid: 0,
				storeId: this.fromChild.checkingStore.storeId,
				createdBy: this.fromChild.loginEmployee._id,
				deliveryDate: this.fromChild.invoiceDate.value,
				remark: this.remark.value,
				products: [],
				paymentCompleted: false,
				transactions: []
			};
			if (this.fromChild.supplierFormControl.value) {
				invEntry.supplierId = this.fromChild.supplierFormControl.value;
			}
			if (this.fromChild.purchaseOrderFormControl.value) {
				invEntry.orderId = this.fromChild.purchaseOrderFormControl.value;
			}
			invEntry.products = this.fromChild.selectedProducts.map((product) => {
				const invItem: InvoicedItem = {
					productId: product.productId,
					productName: product.productName,
					batchNo: product.batchNumber,
					productPackType: product.productPackType,
					quantity: product.quantity,
					costPrice: product.costPrice,
					expiryDate: product.expiryDate
				};
				return invItem;
			});
			this.purchaseEntryService.createEntry(invEntry).then((payload) => {}, (error) => {});
		} else {
			const invEntry: InvoiceEntry = {
				facilityId: this.noChild.selectedFacility._id,
				invoiceNumber: this.invoiceNo.value,
				invoiceAmount: this.invoiceAmount.value,
				amountPaid: 0,
				storeId: this.noChild.checkingStore.storeId,
				createdBy: this.noChild.loginEmployee._id,
				deliveryDate: this.noChild.invoiceDate.value,
				remark: this.remark.value,
				products: [],
				paymentCompleted: false,
				transactions: []
			};
			if (this.noChild.supplierFormControl.value) {
				invEntry.supplierId = this.noChild.supplierFormControl.value;
			}

			invEntry.products = this.noChild.selectedProducts.map((product) => {
				const invItem: InvoicedItem = {
					productId: product.productId,
					productName: product.productName,
					batchNo: product.batchNumber,
					productPackType: product.productPackType,
					quantity: product.quantity,
					costPrice: product.costPrice,
					expiryDate: product.expiryDate
				};
				return invItem;
			});
			this.purchaseEntryService.createEntry(invEntry).then((payload) => {}, (error) => {});
		}
	}

	receiveInvoiceAmount(amount) {
		this.invoiceAmount.setValue(amount);
	}

	validate() {
		try {
			if (
				!!this.fromChild &&
				!!this.fromChild.supplierFormControl.value &&
				this.fromChild.selectedProducts.length > 0
			) {
				return false;
			} else if (
				!!this.noChild &&
				!!this.noChild.supplierFormControl.value &&
				this.noChild.selectedProducts.length > 0
			) {
				return false;
			} else {
				return true;
			}
		} catch (error) {}
	}
}
