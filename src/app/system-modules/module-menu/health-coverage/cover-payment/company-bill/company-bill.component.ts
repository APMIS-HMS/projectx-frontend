import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
	FacilitiesService,
	BillingService,
	PatientService,
	InvoiceService
} from '../../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice, BillModel } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-company-bill',
	templateUrl: './company-bill.component.html',
	styleUrls: [ './company-bill.component.scss' ]
})
export class CompanyBillComponent implements OnInit, OnDestroy {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	@Output() toList: EventEmitter<boolean> = new EventEmitter<boolean>();

	public frmBillLookup: FormGroup;
	itemEdit = new FormControl('', [ Validators.required, <any>Validators.pattern('/^d+$/') ]);
	itemQtyEdit = new FormControl('', [ Validators.required, <any>Validators.pattern('/^d+$/') ]);
	txtSelectAll = new FormControl('', []);
	select1 = new FormControl('', []);
	select2 = new FormControl('', []);
	select3 = new FormControl('', []);
	searchPendingInvoices = new FormControl('', []);
	searchPendingBill = new FormControl('', []);

	addItem = false;
	makePayment = false;
	addModefierPopup = false;
	addLineModefierPopup = false;
	priceItemDetailPopup = false;
	itemEditShow = false;
	itemEditShow2 = false;
	itemEditShow3 = false;
	selectAll = false;

	cat1 = false;
	cat2 = false;
	cat3 = false;

