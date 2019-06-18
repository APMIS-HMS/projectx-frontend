import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	WalletTransaction,
	TransactionType,
	EntityType,
	TransactionDirection,
	TransactionMedium
} from '../../../models/facility-manager/setup/wallet-transaction';
import { PayStackService } from '../../../services/facility-manager/setup/paystack.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	FLUTTERWAVE_PUBLIC_KEY,
	PAYSTACK_CLIENT_KEY,
	PaymentChannels
} from '../../../shared-module/helpers/global-config';
import { PersonService, FacilitiesService } from '../../../services/facility-manager/setup/index';
import { Facility, User } from 'app/models';

@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: [ './wallet.component.scss' ]
})
export class WalletComponent implements OnInit {
	paymentFormGroup: FormGroup;
	facility: Facility;
	selectedFacility: Facility;
	user: any = <any>{};
	transactions: any[] = [];
	flutterwaveClientKey: string = FLUTTERWAVE_PUBLIC_KEY;
	paystackClientKey: string = PAYSTACK_CLIENT_KEY;
	refKey: string;
	loading = true;
	flutterwavePayment = false;
	paystackPayment = false;
	paymentChannels = [];
	totalTransaction = 0;
	creditTransaction = 0;
	debitTransaction = 0;
	// lineChart
	lineChartData: Array<any> = [
		{ data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Balance' },
		{ data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Total Credit' },
		{ data: [ 18, 48, 77, 9, 100, 27, 40 ], label: 'Total Debit' }
	];
	lineChartLabels: Array<any> = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ];
	lineChartOptions: any = {
		responsive: true
	};
	lineChartColors: Array<any> = [
		{
			// blue
			backgroundColor: 'rgba(69, 127, 202, 0.2)',
			borderColor: 'rgba(69, 127, 202, 1)',
			pointBackgroundColor: 'rgba(69, 127, 202, 0.1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(69, 127, 202, 0.8)'
		},
		{
			// green
			backgroundColor: 'rgba(0,255,0,0.2)',
			borderColor: 'rgba(0,255,0,1)',
			pointBackgroundColor: 'rgba(0,255,0,0.1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(0,255,0,0.8)'
		},
		{
			// red
			backgroundColor: 'rgba(255,0,0,0.2)',
			borderColor: 'rgba(255,0,0,1)',
			pointBackgroundColor: 'rgba(255,0,0,0.1)',
			pointBorderColor: '#fff',
			pointHoverBackgroundColor: '#fff',
			pointHoverBorderColor: 'rgba(255,0,0,0.8)'
		}
	];
	lineChartLegend = true;
	lineChartType = 'line';
	wallet: any;

	constructor(
		//
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _personService: PersonService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this._facilityService.get(this.selectedFacility._id, { query: { $select: [ 'wallet' ] } }).then((payload) => {
			this.selectedFacility.wallet = payload.wallet;
			this.wallet = payload.wallet;
			this.populateWallet(payload.wallet);
		});

		this.user = <User>this._locker.getObject('auth');

		this.paymentChannels = PaymentChannels.filter((x) => x.name === 'Flutterwave' || x.name === 'Paystack');
		// this.refKey =
		//   (this.user ? this.user.data._id.substr(20) : "") + new Date().getTime();
		this.generatePaymentKey();
		this.paymentFormGroup = this._fb.group({
			fundAmount: [ 0, [ <any>Validators.required ] ],
			paymentType: [ '', [ <any>Validators.required ] ]
		});

		this.paymentFormGroup.controls['paymentType'].valueChanges.subscribe((val) => {
			const amount = this.paymentFormGroup.controls['fundAmount'].value;
			if (amount !== 0 && amount >= 500) {
				if (val === 'Flutterwave') {
					this.flutterwavePayment = true;
					this.paystackPayment = false;
				} else if (val === 'Paystack') {
					this.flutterwavePayment = false;
					this.paystackPayment = true;
				}
			} else {
				this.flutterwavePayment = false;
				this.paystackPayment = false;
			}
		});

		this.paymentFormGroup.controls['fundAmount'].valueChanges.subscribe((val) => {
			const paymentType = this.paymentFormGroup.controls['paymentType'].value;
			if (val !== 0 && val >= 500) {
				if (paymentType === 'Flutterwave') {
					this.flutterwavePayment = true;
					this.paystackPayment = false;
				} else if (paymentType === 'Paystack') {
					this.flutterwavePayment = false;
					this.paystackPayment = true;
				}
			} else {
				this.flutterwavePayment = false;
				this.paystackPayment = false;
			}
		});

		this._facilityService.get(this.selectedFacility._id, {}).then((res) => {
			this.loading = false;
			if (!!res._id) {
				if (this.wallet) {
					this.facility = res;
					this.facility.wallet = this.wallet;

					this.totalTransaction = res.wallet.transactions.length;
					this.creditTransaction = res.wallet.transactions.filter((tx) => tx.transactionType === 'Cr').length;
					this.debitTransaction = this.totalTransaction - this.creditTransaction;

					this.transactions = res.wallet.transactions.reverse().slice(0, 10);
				} else {
					res.wallet = {
						balance: 0,
						ledgerBalance: 0,
						transactions: []
					};
					this.facility = res;
					// this.personService.update(payload).then(pay => {
					//   this.person = pay;
					// });
				}
			}
		});
	}

	populateWallet(wallet) {
		this.totalTransaction = wallet.transactions.length;
		this.creditTransaction = wallet.transactions.filter((tx) => tx.transactionType === 'Cr').length;
		this.debitTransaction = this.totalTransaction - this.creditTransaction;

		this.transactions = wallet.transactions.reverse().slice(0, 10);
	}
	generatePaymentKey() {
		this.refKey = (this.user ? this.user.data._id.substr(20) : '') + new Date().getTime();
	}
	// Flutterwave Payment
	paymentDone(paymentRes) {
		let flutterwaveRes;
		const ePaymentMethod = this.paymentFormGroup.controls['paymentType'].value;
		const desc = 'Funded wallet via ' + this.paymentFormGroup.controls['paymentType'].value;
		if (ePaymentMethod === 'Flutterwave') {
			flutterwaveRes = {
				amount: paymentRes.tx.charged_amount,
				charged_amount: paymentRes.tx.charged_amount,
				customer: paymentRes.tx.customer,
				flwRef: paymentRes.tx.flwRef,
				txRef: paymentRes.tx.txRef,
				orderRef: paymentRes.tx.orderRef,
				paymentType: paymentRes.tx.paymentType,
				raveRef: paymentRes.tx.raveRef,
				status: paymentRes.tx.status
			};
		}
		const amount = parseFloat(this.paymentFormGroup.controls['fundAmount'].value);
		const walletTransaction: WalletTransaction = {
			ref: ePaymentMethod === 'Flutterwave' ? flutterwaveRes : paymentRes,
			payment: {
				type: 'e-payment',
				route: ePaymentMethod === 'Flutterwave' ? 'Flutterwave' : 'Paystack'
			},
			entity: 'Facility',
			facilityId: this.selectedFacility._id,
			amount: amount
			// ePaymentMethod: ePaymentMethod,
			// transactionType: TransactionType.Cr,
			// transactionMedium: (ePaymentMethod === 'Flutterwave') ? TransactionMedium.Flutterwave : TransactionMedium.PayStack,
			// amount: parseFloat(this.paymentFormGroup.controls['fundAmount'].value),
			// description: desc,
			// sourceId: this.person._id,
			// destinationId: this.person._id,
			// sourceType: EntityType.Person,
			// destinationType: EntityType.Person,
			// transactionDirection: TransactionDirection.PersonToPerson,
			// paidBy: this.user.data.person._id
		};

		this._personService.fundWallet(walletTransaction).subscribe((res: any) => {
			this.loading = false;
			if (res.status === 'success') {
				this.generatePaymentKey();
				this.paymentFormGroup.reset();
				this.paymentFormGroup.controls['fundAmount'].setValue(0);
				this.flutterwavePayment = false;
				this.paystackPayment = false;
				this.facility = res.data;
				this.transactions = this.facility.wallet.transactions.reverse().slice(0, 10);
				this._notification('Success', 'Your wallet has been credited successfully.');
			} else {
				// this._notification('Error', res.body.message);
			}
		});
	}

	paymentCancel() {}

	// Notification
	private _notification(type: string, text: string): void {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}

	public randomize(): void {
		const _lineChartData: Array<any> = new Array(this.lineChartData.length);
		for (let i = 0; i < this.lineChartData.length; i++) {
			_lineChartData[i] = {
				data: new Array(this.lineChartData[i].data.length),
				label: this.lineChartData[i].label
			};
			for (let j = 0; j < this.lineChartData[i].data.length; j++) {
				_lineChartData[i].data[j] = Math.floor(Math.random() * 100 + 1);
			}
		}
		this.lineChartData = _lineChartData;
	}

	// events
	public chartClicked(e: any): void {}

	public chartHovered(e: any): void {}
}
