import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Component, OnInit, EventEmitter, Output, NgZone, ViewChild, AfterViewInit, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
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
} from '../../../../../../services/facility-manager/setup/index';

import { FormTypeService, ScopeLevelService } from '../../../../../../services/module-manager/setup/index';

@Component({
	selector: 'app-doc-upload',
	templateUrl: './doc-upload.component.html',
	styleUrls: [ './doc-upload.component.scss' ]
})
export class DocUploadComponent implements OnInit {
	user: any;
	@Input() selectedPatient: any;
	loading: boolean;
	mainErr = true;
	errMsg = 'you have unresolved errors';
	fileBase64: any;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	public frmNewUpload: FormGroup;
	documentTypes: any;
	fileType: any;
	fileName: any;

	fileCount: any;

	patientData: any;

	constructor(
		private formBuilder: FormBuilder,
		private docUploadService: DocumentUploadService,
		private patientService: PatientService,
		private personService: PersonService,
		private employeeService: EmployeeService,
		private facilityService: FacilitiesService,
		private billingService: BillingService,
		private formsService: FormsService,
		private formTypeService: FormTypeService,
		private systemModuleService: SystemModuleService,
		private locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.user = <any>this.locker.getObject('auth');
		this.frmNewUpload = this.formBuilder.group({
			fileUpload: [ '' ],
			fileName: [ '', [ <any>Validators.required ] ],
			fileType: [ '', [ <any>Validators.required ] ],
			desc: [ '' ]
		});
		this.documentTypeFn();
		this.docUploadCount();
	}
	close_onClick(e?) {
		this.closeModal.emit(true);
	}

	onFileChange(event) {
		let reader = new FileReader();
		if (event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			this.fileName = file.name;
			if (
				file.type == 'image/png' ||
				file.type == 'image/jpg' ||
				file.type == 'image/gif' ||
				file.type == 'image/jpeg' ||
				file.type == 'application/pdf'
			) {
				if (file.size < 1250000) {
					this.fileType = file.type;
					reader.readAsDataURL(file);
					reader.onload = () => {
						let base64 = reader.result;
						this.fileBase64 = base64;
					};
				} else {
					this.systemModuleService.announceSweetProxy('Size Of Document Too BIG!', 'info');
					this.frmNewUpload.controls['fileUpload'].setErrors({ sizeTooBig: true });
				}
			} else {
				this.systemModuleService.announceSweetProxy('Type of document not supported.', 'info');
				this.frmNewUpload.controls['fileUpload'].setErrors({ typeDenied: true });
			}
		}
	}

	uploadDocument(patient?: any) {
		this.systemModuleService.on();
		patient = this.selectedPatient;
		this.loading = true;
		let uploadDoc;
		this.loading = true;

		if (this.locker.getObject('patient')) {
			let upPatient = <any>this.locker.getObject('patient');
			uploadDoc = {
				base64: this.fileBase64,
				docType: this.frmNewUpload.controls['fileType'].value,
				docName: this.frmNewUpload.controls['fileName'].value,
				description: this.frmNewUpload.controls['desc'].value,
				fileType: this.fileType,
				patientId: upPatient._id,
				facilityId: this.facilityService.getSelectedFacilityId()._id,
				uploadType: 'documentUpload'
			};
		} else {
			uploadDoc = {
				base64: this.fileBase64,
				docType: this.frmNewUpload.controls['fileType'].value,
				docName: this.frmNewUpload.controls['fileName'].value,
				description: this.frmNewUpload.controls['desc'].value,
				fileType: this.fileType,
				patientId: patient._id,
				facilityId: this.facilityService.getSelectedFacilityId()._id,
				uploadType: 'documentUpload'
			};
		}

		let uploadDocObj: any = {};
		uploadDocObj.data = JSON.stringify(uploadDoc);

		this.docUploadService
			.post(uploadDocObj)
			.then((payload) => {
				this.systemModuleService.announceSweetProxy('Document Successfully Uploaded!', 'success');
				this.loading = false;
				this.docUploadCount();
				this.close_onClick(true);
				this.systemModuleService.off();
			})
			.catch((err) => {
				this.systemModuleService.off();
				this.systemModuleService.announceSweetProxy('There was an uploading the file, try again!', 'error');
				this.loading = false;
			});
	}

	documentTypeFn() {
		this.formTypeService
			.findAll()
			.then((payload) => {
				this.documentTypes = payload.data;
			})
			.catch((err) => {});
	}

	docUploadCount() {
		this.docUploadService
			.docUploadFind({
				query: {
					patientId: this.selectedPatient,
					facilityId: this.facilityService.getSelectedFacilityId()._id
				}
			})
			.then((payload) => {
				this.fileCount = payload.data.length;
			});
	}

	private _notification(type: String, text: String): void {
		this.facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
}
