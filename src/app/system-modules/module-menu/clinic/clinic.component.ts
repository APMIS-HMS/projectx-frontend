import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { UserService } from './../../../services/facility-manager/setup/user.service';
import { AuthFacadeService } from './../../service-facade/auth-facade.service';
import { Component, OnInit, AfterContentChecked, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { EmployeeService, ProfessionService, AppointmentService } from '../../../services/facility-manager/setup/index';
import { LocationService } from '../../../services/module-manager/setup/index';
import { Profession, Employee, Facility, Location, MinorLocation } from '../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClinicHelperService } from './services/clinic-helper.service';
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'


@Component({
	selector: 'app-clinic',
	templateUrl: './clinic.component.html',
	styleUrls: ['./clinic.component.scss']
})
export class ClinicComponent implements OnInit, OnDestroy {

	pageInView = 'Clinic Manager';
	contentSecMenuShow = false;
	modal_on = false;
	clinicApppointment = false;
	clinicCheckin = false;
	clinicSchedule = false;
	clinicConsulting = false;
	clinicRoom = false;
	clinicHome = true;

	clinicLocations: MinorLocation[] = [];
	professions: Profession[] = [];
	loginEmployee: any = <any>{};
	selectedProfession: Profession = <Profession>{};
	clinic: Location = <Location>{};
	selectedFacility: Facility = <Facility>{};

	isDoctor = false;
	counter = 0;

	constructor(
		private router: Router,
		private appointmentService: AppointmentService,
		private professionService: ProfessionService,
		private locker: CoolLocalStorage,
		private route: ActivatedRoute,
		private employeeService: EmployeeService,
		public clinicHelperService: ClinicHelperService,
		private authFacadeService: AuthFacadeService,
		private userService:UserService,
		private systemModuleService:SystemModuleService,
		private locationService: LocationService) {

		// this.route.data.subscribe(data => {
		//   data['loginEmployee'].subscribe(payload => {
		//     this.loginEmployee = payload.loginEmployee;
		//   });
		// });

	}


	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		const auth: any = this.locker.getObject('auth');

		const page: string = this.router.url;
		this.checkPageUrl(page);
		this.authFacadeService.getLogingEmployee().then((payload) => {
			this.loginEmployee = payload;
			if (this.loginEmployee !== undefined && this.loginEmployee.professionId !== undefined) {
				if (this.loginEmployee.professionId === 'Doctor'
					&& (this.loginEmployee.consultingRoomCheckIn === undefined
						|| this.loginEmployee.consultingRoomCheckIn.length === 0)) {
					this.modal_on = true;
					this.isDoctor = true;
				} else if (this.loginEmployee.professionId === 'Doctor') {
					let isOn = false;
					this.isDoctor = true;
					this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
						if (itemr.isDefault === true) {
							itemr.isOn = true;
							itemr.lastLogin = new Date();
							isOn = true;
							if (this.counter === 0) {
								this.employeeService.update(this.loginEmployee).then(payload => {
									this.loginEmployee = payload;
									this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
								}, error => {
								});
							}
						}
					});
					if (isOn === false) {
						this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
							if (r === 0) {
								itemr.isOn = true;
								itemr.lastLogin = new Date();
								if (this.counter === 0) {
									this.employeeService.update(this.loginEmployee).then(payload => {
										this.loginEmployee = payload;
										this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
									}, error => {
									});
								}
							}

						});
					}
					this.counter++;
				} else {
					this.isDoctor = false;
				}
			}else{
        this.systemModuleService.announceSweetProxy('You are not an employee of this facility','error');
      }
		});






		// const emp$ = Observable.fromPromise(this.employeeService.find({
		//   query: {
		//     facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
		//   }
		// }));
		// 	emp$.mergeMap((emp: any) => {
		// 		if (emp.data.length > 0) {
		// 			return Observable.forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
		// 			]);
		// 		} else {
		// 			return Observable.of(undefined);
		// 		}
		// 	})
		// 		.subscribe((results: any) => {
		// 			this.loginEmployee = results[0];
		// 			this.clinicHelperService.getClinicMajorLocation();
		// 			if (this.loginEmployee.professionObject !== undefined) {
		// 				if (this.loginEmployee.professionObject.name === 'Doctor'
		// 					&& (this.loginEmployee.consultingRoomCheckIn === undefined
		// 						|| this.loginEmployee.consultingRoomCheckIn.length === 0)) {
		// 					this.modal_on = true;
		// 				} else if (this.loginEmployee.professionObject.name === 'Doctor') {
		// 					let isOn = false;
		// 					this.isDoctor = true;
		// 					this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
		// 						if (itemr.isDefault === true) {
		// 							itemr.isOn = true;
		// 							itemr.lastLogin = new Date();
		// 							isOn = true;
		// 							if (this.counter === 0) {
		// 								this.employeeService.update(this.loginEmployee).then(payload => {
		// 									this.loginEmployee = payload;
		// 									this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
		// 								});
		// 							}
		// 						}
		// 					});
		// 					if (isOn === false) {
		// 						this.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
		// 							if (r === 0) {
		// 								itemr.isOn = true;
		// 								itemr.lastLogin = new Date();
		// 								if (this.counter === 0) {
		// 									this.employeeService.update(this.loginEmployee).then(payload => {
		// 										this.loginEmployee = payload;
		// 										this.employeeService.announceCheckIn({ typeObject: itemr, type: 'clinic' });
		// 									});
		// 								}
		// 							}

		// 						});
		// 					}
		// 					this.counter++;
		// 				} else {
		// 					this.isDoctor = false;
		// 				}
		// 			}
		// 		});

  	}

	changeRoom() {
		this.modal_on = true;
		this.contentSecMenuShow = false;
	}

	pageInViewLoader(title) {
		this.pageInView = title;
	}

	navItemClick(val) {
		this.contentSecMenuShow = false;
		if (val == 'home') {
			this.clinicApppointment = false;
			this.clinicCheckin = false;
			this.clinicSchedule = false;
			this.clinicConsulting = false;
			this.clinicRoom = false;
			this.clinicHome = true;
		} else if (val == 'appointment') {
			this.clinicApppointment = true;
			this.clinicCheckin = false;
			this.clinicSchedule = false;
			this.clinicConsulting = false;
			this.clinicRoom = false;
			this.clinicHome = false;
		} else if (val == 'checkin') {
			this.clinicApppointment = false;
			this.clinicCheckin = true;
			this.clinicSchedule = false;
			this.clinicConsulting = false;
			this.clinicRoom = false;
			this.clinicHome = false;
		} else if (val == 'schedule') {
			this.clinicApppointment = false;
			this.clinicCheckin = false;
			this.clinicSchedule = true;
			this.clinicConsulting = false;
			this.clinicRoom = false;
			this.clinicHome = false;
		} else if (val == 'room') {
			this.clinicApppointment = false;
			this.clinicCheckin = false;
			this.clinicSchedule = false;
			this.clinicConsulting = true;
			this.clinicRoom = false;
			this.clinicHome = false;
		}
	}

	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}

	innerMenuHide(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) { } else {
			this.contentSecMenuShow = false;
		}
	}

	closeActivate(e) {
		if (e.srcElement.id !== 'contentSecMenuToggle') {
			this.contentSecMenuShow = false;
		}
		this.appointmentService.hideTimelineAnnounced(true);
	}

	close_onClick(message: boolean): void {
		this.modal_on = false;
	}

	appointmentStyle() {
		this.clinicApppointment = true;
		this.clinicCheckin = false;
		this.clinicSchedule = false;
		this.clinicConsulting = false;
		this.clinicRoom = false;
	}

	checkedinStyle() {
		this.clinicApppointment = false;
		this.clinicCheckin = true;
		this.clinicSchedule = false;
		this.clinicConsulting = false;
		this.clinicRoom = false;
	}

	scheduleStyle() {
		this.clinicApppointment = false;
		this.clinicCheckin = false;
		this.clinicSchedule = true;
		this.clinicConsulting = false;
		this.clinicRoom = false;
	}

	consultingStyle() {
		this.clinicApppointment = false;
		this.clinicCheckin = false;
		this.clinicSchedule = false;
		this.clinicConsulting = true;
		this.clinicRoom = false;
	}

	roomStyle() {
		this.clinicApppointment = false;
		this.clinicCheckin = false;
		this.clinicSchedule = false;
		this.clinicConsulting = false;
		this.clinicRoom = true;
	}

	ngOnDestroy() {
		if (this.clinicHelperService.loginEmployee !== undefined && this.clinicHelperService.loginEmployee.consultingRoomCheckIn !== undefined) {
			this.clinicHelperService.loginEmployee.consultingRoomCheckIn.forEach((itemr, r) => {
				if (itemr.isDefault === true && itemr.isOn === true) {
					itemr.isOn = false;
					this.employeeService.update(this.clinicHelperService.loginEmployee).then(payload => {
						this.clinicHelperService.loginEmployee = payload;
					});
				}
			});
		} else {

		}
		this.employeeService.announceCheckIn(undefined);
	}

	private checkPageUrl(param: string) {
		if (param.includes('appointment')) {
			this.clinicApppointment = true;
			this.clinicCheckin = false;
			this.clinicSchedule = false;
			this.clinicConsulting = false;
			this.clinicRoom = false;

		} else if (param.includes('check-in')) {
			this.clinicApppointment = false;
			this.clinicCheckin = true;
			this.clinicSchedule = false;
			this.clinicConsulting = false;
			this.clinicRoom = false;
		} else if (param.includes('clinic-schedule')) {
			this.clinicApppointment = false;
			this.clinicCheckin = false;
			this.clinicSchedule = true;
			this.clinicConsulting = false;
			this.clinicRoom = false;
		} else if (param.includes('consulting-room')) {
			this.clinicApppointment = false;
			this.clinicCheckin = false;
			this.clinicSchedule = false;
			this.clinicConsulting = true;
			this.clinicRoom = false;
		}
	}

	chartClicked(e){

	}
	chartHovered(e){
	}
}
