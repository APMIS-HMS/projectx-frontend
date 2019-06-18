import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import {
	Router,
	Event,
	NavigationStart,
	ActivatedRoute,
	NavigationEnd,
	NavigationCancel,
	NavigationError
} from '@angular/router';

@Component({
	selector: 'app-health-coverage',
	templateUrl: './health-coverage.component.html',
	styleUrls: [ './health-coverage.component.scss' ]
})
export class HealthCoverageComponent implements OnInit {
	@Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();

	pageInView = 'Health Insurance';

	companyCover = false;
	familyCover = false;
	payment = false;
	hmoCover = true;
	staffCover = false;
	currentPath = '';
	contentSecMenuShow = false;
	recievePayment = false;
	makePayment = false;
	hmoContentArea = false;

	constructor(private router: Router, private route: ActivatedRoute) {
		router.events.subscribe((payload: any) => {
			this.currentPath = payload.url;
		});
	}

	ngOnInit() {
		const page: string = this.router.url;
		this.checkPageUrl(page);
	}
	contentSecMenuToggle() {}
	pageInViewLoader(title) {
		this.pageInView = title;
	}

	companyCover_show() {
		this.companyCover = true;
		this.familyCover = false;
		this.payment = false;
		this.hmoCover = false;
		this.recievePayment = false;
		this.hmoContentArea = false;
		this.pageInView = 'Company Retainership';
		this.router.navigate([ '/dashboard/health-coverage/company-list' ]);
		this.checkPageUrl('company-list');
	}
	familyCover_show() {
		this.companyCover = false;
		this.familyCover = true;
		this.payment = false;
		this.hmoCover = false;
		this.recievePayment = false;
		this.hmoContentArea = false;
		this.pageInView = 'Family Cover';
		this.router.navigate([ '/dashboard/health-coverage/family-list' ]);
	}
	hmoCover_show() {
		this.companyCover = false;
		this.familyCover = false;
		this.payment = false;
		this.hmoCover = true;
		this.recievePayment = false;
		this.hmoContentArea = false;
		this.pageInView = 'Health Insurance';
		this.router.navigate([ '/dashboard/health-coverage/hmo-list' ]);
	}
	payment_show() {
		this.companyCover = false;
		this.familyCover = false;
		this.payment = true;
		this.hmoCover = false;
		this.recievePayment = false;
		this.hmoContentArea = false;
		this.pageInView = 'Payment';
		this.router.navigate([ '/dashboard/health-coverage/payment' ]);
	}
	recievePayment_show() {
		this.companyCover = false;
		this.familyCover = false;
		this.payment = false;
		this.hmoCover = false;
		this.recievePayment = true;
		this.hmoContentArea = false;
		this.pageInView = 'Recieve Payment';
		this.router.navigate([ '/dashboard/health-coverage/recieve-payment' ]);
	}

	healthCover_show() {
		this.companyCover = false;
		this.familyCover = false;
		this.payment = false;
		this.hmoCover = false;
		this.recievePayment = false;
		this.hmoContentArea = true;
		this.pageInView = 'Health Cover';
		this.router.navigate([ '/dashboard/health-coverage/cover' ]);
	}

	private checkPageUrl(param: string) {
		if (param.includes('hmo-list')) {
			this.companyCover = false;
			this.familyCover = false;
			this.payment = false;
			this.hmoCover = true;
			this.recievePayment = false;
			this.pageInView = 'Health Insurance';
		} else if (param.includes('company-list') || param.includes('company-beneficiaries')) {
			this.companyCover = true;
			this.familyCover = false;
			this.payment = false;
			this.hmoCover = false;
			this.recievePayment = false;
			this.pageInView = 'Company Retainership';
		} else if (param.includes('family-list') || param.includes('family-beneficiaries')) {
			this.companyCover = false;
			this.familyCover = true;
			this.payment = false;
			this.hmoCover = false;
			this.recievePayment = false;
			this.pageInView = 'Family Cover';
		} else if (param.includes('recieve-payment')) {
			this.companyCover = false;
			this.familyCover = false;
			this.payment = false;
			this.hmoCover = false;
			this.recievePayment = true;
			this.pageInView = 'Recieve Payment';
		} else if (param.includes('payment')) {
			this.companyCover = false;
			this.familyCover = false;
			this.payment = true;
			this.hmoCover = false;
			this.recievePayment = false;
			this.pageInView = 'Payment';
		} else if (param.includes('health-coverage/cover')) {
			this.companyCover = false;
			this.familyCover = false;
			this.payment = false;
			this.hmoCover = false;
			this.recievePayment = false;
			this.hmoContentArea = true;
			this.pageInView = 'Health Cover';
		}
	}
}
