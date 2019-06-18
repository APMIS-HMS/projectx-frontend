import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
	FacilitiesService,
	BillingService,
	PatientService,
	InvoiceService,
	SearchInvoicesService,
	PendingBillService,
	TodayInvoiceService
} from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, BillIGroup, Invoice, User } from '../../../../models/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-invoice',
	templateUrl: './invoice.component.html',
	styleUrls: [ './invoice.component.scss' ]
})
export class InvoiceComponent implements OnInit, OnDestroy {
	public frmAddItem: FormGroup;
	itemEdit = new FormControl('', [ Validators.required, <any>Validators.pattern('/^d+$/') ]);
	itemQtyEdit = new FormControl('', [ Validators.required, <any>Validators.pattern('/^d+$/') ]);

	addModefierPopup = false;
	addLineModefierPopup = false;
	priceItemDetailPopup = false;
	makePaymentPopup = false;
	isPaidClass = false;
	isWaved = false;
	addItem = false;
	// paidStatus = "UNPAID";
	itemEditShow = false;
	itemEditShow2 = false;
	itemEditShow3 = false;
	itemAmount = '20,000.00';
	itemQty = 2;
	user: any = <any>{};

	searchPendingInvoice = new FormControl('', []);
	searchOtherPendingInvoice = new FormControl('', []);
	searchPendingInvoices = new FormControl('');
	selectedPatient: Patient = <Patient>{};
	selectedFacility: Facility = <Facility>{};
	selectedBillItem: BillItem = <BillItem>{};
	invoice: Invoice = <Invoice>{ billingDetails: [], totalPrice: 0, totalDiscount: 0 };
	selectedInvoiceGroup: Invoice = <Invoice>{};
	isLoadingInvoice = false;
	isLoadingOtherInvoice = false;
	holdMostRecentInvoices: Invoice[] = [];
	holdMostRecentOtherInvoices: Invoice[] = [];
	isPaymentMade = false;
	invoiceGroups: Invoice[] = [];
	otherInvoiceGroups: any[] = [];
	otherInvoiceGroups2: any[] = [];
	subscription: Subscription;
	constructor(
		private formBuilder: FormBuilder,
		private locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
		private invoiceService: InvoiceService,
		private billingService: BillingService,
		private router: Router,
		private route: ActivatedRoute,
		private patientService: PatientService,
		private _searchInvoicesService: SearchInvoicesService,
		private _pendingBillService: PendingBillService,
		private systemModuleService: SystemModuleService,
		private _todayInvoiceService: TodayInvoiceService
	) {
		this.user = <User>this.locker.getObject('auth');
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.patientService.receivePatient().subscribe((payload: Patient) => {
			this.selectedPatient = payload;
			this.selectedInvoiceGroup = <Invoice>{ invoiceNo: '', createdAt: undefined };
			this.getPatientInvoices();
		});
		this.subscription = this.invoiceService.receiveInvoice().subscribe((payload: any) => {
			this.invoice.billingDetails.push(payload);
			this.invoice.billingDetails.forEach((item: any) => {
				this.invoice.totalPrice = this.invoice.totalPrice + item.amount;
			});
		});
	}
	getPatientInvoices() {
		this.isLoadingInvoice = true;
		this.invoiceService
			.find({
				query: {
					facilityId: this.selectedFacility._id,
					$sort: { updatedAt: -1 },
					patientId: this.selectedPatient._id
				}
			})
			.then((payload) => {
				this.invoiceGroups = payload.data;
				console.log(this.invoiceGroups);
				this.holdMostRecentInvoices = this.invoiceGroups;
				this.isLoadingInvoice = false;
			})
			.catch((err) => {
				this.systemModuleService.announceSweetProxy(
					'There was a problem getting invoices. Please try again later!',
					'error'
				);
			});

		this.isLoadingOtherInvoice = true;
		this.invoiceService
			.find({
				query: {
					patientId: { $ne: this.selectedPatient._id },
					facilityId: this.selectedFacility._id,
					paymentCompleted: false,
					$sort: { updatedAt: -1 }
				}
			})
			.then((payload) => {
				this.otherInvoiceGroups = payload.data;
				this.holdMostRecentOtherInvoices = this.otherInvoiceGroups;
				this.isLoadingOtherInvoice = false;
			})
			.catch((err) => {
				this.systemModuleService.announceSweetProxy(
					'There was a problem getting other invoices. Please try again later!',
					'error'
				);
			});
	}

