import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from '../../../../../models/index';
import { WardEmitterService } from '../../../../../services/facility-manager/ward-emitter.service';
import { BedOccupancyService, InPatientService, FacilitiesService } from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-bill-details',
	templateUrl: './bill-details.component.html',
	styleUrls: ['./bill-details.component.scss']
})
export class BillDetailsComponent implements OnInit {
	@Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
	admittedPatientId: string;
	patientData: any;
	facility: Facility = <Facility>{};

	constructor(
		private _wardEventEmitter: WardEmitterService,
		private _route: ActivatedRoute,
		private _router: Router,
		public _inPatientService: InPatientService,
		private _locker: CoolLocalStorage,
		private _BedOccupancyService: BedOccupancyService,
		private _facilitiesService: FacilitiesService
	) {
		this.getAdmittedPatientItems();
	}

	ngOnInit() {
		this._wardEventEmitter.setRouteUrl('Patient Ward Bill Details');
		this.facility = <Facility>this._locker.getObject('selectedFacility');
	}

	getAdmittedPatientItems() {
		this._route.params.subscribe(params => {
			this.admittedPatientId = params['id'];
		});
		this._inPatientService.find({ query: { _id: this.admittedPatientId } })
			.then(payload => {
				if (payload.data.length !== 0) {
					const wardDetails = payload.data[0].transfers[payload.data[0].lastIndex];
					this.patientData = payload.data[0];
					this.patientData.wardItem = wardDetails;
				}
			});
	}

}
