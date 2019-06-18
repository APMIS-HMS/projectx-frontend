import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, Input, Output, OnInit, AfterViewInit, ViewChild, OnDestroy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility, User } from '../../../models/index';
import { WardEmitterService } from '../../../services/facility-manager/ward-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { ISubscription, Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-ward-manager',
	templateUrl: './ward-manager.component.html',
	styleUrls: ['./ward-manager.component.scss']
})
export class WardManagerComponent implements OnInit, OnDestroy {
	@Input() checkedInWard: any;
	pageInView: string;
	loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};
	wardTitle = '';
	isWardAvailable = false;
	modal_on = false;
	admissionNavMenu = false;
	admittedNavMenu = false;
	wardNavMenu = false;
	setupNavMenu = false;
	transferNavMenu = false;
	contentSecMenuShow = false;
	checkedInObject: any = <any>{};
  user: User = <User>{};
  searchControl = new FormControl();
  subscription1: ISubscription;
  subscription2: ISubscription;

	constructor(
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
    private _router: Router,
    private _facilityService: FacilitiesService,
    private _employeeService: EmployeeService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService
	) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.loginEmployee = res;
        if ((this.loginEmployee.wardCheckIn === undefined || this.loginEmployee.wardCheckIn.length === 0)) {
          this.modal_on = true;
        } else {
          let isOn = false;
          this.loginEmployee.wardCheckIn.forEach((x, r) => {
            if (x.isDefault) {
              x.isOn = true;
              x.lastLogin = new Date();
              isOn = true;
              let checkingObject = { typeObject: x, type: 'ward' };
              this.checkedInObject = checkingObject;
              // this._employeeService.announceCheckIn(checkingObject);
              // Set page title
              this.isWardAvailable = true;
              this.wardTitle = x.minorLocationId.name;
              // tslint:disable-next-line:no-shadowed-variable
              this._employeeService.update(this.loginEmployee).then( res => {
                this.loginEmployee = res;
                checkingObject = { typeObject: x, type: 'ward' };
                this.checkedInObject = checkingObject;
                this._wardEventEmitter.announceWardChange(checkingObject);
                this._employeeService.announceCheckIn(checkingObject);
                this._locker.setObject('wardCheckingObject', checkingObject);
              });
            }
          });

          if (!isOn) {
            this.loginEmployee.wardCheckIn.forEach((x, r) => {
              if (r === 0) {
                x.isOn = true;
                x.lastLogin = new Date();
                // Set page title
                this.isWardAvailable = true;
                this.wardTitle = x.minorLocationId.name;
                this._employeeService.update(this.loginEmployee).then(payload => {
                  this.loginEmployee = payload;
                  const checkingObject = { typeObject: x, type: 'ward' };
                  this.checkedInObject = checkingObject;
                  this._wardEventEmitter.announceWardChange(checkingObject);
                  this._employeeService.announceCheckIn(checkingObject);
                  this._locker.setObject('wardCheckingObject', checkingObject);
                });
              }
            });
          }
        }
      } else {
        const text = 'Couldn\'t get Logged in user! Please try again later';
      this._systemModuleService.announceSweetProxy(text, 'error');
      }
    }).catch(err => {
      // Starday * redirect non employee of this facility to the dashboard
      const text = 'Only an employee of this facility can have access to this module';
      this._systemModuleService.announceSweetProxy(text, 'info');
      this._router.navigate(['/dashboard']);
    });
	}

	ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

		const page: string = this._router.url;
		this.checkPageUrl(page);
		this.subscription1 = this._wardEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});

		// Update the wardCheckedIn object when it changes.
    this.subscription2 = this._wardEventEmitter.announceWard.subscribe(val => {
			this.checkedInObject = val;
    });
	}

	checkIntoWard() {
		this.modal_on = true;
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	onClickNavMenu(link: string, menu: string) {
    this.admissionNavMenu = false;
		this.admittedNavMenu = false;
		this.setupNavMenu = false;
    this.wardNavMenu = false;

		this._router.navigate([link]);
		this._wardEventEmitter.announcedUrl.subscribe(url => {
      this.pageInView = url;
    });

		switch (menu) {
			case 'admission':
			this.admissionNavMenu = true;
			break;
			case 'admitted':
			this.admittedNavMenu = true;
			break;
			case 'setup':
				this.setupNavMenu = true;
			break;
			case 'wards':
				this.wardNavMenu = true;
			break;
		}
	}

	private checkPageUrl(param: string) {
		if (param.includes('admission')) {
			this.admissionNavMenu = true;
		} else if (param.includes('admitted')) {
			this.admittedNavMenu = true;
		} else if (param.includes('setup')) {
			this.setupNavMenu = true;
		} else if (param.includes('wards')) {
			this.wardNavMenu = true;
		}
	}

	getCheckedInWard(value: any) {
		// const checkedInObject = { typeObject: value, type: 'ward' };
		// this.checkedInObject = checkedInObject;
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
  }
  
  // Notification
  private _notification(type: String, text: String): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }

	ngOnDestroy() {
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('wardCheckingObject', {});
    this.checkedInObject = {};
    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
  }
}
