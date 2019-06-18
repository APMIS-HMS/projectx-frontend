import { DrugListApiService } from './../../../../../../services/facility-manager/setup/drug-list-api.service';
import { PharmacyEmitterService } from '../../../../../../services/facility-manager/pharmacy-emitter.service';
import { DrugInteractionService } from './../services/drug-interaction.service';
import { Component, OnInit, Output, Input, OnDestroy, EventEmitter } from '@angular/core';
import { Prescription, PrescriptionItem, Facility, Appointment } from 'app/models';
import { Subscription } from 'rxjs';
import { PrescriptionPriorityService, PrescriptionService } from 'app/services/facility-manager/setup';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-prescribed-table',
	templateUrl: './prescribed-table.component.html',
	styleUrls: [ './prescribed-table.component.scss' ]
})
export class PrescribedTableComponent implements OnInit, OnDestroy {
	@Input() currentPrescription: Prescription = <Prescription>{};
	@Input() selectedAppointment: Appointment = <Appointment>{};
	@Input() patientDetails: any;
	@Output() startPrescription: EventEmitter<any> = new EventEmitter<any>();
	billShow = false;
	subscription: Subscription;
	priorities: any[] = [];
	selectedPrescriptionItem: PrescriptionItem;
	selectedPriority: any = <any>{};
	facility: Facility = <Facility>{};
	clinicObj: any = {};
	employeeDetails: any = {};
	showAuthorize: boolean = true;

	constructor(
		private _drugInteractionService: DrugInteractionService,
		private _priorityService: PrescriptionPriorityService,
		private _drugListService: DrugListApiService,
		private _systemModuleService: SystemModuleService,
		private _prescriptionService: PrescriptionService,
		private _locker: CoolLocalStorage,
		private _pharmacyEmitterService: PharmacyEmitterService
	) {
		this.subscription = this._drugInteractionService.currentInteraction.subscribe((value) => {			
		
			//console.log(value);
			this.currentPrescription.prescriptionItems = value;

			if (
				this.currentPrescription.prescriptionItems !== undefined &&
				this.currentPrescription.prescriptionItems.length > 1
			) {
				this._drugListService
					.find_drug_interactions({ query: { rxcuis: value.map((drug) => drug.code) } })
					.then((payload) => {}, (error) => {});
			}
		});

		// I assigned values to this.currentPrescription from a service
			this.subscription = this._pharmacyEmitterService.getPrescription().subscribe(prescibe =>{				
				//console.log(prescibe);	
				this.currentPrescription = 	prescibe;
				this.showAuthorize = false;						
			});
		
	}	

	ngOnInit() {
		this._getAllPriorities();
		this.facility = <Facility>this._locker.getObject('selectedFacility');
	}

	private _getAllPriorities() {
		this._priorityService
			.findAll()
			.then((res) => {
				this.priorities = res.data;

				const _innerPriorities = res.data.filter((x) => x.name.toLowerCase().includes('normal'));
				if (_innerPriorities.length > 0) {
					this.currentPrescription.priority = { id: _innerPriorities[0]._id, name: _innerPriorities[0].name };					
					this.selectedPriority = _innerPriorities[0];
				}
			})
			.catch((err) => {});
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

	onBillShow(item) {
		this.selectedPrescriptionItem = item;
		this.billShow = true;
	}

	close_onClick(e) {
		this.billShow = false;
	}

	removePrescription(item) {
		this.currentPrescription.prescriptionItems = this.currentPrescription.prescriptionItems.filter(
			(i) => i._id !== item._id
		);
	}
	authorizePrescription() {
		this.currentPrescription.priority = { id: this.selectedPriority._id, name: this.selectedPriority.name };
		this.currentPrescription.isAuthorised = true;
		console.log (this.patientDetails);
		console.log (this.currentPrescription); //remove

		this._prescriptionService
			.authorizePresciption(this.currentPrescription)
			.then((res) => {
				if (res.status === 'success') {
					this.startPrescription.emit(this.currentPrescription);
					this._systemModuleService.announceSweetProxy('Prescription has been sent successfully!', 'success');
				} else {
					this._systemModuleService.announceSweetProxy(
						'There was a problem creating prescription! Please try again later',
						'error'
					);
				}
			})
			.catch((err) => {});
	}
}
