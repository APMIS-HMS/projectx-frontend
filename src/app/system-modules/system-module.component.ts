import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NotificationService, Notification } from '../services/communication-manager/notification.service';
import {
	UserService,
	FacilitiesService,
	PersonService,
	EmployeeService
} from '../services/facility-manager/setup/index';
import { Person, Facility } from '../models/index';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { environment } from 'environments/environment';
import { NetworkConnection, ConnectionStatusEnum } from './NetworkConnection';
@Component({
	selector: 'app-system-module',
	templateUrl: './system-module.component.html',
	styleUrls: [ './system-module.component.scss' ]
})
export class SystemModuleComponent implements OnInit {
	searchControl = new FormControl();

	facilityManagerActive = true;
	moduleManagerActive = false;
	isLoggedOut = false;
	selectedUser: any;
	selectedPerson: Person = <Person>{};
	authData: any = <any>{};
	checkedInObject: any = <any>{};
	logoutConfirm_on = false;
	userOpt = false;
	changePassword = false;
	notifications: Notification[];
	notification_length: number;

	login_on = false;
	pwdReset_on = false;
	platformName = '';
	platformLogo = '';
	secondaryLogo;
	title;
	platform;
	isOnline = false;

	constructor(
		private userService: UserService,
		public facilityService: FacilitiesService,
		private personService: PersonService,
		private employeeService: EmployeeService,
		private toast: ToastsManager,
		private router: Router,
		private locker: CoolLocalStorage,
		private authFacadeService: AuthFacadeService,
		private notificationService: NotificationService
	) {
		this.title = environment.title;
		this.platformName = environment.platform;
		this.platformLogo = environment.logo;
		this.secondaryLogo = environment.secondary_logo;
		this.platform = environment.platform;
		this.facilityService.listner.subscribe((payload) => {
			const facility: Facility = <Facility>this.locker.getObject('selectedFacility');
			if (facility._id === payload._id) {
				this.locker.setObject('selectedFacility', payload);
			}
		});
		this.facilityService.patchListner.subscribe((payload) => {
			const facility: Facility = <Facility>this.locker.getObject('selectedFacility');
			if (facility._id === payload._id) {
				this.locker.setObject('selectedFacility', payload);
			}
		});
		this.userService.missionAnnounced$.subscribe((payload) => {
			if (payload === 'out') {
				this.isLoggedOut = true;
				this.router.navigate([ '/' ]);
			} else if (payload === 'in') {
			}
		});

		this.employeeService.checkInAnnounced$.subscribe((payload) => {
			this.checkedInObject = payload;
		});
		let auth: any = this.locker.getObject('auth');
		let authData = auth.data;
		this.personService.get(authData.personId, {}).then((ppayload) => {
			this.selectedPerson = ppayload;
		});

		this.personService.updateListener.subscribe((payload: Person) => {
			auth = this.locker.getObject('auth');
			authData = auth.data;
			if (authData.personId === payload._id) {
				this.selectedPerson = payload;
			}
		});
	}

	ngOnInit() {
		if (NetworkConnection.status === ConnectionStatusEnum.Offline) {
			this.isOnline = false;
		} else {
			this.isOnline = true;
		}
		const auth: any = this.locker.getObject('auth');
		this.authData = auth.data;
		this.getAllNotifications();
	}

	getAllNotifications() {
		try {
			this.notificationService.findAll({}).then((payload) => {
				this.notification_length = payload.total;
			});
		} catch (error) {
			return error;
		}
	}

	signOut() {
		this.userService.logOut();
		this.userService.announceMission('out');
		this.userService.isLoggedIn = false;
	}
	logOut() {
		this.logoutConfirm_on = true;
	}

	success(text) {
		this.toast.success(text, 'Success!');
	}
	error(text) {
		this.toast.error(text, 'Error!');
	}
	info(text) {
		this.toast.info(text, 'Info');
	}
	facilityManager_onClick() {
		this.facilityManagerActive = true;
		this.moduleManagerActive = false;
	}
	moduleManager_onClick() {
		this.moduleManagerActive = true;
		this.facilityManagerActive = false;
	}
	close_onClick() {
		this.logoutConfirm_on = false;
		this.logoutConfirm_on = false;
		this.changePassword = false;
	}
	userOpt_toggle() {
		this.userOpt = !this.userOpt;
	}
	changePass() {
		this.changePassword = true;
		this.logoutConfirm_on = false;
	}
	onSwitchAccount() {
		this.router.navigate([ '/accounts' ]).then((payload) => {
			this.authFacadeService.setLogingEmployee(undefined);
			this.authFacadeService.setLoginUser(undefined);
			this.authFacadeService.setSelectedFacility(undefined);
			this.authFacadeService.access = undefined;
		});
	}

	goHome() {
		this.router.navigate([ '/home-page' ]).then((payload) => {}, (error) => {});
	}
}
