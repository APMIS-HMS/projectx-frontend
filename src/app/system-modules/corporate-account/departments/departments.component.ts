import { Component, OnInit } from '@angular/core';
import { FacilitiesService, CompanyHealthCoverService, CorporateFacilityService } from '../../../services/facility-manager/setup/index';
import { Facility, CompanyHealthCover } from '../../../models/index';
import { CorporateEmitterService } from '../../../services/facility-manager/corporate-emitter.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-departments',
	templateUrl: './departments.component.html',
	styleUrls: ['./departments.component.scss']
})
export class DepartmentsComponent implements OnInit {

	contentSecMenuShow = false;
	addDepartment = false;
	personDependants= false;
	selectedFacility: Facility = <Facility>{};
	constructor(public facilityService: FacilitiesService,
		private companyHealthCoverService: CompanyHealthCoverService,
		private corporateFacilityService: CorporateFacilityService,
		private locker: CoolLocalStorage,
		private _corporateEventEmitter: CorporateEmitterService
	) { }

	ngOnInit() {
		this._corporateEventEmitter.setRouteUrl('Departments');
		this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
	}

	addEmpShow() {
		this.addDepartment = true;
	}
	close_onClick(e) {
		this.addDepartment = false;
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

}
