import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	WalletTransaction,
	TransactionType,
	EntityType,
	TransactionDirection,
	TransactionMedium
} from './../../../../../../models/facility-manager/setup/wallet-transaction';
import { PayStackService } from './../../../../../../services/facility-manager/setup/paystack.service';
// import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	FLUTTERWAVE_PUBLIC_KEY,
	PAYSTACK_CLIENT_KEY,
	PaymentChannels
} from '../../../../../../shared-module/helpers/global-config';
import { PersonService, FacilitiesService } from '../../../../../../services/facility-manager/setup/index';
// import  '../../../../../../../assets/libs/paystack.js';
// import crop from './paystack.js';
import paystackInline from './paystack-inline.js';
import { Facility, User } from 'app/models';
// declare var paystack: any;
// declare var callPayStack: any;
@Component({
	selector: 'app-wallet',
	templateUrl: './wallet.component.html',
	styleUrls: [ './wallet.component.scss' ]
})
export class WalletComponent implements OnInit, AfterViewInit {
	paymentFormGroup: FormGroup;
	@Input() patient;
	person: any;
	transactions: any[] = [];
	search: FormControl;
	// fundAmount: FormControl;
	selectedValue: string;
	selectedFacility: Facility;
	user: any = <any>{};
	// withPaystack: boolean = true;
	// withFlutterwave: boolean = true;
	flutterwaveClientKey: string = FLUTTERWAVE_PUBLIC_KEY;
	paystackClientKey: string = PAYSTACK_CLIENT_KEY;
	refKey: string;
	// ePayment: boolean = false;
	// ePaymentMethod: string = 'Flutterwave';
	loading = true;
	paymentChannels = PaymentChannels;
	cashPayment = false;
	flutterwavePayment = false;
	paystackPayment = false;
	disableBtn = false;
	cashPaymentPay = true;
	cashPaymentPaying = false;

	// wallets = [
	//   { value: 'cash', viewValue: 'Cash' },
	//   { value: 'paystack', viewValue: 'Paystack' }
	// ];

