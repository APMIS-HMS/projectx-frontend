import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import {
	Facility,
	Patient,
	Employee,
	Documentation,
	PatientDocumentation,
	Document
} from '../../../../../../models/index';
import {
	FormsService,
	FacilitiesService,
	DocumentationService
} from '../../../../../../services/facility-manager/setup/index';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-documentation-detail',
	templateUrl: './documentation-detail.component.html',
	styleUrls: [ './documentation-detail.component.scss' ]
})
export class DocumentationDetailComponent implements OnInit {
	loginEmployee: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() document: any = <any>{};
	@Input() isDocumentEdit: any = <any>{};
	@Input() patientDocumentationId: any;

	selectedPatientDocumentation: any;
	addendumCtrl: FormControl = new FormControl();
	selectedFacility: any;

	constructor(
		private facilityService: FacilitiesService,
		private documentationService: DocumentationService,
		private authFacadeService: AuthFacadeService,
		private locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.authFacadeService.getLogingEmployee().then((loginEmployee) => {
			this.loginEmployee = loginEmployee;
			this.getPatientDocumentation();
		});
	}
	checkType(value) {
		if (typeof value === 'string') {
			return true;
		} else if (typeof value === 'number') {
			return true;
		} else if (value.length !== undefined) {
			return true;
		}
	}
	getPatientDocumentation() {
		this.documentationService.get(this.patientDocumentationId, {}).then(
			(payload) => {
				this.selectedPatientDocumentation = payload;
				if (
					this.document.document.addendum !== undefined &&
					this.document.document.addendum.text !== undefined
				) {
					this.addendumCtrl.setValue(this.document.document.addendum.text);
				}
			},
			(error) => {}
		);
	}
	close_onClick() {
		this.closeModal.emit(true);
	}

	save() {
		if (this.addendumCtrl.valid) {
			let addendum: any = {};
			addendum.employeeId = this.loginEmployee._id;

			addendum.employeeName =
				this.loginEmployee.personDetails.title.name +
				' ' +
				this.loginEmployee.personDetails.lastName +
				' ' +
				this.loginEmployee.personDetails.firstName;
			addendum.text = this.addendumCtrl.value;
			this.documentationService
				.addAddendum(addendum, {
					query: {
						patientDocumentationId: this.selectedPatientDocumentation._id,
						documentationId: this.document._id,
						facilityId: this.selectedFacility._id
					}
				})
				.then(
					(payload) => {
						this.close_onClick();
					},
					(error) => {}
				);
		}
	}
}
