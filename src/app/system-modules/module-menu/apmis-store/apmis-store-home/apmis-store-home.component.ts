import { Subscription, ISubscription } from 'rxjs/Subscription';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { EmployeeService } from '../../../../services/facility-manager/setup/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Facility, Employee } from '../../../../models/index';

@Component({
	selector: 'app-apmis-store-home',
	templateUrl: './apmis-store-home.component.html',
	styleUrls: [ './apmis-store-home.component.scss' ]
})
export class ApmisStoreHomeComponent implements OnInit, OnDestroy {
	modal_on = false;
	checkingStore: any = <any>{};
	selectedFacility: Facility = <Facility>{};
	loginEmployee: Employee = <Employee>{};
	workSpace: any;
	isRunningQuery = false;
	subscription: ISubscription;
	showDialog = false;
	constructor(
		private router: Router,
		private _locker: CoolLocalStorage,
		private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService
	) {
		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
					}
				}
			}
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
				this.modal_on = true;
			} else {
				let isOn = false;
				this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
					if (itemr.isDefault === true) {
						itemr.isOn = true;
						itemr.lastLogin = new Date();
						isOn = true;
						let checkingObject = { typeObject: itemr, type: 'store' };
						this._employeeService
							.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
							.then((payload) => {
								this.loginEmployee = payload;
								checkingObject = { typeObject: itemr, type: 'store' };
								this._employeeService.announceCheckIn(checkingObject);
								this._locker.setObject('checkingObject', checkingObject);
							});
					}
				});
				if (isOn === false) {
					this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
						if (r === 0) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							this._employeeService
								.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
								.then((payload) => {
									this.loginEmployee = payload;
									const checkingObject = { typeObject: itemr, type: 'store' };
									this._employeeService.announceCheckIn(checkingObject);
									this._locker.setObject('checkingObject', checkingObject);
								});
						}
					});
				}
			}
		});
	}

	ngOnInit() {}

	changeRoute(value: string) {
		this.router.navigate([ '/dashboard/store/' + value ]).then((payload) => {}).catch((error) => {});
	}

	onSwitchStore() {
		this.modal_on = !this.modal_on;
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	ngOnDestroy() {
		if (this.loginEmployee.storeCheckIn !== undefined) {
			this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this._employeeService.update(this.loginEmployee).then((payload) => {
						this.loginEmployee = payload;
					});
				}
			});
		}
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('checkingObject', {});
		this.subscription.unsubscribe();
	}
}
