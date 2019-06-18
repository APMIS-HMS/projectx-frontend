import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { ProductEmitterService } from '../../../services/facility-manager/product-emitter.service';
import { EmployeeService, FacilitiesService } from '../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../service-facade/auth-facade.service';

@Component({
	selector: 'app-product-manager',
	templateUrl: './product-manager.component.html',
	styleUrls: [ './product-manager.component.scss' ]
})
export class ProductManagerComponent implements OnInit {
	pageInView: String = '';
	productNavMenu: Boolean = false;
	categoryNavMenu: Boolean = false;
	supplierNavMenu: Boolean = false;
	manufacturerNavMenu: Boolean = false;
	routeNavMenu: Boolean = false;
	genericNavMenu: Boolean = false;
	presentationNavMenu: Boolean = false;
	strengthNavMenu: Boolean = false;
	contentSecMenuShow: Boolean = false;
	modal_on = false;
	Ql_toggle = false;
	// products page
	addProduct: Boolean = false;
	isProductCat: Boolean = false;
	isGeneric: Boolean = false;
	isProductRoute: Boolean = false;
	isManufacturer: Boolean = false;
	isPresentation: Boolean = false;
	isStrength: Boolean = false;
	productCatPop: Boolean = false;
	checkingStore: any = <any>{};
	subscription: any = <any>{};
	loginEmployee: any = <any>{};

	constructor(
		private _productEventEmitter: ProductEmitterService,
		private _router: Router,
		private employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService,
		private locker: CoolLocalStorage,
		public facilityService: FacilitiesService
	) {
		this.facilityService.sliderAnnounced$.subscribe((value) => {
			if (value === false) {
				this.addProduct = false;
				this.isProductCat = false;
				this.isGeneric = false;
				this.isProductRoute = false;
				this.isManufacturer = false;
				this.isPresentation = false;
			}
		});

		this.subscription = this.employeeService.checkInAnnounced$.subscribe((payload) => {
			if (payload !== undefined) {
				if (payload.typeObject !== undefined) {
					this.checkingStore = payload.typeObject;
				}
			}
		});

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
		});
	}

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
		}
	}

	// onClickProductNavMenu() {
	// 	this.facilityService.announceSlider(false);
	// 	this.productNavMenu = true;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = false;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._productEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	onClickCategoryNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = true;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	// onClickSupplierNavMenu() {
	// 	// this.facilityService.announceSlider(false);
	// 	this.productNavMenu = false;
	// 	this.categoryNavMenu = false;
	// 	this.supplierNavMenu = true;
	// 	this.manufacturerNavMenu = false;
	// 	this.routeNavMenu = false;
	// 	this.genericNavMenu = false;
	// 	this.presentationNavMenu = false;
	// 	this.strengthNavMenu = false;
	// 	this._productEventEmitter.announcedUrl.subscribe(url => {
	// 		this.pageInView = url;
	// 	});
	// }

	close_onClick(message: boolean): void {
		this.isProductCat = false;
		this.isGeneric = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.isProductRoute = false;
	}

	onClickManufacturerNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = true;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	onClickRouteNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = true;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	onClickGenericNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = true;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	onClickPresentationNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = true;
		this.strengthNavMenu = false;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}
	onClickStrengthNavMenu() {
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = true;
		this._productEventEmitter.announcedUrl.subscribe((url) => {
			this.pageInView = url;
		});
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}
	changeRoute(val) {
		if (val === 'products') {
			this.facilityService.announceSlider(false);
			this.productNavMenu = true;
			this.categoryNavMenu = false;
			this.supplierNavMenu = false;
			this.manufacturerNavMenu = false;
			this.routeNavMenu = false;
			this.genericNavMenu = false;
			this.presentationNavMenu = false;
			this.strengthNavMenu = false;
			this._productEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		} else if (val === 'suppliers') {
			this.productNavMenu = false;
			this.categoryNavMenu = false;
			this.supplierNavMenu = true;
			this.manufacturerNavMenu = false;
			this.routeNavMenu = false;
			this.genericNavMenu = false;
			this.presentationNavMenu = false;
			this.strengthNavMenu = false;
			this._productEventEmitter.announcedUrl.subscribe((url) => {
				this.pageInView = url;
			});
		}
	}
	private checkPageUrl(param: string) {
		if (param.includes('products')) {
			this.productNavMenu = true;
		} else if (param.includes('categories')) {
			this.categoryNavMenu = true;
		} else if (param.includes('suppliers')) {
			this.supplierNavMenu = true;
		} else if (param.includes('manufacturers')) {
			this.manufacturerNavMenu = true;
		} else if (param.includes('routes')) {
			this.routeNavMenu = true;
		} else if (param.includes('generics')) {
			this.genericNavMenu = true;
		} else if (param.includes('presentations')) {
			this.presentationNavMenu = true;
		}
	}
	productCatPopShow() {
		this.addProduct = false;
		this.isProductCat = true;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = true;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
		this.productCatPop = false;
	}
	genericSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = true;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		// this.genericNavMenu = true;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
	}
	presentationSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = true;
		this.isStrength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		// this.presentationNavMenu = true;
		this.strengthNavMenu = false;
	}
	routeSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = true;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		// this.routeNavMenu = true;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
	}
	manufacturerSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = true;
		this.isPresentation = false;
		this.isStrength = false;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		// this.manufacturerNavMenu = true;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		this.strengthNavMenu = false;
	}

	strengthSlide() {
		this.addProduct = false;
		this.isProductCat = false;
		this.isGeneric = false;
		this.isProductRoute = false;
		this.isManufacturer = false;
		this.isPresentation = false;
		this.isStrength = !this.isStrength;
		this.productNavMenu = false;
		this.categoryNavMenu = false;
		this.supplierNavMenu = false;
		this.manufacturerNavMenu = false;
		this.routeNavMenu = false;
		this.genericNavMenu = false;
		this.presentationNavMenu = false;
		// this.strengthNavMenu = true;
	}

	toggleQl() {
		this.Ql_toggle = !this.Ql_toggle;
	}

	onChangeCheckedIn() {
		this.modal_on = true;
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
}
