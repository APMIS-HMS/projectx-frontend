import { Component, OnInit } from '@angular/core';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';
import {
	PurchaseEntryService,
	EmployeeService,
	SupplierService
} from '../../../../services/facility-manager/setup/index';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, Employee } from '../../../../models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';

@Component({
	selector: 'app-invoices',
	templateUrl: './invoices.component.html',
	styleUrls: [ './invoices.component.scss' ]
})
export class InvoicesComponent implements OnInit {
	slideInvoiceDetails = false;
	frmSupplier: FormControl = new FormControl();
	frmSearch: FormControl = new FormControl();
	// frmSupplier: FormControl = new FormControl();
	searchOpen = false;

	invoices: any[] = [];
	suppliers: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedProduct: any = <any>{};
	checkingStore: any = <any>{};
	subscription: any = <any>{};
	loginEmployee: Employee = <Employee>{};
	constructor(
		private _purchaseEventEmitter: PurchaseEmitterService,
		private locker: CoolLocalStorage,
		private invoiceService: PurchaseEntryService,
		private employeeService: EmployeeService,
		private supplierService: SupplierService,
		private router: Router,
		private authFacadeService: AuthFacadeService,
		private route: ActivatedRoute,
		private systemModuleService: SystemModuleService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.subscription = this.employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						this.getInvoices();
					}
				}
			}
		});
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			// this.checkingObject = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
			if (this.loginEmployee.storeCheckIn !== undefined || this.loginEmployee.storeCheckIn.length > 0) {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						this.checkingStore = { typeObject: itemr, type: 'store' };
						this.employeeService.announceCheckIn(this.checkingStore);

						// tslint:disable-next-line:no-shadowed-variable
						this.employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
								this.checkingStore = { typeObject: itemr, type: 'store' };
								this.employeeService.announceCheckIn(this.checkingStore);
								this.locker.setObject('checkingObject', this.checkingStore);
								// this.checkingObject = this.checkingObject.typeObject;
								this.getInvoices();
								this.getSuppliers();
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							// tslint:disable-next-line:no-shadowed-variable
							this.employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload) => {
									this.loginEmployee = payload;
									this.checkingStore = { typeObject: itemr, type: 'store' };
									this.employeeService.announceCheckIn(this.checkingStore);
									this.locker.setObject('checkingObject', this.checkingStore);
									// this.checkingObject = this.checkingObject.typeObject;
									this.getInvoices();
									this.getSuppliers();
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {
		this._purchaseEventEmitter.setRouteUrl('Purchase Invoices');
		// this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		// this.authFacadeService.getLogingEmployee().then((payload: any) => {
		//   this.checkingStore = payload;
		//   this.checkingStore = payload.storeCheckIn.find(x => x.isOn === true);
		//   this.getInvoices();
		//   this.getSuppliers();
		// });

		this.frmSearch.valueChanges.subscribe((value) => {
			if (value !== null) {
				this.invoiceService
					.find({
						query: {
							$or: [
								{
									'products.productObject.name': {
										$regex: value,
										$options: 'i'
									}
								},
								{ invoiceNumber: value }
							],
							$sort: { createdAt: -1 }
						}
					})
					.subscribe((payload) => {
						this.invoices = payload.data;
					});
			}
		});

		this.frmSupplier.valueChanges.subscribe((value) => {
			if (value !== null) {
				this.invoiceService
					.find({ query: { supplierId: value, $sort: { createdAt: -1 } } })
					.subscribe((payload) => {
						this.invoices = payload.data;
					});
			}
		});
	}

	getSuppliers() {
		this.systemModuleService.on();
		this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(
			(payload) => {
				this.suppliers = payload.data;
				this.systemModuleService.off();
			},
			(err) => {
				this.systemModuleService.off();
			}
		);
	}
	getInvoices() {
		this.systemModuleService.on();
		if (this.checkingStore !== null) {
			this.invoiceService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						storeId: this.checkingStore.storeId,
						$sort: { createdAt: -1 }
					}
				})
				.then(
					(payload) => {
						this.invoices = payload.data;
						this.systemModuleService.off();
					},
					(error) => {
						this.systemModuleService.off();
					}
				);
		}
	}
	slideInvoiceDetailsToggle(value, event) {
		this.selectedProduct = value;
		if (this.selectedProduct !== undefined) {
			this.invoiceService.get(this.selectedProduct._id, {}).then((payload) => {});
		}

		this.slideInvoiceDetails = !this.slideInvoiceDetails;
	}
	onNavigateToPayment(value) {
		this.router.navigate([ '/dashboard/product-manager/supplier-detail', value.supplierId ]);
	}

	onEditInvoice(invoice) {
		this.router.navigate([ '/dashboard/purchase-manager/purchase-entry-edit', invoice._id ]);
	}

	ngOnDestroy() {
		if (this.loginEmployee.storeCheckIn !== undefined) {
			this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
				if (itemr.storeObject === undefined) {
					const store_ = this.loginEmployee.storeCheckIn.find(
						(x) => x.storeId.toString() === itemr.storeId.toString()
					);
					itemr.storeObject = store_.storeObject;
				}
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this.employeeService.update(this.loginEmployee).then(
						(payload) => {
							this.loginEmployee = payload;
						},
						(err) => {}
					);
				}
			});
		}
		this.employeeService.announceCheckIn(undefined);
		this.locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}
}
