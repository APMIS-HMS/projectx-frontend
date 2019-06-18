import { Component, OnInit, EventEmitter, Output, Input, Renderer, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import * as XLSX from 'xlsx';
import { FormArray, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
	ProfessionService,
	RelationshipService,
	MaritalStatusService,
	GenderService,
	TitleService,
	CountriesService,
	PatientService,
	PersonService,
	EmployeeService,
	FacilitiesService,
	FacilitiesServiceCategoryService,
	BillingService,
	ServicePriceService,
	HmoService,
	FamilyHealthCoverService
} from '../../../../services/facility-manager/setup/index';
import { Tag, Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

type AOA = any[][];


@Component({
	selector: 'app-bulk-upload',
	templateUrl: './bulk-upload.component.html',
	styleUrls: [ './bulk-upload.component.scss' ]
})
export class BulkUploadComponent implements OnInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild('fileInput') fileInput: ElementRef;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr: boolean = true;
	errMsg;
	isLoading = true;
	pageSize = 10;
	pageSizeOptions = [ 5, 10, 25, 100 ];
	pageEvent: PageEvent;

	patients = [];

	uploadingLoading: boolean = false;
	uploadItemTotal = 0;
	uploadItemCounter = 0;

	showInsurance: boolean = false;
	showWallet: boolean = false;
	showFamily: boolean = false;
	showCompany: boolean = false;

	openBox: any = '';
	shownForm: FormGroup;
	items: any = [];

	genders: any[] = [];
	titles: any[] = [];

	btnLoading: boolean = false;

	facility: Facility = <Facility>{};
	failed: boolean = false;

	today = new Date();
	

	upload_view = false;
	searchOpen = false;
	loading = false;
	patientSearch = new FormControl('');
	constructor(
		private formBuilder: FormBuilder,
		private titleService: TitleService,
		private genderService: GenderService,
		private patientService: PatientService,
		private _locker: CoolLocalStorage,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.shownForm = this.formBuilder.group({
			items: this.formBuilder.array([ this.createForm() ])
		});
		this.items = this.shownForm.get('items') as FormArray;
		this.getGenders();
		this.getTitles();
	}

	createForm(): FormGroup {
		return this.formBuilder.group({
			title: '',
			firstName: '',
			lastName: '',
			gender: '',
			primaryContactPhoneNo: '',
			street: '',
			homeAddress: {},
			motherMaidenName: '',
			maritalStatus: '',
			lga: '',
			state: '',
			country: '',
			email: '',
			hospId: '',
			dateOfBirth: '',
			payPlan: ''
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	onPaginateChange(event) {
		const startIndex = event.pageIndex * event.pageSize;
		// this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
		// this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
	}

	uploadingData(e) {
		const target: DataTransfer = <DataTransfer>e.target;
		if (target.files.length !== 1) {
			throw new Error('Cannot use multiple files');
		}
		const reader: FileReader = new FileReader();
		// tslint:disable-next-line:no-shadowed-variable
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

			/* save data */
			const datas = <AOA>XLSX.utils.sheet_to_json(ws, { header: 1 });
			const data = datas.filter(function(x) {
				// Removing empty rows from the array.
				return x.length;
			});
			//this.finalExcelFileUpload(data, hmo);
			// this.turningDataToArrayOfObjects(data);
			// this.turningDataToArrayOfObjects(data);
			this.patientService.uploadExcel(data).then(
				(payload) => {
					this.patients = payload;
					let control = <FormArray>this.shownForm.controls['items'];
					control.setValue(payload);
				},
				(err) => {}
			);
		};
		reader.readAsBinaryString(target.files[0]);
	}

	loadProgressBar() {}

	turningDataToArrayOfObjects(data) {
		data.splice(0, 1);
		let len = data.length;
		let arr = [];
		this.uploadItemTotal = len - 1;
		for (let i = 0; i < len; i++) {
			var timer = setTimeout(() => {
				this.uploadingLoading = true;
				this.uploadItemCounter = i;
				const rowObj: any = <any>{};
				rowObj.homeAddress = <any>{};
				rowObj.title = data[i][0] !== undefined ? data[i][0] : ' ';
				rowObj.firstName = data[i][1] !== undefined ? data[i][1] : ' ';
				rowObj.lastName = data[i][2] !== undefined ? data[i][2] : ' ';
				rowObj.gender = data[i][3] !== undefined ? data[i][3] : ' ';
				rowObj.dateOfBirth = new Date() >= new Date(data[i][4]) ? new Date(data[i][4]) : new Date();
				rowObj.street = data[i][5] !== undefined ? data[i][5] : ' ';
				rowObj.lga = data[i][6] !== undefined ? data[i][6] : ' ';
				rowObj.state = data[i][7] !== undefined ? data[i][7] : ' ';
				rowObj.country = data[i][8] !== undefined ? data[i][8] : ' ';
				rowObj.homeAddress = {
					street: rowObj.street,
					lga: rowObj.lga,
					state: rowObj.state,
					country: rowObj.country
				};
				rowObj.email = data[i][9] !== undefined ? data[i][9] : ' ';
				rowObj.hospId = data[i][10] !== undefined ? data[i][10] : '';
				rowObj.primaryContactPhoneNo = data[i][11] !== undefined ? data[i][11] : ' ';
				rowObj.motherMaidenName = data[i][12] !== undefined ? data[i][12] : ' ';
				rowObj.maritalStatus = data[i][13] !== undefined ? data[i][13] : ' ';
				rowObj.payPlan = 'Wallet';
				this.items.push(this.createForm());
				let datas: any = this.shownForm.controls.items;
				datas.controls[i].controls.firstName.setValue(rowObj.firstName);
				datas.controls[i].controls.lastName.setValue(rowObj.lastName);
				datas.controls[i].controls.gender.setValue(rowObj.gender);
				datas.controls[i].controls.primaryContactPhoneNo.setValue(rowObj.primaryContactPhoneNo);
				datas.controls[i].controls.email.setValue(rowObj.email);
				datas.controls[i].controls.hospId.setValue(rowObj.hospId);
				datas.controls[i].controls.street.setValue(rowObj.street);
				datas.controls[i].controls.lga.setValue(rowObj.lga);
				datas.controls[i].controls.state.setValue(rowObj.state);
				datas.controls[i].controls.country.setValue(rowObj.country);
				datas.controls[i].controls.maritalStatus.setValue(rowObj.maritalStatus);
				datas.controls[i].controls.motherMaidenName.setValue(rowObj.motherMaidenName);
				datas.controls[i].controls.dateOfBirth.setValue(rowObj.dateOfBirth);
				datas.controls[i].controls.title.setValue(rowObj.title);
				datas.controls[i].controls.payPlan.setValue(rowObj.payPlan.toLowerCase());
				datas.controls[i].controls.payPlan.disable();

				arr.push(rowObj);

				this.patients = arr;
			}, 10000);
		}
		this.uploadingLoading = false;
	}

	excelDateToJSDate(date) {
		new Date(date.toString());
		let dateIsh = new Date(Math.round((date - 25569) * 86400 * 1000));
		return dateIsh;
	}

	

	onEditDataStreet(value, i) {
		this.patients[i].street = value.srcElement.value;
		this.patients[i].homeAddress.street = value.srcElement.value;
	}

	onEditDataLGA(value, i) {
		this.patients[i].lga = value.srcElement.value;
		this.patients[i].homeAddress.lga = value.srcElement.value;
	}

	onEditDataCountry(value, i) {
		this.patients[i].country = value.srcElement.value;
		this.patients[i].homeAddress.country = value.srcElement.value;
	}

	onEditDataState(value, i) {
		this.patients[i].state = value.srcElement.value;
		this.patients[i].homeAddress.state = value.srcElement.value;
	}

	changeInput(ev) {
		if (ev.value === 'wallet') {
			this.showInsurance = false;
			this.showWallet = true;
			this.showFamily = false;
			this.showCompany = false;
		} else if (ev.value === 'insurance') {
			this.showInsurance = true;
			this.showWallet = false;
			this.showFamily = false;
			this.showCompany = false;
		} else if (ev.value === 'company') {
			this.showInsurance = false;
			this.showWallet = false;
			this.showFamily = false;
			this.showCompany = true;
		} else if (ev.value === 'family') {
			this.showInsurance = false;
			this.showWallet = false;
			this.showFamily = true;
			this.showCompany = false;
		} else {
			this.showInsurance = false;
			this.showWallet = false;
			this.showFamily = false;
			this.showCompany = false;
		}
	}

	editBtn(data) {}

	deleteBtn(i) {
		const ind = this.patients.findIndex((x) => x.serialNo === i);
		if (this.patients[i] !== undefined) {
			this.patients.splice(i, 1);
		}
	}

	showImageBrowseDlg() {
		this.fileInput.nativeElement.click();
	}

	saveRow(i) {
		let data: any = this.shownForm.controls.items;
		let info = data.controls[i].controls;
		let patientInfo;
		if (this.failed === true) {
			patientInfo = this.patients[i].data;
		} else {
			patientInfo = this.patients[i];
		}
		patientInfo.firstName = info.firstName.value;
		patientInfo.lastName = info.lastName.value;
		patientInfo.email = info.email.value;
		patientInfo.hospId = info.hospId.value;
		patientInfo.dateOfBirth = info.dateOfBirth.value;
		patientInfo.primaryContactPhoneNo = info.primaryContactPhoneNo.value;
		patientInfo.title = info.title.value;
		patientInfo.gender = info.gender.value;
		patientInfo.payPlan = info.payPlan.value;
		this.openBox = '';
	}

	getGenders() {
		this.genderService
			.findAll()
			.then((payload) => {
				this.genders = payload.data;
			})
			.catch((err) => {});
	}
	getTitles() {
		this.titleService
			.findAll()
			.then((payload) => {
				this.titles = payload.data;
			})
			.catch((err) => {});
	}

	submit() {
		let newArr = [];
		this.btnLoading = true;
		this.patients.forEach((element) => {
			element.facilityId = this.facility._id;
		});
		//  (pa => {
		//  console.log(pa);
		// if (this.failed){
		//   delete pa.message;
		//   delete pa.facilityId;
		//   pa = pa.data;
		//   newArr.push(pa);
		//   delete pa.data;
		// }
		// pa.facilityId = this.facility._id
		// });
		// console.log(newPatients);
		// this.patients = (this.failed) ? newArr : newPatients;
		const data = { data: JSON.stringify(this.patients) };
		this.patientService
			.bulkUpload(data)
			.then((payload) => {
				this.uploadItemCounter = 0;
				this.uploadItemTotal = 0;
				this.uploadingLoading = false;
				if (payload.failed.length > 0) {
					this.patients = [];
					this.systemModuleService.announceSweetProxy(
						'An error occured. The following list had an issue when uploading',
						'error'
					);
					this.failed = true;
					this.patients = payload.failed;
					this.btnLoading = false;
				} else {
					this.failed = false;
					this.btnLoading = false;
					this.patients = [];
					this.systemModuleService.announceSweetProxy(
						'Patients information successfully uploaded!',
						'success'
					);
				}
			})
			.catch((err) => {
				this.uploadItemCounter = 0;
				this.uploadItemTotal = 0;
				this.btnLoading = false;
				this.systemModuleService.announceSweetProxy(
					'Please kindly navigate to Patient Management to check for newly added patients',
					'info'
				);
			});
	}

	edit(info, i) {
		let datas: any = this.shownForm.controls.items;
		datas.controls[i].controls.firstName.setValue(info.firstName);
		datas.controls[i].controls.lastName.setValue(info.lastName);
		datas.controls[i].controls.gender.setValue(info.gender);
		datas.controls[i].controls.primaryContactPhoneNo.setValue(info.primaryContactPhoneNo);
		datas.controls[i].controls.email.setValue(info.email);
		datas.controls[i].controls.hospId.setValue(info.hospId);
		datas.controls[i].controls.dateOfBirth.setValue(info.dateOfBirth);
		datas.controls[i].controls.title.setValue(info.title);
		datas.controls[i].controls.payPlan.setValue(info.payPlan.toLowerCase());
		datas.controls[i].controls.payPlan.disable();
	}

	closeRow() {
		this.openBox = '';
	}
}
