import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { Appointment } from 'app/models';

@Component({
	selector: 'app-new-patient-prescription',
	templateUrl: './new-patient-prescription.component.html',
	styleUrls: [ './new-patient-prescription.component.scss' ]
})
export class NewPatientPrescriptionComponent implements OnInit {
	@Input() patientDetails: any;
	@Input() selectedAppointment: Appointment = <Appointment>{};
	tab_prescribe_drug = true;
	tab_prescription_history = false;

	constructor() {}

	ngOnInit() {}

	tab_click(tab) {
		if (tab === 'prescribeDrug') {
			this.tab_prescribe_drug = true;
			this.tab_prescription_history = false;
		} else if (tab === 'prescriptionHistory') {
			this.tab_prescribe_drug = false;
			this.tab_prescription_history = true;
		}
	}
}
