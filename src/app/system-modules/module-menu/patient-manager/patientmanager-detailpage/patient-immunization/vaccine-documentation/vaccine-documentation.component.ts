import { Component, OnInit, Input } from '@angular/core';
import { ImmunizationRecordService } from '../../../../../../services/facility-manager/setup';
import { Facility } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-vaccine-documentation',
	templateUrl: './vaccine-documentation.component.html',
	styleUrls: [ './vaccine-documentation.component.scss' ]
})
export class VaccineDocumentationComponent implements OnInit {
	@Input() patient;
	facility: Facility = <Facility>{};
	immunizationRecord: any = <any>{};
	immunizationRecords: any = <any>[];
	loading = true;

	constructor(private _locker: CoolLocalStorage, private _immunizationRecordService: ImmunizationRecordService) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		if (!!this.patient && !!this.patient._id) {
			this._getImmunizationRecords(this.patient._id);
		}
	}

	private _getImmunizationRecords(patientId) {
		this._immunizationRecordService
			.find({ query: { facilityId: this.facility._id, patientId: patientId } })
			.then((res) => {
				this.loading = false;
				// Check if data has a value and if there exists immunizations as a property and if the length is greater than 0.
				if (
					!!res.data &&
					res.data.length > 0 &&
					!!res.data[0].immunizations &&
					res.data[0].immunizations.length > 0
				) {
					this._modelImmunizationRecord(res.data[0]);
				}
			})
			.catch((err) => {});
	}

	private _modelImmunizationRecord(record) {
		this.immunizationRecord = record;
		const sortedArrays = record.immunizations.sort((a, b) => a.sequence - b.sequence);
		const grouped = this._groupBy(sortedArrays);
		this.immunizationRecords = Array.from(grouped);
	}

	private _groupBy(list) {
		const map = new Map();
		list.forEach((item) => {
			const key = item.vaccine.code;
			const collection = map.get(key);
			if (!collection) {
				map.set(key, [ item ]);
			} else {
				collection.push(item);
			}
		});
		return map;
	}
}
