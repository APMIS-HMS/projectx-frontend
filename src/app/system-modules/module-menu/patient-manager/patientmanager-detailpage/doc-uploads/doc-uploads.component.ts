import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	DocumentUploadService,
	PatientService,
	PersonService,
	EmployeeService,
	FacilitiesService,
	FacilitiesServiceCategoryService,
	BillingService,
	FormsService
} from '../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-doc-uploads',
	templateUrl: './doc-uploads.component.html',
	styleUrls: [ './doc-uploads.component.scss' ]
})
export class DocUploadsComponent implements OnInit {
	@Input() patient;
	// @ViewChild('fileInput') fileInput: ElementRef;
	addProblem_view = false;
	addAllergy_view = false;
	addHistory_view = false;
	addVitals_view = false;
	docDetail_view = false;
	newUpload = false;
	showDoc = false;
	documents: any;
	selectedDocument: any;

	constructor(
		private facilityService: FacilitiesService,
		private docUploadService: DocumentUploadService,
		private locker: CoolLocalStorage
	) {
		this.docUploadService.listner.subscribe((payload) => {
			this.getDocuments();
		});
	}

	ngOnInit() {
		this.getDocuments();
	}

	getDocuments() {
		// const patient = <any>this.locker.getObject('patient');
		this.docUploadService
			.docUploadFind({
				query: {
					patientId: this.patient._id,
					facilityId: this.facilityService.getSelectedFacilityId()._id,
					$sort: {
						createdAt: -1
					}
				}
			})
			.then((payload) => {
				this.documents = payload.data;
			});
	}

	addProblem_show(e) {
		this.addProblem_view = true;
	}
	addAllergy_show(e) {
		this.addAllergy_view = true;
	}
	addHistory_show(e) {
		this.addHistory_view = true;
	}
	addVitals_show(e) {
		this.addVitals_view = true;
	}
	newUpload_show() {
		this.newUpload = true;
	}

	close_onClick(message: boolean): void {
		this.addProblem_view = false;
		this.addAllergy_view = false;
		this.addHistory_view = false;
		this.addVitals_view = false;
		this.newUpload = false;
		this.showDoc = false;
	}
	docDetail(data?) {
		this.selectedDocument = data;
		this.showDoc = true;
	}
	onChange(e) {
		// upload stuff
	}
	// showImageBrowseDlg(){
	//   this.fileInput.nativeElement.click()
	// }
}