	constructor(
		private _fb: FormBuilder,
		private personService: PersonService,
		private _payStackService: PayStackService,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _personService: PersonService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.user = <User>this._locker.getObject('auth');

		this.paymentFormGroup = this._fb.group({
			fundAmount: [ 0, [ <any>Validators.required ] ],
			paymentType: [ '', [ <any>Validators.required ] ]
		});

		this.paymentFormGroup.controls['paymentType'].valueChanges.subscribe((val) => {
			const amount = this.paymentFormGroup.controls['fundAmount'].value;
			if (amount !== 0 && amount >= 500) {
				if (val === 'Cash' || val === 'Cheque' || val === 'POS') {
					this.cashPayment = true;
					this.flutterwavePayment = false;
					this.paystackPayment = false;
				} else if (val === 'Flutterwave') {
					this.cashPayment = false;
					this.flutterwavePayment = true;
					this.paystackPayment = false;
				} else if (val === 'Paystack') {
					this.cashPayment = false;
					this.flutterwavePayment = false;
					this.paystackPayment = true;
				}
			} else {
				this.cashPayment = false;
				this.flutterwavePayment = false;
				this.paystackPayment = false;
			}
		});

		this.paymentFormGroup.controls['fundAmount'].valueChanges.subscribe((val) => {
			const amount = this.paymentFormGroup.controls['fundAmount'].value;
			if (amount !== 0 && amount >= 500) {
				if (val === 'Cash' || val === 'Cheque' || val === 'POS') {
					this.cashPayment = true;
					this.flutterwavePayment = false;
					this.paystackPayment = false;
				} else if (val === 'Flutterwave') {
					this.cashPayment = false;
					this.flutterwavePayment = true;
					this.paystackPayment = false;
				} else if (val === 'Paystack') {
					this.cashPayment = false;
					this.flutterwavePayment = false;
					this.paystackPayment = true;
				}
			} else {
				this.cashPayment = false;
				this.flutterwavePayment = false;
				this.paystackPayment = false;
			}
		});

		// this.paymentFormGroup.controls['fundAmount'].valueChanges.subscribe(val => {
		//   const paymentType = this.paymentFormGroup.controls['paymentType'].value;

		//   if (val !== 0 && val >= 500) {
		//     if (paymentType === 'Cash' || paymentType === 'Cheque' || paymentType === 'POS') {
		//       this.cashPayment = true;
		//       this.flutterwavePayment = false;
		//       this.paystackPayment = false;
		//     } else if (paymentType === 'Flutterwave') {
		//       this.cashPayment = false;
		//       this.flutterwavePayment = true;
		//       this.paystackPayment = false;
		//     } else if (paymentType === 'Paystack') {
		//       this.cashPayment = false;
		//       this.flutterwavePayment = false;
		//       this.paystackPayment = true;
		//     }
		//   } else {
		//     this.cashPayment = false;
		//     this.flutterwavePayment = false;
		//     this.paystackPayment = false;
		//   }
		// });

		this.search = new FormControl('', []);
		this.search.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			this.loading = false;
			if (value.length > 0) {
				const copiedTransactions = JSON.parse(JSON.stringify(this.person.wallet.transactions));
				this.transactions = copiedTransactions.filter(function(el) {
					return (
						el.amount === value ||
						el.refCode === value ||
						el.description.toLowerCase().includes(value.toLowerCase()) ||
						el.transactionType.toLowerCase() === value.toLowerCase()
					);
				});
			} else {
				this.transactions = this.person.wallet.transactions.reverse().slice(0, 5);
			}
		});

		this.personService.get(this.patient.personId, {}).then((payload) => {
			console.log(payload);
			this.loading = false;
			this.person = payload;
			this.getPersonWallet(payload);
		},err=>{
			console.log(err);
		});

		// if (this.patient.personDetails.email === undefined) {
		// 	this.patient.personDetails.email = this.patient.personDetails.apmisId + '@apmis.ng';
		// 	this.patient.personDetails = JSON.parse(JSON.stringify(this.patient.personDetails));
		// }

		this.refKey = (this.user ? this.user.data._id.substr(20) : '') + new Date().getTime();

		// let formData = { type: 'customers' };
		// this._payStackService.paystack(formData).then(payload => {
		// })
		// this.verifyTransaction('T706272350859262');
	}
	ngAfterViewInit(): void {
		// crop();
	}

	getPersonWallet(person) {
		this.personService.get(person._id, { query: { $select: [ 'wallet' ] } }).then((payload) => {
			console.log(payload);
			if (payload.wallet === undefined) {
				payload.wallet = {
					balance: 0,
					ledgerBalance: 0,
					transactions: []
				};
				this.personService.update(payload).then((pay) => {
					this.person = pay;
				});
			} else {
				this.person.wallet = payload.wallet;
				this.transactions = payload.wallet.transactions.reverse().slice(0, 10);
			}
		},err=>{
			console.log(err);
		});
	}

	// verifyTransaction(reference) {
	//   let formData = { type: 'verifyTransaction', reference: reference };
	//   this._payStackService.paystack(formData).then(payload => {
	//   });
	// }

	// fundWithElectronic() {
	//   let retVal = paystackInline(
	//     this.patient.personDetails.email,
	//     this.fundAmount.value,
	//     this.patient.personDetails.phoneNumber,
	//     this.paystackCallback
	//   );
	// }
	// onClose() {}

	// paystackCallback(response) {
	//   // let that = this;
	//   this.verifyTransaction(response.reference);
	// }

	fundWalletViaCashPayment(valid: boolean, value: any) {
		if (valid && parseFloat(value.fundAmount) >= 500) {
			this.disableBtn = true;
			this.cashPaymentPay = false;
			this.cashPaymentPaying = true;
			const desc = 'Funded wallet via ' + value.paymentType;

			let medium;
			if (value.paymentType === 'Cash') {
				medium = TransactionMedium.Cash;
			} else if (value.paymentType === 'Cheque') {
				medium = TransactionMedium.Cheque;
			} else if (value.paymentType === 'Transfer') {
				medium = TransactionMedium.Transfer;
			} else if (value.paymentType === 'POS') {
				medium = TransactionMedium.POS;
			}
			// Wallet model.
			const walletTransaction = {
				paymentMethod: value.paymentType,
				transactionType: TransactionType.Cr,
				transactionMedium: medium,
				amount: parseFloat(value.fundAmount),
				description: desc,
				sourceId: this.selectedFacility._id,
				destinationId: this.person._id,
				sourceType: EntityType.Facility,
				destinationType: EntityType.Person,
				transactionDirection: TransactionDirection.FacilityToPerson,
				paidBy: this.user.data.personId
			};
			this.personService
				.fundWallet(walletTransaction, this.selectedFacility._id)
				.then((res: any) => {
					if (res.status === 'success') {
						this.paymentFormGroup.reset();
						this.paymentFormGroup.controls['fundAmount'].setValue(0);
						this.resetPaymentForm();
						this.person = res.data.person;
						this.transactions = this.person.wallet.transactions.reverse().slice(0, 10);
						const text =
							"Your facility's wallet has been debited and patient's wallet has been credited successfully.";
						this._notification('Success', text);
					} else {
						this.resetPaymentForm();
						this._notification('Error', res.body.message);
					}
				})
				.catch((err) => {});
		} else {
			const text = 'Please enter amount above 500 naira and also select payment type';
			this._notification('Info', text);
		}
	}

	// Reset payment form when payment is done or failed.
	resetPaymentForm() {
		this.paymentFormGroup.reset();
		this.paymentFormGroup.controls['fundAmount'].setValue(0);
		this.cashPaymentPay = true;
		this.cashPaymentPaying = false;
		this.disableBtn = false;
		this.cashPayment = false;
		this.flutterwavePayment = false;
		this.paystackPayment = false;
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
			entity: 'Person',
			destinationId: this.person._id,
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

		this.personService
			.fundWallet(walletTransaction, this.selectedFacility._id)
			.then((res: any) => {
				this.loading = false;
				if (res.status === 'success') {
					this.paymentFormGroup.reset();
					this.paymentFormGroup.controls['fundAmount'].setValue(0);
					this.disableBtn = false;
					this.cashPayment = false;
					this.flutterwavePayment = false;
					this.paystackPayment = false;
					this.person = res.data;
					this.transactions = this.person.wallet.transactions.reverse().slice(0, 10);
					this._notification('Success', 'Your wallet has been credited successfully.');
				} else {
					this._notification('Error', res.body.message);
				}
			})
			.catch((err) => {});
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
}
