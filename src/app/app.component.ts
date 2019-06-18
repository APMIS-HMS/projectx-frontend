import { UserFacadeService } from './system-modules/service-facade/user-facade.service';
import { UserService } from './services/facility-manager/setup/user.service';
import { SystemModuleService } from './services/module-manager/setup/system-module.service';
import { Component, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
	FacilitiesService,
	AppointmentService,
	AppointmentTypeService,
	ProfessionService,
	EmployeeService,
	WorkSpaceService
} from './services/facility-manager/setup/index';
import { Facility, Employee, ClinicModel, AppointmentType, Appointment, Profession } from './models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { JoinChannelService } from 'app/services/facility-manager/setup/join-channel.service';
import swal from 'sweetalert2';
import { AuthFacadeService } from './system-modules/service-facade/auth-facade.service';

import { APP_DATE_FORMATS, AppDateAdapter } from 'app/date-format';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_DATE_FORMATS
		}
	]
})
export class AppComponent implements OnInit, OnDestroy {
	auth: any;
	loadIndicatorVisible = true;
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	// subscription: Subscription;
	loginUser: any;
	private facilitySubscription: ISubscription;
	private loaderSubscription: ISubscription;
	private sweetAlertSubscription: ISubscription;
	public channel;

	constructor(
		private router: Router,
		private vcr: ViewContainerRef,
		private toastr: ToastsManager,
		private employeeService: EmployeeService,
		private workSpaceService: WorkSpaceService,
		private facilityService: FacilitiesService,
		private locker: CoolLocalStorage,
		private userServiceFacade: UserFacadeService,
		private joinService: JoinChannelService,
		private systemModuleService: SystemModuleService,
		private loadingService: LoadingBarService,
		private authFacadeService: AuthFacadeService
	) {
		this.toastr.setRootViewContainerRef(vcr);
		this.facilitySubscription = this.facilityService.notificationAnnounced$.subscribe((obj: any) => {
			if (obj.users !== undefined && obj.users.length > 0) {
				if (this.loginUser !== undefined) {
					this.processNotification(obj);
				} else {
					this.authFacadeService
						.getLogingUser()
						.then((payload) => {
							this.loginUser = payload;
							this.processNotification(obj);
						})
						.catch((err) => {});
				}
			}
		});

		this.loaderSubscription = this.systemModuleService.loadingAnnounced$.subscribe((value: any) => {
			if (value.status === 'On') {
				this.loadingService.start();
			} else {
				this.loadingService.complete();
			}
		});

		this.sweetAlertSubscription = this.systemModuleService.sweetAnnounced$.subscribe((value: any) => {
			this._sweetNotification(value);
		});
	}

	ngOnInit() {
		this.userServiceFacade
			.authenticateResource()
			.then((result) => {
				this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
				this.auth = <any>this.locker.getObject('auth');
				this.joinService
					.create({ _id: this.selectedFacility._id, userId: this.auth.data._id })
					.then((paylo) => {});
			})
			.catch((err) => {
				// this.systemModuleService.announceSweetProxy('Authentication is required, please log-in with your credentials', 'warning');
				this.router.navigate([ '/' ]);
				this.locker.clear();
				window.localStorage.clear();
				this.loadingService.complete();
			});
	}
	processNotification(obj) {
		const userId = this.loginUser._id;
		const isUserIdIncluded = obj.users.filter((x) => x === userId).length > 0;
		if (isUserIdIncluded === true) {
			if (obj.type === 'Success') {
				this.success(obj.text);
			} else if (obj.type === 'Error') {
				this.error(obj.text);
			} else if (obj.type === 'Info') {
				this.info(obj.text);
			} else if (obj.type === 'Warning') {
				this.warning(obj.text);
			}
		}
	}

	_sweetNotification(value) {
		if (value.type === 'success') {
			swal({
				title: value.title,
				type: 'success',
				text: value.text,
				html: value.html,
				position: value.position !== undefined && value.position !== null ? value.position : 'top-end',
				showConfirmButton:
					value.showConfirmButton !== undefined && value.showConfirmButton !== null
						? value.showConfirmButton
						: false,
				timer: value.timer !== undefined && value.timer !== null ? value.timer : 2000
			}).then((result) => {
				if (value.cp !== undefined && value.cp !== null) {
					value.cp.sweetAlertCallback(result);
				}
			});
		} else if (value.type === 'error') {
			swal({
				title: value.title,
				type: 'error',
				text: value.text,
				html: value.html
			});
		} else if (value.type === 'info') {
			swal({
				title: value.title,
				type: 'info',
				text: value.text,
				html: value.html
			});
		} else if (value.type === 'warning') {
			swal({
				title: value.title,
				type: 'warning',
				text: value.text,
				html: value.html
			});
		} else if (value.type === 'question') {
			swal({
				title: value.title,
				text: value.text,
				type: value.type,
				html: value.html,
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'Yes!'
			}).then((result) => {
				value.cp.sweetAlertCallback(result, value.from);
			});
		}
	}
	success(text) {
		this.toastr.success(text, 'Success!');
	}
	error(text) {
		this.toastr.error(text, 'Error!');
	}
	info(text) {
		this.toastr.info(text, 'Info');
	}
	warning(text) {
		this.toastr.warning(text, 'Warning');
	}

	ngOnDestroy() {
		// unsubscribe from any subscribed observable.
		this.facilitySubscription.unsubscribe();
		this.loaderSubscription.unsubscribe();
		this.sweetAlertSubscription.unsubscribe();
	}
}
