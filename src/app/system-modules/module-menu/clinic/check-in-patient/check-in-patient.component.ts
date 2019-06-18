import { SchedulerService } from './../../../../services/facility-manager/setup/scheduler.service';
import { AuthFacadeService } from './../../../service-facade/auth-facade.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// tslint:disable-next-line:max-line-length
import {
	FacilitiesService,
	EmployeeService,
	ConsultingRoomService,
	ProfessionService,
	WorkSpaceService,
	AppointmentService,
	PatientService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import {
	Appointment,
	ClinicModel,
	Profession,
	Timeline,
	Employee,
	Facility,
	Location,
	MinorLocation,
	Patient
} from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ClinicHelperService } from '../services/clinic-helper.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { IPagerSource } from 'app/core-ui-modules/ui-components/PagerComponent';
@Component({
	selector: 'app-check-in-patient',
	templateUrl: './check-in-patient.component.html',
	styleUrls: [ './check-in-patient.component.scss' ]
})
export class CheckInPatientComponent implements OnInit, OnDestroy {
	schedules: any;
	patientItem: any;
	addVital = false;
	slideTimeline = false;
	searchControl = new FormControl();
	value: Date = new Date(1981, 3, 27);
	now: Date = new Date();
	min: Date = new Date(1900, 0, 1);
	dateClear = new Date(2015, 11, 1, 6);
	loadIndicatorVisible = false;

	checkedInAppointments: Appointment[] = [];
	selectedCheckedInAppointment: Appointment = <Appointment>{};
	selectedFacility: Facility = <Facility>{};
	timelines: Timeline[] = [];
	employees: Employee[] = [];
	professions: Profession[] = [];
	clinics: any[] = [];
	clinicLocations: MinorLocation[] = [];
	loginEmployee: Employee = <Employee>{};
	selectedProfession: any;
	clinic: Location = <Location>{};
	patient: any = <any>{};
	isDoctor = false;
	counter = 0;
	subscription: Subscription;
	loading: Boolean = true;
	paginationObj: IPagerSource = { totalRecord: 0, currentPage: 0, pageSize: 10, totalPages: 0 };

	constructor(
		private appointmentService: AppointmentService,
		private router: Router,
		private route: ActivatedRoute,
		private employeeService: EmployeeService,
		private workSpaceService: WorkSpaceService,
		private professionService: ProfessionService,
		private consultingRoomService: ConsultingRoomService,
		private locationService: LocationService,
		private authFacadeService: AuthFacadeService,
		public clinicHelperService: ClinicHelperService,
		private patientService: PatientService,
		private locker: CoolLocalStorage,
		public facilityService: FacilitiesService,
		private scheduleService: SchedulerService
	) {
		this.clinicHelperService.getConsultingRoom();
		this.subscription = this.employeeService.listner.subscribe((payload) => {
			this.loginEmployee = payload;
		});
		this.subscription = this.appointmentService.updatelistner.subscribe((payload) => {
			this.selectedCheckedInAppointment = payload;
			this.getClinics();
		});
		this.subscription = this.appointmentService.timelineAnnounced$.subscribe((value) => {
			if (value === true) {
				this.slideTimeline = false;
			}
		});
	}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		const auth: any = this.locker.getObject('auth');

		this.authFacadeService.getLogingEmployee().then((payload: any) => {
			this.loginEmployee = payload;
			if (this.loginEmployee.professionId === 'Doctor') {
				this.isDoctor = true;
				this.selectedProfession = this.loginEmployee.professionId;
			}
			this.getEmployees();
			this.getSchedules();
		});
		// this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');

