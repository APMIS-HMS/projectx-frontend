import { Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Event, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Employee, Facility } from '../../models/index';
import {
	EmployeeService,
	FacilitiesService,
	UserService,
	WorkSpaceService
} from '../../services/facility-manager/setup/index';

import { FeatureModuleService } from './../../services/module-manager/setup/feature-module.service';
import { DONT_USE_AUTH_GUARD } from './../../shared-module/helpers/global-config';
import { AuthFacadeService } from './../service-facade/auth-facade.service';
import { ChannelService } from '../../services/communication-manager/channel-service';
import { ImageEmitterService } from '../../services/facility-manager/image-emitter.service';

@Component({
	selector: 'app-dashboard-home',
	templateUrl: './dashboard-home.component.html',
	// tslint:disable-next-line:use-host-property-decorator
	host: { '(document:click)': 'hostClick($event)' },
	styleUrls: [ './dashboard-home.component.scss' ]
})
export class DashboardHomeComponent implements OnInit {
	facilityObj: Facility = <Facility>{};
	facilityName = '';
	searchControl = new FormControl();

	modal_on = false;
	logoutConfirm_on = false;
	innerMenuShow = false;
	changeFacilityLogo = false;
	changePassword = false;
	notificationSlideIn = false;

	facilityManagerActive = true;
	moduleManagerActive = false;
	loadedMenu = false;
	facilitySubmenuActive = true;
	employeeSubmenuActive = false;
	userSubmenuActive = false;
	patientSubmenuActive = false;
	billingSebmenuActive = false;
	formsSubmenuActive = false;
	immunizationSubmenuActive = false;

	newModuleSubmenuActive = false;
	allModulesSubmenuActive = false;
	moduleAnalyticsSubmenuActive = false;

	loadIndicatorVisible = false;
	subscription: Subscription;
	loginEmployee: Employee = <Employee>{};
	access: any = [];
	facilitySubscriptions: any = [];
	channel: any;

	checkedInObject: any = <any>{};
	constructor(
		private _elRef: ElementRef,
		private locker: CoolLocalStorage,
		private userService: UserService,
		private router: Router,
		public facilityService: FacilitiesService,
		private employeeService: EmployeeService,
		private workSpaceService: WorkSpaceService,
		private authFacadeService: AuthFacadeService,
		private channelService: ChannelService,
		private featureService: FeatureModuleService,
		private imageEmitter: ImageEmitterService
	) {}

	ngOnInit() {
		this.channel = this.channelService.getCurrentUserChannel();
		this.featureService.listner.subscribe((payload) => {
			this.getUserRoles();
		});
		this.facilityObj = <Facility>this.facilityService.getSelectedFacilityId();
		if (this.facilityObj !== undefined && this.facilityObj != null) {
			this.facilityName = this.facilityObj.name;
			if (this.facilityObj.logoObject) {
				this.imageEmitter.setSrc(this.facilityObj.logoObject.thumbnail);
			}

			this.getFacilitySubscription();
			this.employeeService.checkInAnnounced$.subscribe((payload) => {
				this.checkedInObject = payload;
			});
			this.facilityService.listner.subscribe((pay) => {
				this.facilityName = pay.name;
			});
			this.facilityService.patchListner.subscribe((pay) => {
				this.facilityName = pay.name;
			});
			// this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
			try {
				this.authFacadeService.getLogingEmployee().then(
					(payload: any) => {
						this.loginEmployee = payload;
						const auth = <any>this.locker.getObject('auth');
						if (this.loginEmployee !== undefined) {
							this.locker.setObject('workspaces', this.loginEmployee.workSpaces);
						}

						this.locker.setObject('miniFacility', this.loginEmployee);
						this.getUserRoles();
						/* if (this.loginEmployee !== undefined && this.loginEmployee._id
			  !== undefined && auth.data.personId === this.loginEmployee.personId) {
			  return;
			} */
					},
					(error) => {}
				);
			} catch (error) {}

			this.loadIndicatorVisible = true;
		} else {
			this.router.navigate([ '/accounts' ]);
		}

		// const emp$ = Observable.fromPromise(this.employeeService.find({
		//   query: {
		//     facilityId: this.facilityObj._id, personId: auth.data.personId,
		//     $select: ['personId']
		//   }
		// }));
		// this.subscription = emp$.mergeMap((emp: any) => {
		//   if (emp.data.length > 0) {
		//     return Observable.forkJoin(
		//       [
		//         Observable.fromPromise(this.employeeService.get(emp.data[0]._id,
		//         {})), Observable.fromPromise(this.workSpaceService.find({ query:
		//         { 'employeeId._id': emp.data[0]._id } })),
		//         Observable.fromPromise(this.facilityService
		//           .find({
		//             query: {
		//               '_id': this.facilityObj._id,
		//               $select: ['name', 'email', 'contactPhoneNo',
		//               'contactFullName', 'shortName', 'website', 'logoObject']
		//             }
		//           }))
		//       ])
		//   } else {
		//     this.loadIndicatorVisible = false;
		//     return Observable.of({})
		//   }
		// }
		// ).subscribe((results: any) => {
		//   if (results[0] !== undefined) {
		//     this.loginEmployee = results[0];
		//     this.loginEmployee.workSpaces = results[1].data;
		//     this.locker.setObject('workspaces', this.loginEmployee.workSpaces);

		//     if (results[2].data.length > 0) {
		//       this.locker.setObject('miniFacility', results[2].data[0])
		//     }

		//     // this.locker.setObject('loginEmployee', this.loginEmployee);
		//     // this.authFacadeService.setLogingEmployee(this.loginEmployee);
		//     this.authFacadeService.getLogingEmployee().then((payload: any) => {
		//       this.loginEmployee = payload;
		//     });
		//   }

		//   this.loadIndicatorVisible = false;
		// })
	}
	getFacilitySubscription() {
		try {
			this.facilityService
				.findValidSubscription({
					query: {
						facilityId: this.facilityObj._id
					}
				})
				.then((payload) => {
					this.loadedMenu = true;
					this.facilitySubscriptions = payload.data;
					this.facilitySubscriptions.subscriptions_status = payload.data.subscriptions_status;
				});
		} catch (error) {}
	}

