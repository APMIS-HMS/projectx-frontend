import { Component, OnInit, Input } from '@angular/core';
import { Appointment, Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { PrescriptionService } from 'app/services/facility-manager/setup';

@Component({
	selector: 'app-prescription-history',
	templateUrl: './prescription-history.component.html',
	styleUrls: [ './prescription-history.component.scss' ]
})
export class PrescriptionHistoryComponent implements OnInit {
	@Input() patientDetails: any;
	@Input() selectedAppointment: Appointment = <Appointment>{};
	selectedFacility: any;
	patientPrescriptions: any = [];
	constructor(private _locker: CoolLocalStorage, private _prescriptionService: PrescriptionService) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.getPatientPrescriptions();
	}

	getPatientPrescriptions() {
		this._prescriptionService
			.find({
				query: {
					patientId: this.patientDetails._id,
					$select: [ 'prescriptionItems', 'createdAt' ],
					$sort: { createdAt: -1 }
					// $limit: false
				}
			})
			.then(
				(payload) => {
					const prescriptions = payload.data
						.map((item) => {
							return {
								createdAt: item.createdAt,
								prescriptionItems: item.prescriptionItems
							};
						})
						.map((prescription) => {
							return prescription.prescriptionItems.map((i) => {
								return {
									createdAt: prescription.createdAt,
									genericName: i.genericName,
									productName: i.productName,
									regimen: i.regimen
								};
							});
						});
					this.patientPrescriptions = [].concat.apply([], prescriptions);
				},
				(error) => {
					console.log(error);
				}
			);
	}
}
