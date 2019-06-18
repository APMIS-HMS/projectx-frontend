import { Component, OnInit, Output, Input, EventEmitter, NgZone } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../services/facility-manager/setup/index';
import { Facility } from '../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-facility-logo',
	templateUrl: './add-logo.component.html',
	styleUrls: ['../facility-setup.component.scss']
})
export class AddLogoComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};

	frm_numberVerifier: FormGroup;
	//facility: Facility = <Facility>{};
	//selectedFacility: Facility = <Facility>{};
	InputedToken: string;
	errMsg: string;

	private zone: NgZone;
	private progress: number = 0;
	private response: any = {};
	hasBaseDropZoneOver: boolean = true;
	sizeLimit = 2000000;

	f_logo_show = true;
	selectModules_show = false
	back_selectModules_show = false
	mainErr = true;

	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _facilityService: FacilitiesService,
	) { }

	ngOnInit() {
		//this.selectedFacility = this.inputFacility;
	}

	handleUpload(data: any): void {
		this.zone.run(() => {
			this.response = data;
			this.progress = Math.floor(data.progress.percent / 100);
		});
	}
	fileOverBase(e: any): void {
		this.hasBaseDropZoneOver = e;
	}
	beforeUpload(uploadingFile): void {
		this.getDataUri(uploadingFile.originalName, function (dataUri) {
			// Do whatever you'd like with the Data URI!
		});

		if (uploadingFile.size > this.sizeLimit) {
			uploadingFile.setAbort();
			alert('File is too large');
		}
	}
	imageChange(fileInput: any) {
		this.previewFile(fileInput.target.files[0]);
		if (fileInput.target.files && fileInput.target.files[0]) {
			const reader = new FileReader();

			reader.onload = function (e: any) {
			};
			reader.onprogress = function (e: any) {
			};

			reader.readAsDataURL(fileInput.target.files[0]);
		}
	}

	previewFile(value: File) {
		const file = value;
		const reader = new FileReader();
		const facility = this.inputFacility;
		reader.addEventListener('load', function () {
			// facility.logo = reader.result;
		}, false);

		if (file) {
			reader.readAsDataURL(file);
		}
	}

	getDataUri(url, callback) {
		let image = new Image();

		image.onload = function () {
			const canvas = document.createElement('canvas');
			canvas.width = image.width; // or 'width' if you want a special/scaled size
			canvas.height = image.width; // or 'height' if you want a special/scaled size

			canvas.getContext('2d').drawImage(image, 0, 0);

			// Get raw image data
			callback(canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, ''));

			// ... or get as Data URI
			callback(canvas.toDataURL('image/png'));
		};

		image.src = url;
	}

	back_logoUp() {
		this.f_logo_show = false;
		this.selectModules_show = false;
		this.back_selectModules_show = true;
	}

	f_sg4_show() {
		this.f_logo_show = false;
		this.selectModules_show = true;
		this._facilityService.update(this.inputFacility).then(payload => { });
		this._facilityService.update(this.inputFacility).then(payload => {
			if (payload != null && payload != undefined) {

			}
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

}
