import { AuthFacadeService } from './../../../service-facade/auth-facade.service';
import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { SchedulerService, ConsultingRoomService, EmployeeService, ProfessionService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
// tslint:disable-next-line:max-line-length
import { ScheduleRecordModel, Profession, ConsultingRoomModel, Employee, Facility, Location, MinorLocation } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class ClinicHelperService {
  clinicLocations: MinorLocation[] = [];
  professions: Profession[] = [];
  schedules: ScheduleRecordModel[] = [];
  consultingRooms: ConsultingRoomModel[] = [];
  loginEmployee: Employee = <Employee>{};
  selectedProfession: Profession = <Profession>{};
  clinic: Location = <Location>{};
  selectedFacility: Facility = <Facility>{};
  selectedConsultingRoom: ConsultingRoomModel = <ConsultingRoomModel>{};
  checkedInRoom: any = <any>{};

  isDoctor = false;
  constructor(private professionService: ProfessionService,
    private locker: CoolLocalStorage,
    private scheduleService: SchedulerService,
    private consultingRoomService: ConsultingRoomService,
    private employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService,
    private router:Router,
    private locationService: LocationService, ) {
    this.getProfessions();
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.getClinicMajorLocation();
    this.getConsultingRoom();
    this.employeeService.listner.subscribe(payload => {
      if (payload._id === this.loginEmployee._id) {
        this.loginEmployee = payload;
      }
    });
  }

  getSchedules() {
    this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.schedules = payload.data;
      this.getClinicLocation();
    });
  }
  getClinicMinorLocations() {
    this.selectedFacility.departments.forEach((depti, i) => {
      depti.units.forEach((unitj, j) => {
      });
    });
  }
  getConsultingRoom() {
    // this.checkedInRoom = <any>{};
    // let onRooms = this.loginEmployee.consultingRoomCheckIn.filter(x => x.isOn === true);
    // let onRoom = undefined;
    // if (onRooms.length > 0) {
    //   onRoom = onRooms[0];
    // }
    this.consultingRoomService.find({ query: { facilityId: this.selectedFacility._id } })
      .then(payload => {
        this.consultingRooms = payload.data;
        // payload.data.forEach((itemd, d) => {
        //   itemd.rooms.forEach((itemr, r) => {
        //     if (onRoom !== undefined) {
        //       if (itemr._id === onRoom.roomId) {
        //         this.checkedInRoom = itemr;
        //       }
        //     }
        //   });
        // });
      }).catch(err => {
        this.getConsultingRoom();
      });
  }
  getClinicMajorLocation() {
    this.locationService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        if (itemi.name === 'Clinic') {
          this.clinic = itemi;
          this.getLoginEmployee();
        }
      });
    });
  }

  getProfessions() {
    this.professionService.findAll().then(payload => {
      payload.data.forEach((itemi, i) => {
        this.professions.push(itemi);
      });
    });
  }
  getClinicLocation() {
    this.clinicLocations = [];
    const inClinicLocations: MinorLocation[] = [];
    const minors = this.selectedFacility.minorLocations.filter(x => x.locationId === this.clinic._id);
    minors.forEach((itemi, i) => {
      const minorLocation: MinorLocation = <MinorLocation>{};
      minorLocation._id = itemi._id;
      minorLocation.description = itemi.description;
      minorLocation.locationId = itemi.locationId;
      minorLocation.name = itemi.name;
      minorLocation.shortName = itemi.shortName;
      minorLocation.text = itemi.name;
      inClinicLocations.push(minorLocation);
    });
    if (this.loginEmployee.professionId !== undefined && this.loginEmployee.professionId === 'Doctor') {
      this.schedules.forEach((items, s) => {
        this.loginEmployee.units.forEach((itemu, u) => {
          if (itemu === items.unit) {
            const res = inClinicLocations.filter(x => x._id === items.clinic);
            if (res.length > 0) {
              this.clinicLocations.push(res[0]);
            }
          }
        });
      });
    } else {
      // this.loginEmployee.workSpaces.forEach((itemw, w) => {
      // 	itemw.locations.forEach((iteml, l) => {
      // 		const res = inClinicLocations.filter(x => x._id === iteml.minorLocationId);
      // 		if (res.length > 0) {
      // 			this.clinicLocations.push(res[0]);
      // 		}
      // 	});
      // });
    }

  }
  getLoginEmployee() {
    const auth: any = this.locker.getObject('auth');

    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      if(this.loginEmployee === undefined){
        this.router.navigate(['/dashboard']);
      }else{
        if (this.loginEmployee.professionId === 'Doctor') {
          this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
          this.isDoctor = true;
          this.getSchedules();
        } else {
          this.isDoctor = false;
          this.getClinicLocation();
        }
      }

    })

    // Observable.fromPromise(this.employeeService.find({
    //   query:
    //     {
    //       facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
    //     }
    // })).mergeMap((emp: any) => Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {}))).subscribe((results: Employee) => {
    //   this.loginEmployee = results;
    //   if (this.loginEmployee.professionObject.name === 'Doctor') {
    //     this.selectedProfession = this.professions.filter(x => x._id === this.loginEmployee.professionId)[0];
    //     this.isDoctor = true;
    //     this.getSchedules();
    //   } else {
    //     this.isDoctor = false;
    //     this.getClinicLocation();
    //   }
    // });
  }

}
