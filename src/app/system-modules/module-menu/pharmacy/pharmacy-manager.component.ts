import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { FacilitiesService, EmployeeService } from '../../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';

@Component({
	selector: 'app-pharmacy-manager',
	templateUrl: './pharmacy-manager.component.html',
	styleUrls: ['./pharmacy-manager.component.scss']
})

export class PharmacyManagerComponent implements OnInit, OnDestroy {
	pageInView: String = '';
	storeTitle: String = '';
	modal_on: Boolean = false;
	isStoreAvailable: Boolean = false;
	externalPrescriptionNavMenu: Boolean = false;
	prescriptionNavMenu: Boolean = false;
	walkInNavMenu: Boolean = false;
	loginEmployee: Employee = <Employee>{};
	selectedFacility: Facility = <Facility>{};
	miniFacility: Facility = <Facility>{};

	constructor(
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		public facilityService: FacilitiesService,
    private _employeeService: EmployeeService,
    private _authFacadeService: AuthFacadeService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.miniFacility = <Facility>this._locker.getObject('miniFacility');
		const auth: any = this._locker.getObject('auth');
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
      if ((this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0)) {
        this.modal_on = true;
      } else {
        let isOn = false;
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (itemr.isDefault) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            isOn = true;
            let checkingObject = { typeObject: itemr, type: 'store' };
            this._employeeService.announceCheckIn(checkingObject);
            // Set page title
            this.isStoreAvailable = true;
            this.storeTitle = itemr.storeObject.name;
            this._employeeService.update(this.loginEmployee).then(payload => {
              this.loginEmployee = payload;
              checkingObject = { typeObject: itemr, type: 'store' };
              this._employeeService.announceCheckIn(checkingObject);
              this._locker.setObject('checkingObject', checkingObject);
            });
          }
        });
        if (!isOn) {
          this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
            if (r === 0) {
              itemr.isOn = true;
              itemr.lastLogin = new Date();
              // Set page title
              this.isStoreAvailable = true;
              this.storeTitle = itemr.storeObject.name;
              this._employeeService.update(this.loginEmployee).then(payload => {
                this.loginEmployee = payload;
                const checkingObject = { typeObject: itemr, type: 'store' };
                this._employeeService.announceCheckIn(checkingObject);
                this._locker.setObject('checkingObject', checkingObject);
              });
            }
          });
        }
      }
    }).catch(err => console.log(err));
		const url: String = this._router.url;
		this.changeRoute(url);

		const page: string = this._router.url;
		// this.checkPageUrl(page);
		this._pharmacyEventEmitter.announcedUrl.subscribe(url => {
			this.pageInView = url;
		});
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	changeRoute(route: String) {
		if (route.endsWith('external-prescriptions')) {
			this.externalPrescriptionNavMenu = true;
			this.prescriptionNavMenu = false;
			this.walkInNavMenu = false;
		} else if (route.endsWith('prescriptions')) {
			this.externalPrescriptionNavMenu = false;
			this.prescriptionNavMenu = true;
			this.walkInNavMenu = false;
		} else if (route.endsWith('dispense')) {
			this.externalPrescriptionNavMenu = false;
			this.prescriptionNavMenu = false;
			this.walkInNavMenu = true;
		}
	}

	ngOnDestroy() {
		if (this.loginEmployee.consultingRoomCheckIn !== undefined) {
			this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this._employeeService.update(this.loginEmployee).then(payload => {
						this.loginEmployee = payload;
					});
				}
			});
		}
		this._employeeService.announceCheckIn(undefined);
		this._locker.setObject('checkingObject', {});
	}
}
