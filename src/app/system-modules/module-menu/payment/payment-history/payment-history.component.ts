import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Facility, Invoice } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { IPagerSource } from '../../../../core-ui-modules/ui-components/PagerComponent';

@Component({
	selector: 'app-payment-history',
	templateUrl: './payment-history.component.html',
	styleUrls: [ './payment-history.component.scss' ]
})
export class PaymentHistoryComponent implements OnInit {
	// invoiceSearch = new FormControl();
	patientSearch = new FormControl();
	user: any = <any>{};
	dateRange: any;
	searchOpen = false;
	selectedFacility: Facility = <Facility>{};
	invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
	selectedInvoiceGroup: Invoice = <Invoice>{};
	invoiceGroups: Invoice[] = [];
	subscription: Subscription;
	paymentTxn: any = <any>[];
	loading: Boolean = true;
	disableSearchBtn = false;
	searchBtn = true;
	searchingBtn = false;
	paginationObj: IPagerSource = {
		pageSize: 10,
		totalPages: 0,
		currentPage: 0,
		totalRecord: 0
	};

	constructor(
		private _route: Router,
		private _router: ActivatedRoute,
		private locker: CoolLocalStorage,
		private invoiceService: InvoiceService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.getPatientInvoices();

		this.patientSearch.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.do((val) => {
				this.invoiceGroups = [];
				this.loading = true;
			})
			.switchMap((term) =>
				Observable.fromPromise(
					this.invoiceService.search({
						query: { name: term, facilityId: this.selectedFacility._id, $sort: { updatedAt: -1 } }
					})
				)
			)
			.subscribe(
				(res: any) => {
					this.loading = false;
					if (res.status === 'success' && res.data.length > 0) {
						this.invoiceGroups = res.data.filter((x) => x.paymentCompleted);
					}
				},
				(err) => {}
			);
	}

	onClickViewDetails(item) {
		if (!!item._id) {
			this.systemModuleService.on();
			this._route.navigate([ `/dashboard/payment/history/${item._id}` ]).then((res) => {
				this.systemModuleService.off();
			});
		}
	}

	getPatientInvoices() {
		this.systemModuleService.on();
		this.invoiceService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					$sort: { updatedAt: -1 },
					$limit: this.paginationObj.pageSize,
					$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
				}
			})
			.then((payload) => {
				if (!!payload.data && payload.data.length > 0) {
					this.invoiceGroups = payload.data;
					this.paginationObj.totalRecord = payload.total;
					this.loading = false;
				}
				this.systemModuleService.off();
			})
			.catch((err) => {
				this.systemModuleService.announceSweetProxy(
					'There was a problem getting invoices. Please try again later!',
					'error'
				);
			});
	}

	onClickFindBillHistory() {
		if (!!this.dateRange.from && !!this.dateRange.to) {
			this.loading = true;
			this.disableSearchBtn = true;
			this.searchBtn = false;
			this.searchingBtn = true;
			const query = {
				facilityId: this.selectedFacility._id,
				startDate: this.dateRange.from,
				endDate: this.dateRange.to
			};

			this.invoiceService
				.search({ query })
				.then((res) => {
					this.loading = false;
					this.disableSearchBtn = false;
					this.searchBtn = true;
					this.searchingBtn = false;
					if (res.status === 'success' && res.data.length > 0) {
						this.invoiceGroups = res.data.filter((x) => x.paymentCompleted);
					}
				})
				.catch((err) => {
					this.loading = false;
					this.disableSearchBtn = false;
					this.searchBtn = true;
					this.searchingBtn = false;
				});
		} else {
			this.systemModuleService.announceSweetProxy('Please select HMO and date range', 'error');
		}
	}

	setReturnValue(dateRange: any) {
		if (dateRange !== null) {
			this.dateRange = dateRange;
		}
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}
	gotoPage(index: number) {
		this.paginationObj.currentPage = index;
		// Get the data for the selected page index
		this.getPatientInvoices();
	}
}