	ngOnInit() {
		this.frmAddItem = this.formBuilder.group({
			service: [ '', [ <any>Validators.required ] ],
			qty: [ '', [ <any>Validators.required ] ]
		});
		this.subscription = this.route.params.subscribe((params) => {
			const invoiceId = params['id'];
			if (invoiceId !== undefined) {
				this.invoiceService.get(invoiceId, {}).then((payload) => {
					this.selectedInvoiceGroup = payload;
					this.selectedPatient = payload.patientObject;
					this.getPatientInvoices();
				});
			}
		});

		this.searchOtherPendingInvoice.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			if (this.searchOtherPendingInvoice.value !== '' && this.searchOtherPendingInvoice.value.length >= 3) {
				this.isLoadingOtherInvoice = true;
				this.invoiceService
					.search({
						query: {
							facilityId: this.selectedFacility._id,
							patientId: { $ne: this.selectedPatient._id },
							name: value
						}
					})
					.then((payload) => {
						this.otherInvoiceGroups = payload.data;
						this.isLoadingOtherInvoice = false;
					})
					.catch((err) => {
						this.isLoadingOtherInvoice = false;
						this.otherInvoiceGroups = this.holdMostRecentOtherInvoices;
						this.systemModuleService.announceSweetProxy(
							'There was a problem getting pending bills. Please try again later!',
							'error'
						);
					});
			} else {
				this.otherInvoiceGroups = this.holdMostRecentOtherInvoices;
				this.isLoadingOtherInvoice = false;
			}
		});

		this.searchPendingInvoice.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			if (this.searchPendingInvoice.value !== '' && this.searchPendingInvoice.value.length >= 3) {
				this.isLoadingInvoice = true;
				this.invoiceService
					.find({
						query: {
							facilityId: this.selectedFacility._id,
							patientId: this.selectedPatient._id,
							invoiceNo: {
								$regex: this.searchPendingInvoice.value,
								$options: 'i'
							}
						}
					})
					.then((payload) => {
						this.invoiceGroups = payload.data;
						this.isLoadingInvoice = false;
					})
					.catch((err) => {
						this.isLoadingInvoice = false;
						this.invoiceGroups = this.holdMostRecentInvoices;
						this.systemModuleService.announceSweetProxy(
							'There was a problem getting pending bills. Please try again later!',
							'error'
						);
					});
			} else {
				this.invoiceGroups = this.holdMostRecentInvoices;
				this.isLoadingInvoice = false;
			}
		});
	}
	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
	onSelectedInvoice(group) {
		this.selectedInvoiceGroup = group;
	}

	onPersonValueUpdated(item) {
		if (item.person !== undefined) {
			this.selectedPatient.personDetails = item.person;
		}
		this.isLoadingInvoice = false;
		this.isLoadingOtherInvoice = false;
		this.selectedInvoiceGroup = item.invoice;
		this.getPatientInvoices();
	}

	onSelectedOtherPatientInvoice(invoice) {
		this.router.navigate([ '/dashboard/payment/invoice', invoice._id ]).then((routePayload) => {
			this.isLoadingInvoice = true;
			this.isLoadingOtherInvoice = true;
		});
	}

	addModefier() {
		this.addModefierPopup = true;
	}
	lineModifier_show() {
		this.addLineModefierPopup = true;
	}
	addItem_show() {
		this.addItem = true;
	}
	makePayment_show() {
		if (this.selectedInvoiceGroup.totalPrice !== 0 && this.selectedInvoiceGroup.totalPrice !== undefined) {
			if (this.selectedInvoiceGroup.paymentCompleted === false) {
				// if (this.selectedPatient.personDetails.wallet.balance < this.selectedInvoiceGroup.totalPrice) {
				//     this._notification('Info', "You donot have sufficient balance to make this payment");
				// } else {

				// }
				this.makePaymentPopup = true;
			} else {
				this._notification('Info', 'Selected invoice is paid');
			}
		} else {
			this._notification('Info', 'You cannot make payment for a Zero cost service, please select an invoice');
		}
	}

	close_onClick(e) {
		this.addModefierPopup = false;
		this.addLineModefierPopup = false;
		this.addItem = false;
		this.priceItemDetailPopup = false;
		this.makePaymentPopup = false;
	}
	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
	itemEditToggle() {
		this.itemEditShow = !this.itemEditShow;
	}
	itemEditToggle2() {
		this.itemEditShow2 = !this.itemEditShow2;
	}
	itemEditToggle3() {
		this.itemEditShow3 = !this.itemEditShow3;
	}
	itemDetail(billItem: BillItem) {
		this.priceItemDetailPopup = true;
		this.selectedBillItem = billItem;
	}
	print() {
        const printContents = document.getElementById('invoicePrint').innerHTML;
		let popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
        popupWin.document.write(`
        <html>
                <head>
                <title></title>
                <style>
                //........Customized style.......
                @import "../../../../globals/variables.scss";
                @import "../../../../globals/normalize.scss";

                .image_container{
                    vertical-align: middle;
                    width: 80px;
                    height: 80px;
                    img{
                        max-width:100%; 
                        max-height:100%;
                        margin:auto;
                        display:block;
                        object-fit: cover;
                    }
                }
                
                .card-container{
                    display:grid; padding-right: 30px; padding-left: 30px;
                }

                .img_wrap{
                    display: grid;
                    justify-content: center;
                    justify-items: center;
                    justify-self: center;
                    text-align: center;
                    align-items: center;
                    align-content: center;
                    align-self: center;
                  }
                .megaPgWrap{
                    display: flex;
                    justify-content: space-between;
                }
                .feedsWrap{
                    width: 180px;
                    padding: 5px;
                }
                .feedbox{
                    background: #EEEEEE;
                    width: 100%;
                    min-height: 200px;
                    margin-bottom: 10px;
                }
                .feedsWrap input, .feedsWrap select{
                    width: 80%;
                }
                .cta-1{
                    width: 130px;
                    height: 30px;
                    font-size: 1.2rem;
                }
                .feedsWrap .frm-item-wrap{
                    padding-bottom: 10px;
                }
                .contentCol{
                    width: 800px;
                    border: 1px solid #EEEEEE;
                    margin: 0 2px;
                }
                .suggestionFeeds{
                    width: 245px;
                    margin: 0 auto;
                    display: flex;
                    flex-wrap: wrap;
                }
                .suggestedItem{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    max-width: 185px;
                    background: #BDBDBD;
                    border-radius: 20px;
                    padding: 3px;
                    border: 0.5px solid #9E9E9E;
                    margin-top: 5px;
                    margin-left: 3px;
                    cursor: pointer;
                }
                .pay-tag{
                    position:absolute;
                    top:40%;
                    left:40%;
                    z-index:1;
                    font-family:Arial,sans-serif;
                    -webkit-transform: rotate(-45deg); /* Safari */
                    -moz-transform: rotate(-45deg); /* Firefox */
                    -ms-transform: rotate(-45deg); /* IE */
                    -o-transform: rotate(-45deg); /* Opera */
                    transform: rotate(-45deg);
                    font-size:40px;
                    color:#c00;
                    background:#fff;
                    border:solid 4px #c00;
                    padding:5px;
                    border-radius:5px;
                    zoom:1;
                    filter:alpha(opacity=20);
                    opacity:0.2;
                    -webkit-text-shadow: 0 0 2px #c00;
                    text-shadow: 0 0 2px #c00;
                    box-shadow: 0 0 2px #c00;
                }
                div.invoice.paid:after
                {
                    position:absolute;
                    top:40%;
                    left:40%;
                    z-index:1;
                    font-family:Arial,sans-serif;
                    -webkit-transform: rotate(-45deg); /* Safari */
                    -moz-transform: rotate(-45deg); /* Firefox */
                    -ms-transform: rotate(-45deg); /* IE */
                    -o-transform: rotate(-45deg); /* Opera */
                    transform: rotate(-45deg);
                    font-size:40px;
                    color:#c00;
                    background:#fff;
                    border:solid 4px #c00;
                    padding:5px;
                    border-radius:5px;
                    zoom:1;
                    filter:alpha(opacity=20);
                    opacity:0.2;
                    -webkit-text-shadow: 0 0 2px #c00;
                    text-shadow: 0 0 2px #c00;
                    box-shadow: 0 0 2px #c00;
                }
                .suggestedItem:hover{
                    background: #9E9E9E;
                }
                .suggetedName {
                    font-size: 1.2rem;
                }
                .billHeader{
                    font-family: $font-titles;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: #01579B;
                    padding: 10px;
                    width: 100%;
                    height: 80px;
                    box-sizing: border-box;
                }
                .billHeaderLogoWrap{
                    text-align: center;
                }
                .billHeaderLogoWrap img{
                    width: 40px;
                    border: 5px solid #fff;
                }
                .BillfacilityName{
                    color: #fff;
                    font-size: 1.6rem;
                }
                .billContact{
                    display: flex;
                    align-items: center;
                    color: #03A9F4;
                    font-size: 1.2rem;
                    margin: 5px;
                }
                .billContact i{
                    margin-right: 10px;
                }
                .invoiceLabel{
                    font-size: 2.5rem;
                    color: #BCAAA4;
                }
                .billBody{
                    margin: 20px 0;
                }
                .topsecInnerWrap{
                    font-size: 1.1rem;
                    color: #37474F;
                    line-height: 1.5;
                    margin-left: 10px;
                    min-width: 160px;
                }
                .clientName{
                    font-family: $font-titles;
                    text-transform: uppercase;
                    border-bottom: 1px solid #EEEEEE;
                    padding: 0 0 5px 5px;
                    font-size: 2rem;
                    color: #01579B;
                    margin-bottom: 5px;
                }
                .rhsSectA{
                    border-bottom: 1px solid #EEEEEE;
                    padding-left: 5px;
                    padding-bottom: 5px;
                }
                .semiWrapper{
                    display: flex;
                    justify-content: space-between;
                    margin-right: 10px;
                    line-height: 2;
                }
                .semiWrapper .label{
                    padding-right: 20px;
                }
                .semiWrapper .data{
                    font-weight: bold;
                    text-align: right;
                }
                .rhsSectB {
                    text-align: right;
                    font-size: 1.4rem;
                    color: #000;
                    margin: 5px 10px 0 0;
                }
                .topTotal{
                    font-weight: bold;
                }
                .billContentSect{
                    position: relative;
                }
                .btn-addItem{
                    margin: 20px 0 -14px 9px;
                }
                .billContentSect .tblBg{
                    margin: 20px auto;
                    color: #424242;
                    border-collapse: collapse;
                    width: 98%;
                }
                .billContentSect .tblBg td, .billContentSect .tblBg th{
                    min-width: 90px;
                    padding: 15px 10px;
                }
                .billContentSect .tblBg td{
                    border-bottom: 0.1px solid #F5F5F5;
                }
                thead{
                    font-size: 1.6rem;
                    border-bottom: 2px solid #BDBDBD;
                }
                thead .col1{
                    font-weight: normal;
                }
                thead .col2, thead .col3, thead .col4, thead .col4-5, thead .col5{
                    font-weight: bold;
                }
                .col2, .col3, .col4, .col4-5, .col5{
                    text-align: center;
                }
                .col2, .col3, .col4, .col4-5, .col1{
                    cursor: pointer;
                }
                thead .col4, tbody .col4{
                    color: #fff;
                    background: #03A9F4;
                }
                .billContentSect tbody tr:hover{
                    border-left: 5px solid #03A9F4
                }
                .col4-5{
                    color: #fff;
                    background: #1565C0;
                }
                .col1{
                    background: #FAFAFA;
                }
                .col2{
                    background: #E0E0E0;
                }
                .col3{
                    background: #EEEEEE;
                }
                .col5{
                    background: #FF7043;
                    color: #fff;
                }
                .col5 i{
                    cursor: pointer;
                    padding: 3px;
                    margin: 3px;
                    border: 1px solid #FF7043;
                    text-align: center;
                }
                .col2 input, .col3 input{
                    width: 80%;
                    margin: 0;
                    padding: 0 5px;
                }
                .itemName{
                    font-size: 1.4rem;
                    font-weight: bold;
                }
                .itemDesc{
                    font-size: 1rem;
                    font-weight: normal;
                    color: #BDBDBD;
                    max-width: 170px;
                }
                .billSummarySect{
                    background: #757575;
                    color: #fff;
                    width: 100%;
                    padding: 10px;
                    box-sizing: border-box;
                    overflow: hidden;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .summaryItems{
                    color: #BDBDBD;
                    border-bottom: 1px solid #BDBDBD;
                    text-align: right;
                }
                .summaryItem, .grandTotalWrap{
                    display: flex;
                    justify-content: space-between;
                    margin-right: 10px;
                    line-height: 2;
                }
                .summaryItem .label, .grandTotalWrap .label{
                    padding-right: 20px;
                    font-size: 1.2rem;
                }
                .summaryItem .data, .grandTotalWrap .data{
                    width: 150px;
                    font-weight: bold;
                    font-size: 1.6rem;
                }
                .grandTotalWrap .label, .grandTotalWrap .data{
                    color: #fff;
                    font-weight: bold;
                    text-align: right;
                }
                .billSummarySect table td{
                    width: 100px;
                    padding: 2px 10px;
                }
                .billFooter{
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                }
                .billFooter img{
                    width: 15px;
                    margin-right: 10px;
                }
                .BillfooterTxt{
                    font-size: 1rem;
                    color: #757575;
                }
                .col5 .cta-1{
                    margin: 0;
                    background: transparent;
                    border: 1px solid #fff;
                    width: auto;
                    height: auto;
                    padding: 3px 5px;
                    font-size: 1rem;
                }
                .printIco {
                    position: absolute;
                    right: 5px;
                    font-size: 2.6rem;
                    top: 0px;
                    color: #424242;
                    cursor: pointer;
                }
                .printIco:hover{
                    color: #0288D1;
                }
                </style>
                </head>
                <body onload="window.print();window.close()">${printContents}</body>
            </html>`
		);
		popupWin.document.close();
	}

	printIt() {
		window.print();
	}
}
