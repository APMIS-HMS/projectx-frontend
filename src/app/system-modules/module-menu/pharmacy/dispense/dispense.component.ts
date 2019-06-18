import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, PrescriptionItem } from '../../../../models/index';
import { FacilitiesService, PrescriptionService } from '../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-dispense',
	templateUrl: './dispense.component.html',
	styleUrls: ['./dispense.component.scss']
})
export class DispenseComponent implements OnInit {
	@Output() prescriptionItems: PrescriptionItem[] = [];
	@Output() employeeDetails: any;
	facility: Facility = <Facility>{};

	constructor(
		private _locker: CoolLocalStorage,
		private _router: Router,
		private _route: ActivatedRoute
	) {

	}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');

		this._route.data.subscribe(data => {
			data['loginEmployee'].subscribe(payload => {
				this.employeeDetails = payload.loginEmployee;
			});
		});
	}
}
