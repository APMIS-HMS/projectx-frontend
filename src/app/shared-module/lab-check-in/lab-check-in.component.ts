import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmployeeService, FacilitiesService, WorkbenchService } from '../../services/facility-manager/setup/index';
import { Employee, Facility } from '../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { LocationService } from 'app/services/module-manager/setup';
import { LabEventEmitterService } from '../../services/facility-manager/lab-event-emitter.service';
import { SystemModuleService } from '../../services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-lab-check-in',
  templateUrl: './lab-check-in.component.html',
  styleUrls: ['./lab-check-in.component.scss']
})
export class LabCheckInComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() loginEmployee: Employee;
  @Input() workSpace: any;
  labCheckin: FormGroup;
  mainErr = true;
	errMsg = 'You have unresolved errors';
	workbenches: any[] = [];
  locations: any[] = [];
  locationHistory: any[] = [];
  selectedFacility: Facility = <Facility>{};
  checkInBtnText: String = '<i class="fa fa-check-circle"></i> Check In';

  constructor(
    private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
    private _employeeService: EmployeeService,
    private _workbenchService: WorkbenchService,
    private _authFacadeService: AuthFacadeService,
    private _locationService: LocationService,
    private _labEventEmitter: LabEventEmitterService,
    private _systemModuleService: SystemModuleService
  ) {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    this._getLabLocation();
  }

  ngOnInit() {
    this.labCheckin = this._fb.group({
      location: ['', [<any>Validators.required]],
      workbench: ['', [<any>Validators.required]],
      isDefault: [false, [<any>Validators.required]]
    });

		this.labCheckin.controls['location'].valueChanges.subscribe(val => {
      this._workbenchService.find({ query: { 'minorLocationId': val._id } }).then(res => {
				if (res.data.length > 0) {
					this.workbenches = res.data;
				}
			});
		});
  }

	checkIn(valid, value) {
    if (valid) {
      this.checkInBtnText = '<i class="fa fa-spinner fa-spin"></i> Checking in...';
      const checkIn: any = <any>{};
      checkIn.minorLocationId = value.location._id;
      checkIn.minorLocationObject = value.location;
      checkIn.workbenchId = value.workbench._id;
      checkIn.workbenchObject = value.workbench;
      checkIn.lastLogin = new Date();
      checkIn.isOn = true;
      checkIn.isDefault = value.isDefault;
      if (this.loginEmployee.workbenchCheckIn === undefined) {
        this.loginEmployee.workbenchCheckIn = [];
      }
      // Set to false any existing workbench that is set to true.
      if (!!this.loginEmployee.workbenchCheckIn && this.loginEmployee.workbenchCheckIn.length > 0) {
        this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
          item.isOn = false;
          if (value.isDefault === true) {
            item.isDefault = false;
          }
        });
      }

      this.loginEmployee.workbenchCheckIn.push(checkIn);
      this._employeeService.update(this.loginEmployee).then(res => {
        this.loginEmployee = res;
        const locationHistory = (this.loginEmployee.workbenchCheckIn.length > 0) ? this.loginEmployee.workbenchCheckIn : [];
        this.locationHistory = (locationHistory.length > 0) ? locationHistory.reverse().slice(0, 10) : [];
        const workspaces = <any>this._locker.getObject('workspaces');
        this.loginEmployee.workSpaces = workspaces;
        this._locker.setObject('loginEmployee', res);
        let keepCheckIn;
        this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
          item.isOn = false;
          if (item.workbenchId === checkIn.workbenchId) {
            item.isOn = true;
            keepCheckIn = item;
          }
        });

        const checkingObject = { typeObject: keepCheckIn, type: 'workbench' };
        this._employeeService.announceCheckIn(checkingObject);
        this._labEventEmitter.announceLabChange(checkingObject);
        this.checkInBtnText = '<i class="fa fa-check-circle"></i> Check In';
        this.close_onClick();
      });
    } else {
      this._systemModuleService.announceSweetProxy('Please fill all fields', 'error');
    }
  }

  private _getEmployee(labId: string) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
      const locationHistory = (this.loginEmployee.workbenchCheckIn.length > 0) ? this.loginEmployee.workbenchCheckIn : [];
      this.locationHistory = (locationHistory.length > 0) ? locationHistory.reverse().slice(0, 10) : [];
      if (!!this.loginEmployee.workSpaces && this.loginEmployee.workSpaces.length > 0) {
        if (!!this.selectedFacility.minorLocations && this.selectedFacility.minorLocations.length > 0) {
          const minorLocations = this.selectedFacility.minorLocations;
          const locations = this.loginEmployee.workSpaces.map(m => m.locations);
          const locationIds = [];
          locations.forEach(location => {
            (location.map(m => m.minorLocationId)).forEach(p => { locationIds.push(p) });
          });
          this.locations = minorLocations.filter(x => x.locationId === labId && locationIds.includes(x._id));
        }
      }
    }).catch(err => {});
  }

  private _getLabLocation() {
    this._locationService.find({ query: { name: 'Laboratory'}}).then(res => {
      if (res.data.length > 0) {
        this._getEmployee(res.data[0]._id);
      }
    }).catch(err => {});
  }

  close_onClick() {
		this.closeModal.emit(true);
	}

	changeRoom(checkIn: any) {
		let keepCheckIn;
		this.loginEmployee.workbenchCheckIn.forEach((item, i) => {
			item.isOn = false;
			if (item._id === checkIn._id) {
				item.isOn = true;
				keepCheckIn = item;
			}
		});
		this._employeeService.update(this.loginEmployee).then(res => {
      this.loginEmployee = res;
      const locationHistory = (this.loginEmployee.workbenchCheckIn.length > 0) ? this.loginEmployee.workbenchCheckIn : [];
      this.locationHistory = (locationHistory.length > 0) ? locationHistory.reverse().slice(0, 10) : [];
      const checkingObject = { typeObject: keepCheckIn, type: 'workbench' };
      this._employeeService.announceCheckIn(checkingObject);
      this._labEventEmitter.announceLabChange(checkingObject);
			this.close_onClick();
		});
	}

}
