import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService, PurchaseEntryService } from '../../../../../services/facility-manager/setup/index';
import { Facility, PurchaseEntry } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl } from '@angular/forms';
import { invalid } from 'moment';
import { ProductEmitterService } from '../../../../../services/facility-manager/product-emitter.service';

@Component({
  selector: 'app-transaction-history',
  templateUrl: './transaction-history.component.html',
  styleUrls: ['./transaction-history.component.scss']
})
export class TransactionHistoryComponent implements OnInit {
  suppliers: any[];
  newPayment = false;
  paymentHistory = false;
  invoices:any = [];
  selected_supplier:any;
  loading = true;
  searchOpen = false;
  frmFilterSupplier: FormControl = new FormControl();

  selectedFacility: Facility = <Facility>{};
  selectedInvoice: PurchaseEntry = <PurchaseEntry>{};
  constructor(private route: ActivatedRoute,
    private router: Router,
    private supplierService: SupplierService,
    private invoiceService: PurchaseEntryService,
    private locker: CoolLocalStorage,
    private _productEventEmitter: ProductEmitterService
  ) {
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this._productEventEmitter.setRouteUrl('Supplier Details');
    this.getHistory();
    this.getSuppliers();
    this.frmFilterSupplier.valueChanges.subscribe(payload => {
      this.router.navigate(['/dashboard/product-manager/supplier-details', payload]);
    });
  }

  getHistory() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id !== undefined) {
        this.invoiceService.getInvoice(id,
          { query: { supplierId: id, facilityId: this.selectedFacility._id, $sort: { createdAt: -1 }  } }).subscribe(res => {
          this.loading = false;
          this.invoices = res.data;
          this.selected_supplier = res.supplier;
        }, error => {
        });
      }
    });
  }

  getSuppliers() {
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.suppliers = payload.data;
    });
  }
  close_onClick(message: boolean): void {
    this.newPayment = false;
  }
  closeHistory_onClick(message: boolean): void {
    this.paymentHistory = false;
  }
  newPaymentShow(invoice) {
    this.selectedInvoice = invoice;
    this.newPayment = true;
  }
  PaymentHistoryShow(invoice) {
    this.selectedInvoice = invoice;
    this.paymentHistory = !this.paymentHistory;
  }

  openSearch() {
    this.searchOpen = !this.searchOpen;
  }

  checkForOutstanding(value) {
    const val = value.invoiceAmount - value.amountPaid;
    if (isNaN(val)) {
      return 0;
    }else {
      return val;
    }
  }

  onRefreshHistory(value) {
    this.getHistory();
  }
}
