import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import { BedOccupancyService, InPatientService, InPatientListService, FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { Facility, InPatient, WardTransfer, User} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
// import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: "app-admit-patient",
  templateUrl: './admit-patient.component.html',
  styleUrls: ['./admit-patient.component.scss']
})
export class AdmitPatientComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() inPatientItem: any;
  admitFormGroup: FormGroup;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  user: User = <User>{};
  employeeDetails: any = <any>{};
  inPatient: InPatient = <InPatient>{};
  _wardTransfer: WardTransfer = <WardTransfer>{};
  wards: any[] = [];
  rooms: any[] = [];
  beds: any[] = [];
  selectedBeds: any[] = [];
  availableBeds: any[] = [];
  occupiedBeds: any[] = [];
  admitPatient = false;
  admitBtn: boolean = true;
  admittingBtn: boolean = false;
  loadContent: Boolean = true;
  loadAvailableBeds: Boolean = true;
  disableAdmitBtn: Boolean = false;
  loggedInWard;

  constructor(
    private _bedOccupancyService: BedOccupancyService,
    private fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private router: Router,
    private _facilitiesService: FacilitiesService,
    private _inPatientService: InPatientService,
    private _inPatientListService: InPatientListService,
    private _authFacadeService: AuthFacadeService,
    private _systemModuleService: SystemModuleService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      if (!!res._id) {
        this.employeeDetails = res;
      }
    }).catch(err => {});
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.user = <User>this._locker.getObject('auth');

    // this.getwardRoomLocationItems();
    this.getWardsDetails();

    this.admitFormGroup = this.fb.group({
      ward: ['', [<any>Validators.required]],
      room: ['', [<any>Validators.required]],
      bed: ['', [<any>Validators.required]],
      desc: ['']
    });

    this.admitFormGroup.controls['ward'].valueChanges.subscribe(val => {
      this.loadAvailableBeds = true;
      this.beds = [];
      this.rooms = [];
      if (val !== '') {
        this.loadAvailableBeds = false;
        const wards = this.wards.filter(x => x._id === val);
        if (wards.length > 0 && !!wards[0].wardSetup) {
          this.rooms = wards[0].wardSetup.rooms;
          this.admitFormGroup.controls['room'].setValue('');
          this.admitFormGroup.controls['bed'].setValue('');
        }
      }
    });

    if (!!this.inPatientItem) {
      if (!!this.inPatientItem.minorLocationId) {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.minorLocationId);
        }, 1000);
      } else if (this.inPatientItem.typeChecker === myGlobals.transfer) {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.proposedWard);
        }, 1000);
      } else {
        setTimeout(e => {
          this.admitFormGroup.controls['ward'].setValue(this.inPatientItem.transfers[0].minorLocationId);
        }, 1000);
      }
    }

    this.admitFormGroup.controls['room'].valueChanges.subscribe(val => {
      this.loadAvailableBeds = false;
      this.beds = [];
      if (val !== '') {
        const rooms = this.rooms.filter(x => x._id === val._id);
        if (rooms.length > 0) {
          const payload = {
            action: 'getAvailableBeds',
            facilityId: this.facility._id,
            minorLocationId: this.admitFormGroup.controls['ward'].value,
            roomId: val._id
          };

          this._bedOccupancyService.customGet(payload, {}).then(res => {
            if (res.status === 'success') {
              this.beds = res.data;
            } else {
              this.beds = [];
            }
          }).catch(err => {});
        }
      }
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onAdmit(value: any, valid: boolean) {
    if (valid) {
      this.admitBtn = false;
      this.admittingBtn = true;
      this.disableAdmitBtn = true;
      // payload to send to the server;
      let payload = {
        inPatientId: this.inPatientItem._id,
        facilityId: this.facility._id,
        patientId: '',
        status: '',
        newStatus: '',
        action: '',
        employeeId: this.employeeDetails._id,
        minorLocationId: value.ward,
        roomId: value.room._id,
        bedId: value.bed._id,
        desc: value.desc,
        type: ''
      };

      // Patient is coming in on admission.
      if (this.inPatientItem.typeChecker === myGlobals.onAdmission) {
        payload.type = 'admitPatient';
        payload.action = 'admitPatient';
        payload.status = myGlobals.onAdmission;
        payload.patientId = this.inPatientItem.patientId;

        this._inPatientService.customCreate(payload).then(res => {
          if (res.status === 'success') {
            const patient = `${this.inPatientItem.personDetails.firstName} ${this.inPatientItem.personDetails.lastName}`;
            const text = `You have successfully admitted ${patient} into ${value.bed.name} bed in ${value.room.name} room`;
            // this._notification('Success', fullText);
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.close_onClick();
          } else {
            this._systemModuleService.announceSweetProxy(res.message, 'error');
          }
        }).catch(err => {});
      } else if (this.inPatientItem.typeChecker === myGlobals.transfer) {
        payload.type = 'acceptTransfer';
        payload.status = myGlobals.transfer;
        payload.newStatus = myGlobals.onAdmission;
        payload.action = 'admitPatient';
        payload.patientId = this.inPatientItem.patientId;

        this._inPatientService.customCreate(payload).then(res => {
          if (res.status === 'success') {
            const patient = `${this.inPatientItem.patient.personDetails.firstName} ${this.inPatientItem.patient.personDetails.lastName}`;
            const text = `You have successfully admitted ${patient} into ${value.bed.name} bed in ${value.room.name} room`;
            // this._notification('Success', fullText);
            this._systemModuleService.announceSweetProxy(text, 'success');
            this.close_onClick();
          } else {
            this._systemModuleService.announceSweetProxy(res.message, 'error');
          }
        }).catch(err => {});
      }
    } else {
      this._notification('Error', 'Please fill in all required fields.');
    }
  }

  getWardsDetails() {
    this.wards = this.facility.minorLocations.filter(x => x.locationId === this.inPatientItem.loggedInWard.majorLocationId);
    this.loadContent = false;
    // this._bedOccupancyService.find({ query: { facilityId: this.facility._id } }).then(res => {
    //   if (res.data.length > 0) {
    //     if (!!this.inPatientItem) {
    //       // Filter the wards to the current logged ward.
    //       this.wards = res.data[0].locations.filter(x => x.minorLocationId._id === this.inPatientItem.loggedInWard.minorLocationId._id);
    //     }
    //   }
    // });
  }

  // Notification
  private _notification(type: String, text: String): void {
    this._facilitiesService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