	selectedPatient: Patient = <Patient>{};
	selectedFacility: Facility = <Facility>{};
	selectedBillItem: BillModel = <BillModel>{};
	billGroups: any[] = [];
	masterBillGroups: any[] = [];
	invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
	selectedGroup: any = <any>{};
	selectedServiceBill: any = <any>{};
	subTotal = 0;
	total = 0;
	discount = 0;
	subscription: Subscription;
	constructor(
		private locker: CoolLocalStorage,
		private formBuilder: FormBuilder,
		public facilityService: FacilitiesService,
		private invoiceService: InvoiceService,
		private router: Router,
		private billingService: BillingService,
		private patientService: PatientService
	) {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.patientService.receivePatient().subscribe((payload: Patient) => {
			this.selectedPatient = payload;
			this.subTotal = 0;
			this.total = 0;
			this.discount = 0;
			this.getPatientBills();
		});

		this.invoiceService.receiveDiscount().subscribe((payload: any) => {
			const valueCheck = payload.valueCheck;
			const modifier = payload.modifier;
			if (valueCheck === 'Percentage') {
				this.discount = modifier / 100 * this.total;
			} else {
				this.discount = modifier;
			}
			this.reCalculateBillTotal();
		});

		this.subscription = this.invoiceService.receiveInvoice().subscribe((payload: any) => {
			payload.forEach((itemi, i) => {
				if (itemi.isModified !== undefined) {
					this.fixedModifiedBill(itemi);
				} else {
					this.fixedGroup(itemi);
				}
			});
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	fixedModifiedBill(payload) {
		const groups = this.billGroups.filter((x) => x.categoryId === payload.facilityServiceObject.categoryId);
		if (groups.length > 0) {
			const group = groups[0];
			group.bills.forEach((itemi, i) => {
				if (itemi._id === payload._id) {
					group.bills[i] = payload;
					this.reCalculateBillTotal();
				}
			});
		}
	}
	onGenerateInvoice() {
		const billGroup: Invoice = <Invoice>{ billingIds: [] };
		billGroup.facilityId = this.selectedFacility._id;
		billGroup.patientId = this.selectedPatient._id;

		this.billGroups.forEach((itemg, g) => {
			itemg.bills.forEach((itemb: BillModel, b) => {
				if (itemb.isChecked) {
					billGroup.billingIds.push({ billingId: itemb._id });
				}
			});
		});

		if (billGroup.billingIds.length > 0) {
			billGroup.totalDiscount = this.discount;
			billGroup.totalPrice = this.subTotal;
			billGroup.grandAmount = this.total;
			this.invoiceService.create(billGroup).then(
				(payload) => {
					this.router.navigate([ '/dashboard/payment/invoice', payload.patientId ]);
				},
				(error) => {}
			);
		}
	}
	fixedGroup(bill: BillModel) {
		const existingGroupList = this.billGroups.filter((x) => x.categoryId === bill.facilityServiceObject.categoryId);
		if (existingGroupList.length > 0) {
			const existingGroup = existingGroupList[0];
			if (existingGroup.isChecked) {
				bill.isChecked = true;
			}
			const existingBills = existingGroup.bills.filter(
				(x) => x.facilityServiceObject.serviceId === bill.facilityServiceObject.serviceId
			);
			if (existingBills.length > 0) {
				const existingBill = existingBills[0];
				existingBill.qty = existingBill.qty + bill.qty;
				existingBill.amount = existingBill.qty * existingBill.unitPrice;

				// existingGroup.total = existingGroup.total + bill.amount;
				this.subTotal = this.subTotal + existingGroup.total;
				this.total = this.subTotal - this.discount;
			} else {
				existingGroup.bills.push(bill);
				this.subTotal = this.subTotal + existingGroup.total;
				this.total = this.subTotal - this.discount;
			}
			existingGroup.isOpened = false;
			this.toggleCurrentCategory(existingGroup);
		} else {
			const group = {
				isChecked: false,
				total: 0,
				isOpened: false,
				categoryId: bill.facilityServiceObject.categoryId,
				category: bill.facilityServiceObject.category,
				bills: []
			};
			bill.isChecked = false;
			group.bills.push(bill);
			this.billGroups.push(group);
			this.total = this.subTotal - this.discount;
			group.isOpened = false;
			this.toggleCurrentCategory(group);
		}
	}
	fixedGroupExisting(bill: BillItem) {
		const inBill: BillModel = <BillModel>{};
		inBill.amount = bill.totalPrice;
		inBill.itemDesc = bill.description;
		inBill.itemName = bill.facilityServiceObject.service;
		inBill.qty = bill.quantity;
		inBill.unitPrice = bill.unitPrice;
		inBill._id = bill._id;
		inBill.facilityServiceObject = bill.facilityServiceObject;
		inBill.billObject = bill;

		const existingGroupList = this.billGroups.filter((x) => x.categoryId === bill.facilityServiceObject.categoryId);
		if (existingGroupList.length > 0) {
			const existingGroup = existingGroupList[0];
			if (existingGroup.isChecked) {
				bill.isChecked = true;
			}
			const existingBills = existingGroup.bills.filter(
				(x) => x.facilityServiceObject.serviceId === bill.facilityServiceObject.serviceId
			);
			if (existingBills.length > 100000) {
				const existingBill = existingBills[0];
				existingBill.qty = existingBill.qty + bill.quantity;
				existingBill.amount = existingBill.qty * existingBill.unitPrice;
				this.subTotal = this.subTotal + existingGroup.total;
				this.total = this.subTotal - this.discount;
			} else {
				existingGroup.bills.push(inBill);
				this.subTotal = this.subTotal + existingGroup.total;
				this.total = this.subTotal - this.discount;
			}
			existingGroup.isOpened = false;
			this.toggleCurrentCategory(existingGroup);
		} else {
			const group = {
				isChecked: false,
				total: 0,
				isOpened: false,
				categoryId: bill.facilityServiceObject.categoryId,
				category: bill.facilityServiceObject.category,
				bills: []
			};
			inBill.isChecked = false;
			group.bills.push(inBill);
			this.billGroups.push(group);
			this.billGroups.sort((p) => p.categoryId);
			this.total = this.subTotal - this.discount;
			group.isOpened = false;
			this.toggleCurrentCategory(group);
		}
	}
	getBill(payload: any) {
		const bill: BillItem = <BillItem>{};
		bill.description = payload.itemDesc;
		bill.facilityServiceId = payload.service.facilityServiceId;
		bill.quantity = payload.qty;
		bill.serviceId = payload.service.serviceId;
		bill.totalPrice = payload.amount;
		bill.unitPrice = payload.unitPrice;
		return bill;
	}
	ngOnInit() {
		this.pageInView.emit('Generate Bill');
		this.itemQtyEdit.valueChanges.subscribe((value) => {
			this.selectedBillItem.qty = value;
			this.selectedBillItem.amount = this.selectedBillItem.qty * this.selectedBillItem.unitPrice;
			this.reCalculateBillTotal();
		});
	}
	getPatientBills() {
		this.billGroups = [];
		this.masterBillGroups = [];
		this.txtSelectAll.setValue(false);
		this.billingService
			.find({
				query: { facilityId: this.selectedFacility._id, patientId: this.selectedPatient._id, isinvoice: true }
			})
			.then((payload) => {
				this.masterBillGroups = [];
				this.billGroups = [];
				payload.data.forEach((itemi, i) => {
					this.masterBillGroups.push(itemi);
					itemi.billItems.forEach((itemj, j) => {
						this.fixedGroupExisting(itemj);
					});
				});
			});
	}
	onRemoveDiscount() {
		this.discount = 0;
		this.reCalculateBillTotal();
	}
	reCalculateBillTotal() {
		this.subTotal = 0;
		this.total = 0;
		this.billGroups.forEach((itemi, i) => {
			itemi.total = 0;
			itemi.bills.forEach((itemj, j) => {
				if (itemj.isChecked) {
					itemi.total = itemi.total + itemj.qty * itemj.unitPrice;
					this.subTotal = this.subTotal + itemj.qty * itemj.unitPrice;
				}
			});
		});
		this.total = this.subTotal - this.discount;
	}

	onRemoveBill(bill: BillModel, group: any) {
		group.bills.forEach((itemi, i) => {
			if (itemi.service.serviceId === bill.service.serviceId) {
				group.bills.splice(i, 1);
				this.reCalculateBillTotal();
			}
		});
	}
	checkAll(val: boolean) {
		this.billGroups.forEach((itemi, i) => {
			itemi.isChecked = val;
			itemi.bills.forEach((itemj, j) => {
				itemj.isChecked = val;
			});
		});
		this.reCalculateBillTotal();
	}
	selectAll_change(e) {
		if (e.target.checked) {
			this.selectAll = true;
			this.checkAll(true);
		} else {
			this.selectAll = false;
			this.checkAll(false);
		}
	}
	checkGroup(event: any, group: any) {
		group.isChecked = event.target.checked;
		if (!group.isChecked) {
			this.subTotal = this.subTotal - group.total;
			this.total = this.total - group.total;
		}
		group.total = 0;
		group.bills.forEach((itemi, i) => {
			itemi.isChecked = group.isChecked;
			if (itemi.isChecked) {
				group.total = group.total + itemi.amount;
				this.subTotal = this.subTotal + itemi.amount;
				this.total = this.total + itemi.amount;
			} else {
				group.total = 0;
			}
		});
	}
	checkBill(event: any, bill: any, group: any) {
		bill.isChecked = event.target.checked;
		if (bill.isChecked) {
			group.total = group.total + bill.amount;
			this.subTotal = this.subTotal + bill.amount;
			this.total = this.total + bill.amount;
		} else {
			group.total = group.total - bill.amount;
			this.subTotal = this.subTotal - bill.amount;
			this.total = this.total - bill.amount;
		}
		this.unCheckGroupIfEmpty(group);
	}
	unCheckGroupIfEmpty(group) {
		const checkedBills = group.bills.filter((x) => x.isChecked);
		if (checkedBills.length < group.bills.length) {
			group.isChecked = false;
		} else if (checkedBills.length === group.bills.length) {
			group.isChecked = true;
		}
	}
	toggleCurrentCategory(group: any) {
		this.selectedGroup = group;
		this.selectedGroup.isOpened = !this.selectedGroup.isOpened;
	}
	isCurrentCategory(group: any) {
		if (group.isOpened) {
			return true;
		}
		return this.selectedGroup.categoryId === group.categoryId && this.selectedGroup.isOpened;
	}
	isCurrentBill(bill: BillModel, group: any) {
		this.selectedGroup = group;
		if (this.selectedBillItem === undefined || this.selectedBillItem.facilityServiceObject === undefined) {
			return false;
		}
		return this.selectedBillItem._id === bill._id;
	}
	toggleCat2() {
		this.cat2 = !this.cat2;
	}
	toggleCat3() {
		this.cat3 = !this.cat3;
	}
	itemEditToggle(bill: BillModel) {
		this.itemEditShow = !this.itemEditShow;
		this.selectedBillItem = bill;
		if (!this.itemEditShow) {
			this.selectedBillItem = <BillModel>{};
		}
		if (!this.itemEditShow) {
			this.masterBillGroups.forEach((itemi, i) => {
				itemi.billItems.forEach((itemy, y) => {
					if (itemy._id === bill._id) {
						itemy.quantity = bill.qty;
						itemy.totalPrice = bill.amount;
						itemy.unitPrice = bill.unitPrice;
						this.billingService.update(itemi).then((payload) => {});
					}
				});
			});
		}
	}
	itemEditToggle2() {
		this.itemEditShow2 = !this.itemEditShow2;
	}
	itemEditToggle3() {
		this.itemEditShow3 = !this.itemEditShow3;
	}
	addModefier() {
		this.addModefierPopup = true;
	}
	lineModifier_show(bill: BillModel) {
		this.selectedServiceBill = bill;
		this.addLineModefierPopup = true;
	}
	addItem_show() {
		this.addItem = true;
	}
	itemDetail(bill: any) {
		this.selectedServiceBill = bill;
		this.priceItemDetailPopup = true;
	}
	makePayment_onclick() {
		this.makePayment = true;
	}
	close_onClick(e) {
		this.addModefierPopup = false;
		this.addLineModefierPopup = false;
		this.addItem = false;
		this.priceItemDetailPopup = false;
		this.makePayment = false;
	}
	hmoList_click() {
		this.toList.emit(true);
	}
}