		// this.route.data.subscribe(data => {
		//   this.subscription = data['checkInPatients'].subscribe((payload: any[]) => {
		//     const emp$ = Observable.fromPromise(this.employeeService.find({
		//       query: {
		//         facilityId: this.selectedFacility._id, personId: auth.data.personId, showbasicinfo: true
		//       }
		//     }));
		//     this.subscription = emp$.mergeMap((emp: any) => Observable
		//     .forkJoin([Observable.fromPromise(this.employeeService.get(emp.data[0]._id, {})),
		//     ]))
		//       .subscribe((results: any) => {
		//         this.loginEmployee = results[0];
		//         if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
		//           payload.forEach((itemch, ch) => {
		//             this.loginEmployee.unitDetails.forEach((itemu, u) => {
		//               itemu.clinics.forEach((itemc, c) => {
		//                 if (itemc._id === itemch.clinicId) {
		//                   this.checkedInAppointments.push(itemch);
		//                 }
		//               });yyy
		//             });
		//           });
		//         } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
		//           payload.forEach((itemch, ch) => {
		//             this.loginEmployee.workSpaces.forEach((itemu, u) => {
		//               itemu.locations.forEach((itemc, c) => {
		//                 if (itemc.minorLocationId === itemch.locationId) {
		//                   this.checkedInAppointments.push(itemch);
		//                 }
		//               });
		//             });
		//           });
		//         }
		//         this.loadIndicatorVisible = false;
		//         this.getClinics();
		//       });
		//   });