	getSubscribedModule(value) {
		if (this.facilitySubscriptions.subscriptions_status !== undefined) {
			if (this.facilitySubscriptions.subscriptions_status === true) {
				if (this.facilitySubscriptions.plans !== undefined) {
					let _modules = this.facilitySubscriptions.plans.filter(
						(x) => x.name === value && x.isConfirmed === true
					);
					if (_modules.length > 0) {
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return true;
			}
		} else {
			return false;
		}
	}

	getUserRoles() {
		this.authFacadeService.getUserAccessControls(true).then(
			(payload: any) => {
				if (payload.modules.length > 0) {
					// setTimeout(e => {
					this.loadedMenu = true;
					this.access = payload;
					// }, 5000);
				}
			},
			(error) => {}
		);
	}
	accessHas(menu, label) {
		if (this.getSubscribedModule(label)) {
			const modules: any = this.access.modules;
			if (modules !== undefined) {
				const index = modules.findIndex((x) => x.route.substring(1) === menu.toLowerCase());
				return index > -1 || DONT_USE_AUTH_GUARD;
			}
		} else {
			return DONT_USE_AUTH_GUARD;
		}
	}

	laboratorySubmenuShow() {
		this.innerMenuShow = false;
		this.router.navigate([ '/dashboard/laboratory' ]);
	}

	onSwitchAccount() {
		this.router.navigate([ '/accounts' ]);
	}
	onHealthCoverage() {
		this.innerMenuShow = false;
		this.router.navigate([ '/dashboard/health-coverage' ]);
	}
	facilityMenuShow() {
		this.facilityManagerActive = true;
		this.moduleManagerActive = false;
		this.newModuleSubmenuActive = false;

		this.facilitySubmenuActive = true;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.billingSebmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	moduleMenuShow() {
		this.facilityManagerActive = false;
		this.moduleManagerActive = true;
		this.facilitySubmenuActive = false;
		this.newModuleSubmenuActive = true;
		this.newModuleSubmenuActive = true;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.billingSebmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}

	facilitySubmenuShow() {
		this.facilitySubmenuActive = true;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.innerMenuShow = false;
		this.billingSebmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	employeeSubmenuShow() {
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = true;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.innerMenuShow = false;
		this.billingSebmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	userSubmenuShow() {
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = true;
		this.patientSubmenuActive = false;
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.innerMenuShow = false;
		this.billingSebmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	billingSubmenuShow() {
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.innerMenuShow = false;
		this.billingSebmenuActive = true;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	patientSubmenuShow() {
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = true;
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.formsSubmenuActive = false;
		this.innerMenuShow = false;
		this.immunizationSubmenuActive = false;
	}

	newModuleSubmenuShow() {
		this.newModuleSubmenuActive = true;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	allModulesSubmenuShow() {
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = true;
		this.moduleAnalyticsSubmenuActive = false;
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	moduleAnalyticsSubmenuShow() {
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = true;
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.formsSubmenuActive = false;
		this.immunizationSubmenuActive = false;
	}
	formsSubmenuShow() {
		this.newModuleSubmenuActive = false;
		this.allModulesSubmenuActive = false;
		this.moduleAnalyticsSubmenuActive = false;
		this.facilitySubmenuActive = false;
		this.employeeSubmenuActive = false;
		this.userSubmenuActive = false;
		this.patientSubmenuActive = false;
		this.innerMenuShow = false;
		this.formsSubmenuActive = true;
		this.immunizationSubmenuActive = false;
	}

	mainMenuRoute(route) {}

	innerMenuToggle() {
		this.innerMenuShow = !this.innerMenuShow;
	}
	innerMenuHide(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) {
		} else {
			this.innerMenuShow = false;
		}
	}
	close_onClick(message: boolean): void {
		this.modal_on = false;
		this.logoutConfirm_on = false;
		this.changeFacilityLogo = false;
		this.changePassword = false;
	}
	logoutConfirm_show() {
		this.modal_on = false;
		this.logoutConfirm_on = true;
		this.innerMenuShow = false;
		this.changeFacilityLogo = false;
		this.changePassword = false;
	}
	onTags() {
		this.modal_on = false;
		this.logoutConfirm_on = false;
		this.innerMenuShow = false;
		this.changeFacilityLogo = false;
		this.changePassword = false;
	}
	show_changeFacilityLogo() {
		this.changeFacilityLogo = true;
		this.changePassword = false;
		this.modal_on = false;
		this.logoutConfirm_on = false;
	}

	notificationToggle() {
		this.notificationSlideIn = !this.notificationSlideIn;
	}

	// close main menu when clicked outside container
	hostClick(event) {
		if (!this._elRef.nativeElement.contains(event.target)) {
			this.innerMenuShow = false;
		}
	}
}
