import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { InvoiceService, EmployeeService } from '../../../../../services/facility-manager/setup/index';
import { Facility, Invoice } from '../../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-payment-history-details',
	templateUrl: './payment-history-details.component.html',
	styleUrls: [ './payment-history-details.component.scss' ]
})
export class PaymentHistoryDetailsComponent implements OnInit {
	invoiceDetails: any;
	constructor(
		private _route: Router,
		private _router: ActivatedRoute,
		private locker: CoolLocalStorage,
		private invoiceService: InvoiceService,
		private employeeService: EmployeeService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this._router.params.subscribe((params) => {
			this.systemModuleService.on();
			const id = params['id'];
			if (id !== undefined) {
				this.invoiceService.get(id, {}).then((payload) => {
					this.invoiceDetails = payload;
					this.invoiceDetails.payments.forEach((element) => {
						try {
							this.employeeService.get(element.createdBy, {}).then(
								(payload) => {
									element.cashier = payload;
								},
								(err) => {
									element.cashier = {};
								}
							);
						} catch (e) {
							element.cashier = {};
						}
					});
					this.systemModuleService.off();
				});
			}
		});
	}

	getUnitPrice(serviceId) {
		const unitPrice = this.invoiceDetails.billingIds.find(
			(x) => x.billObject.facilityServiceObject.serviceId.toString() === serviceId.toString()
		);
		return unitPrice.billObject.unitPrice;
	}
}
