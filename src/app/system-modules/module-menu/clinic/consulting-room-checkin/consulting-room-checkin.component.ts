import { AuthFacadeService } from './../../../service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConsultingRoomService, EmployeeService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { ConsultingRoomModel, Employee, User, Facility } from '../../../../models/index';
import { ClinicHelperService } from '../services/clinic-helper.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { LocationService } from '../../../../services/module-manager/setup';

@Component({
  selector: 'app-consulting-room-checkin',
  templateUrl: './consulting-room-checkin.component.html',
  styleUrls: ['./consulting-room-checkin.component.scss']
})
export class ConsultingRoomCheckinComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  mainErr = true;
  errMsg = 'You have unresolved errors';
  loginEmployee: Employee = <Employee>{};
  locations: any[] = [];
  user: User = <User>{};

  public roomCheckin: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  // @Output() selectedEmployee: Employee = <Employee>{};
  selectedConsultingRoom: ConsultingRoomModel = <ConsultingRoomModel>{};

  constructor(
    private formBuilder: FormBuilder,
    public clinicHelperService: ClinicHelperService,
    public facilityService: FacilitiesService,
    private consultingRoomService: ConsultingRoomService,
    private employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService,
    private _locationService: LocationService,
    private locker: CoolLocalStorage
  ) {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this._getLabLocation();
  }

  ngOnInit() {
    this.roomCheckin = this.formBuilder.group({
      location: ['', [<any>Validators.required]],
      room: ['', [<any>Validators.required]],
      isDefault: [true, []]
    });
    this.roomCheckin.controls['location'].valueChanges.subscribe(value => {
      this.consultingRoomService.find({ query: { minorLocationId: value } }).then(payload => {
        if (payload.data.length > 0) {
          this.selectedConsultingRoom = payload.data[0];
        } else {
          this.selectedConsultingRoom = <ConsultingRoomModel>{};
        }
      });
    });

    this.roomCheckin.controls['room'].valueChanges.subscribe(value => {
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  checkIn(valid, value) {
    let checkIn: any = <any>{};
    checkIn.minorLocationId = value.location;
    checkIn.roomId = value.room;
    checkIn.lastLogin = new Date();
    checkIn.isOn = true;
    checkIn.isDefault = value.isDefault;
    if (this.loginEmployee.consultingRoomCheckIn === undefined) {
      this.loginEmployee.consultingRoomCheckIn = [];
    }
    this.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (value.isDefault === true) {
        itemi.isDefault = false;
      }
    });
    this.loginEmployee.consultingRoomCheckIn.push(checkIn);
    this.employeeService.update(this.loginEmployee).then(payload => {
      this._notification('Success', 'You have successfully checked into consulting room.');
      this.loginEmployee.consultingRoomCheckIn = payload.consultingRoomCheckIn;
      const workspaces = <any>this.locker.getObject('workspaces');
      this.loginEmployee.workSpaces = workspaces;
      this.locker.setObject('loginEmployee', this.loginEmployee);
      this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
        if (itemr.isDefault === true) {
          itemr.isOn = true;
          itemr.lastLogin = new Date();
          this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
        }
      });
      this.close_onClick();
    });
  }

  private _getLabLocation() {
    this._locationService.find({ query: { name: 'Clinic' } }).then(res => {
      if (res.data.length > 0) {
        this._getEmployee(res.data[0]._id);
      }
    }).catch(err => {});
  }

  private _getEmployee(pharmId: string) {
    this.authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
      if (!!this.loginEmployee.workSpaces && this.loginEmployee.workSpaces.length > 0) {
        if (!!this.selectedFacility.minorLocations && this.selectedFacility.minorLocations.length > 0) {
          const minorLocations = this.selectedFacility.minorLocations;
          const locations = this.loginEmployee.workSpaces.map(m => m.locations);
          const locationIds = [];
          locations.forEach(location => { (location.map(m => m.minorLocationId)).forEach(p => { locationIds.push(p) }); });
          this.locations = minorLocations.filter(x => x.locationId === pharmId && locationIds.includes(x._id));
        }
      }
    }).catch(err => {});
  }

  changeRoom(checkIn: any) {
    let keepCheckIn;
    this.loginEmployee.consultingRoomCheckIn.forEach((itemi, i) => {
      itemi.isOn = false;
      if (itemi._id === checkIn._id) {
        itemi.isOn = true;
        keepCheckIn = itemi;
      }
    });
    this.employeeService.update(this.loginEmployee).then(payload => {
      this._notification('Success', 'You have successfully changed consulting room.');
      this.loginEmployee = payload;
      const workspaces = <any>this.locker.getObject('workspaces');
      this.loginEmployee.workSpaces = workspaces;
      this.locker.setObject('loginEmployee', this.loginEmployee);
      this.employeeService.announceCheckIn({ typeObject: keepCheckIn, type: 'clinic' });
      this.close_onClick();
    });
  }

  // Notification
  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