		// });
	}

	getClinics() {
		this.clinics = [];
		const clinicIds = [];

		this.selectedFacility.departments.forEach((itemi, i) => {
			itemi.units.forEach((itemj, j) => {
				itemj.clinics.forEach((itemk, k) => {
					if (this.loginEmployee !== undefined && this.loginEmployee.professionId === 'Doctor') {
						this.loginEmployee.units.forEach((itemu, u) => {
							if (itemu === itemj.name) {
								const clinicModel: ClinicModel = <ClinicModel>{};
								clinicModel.clinic = itemk;
								clinicModel.department = itemi;
								clinicModel.unit = itemj;
								clinicModel._id = itemk._id;
								clinicModel.clinicName = itemk.clinicName;
								this.clinics.push(clinicModel);
								clinicIds.push(clinicModel.clinicName);
							}
						});
					} else if (this.loginEmployee !== undefined && this.loginEmployee.professionId !== 'Doctor') {
						this.loginEmployee.workSpaces.forEach((wrk, ii) => {
							wrk.locations.forEach((lct, li) => {
								this.schedules.forEach((sch: any, ji) => {
									sch.schedules.forEach((sch2, jji) => {
										if (
											sch2.location._id === lct.minorLocationId &&
											sch.clinic === itemk.clinicName
										) {
											if (clinicIds.filter((x) => x === itemk._id).length === 0) {
												if (this.clinics.findIndex((x) => x._id === itemk._id) === -1) {
													const clinicModel: ClinicModel = <ClinicModel>{};
													clinicModel.clinic = sch.clinic;
													clinicModel.department = itemi;
													clinicModel.unit = itemj;
													clinicModel._id = itemk._id;
													clinicModel.clinicName = itemk.clinicName;
													this.clinics.push(clinicModel);
													clinicIds.push(clinicModel.clinicName);
												}
											}
										}
									});
								});
							});
						});
					}
				});
			});
		});
		this.loadIndicatorVisible = false;
		this.getAppointments(clinicIds);
	}
	getSchedules() {
		this.scheduleService.find({ query: { facilityId: this.selectedFacility._id } }).then((payload: any) => {
			this.schedules = payload.data;
			this.getClinics();
		});
	}
	getAppointments(clinicIds) {
		this.appointmentService
			.findAppointment({
				query: {
					facilityId: this.selectedFacility._id,
					isToday: true,
					isCheckedIn: true,
					isCheckedOut: false,
					clinicIds: clinicIds,
					$limit: this.paginationObj.pageSize,
					$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
				}
			})
			.then((payload) => {
				this.loading = false;
				this.checkedInAppointments = payload.data.filter((x) => x.isCheckedOut === false);
				this.paginationObj.totalRecord = payload.total;
			});
	}

	// getClinics() {
	//   this.clinics = [];
	//   this.selectedFacility.departments.forEach((itemi, i) => {
	//     itemi.units.forEach((itemj, j) => {
	//       itemj.clinics.forEach((itemk, k) => {
	//         if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name === 'Doctor') {
	//           this.loginEmployee.units.forEach((itemu, u) => {
	//             if (itemu === itemj._id) {
	//               const clinicModel: ClinicModel = <ClinicModel>{};
	//               clinicModel.clinic = itemk;
	//               clinicModel.department = itemi;
	//               clinicModel.unit = itemj;
	//               clinicModel._id = itemk._id;
	//               clinicModel.clinicName = itemk.clinicName;
	//               this.clinics.push(clinicModel);
	//             }
	//           });
	//         } else if (this.loginEmployee !== undefined && this.loginEmployee.professionObject.name !== 'Doctor') {
	//           this.loginEmployee.workSpaces.forEach((itemw, w) => {
	//             itemw.locations.forEach((iteml, l) => {
	//               if (iteml.minorLocationId === itemk.clinicLocation) {
	//                 const clinicModel: ClinicModel = <ClinicModel>{};
	//                 clinicModel.clinic = itemk;
	//                 clinicModel.department = itemi;
	//                 clinicModel.unit = itemj;
	//                 clinicModel._id = itemk._id;
	//                 clinicModel.clinicName = itemk.clinicName;
	//                 this.clinics.push(clinicModel);
	//               }
	//             });
	//           });
	//         }

	//       });
	//     });
	//   });
	// }
	close_onClick(e) {
		this.addVital = false;
		this.getClinics();
	}

	sortPatientsByName() {
		this.checkedInAppointments.sort(function(x: any, y: any) {
			const xLastName = x.patientDetails.personDetails.lastName.toLowerCase();
			const yLastName = y.patientDetails.personDetails.lastName.toLowerCase();
			if (xLastName < yLastName) {
				return -1;
			}
			if (xLastName > yLastName) {
				return 1;
			}
			return 0;
		});
	}

	getCheckedInPatients() {
		// query:
		// {
		//     isFuture: true, 'facilityId': this.selectedFacility._id, 'clinicIds': clinicIds
		// }
		this.appointmentService
			.findAppointment({
				query: {
					facilityId: this.selectedFacility._id,
					attendance: { $exists: true },
					$limit: this.paginationObj.pageSize,
					$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
				}
			})
			.then((payload) => {
				this.loading = false;
				this.checkedInAppointments = payload.data;
				this.paginationObj.totalRecord = payload.total;
				if (this.checkedInAppointments.length > 0) {
					this.selectedCheckedInAppointment = this.checkedInAppointments[0];
				}
			});
	}

	getProfessions() {
		this.professionService.findAll().then((payload) => {
			payload.data.forEach((itemi, i) => {
				this.professions.push(itemi);
			});
		});
	}

	getEmployees() {
		this.employees = [];
		if (this.isDoctor) {
			this.employeeService
				.find({
					query: {
						facilityId: this.selectedFacility._id,
						professionId: this.selectedProfession._id,
						units: { $in: this.loginEmployee.units }
					}
				})
				.then((payload) => {
					payload.data.forEach((itemi, i) => {
						this.employees.push(itemi);
						if (this.loginEmployee._id !== undefined && this.selectedProfession._id !== undefined) {
						}
					});

					if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
						this.workSpaceService
							.find({ query: { employeeId: this.loginEmployee._id } })
							.then((payloade) => {});
					}
				});
		} else {
			const profession$ = Observable.fromPromise(this.professionService.find({ query: { name: 'Doctor' } }));
			profession$
				.mergeMap((result: any) => {
					if (result.data.length > 0) {
						this.selectedProfession = result.data[0];
						return Observable.fromPromise(
							this.employeeService.find({
								query: {
									facilityId: this.selectedFacility._id,
									professionId: result.data[0]._id
								}
							})
						);
					}
				})
				.subscribe((results) => {});
			// this.employeeService.find({
			//   query: {
			//     facilityId: this.selectedFacility._id,
			//     professionId: this.selectedProfession._id
			//   }
			// })
			//   .then(payload => {
			//     payload.data.forEach((itemi, i) => {
			//       this.employees.push(itemi);
			//     });

			//     if (this.loginEmployee !== undefined && this.selectedProfession._id !== undefined) {
			//       this.workSpaceService.find({ query: { employeeId: this.loginEmployee._id } }).then(payloade => {
			//       });
			//     }
			//   });
		}
	}

	getCheckedInTimeLine() {
		if (this.selectedCheckedInAppointment !== undefined) {
			const timeline: Timeline = <Timeline>{};
			timeline.startTime = this.selectedCheckedInAppointment.attendance.dateCheckIn;
			timeline.endTime = this.selectedCheckedInAppointment.attendance.dateCheckIn;
			timeline.person = this.selectedCheckedInAppointment.attendance.employeeId;
			timeline.label = 'Check In';
			this.timelines.push(timeline);
			this.getOtherTimeLines();
		}
	}

	getOtherTimeLines() {
		if (this.selectedCheckedInAppointment.clinicInteractions !== undefined) {
			this.appointmentService.get(this.selectedCheckedInAppointment._id, {}).then((payload) => {
				if (payload !== undefined) {
					this.selectedCheckedInAppointment = payload;
					payload.clinicInteractions.forEach((itemi, i) => {
						const timeline: Timeline = <Timeline>{};
						timeline.startTime = itemi.startAt;
						timeline.endTime = itemi.endAt;
						timeline.person = itemi.employee;
						timeline.label = itemi.title;
						this.timelines.push(timeline);
					});
				}
			});
		}
	}

	show_addVital() {
		this.addVital = true;
	}

	getConsultingRoom(appointment) {
		const retVal = '';
		// if (appointment.employeeDetails.consultingRoomCheckIn !== undefined) {
		//   appointment.employeeDetails.consultingRoomCheckIn.forEach((itemr, r) => {
		//     if (itemr.isOn === true) {
		//       this.clinicHelperService.consultingRooms.forEach((itemk, k) => {
		//         itemk.rooms.forEach((itemp, p) => {
		//           if (itemp._id === itemr.roomId) {
		//             retVal = 'Consulting Room(' + itemp.name + ')';
		//           }
		//         });
		//       });
		//     }
		//   });
		// }

		return retVal;
	}

	dontGo() {
		this.slideTimeline = false;
	}

	goToPatientPage(appointment, append) {
		//TO DO - 1. While is this taking time.  2. Move this to backend
		if (append === true) {
			const isOnList = this.loginEmployee.consultingRoomCheckIn.filter((x) => x.isOn === true);
			this.locker.setObject('patient', appointment.patientDetails);
			this.locker.setObject('appointment', '');
			appointment.isEngaged = true;
			this.locker.setObject('appointment', appointment);
			if (isOnList.length > 0) {
				this.router
					.navigate([
						'/dashboard/patient-manager/patient-manager-detail',
						appointment.patientDetails.personDetails._id,
						{ checkInId: isOnList[0]._id }
					])
					.then(
						(payload) => {
							this.appointmentService.appointmentAnnounced(appointment);
						},
						(error) => {}
					);
			} else {
				this.router.navigate([
					'/dashboard/patient-manager/patient-manager-detail',
					appointment.patientDetails.personDetails._id,
					{ appId: appointment._id }
				]);
			}
		} else {
			this.locker.setObject('patient', appointment.patientDetails);
			this.router.navigate([
				'/dashboard/patient-manager/patient-manager-detail',
				appointment.patientDetails.personDetails._id
			]);
		}
	}

	slideTimeline_toggle(value, event) {
		this.slideTimeline = !this.slideTimeline;
		this.selectedCheckedInAppointment = value;
		this.timelines = [];
		this.getCheckedInTimeLine();
		event.stopPropagation();
	}

	showVital(appointment) {
		this.addVital = true;
		this.selectedCheckedInAppointment = appointment;
		this.patientService.find({ query: { _id: appointment.patientId } }).subscribe((payload: any) => {
			this.patient = payload.data[0];
		});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onNavigate(appointment) {
		window.open(appointment.zoom.join_url, '_blank');
	}
}
