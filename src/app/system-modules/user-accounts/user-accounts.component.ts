import { JoinChannelService } from './../../services/facility-manager/setup/join-channel.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	FacilitiesService,
	CorporateFacilityService,
	EmployeeService
} from '../../services/facility-manager/setup/index';
import { Facility, Person, Employee } from '../../models/index';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, PersonService } from '../../services/facility-manager/setup/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ChannelService } from '../../services/communication-manager/channel-service';
import { SystemModuleService } from '../../services/module-manager/setup/system-module.service';
import { USE_FACILITY_ACTIVATION } from 'app/shared-module/helpers/global-config';

@Component({
	selector: 'app-user-accounts',
	templateUrl: './user-accounts.component.html',
	styleUrls: [ './user-accounts.component.scss' ]
})
export class UserAccountsComponent implements OnInit {
	item: any;

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	popup_listing = false;
	popup_verifyToken = false;
	popup_verificationToken = false;
	listOfFacilities: Facility[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedPerson: Person = <Person>{};
	logoutConfirm_on = false;
	loginEmployee: Employee = <Employee>{};
	authData: any;
	constructor(
		private locker: CoolLocalStorage,
		private router: Router,
		private route: ActivatedRoute,
		private userService: UserService,
		private personService: PersonService,
		private sanitizer: DomSanitizer,
		private corporateFacilityService: CorporateFacilityService,
		private employeeService: EmployeeService,
		private systemModuleService: SystemModuleService,
		private joinChannelService: JoinChannelService,
		public facilityService: FacilitiesService
	) {
		this.userService.missionAnnounced$.subscribe((payload) => {
			if (payload === 'out') {
				this.router.navigate([ '/' ]);
			}
		});
	}

	ngOnInit() {
		this.route.data.subscribe((data) => {
			if (data['switchUsers']) {
				data['switchUsers'].subscribe((payload: any) => {
					this.authData = payload.authData;
					this.selectedPerson = payload.selectedPerson;
					if (payload.listOfFacilities.length === 1) {
						this.popListing(payload.listOfFacilities[0]);
					} else {
						this.listOfFacilities = payload.listOfFacilities;
					}
				});
			} else {
				this.systemModuleService.off();
			}
		});
		// let auth = this.locker.getObject('auth');
		// this.authData = auth.data;
		// this.personService.get(this.authData.personId, {}).then(payload => {
		//   this.selectedPerson = payload;
		// });
		// if (auth == null || auth === undefined) {
		//   this.router.navigate(['/']);
		// } else if (auth.data.corporateOrganisationId == null || auth.data.corporateOrganisationId === undefined) {
		//   let facilities = auth.data.facilitiesRole;
		//   let facilityList = [];
		//   facilities.forEach((item, i) => {
		//     facilityList.push(item.facilityId);
		//   });

		//   this.facilityService.find({ query: { _id: { $in: facilityList } } })
		//     .then(payload => {
		//       this.listOfFacilities = payload.data;
		//       if (this.listOfFacilities.length === 1) {
		//         this.locker.setObject('selectedFacility', this.listOfFacilities[0]);
		//         this.router.navigate(['/modules']);
		//       } else {
		//       }
		//     });
		// } else {
		//   this.corporateFacilityService.get(auth.data.corporateOrganisationId, {}).then(single => {
		//     this.locker.setObject('selectedFacility', single);
		//     this.locker.setObject('isCorporate', true);
		//     this.router.navigate(['/modules/corporate']);
		//   });
		// }
	}

	popListing(item: any) {
		if ((!item.isActivated || item.isActivated === false) && USE_FACILITY_ACTIVATION) {
			this.systemModuleService.announceSweetProxy(
				'<strong>Facility Activation</strong>',
				'info',
				null,
				// tslint:disable-next-line:max-line-length
				'This Facility is yet to be <var>activated</var>, ' +
					'please contact <b>APMIS</b> on <i>0700-GET-APMIS</i>, <i>support@apmis.ng</i> or any APMIS agent',
				'This Facility is yet to be <b>activated</b>, ' +
					'please contact <b>APMIS</b> on <i>0700-GET-APMIS</i>, <i>support@apmis.ng</i> or any APMIS agent'
			);
		} else {
			const auth: any = this.locker.getObject('auth');
			this.item = item;
			this.facilityService.get(item._id, {}).then((payload) => {
				this.selectedFacility = payload;
				if (this.selectedFacility.isTokenVerified === false) {
					this.popup_verifyToken = true;
					this.popup_listing = false;
				} else {
					const dataChannel = {
						_id: this.selectedFacility._id,
						userId: auth.data._id,
						dept: this.selectedFacility.departments,
						facilityName: this.selectedFacility.name
					};
					this.joinChannelService.create(dataChannel).then(
						(pay) => {
							this.popup_listing = true;
							this.popup_verifyToken = false;
						},
						(err) => {}
					);
				}
				this.locker.setObject('selectedFacility', this.selectedFacility);
				this.locker.setObject('fac', this.selectedFacility._id);
				this.logoutConfirm_on = false;
			});
		}
	}
	close_onClick(e) {
		this.popup_listing = false;
		this.logoutConfirm_on = false;
		this.popup_verifyToken = false;
	}
	close_onClick2() {
		this.popup_verifyToken = false;
		if (this.item !== undefined && this.item._id !== undefined) {
			this.popListing(this.item);
		}
	}
	logoutConfirm_show() {
		this.popup_listing = false;
		this.logoutConfirm_on = true;
	}

	close_modal_onClick() {
		this.closeModal.emit(true);
	}
}
