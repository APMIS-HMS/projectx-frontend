import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup';
import { Employee, Facility } from '../../../models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { LabEventEmitterService } from '../../../services/facility-manager/lab-event-emitter.service';
import { ISubscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-lab',
	templateUrl: './radiology.component.html',
	styleUrls: [ './radiology.component.scss' ]
})
export class RadiologyComponent implements OnInit, OnDestroy {
	@Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
	pageInView = 'Radiology';
	loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};
	workbenchTitle: String = '';
	isWorkbenchAvailable: Boolean = false;
	modal_on: Boolean = false;
	contentSecMenuShow = false;
	requestContentArea = false;
	workbenchContentArea = false;
	investigationContentArea = false;
	pricingContentArea = false;
	panelContentArea = false;
	reportContentArea = false;
	externalContentArea = false;
	templateContentArea = false;
	checkedInObject: any = <any>{};
	labSubscription: ISubscription;

	constructor(
		private _router: Router,
		private _locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
		private _employeeService: EmployeeService,
		private _authFacadeService: AuthFacadeService,
		private _labEventEmitter: LabEventEmitterService
	) {
		// Subscribe to the event when ward changes.
		this.labSubscription = this._labEventEmitter.announceLab.subscribe((val) => {
			this.checkedInObject = val;
		});
	}

	ngOnInit() {
		const page: string = this._router.url;
		this.checkPageUrl(page);
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.loginEmployee = res;
				if (
					this.loginEmployee.workbenchCheckIn === undefined ||
					this.loginEmployee.workbenchCheckIn.length === 0
				) {
					this.modal_on = true;
				} else {
					let isOn = false;
					this.loginEmployee.workbenchCheckIn.forEach((x, r) => {
						if (x.isDefault) {
							x.isOn = true;
							x.lastLogin = new Date();
							isOn = true;
							let checkingObject = { typeObject: x, type: 'workbench' };
							this.checkedInObject = checkingObject;
							this._employeeService.announceCheckIn(checkingObject);
							// Set page title
							this.isWorkbenchAvailable = true;
							this.workbenchTitle = x.workbenchObject.name;
							this._employeeService.update(this.loginEmployee).then((res: any) => {
								this.loginEmployee = res;
								checkingObject = { typeObject: x, type: 'workbench' };
								this.checkedInObject = checkingObject;
								this._employeeService.announceCheckIn(checkingObject);
								this._labEventEmitter.announceLabChange(checkingObject);
								this._locker.setObject('workbenchCheckingObject', checkingObject);
							});
						}
					});

					if (!isOn) {
						this.loginEmployee.workbenchCheckIn.forEach((x, r) => {
							if (r === 0) {
								x.isOn = true;
								x.lastLogin = new Date();
								// Set page title
								this.isWorkbenchAvailable = true;
								this.workbenchTitle = x.workbenchObject.name;
								this._employeeService.update(this.loginEmployee).then((payload) => {
									this.loginEmployee = payload;
									const checkingObject = { typeObject: x, type: 'workbench' };
									this.checkedInObject = checkingObject;
									this._employeeService.announceCheckIn(checkingObject);
									this._labEventEmitter.announceLabChange(checkingObject);
									this._locker.setObject('workbenchCheckingObject', checkingObject);
								});
							}
						});
					}
				}
			})
			.catch((err) => {});
	}

	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}

	checkPageUrl(param: string) {
		if (param.includes('external')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = true;
			this.templateContentArea = false;
		} else if (param.includes('request')) {
			this.requestContentArea = true;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('workbench')) {
			this.requestContentArea = false;
			this.workbenchContentArea = true;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('investigation-pricing')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = true;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('investigation')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = true;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('panel')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = true;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('report')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = true;
			this.externalContentArea = false;
			this.templateContentArea = false;
		} else if (param.includes('template')) {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = true;
		}
	}
	changeRoute(value: string) {
		if (value === '') {
			this.requestContentArea = true;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'external-requests') {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = true;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'workbenches') {
			this.requestContentArea = false;
			this.workbenchContentArea = true;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'investigation-pricing') {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = true;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'investigations') {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = true;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'reports') {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = true;
			this.externalContentArea = false;
			this.templateContentArea = false;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		} else if (value === 'templates') {
			this.requestContentArea = false;
			this.workbenchContentArea = false;
			this.investigationContentArea = false;
			this.pricingContentArea = false;
			this.panelContentArea = false;
			this.reportContentArea = false;
			this.externalContentArea = false;
			this.templateContentArea = true;
			this._router.navigate([ '/dashboard/radiology/' + value ]);
		}
	}
	checkIntoWorkbench() {
		this.modal_on = true;
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	ngOnDestroy() {
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('workbenchCheckingObject', {});
		this.checkedInObject = {};
		this.labSubscription.unsubscribe();
	}
	chartClicked(e) {}
	chartHovered(e) {}
}
