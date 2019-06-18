import { Component, OnInit,OnDestroy } from '@angular/core';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../services/module-manager/setup/location.service';
import { StoreService } from './../../../../services/facility-manager/setup/store.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';
import { Facility,Employee } from 'app/models';
import { FormControl } from '@angular/forms';
import {EmployeeService} from '../../../../services/facility-manager/setup/index';

import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { Subscription, ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-store-stores',
  templateUrl: './store-stores.component.html',
  styleUrls: ['./store-stores.component.scss']
})
export class StoreStoresComponent implements OnInit,OnDestroy {

  tab_store = true;
  selectedFacility: any;
  stores: any = [];
  loc = '0';
  minorLocations: any = [];
  locations: any = [];
  storeLocations: any = [];
  formControlMinorLocation: FormControl = new FormControl();;
  formControlLocation: FormControl = new FormControl();

  loginEmployee: Employee = <Employee>{};
  checkingStore: any = <any>{};
	workSpace: any;
	isRunningQuery = false;
	subscription: ISubscription;
	showDialog = false;

  constructor(private router: Router, private _locker: CoolLocalStorage,
    private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private storeService: StoreService,
    private _employeeService: EmployeeService,
		private authFacadeService: AuthFacadeService) { 
    this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res) {
				if (!!res.typeObject) {
					this.checkingStore = res.typeObject;
					if (!!this.checkingStore.storeId) {
						if (!this.isRunningQuery) {
              this.isRunningQuery = true;
            }
					}
				}
			}
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
			if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
				// this.modal_on = true;
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

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this.getFacilityService();
    this.getLocationService();
    this.formControlLocation.valueChanges.subscribe(value => {
      this.storeLocations = this.minorLocations.filter(x => x.locationId.toString() === value.toString());
    });

    this.formControlMinorLocation.valueChanges.subscribe(value => {
      this.loc = value;
      this.storeService.listenStoreValue(value);
    });
  }

  getFacilityService() {
    this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
      this.minorLocations = payload.minorLocations;
    }, err => { })
  }

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
    }, err => { })
  }

  tab_click(tab) {
    if (tab === 'store') {
      this.tab_store = true;
    }
  }

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
      }
    ).catch(error => {
    });
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
