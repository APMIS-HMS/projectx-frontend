import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	BedOccupancyService,
	InPatientService,
	FacilitiesService,
	InPatientListService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, User } from './../../../../models/index';
import { WardEmitterService } from '../../../../services/facility-manager/ward-emitter.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import * as myGlobals from '../../../../shared-module/helpers/global-config';
import { IPagerSource } from '../../../../core-ui-modules/ui-components/PagerComponent';

@Component({
	selector: 'app-ward-manager-admittedpage',
	templateUrl: './ward-manager-admittedpage.component.html',
	styleUrls: [ './ward-manager-admittedpage.component.scss' ]
})
export class WardManagerAdmittedpageComponent implements OnInit {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	public frmNewAdmit: FormGroup;
	dischargePatient = false;
	filterFormGroup: FormGroup;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	employeeDetails: any = <any>{};
	admittedPatient: any[] = [];
	filterAdmittedPatient: any[];
	wardRoomLocationItems: any[] = [];
	wardRoomBedLocationItems: any[] = [];
	wardLocationItems: any[] = [];
	wardVal = new FormControl();
	roomVal = new FormControl();
	searchControl = new FormControl();
	loading: Boolean = true;
	selectedWard: any;
	wsearchOpen = false;
	paginationObj: IPagerSource = { pageSize: 10, currentPage: 0, totalPages: 0, totalRecord: 0 };
	private wardType: { type: string; typeObject: any };

	constructor(
		private fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _wardEventEmitter: WardEmitterService,
		private _inPatientService: InPatientService,
		private _bedOccupancyService: BedOccupancyService,
		private _facilitiesService: FacilitiesService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
		private _inPatientListService: InPatientListService
	) {
		this.facility = <Facility>this._locker.getObject('selectedFacility');

		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				if (!!res._id) {
					this.employeeDetails = res;
					const wardCheckedIn = this.employeeDetails.wardCheckIn.filter((x) => x.isOn)[0];
					this.wardType = {
						type: 'ward',
						typeObject: wardCheckedIn
					};
					this.getAdmittedItems(this.wardType);
					// this.getwardLocationItems(wardType);
				}
			})
			.catch((err) => {});
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Admitted Patients');
		this._wardEventEmitter.announceWard.subscribe((val) => {
			this.selectedWard = val;
			this.getAdmittedItems(val);
			// this.getwardLocationItems(val);
		});

		// this.searchControl.valueChanges.subscribe(searchText => {
		// 	this.filterInPatientList(searchText);
		// });
	}

	openSearch() {
		this.wsearchOpen = true;
	}
	closeSearch() {
		this.wsearchOpen = false;
	}

	onClickDischargePatient() {
		this.dischargePatient = true;
	}

	close_onClick() {
		this.dischargePatient = false;
	}

	getAdmittedItems(wardCheckedIn: any) {
		this.loading = true;
		this._inPatientListService
			.customGet(
				{ action: 'getAdmittedPatients' },
				{
					query: {
						facilityId: this.facility._id,
						currentWard: wardCheckedIn.typeObject.minorLocationId._id,
						status: myGlobals.onAdmission,
						$sort: { createdAt: -1 },
						$limit: this.paginationObj.pageSize,
						$skip: this.paginationObj.currentPage * this.paginationObj.pageSize
					}
				}
			)
			.then((res) => {
				this.loading = false;
				if (res.status === 'success' && res.data.length > 0) {
					this.admittedPatient = res.data;
					this.paginationObj.totalPages = res.total;
				}
			});
	}
	gotoPage(index: number) {
		this.paginationObj.currentPage = index;
		// Get the data for the selected page index
		this.getAdmittedItems(this.wardType);
	}
	onRoomChange(e) {}

	onWardChange(e) {}
}
