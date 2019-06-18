import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FacilitiesService } from '../../../services/facility-manager/setup/index';
import { Facility } from '../../../models/index';
import { UserService } from '../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-facility-page',
	templateUrl: './facility-page.component.html',
	styleUrls: [ './facility-page.component.scss' ]
})
export class FacilityPageComponent implements OnInit {
	@Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
	contentSecMenuShow = false;

	modal_on = false;
	homeContentArea = true;
	modulesContentArea = false;
	departmentsContentArea = false;
	locationsContentArea = false;
	optionsContentArea = false;

	pageInView = 'Home';
	facilityObj: Facility = <Facility>{};

	constructor(
		public facilityService: FacilitiesService,
		private _DomSanitizationService: DomSanitizer,
		private router: Router,
		private locker: CoolLocalStorage
	) {
		this.facilityService.listner.subscribe((payload) => {
			this.facilityObj = payload;
		});
	}

	ngOnInit() {
		this.facilityObj = this.facilityService.getSelectedFacilityId();
		if (this.facilityObj === undefined || this.facilityObj === null) {
			this.router.navigate([ '/accounts' ]);
		}
	}
	navFpHome() {
		this.homeContentArea = true;
		this.modulesContentArea = false;
		this.departmentsContentArea = false;
		this.locationsContentArea = false;
		this.optionsContentArea = false;
	}
	navFpModules() {
		this.homeContentArea = false;
		this.modulesContentArea = true;
		this.departmentsContentArea = false;
		this.locationsContentArea = false;
		this.optionsContentArea = false;
	}
	navFpDepartments() {
		this.homeContentArea = false;
		this.modulesContentArea = false;
		this.departmentsContentArea = true;
		this.locationsContentArea = false;
		this.optionsContentArea = false;
	}
	navFpLocations() {
		this.homeContentArea = false;
		this.modulesContentArea = false;
		this.departmentsContentArea = false;
		this.locationsContentArea = true;
		this.optionsContentArea = false;
	}
	navFpOptions() {
		this.homeContentArea = false;
		this.modulesContentArea = false;
		this.departmentsContentArea = false;
		this.locationsContentArea = false;
		this.optionsContentArea = true;
	}
	pageInViewLoader(title) {
		this.pageInView = title;
	}
	contentSecMenuToggle() {
		this.contentSecMenuShow = !this.contentSecMenuShow;
	}
	close_onClick(e) {
		if (
			e.srcElement.className === 'inner-menu1-wrap' ||
			e.srcElement.localName === 'i' ||
			e.srcElement.id === 'innerMenu-ul'
		) {
		} else {
			this.contentSecMenuShow = false;
		}
	}
}
