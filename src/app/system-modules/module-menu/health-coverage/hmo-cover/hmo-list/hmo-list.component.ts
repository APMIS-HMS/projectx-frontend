import { SystemModuleService } from './../../../../../services/module-manager/setup/system-module.service';
import { User } from './../../../../../models/facility-manager/setup/user';
import { CoolLocalStorage } from 'angular2-cool-storage';

import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {
	HmoService,
	FacilitiesService,
	FacilityTypesService
} from '../../../../../services/facility-manager/setup/index';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';
import { element } from 'protractor';

type AOA = any[][];

@Component({
	selector: 'app-hmo-list',
	templateUrl: './hmo-list.component.html',
	styleUrls: [ './hmo-list.component.scss' ]
})
export class HmoListComponent implements OnInit {
	@ViewChildren('fileInput') fileInput: QueryList<any>;
	@Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

	public frmNewHmo: FormGroup;
	hmo = new FormControl('', []);
	searchHmo = new FormControl();
	policyIDRegexFormat = new FormControl();
	sepHmoBeneficiaryId = new FormControl();
	HmoPrincipalId = new FormControl();
	sepHmoPrincipalId = new FormControl();
	HmoBeneficiaryId = new FormControl();
	newHmo = false;
	isSelectedFileUploaded = false;

	apmisLookupUrl = 'facilities';
	apmisLookupText = '';
	apmisLookupQuery = {};
	apmisLookupDisplayKey = 'name';
	apmisLookupOtherKeys = [];

	excelFile: any;
	formData: any;
	ev: any;
	HMO: any;

	loading: boolean = true;

	selelctedFacility: Facility = <Facility>{};
	selectedHMO: any = <any>{};
	selectedFacilityType: FacilityType = <FacilityType>{};
	loginHMOListObject: any = <any>{};
	user: User = <User>{};

	hmoFacilities: any[] = [];
	hmoEnrolleList: any[] = [];
	constructor(
		private formBuilder: FormBuilder,
		private hmoService: HmoService,
		private facilityService: FacilitiesService,
		private facilityTypeService: FacilityTypesService,
		private locker: CoolLocalStorage,
		private router: Router,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
		this.user = <User>this.locker.getObject('auth');
		this.frmNewHmo = this.formBuilder.group({
			name: [ '', [ Validators.required ] ]
		});

		this.frmNewHmo.controls['name'].valueChanges.subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.apmisLookupQuery = {
					facilityTypeId: this.selectedFacilityType.name,
					name: { $regex: -1, $options: 'i' },
					$select: [ 'name', 'email', 'primaryContactPhoneNo', 'shortName', 'website', 'policyIDRegexFormat' ]
				};
			} else {
				this.apmisLookupQuery = {
					facilityTypeId: this.selectedFacilityType.name,
					name: { $regex: value, $options: 'i' },
					$select: [ 'name', 'email', 'primaryContactPhoneNo', 'shortName', 'website', 'policyIDRegexFormat' ]
				};
			}
		});

		this.searchHmo.valueChanges.debounceTime(300).distinctUntilChanged().subscribe((value) => {
			this._getHMOFacilities(this.loginHMOListObject, value);
		});

		this.getFacilityTypes();
		this.getLoginHMOList();
	}
	getLoginHMOList() {
		this.hmoService
			.find({
				query: {
					facilityId: this.selelctedFacility._id
				}
			})
			.then((payload) => {
				if (payload.data.length > 0) {
					this.loginHMOListObject = payload.data[0];
					this._getHMOFacilities(payload.data[0]);
				} else {
					this.loginHMOListObject.facilityId = this.selelctedFacility._id;
					this.loginHMOListObject.hmos = [];
				}
			});
	}
	_getHMOFacilities(facilityHMOs, value?) {
		this.hmoEnrolleList = facilityHMOs.hmos.map((obj) => {
			return { hmo: obj.hmo, enrolles: obj.enrolleeList };
		});
		const flist = this.hmoEnrolleList.map((obj) => {
			return obj.hmo;
		});
		if (value === null || value === undefined) {
			this.facilityService
				.find({
					query: { _id: { $in: flist }, $sort: { updatedAt: -1 } }
				})
				.then((payload) => {
					this.loading = false;
					this.hmoFacilities = payload.data;
				});
		} else {
			this.facilityService
				.find({
					query: { _id: { $in: flist }, name: { $regex: value, $options: 'i' }, $sort: { updatedAt: -1 } }
				})
				.then((payload) => {
					this.loading = false;
					this.hmoFacilities = payload.data;
				});
		}
	}
	getFacilityTypes() {
		this.facilityTypeService.findAll().then((payload) => {
			payload.data.forEach((item) => {
				if (item.name === 'HMO') {
					this.selectedFacilityType = item;
				}
			});
		});
	}
	apmisLookupHandleSelectedItem(value) {
		this.policyIDRegexFormat.reset();
		this.apmisLookupText = value.name;
		if (value.policyIDRegexFormat !== undefined) {
			this.policyIDRegexFormat.setValue(value.policyIDRegexFormat);
		}
		let isExisting = false;
		if (this.loginHMOListObject.hmos !== undefined) {
			this.loginHMOListObject.hmos.forEach((item) => {
				if (item._id === value._id) {
					isExisting = true;
				}
			});
		}

		if (!isExisting) {
			this.selectedHMO = value;
		} else {
			this.selectedHMO = <any>{};
			this.systemModuleService.announceSweetProxy('Selected HMO is already in your list of HMOs', 'info');
		}
	}

	newHmo_show(hmo?) {
		this.newHmo = !this.newHmo;
		if (hmo !== undefined && hmo !== null) {
			if (hmo.policyIDRegexFormat !== undefined) {
				this.policyIDRegexFormat.setValue(hmo.policyIDRegexFormat);
			}
			this.apmisLookupText = hmo.name;
			this.selectedHMO = hmo;
		}
	}

	showImageBrowseDlg(i) {
		var fileInputs = this.fileInput.toArray();
		fileInputs[i].nativeElement.click();
	}

	triggerFile(fileInput: ElementRef) {
		fileInput.nativeElement.click();
	}

	show_beneficiaries(hmo) {
		this.router.navigate([ '/dashboard/health-coverage/hmo-cover-beneficiaries/', hmo._id ]);
	}
	onChange(e) {}
	submitExcel(e, hmo) {
		this.ev = e;
		this.HMO = hmo;
		this.systemModuleService.announceSweetProxy(
			'You are trying to upload an excel file. Please make sure it conforms with the accepted excel sheet format',
			'question',
			this
		);
	}
	sweetAlertCallback(result) {
		if (result.value) {
			this.upload(this.ev, this.HMO);
		}
	}
	upload(e, hmo) {
		this.systemModuleService.on();
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
			this.finalExcelFileUpload(data, hmo);
		};
		reader.readAsBinaryString(target.files[0]);
		// this.isSelectedFileUploaded = false;
	}

	finalExcelFileUpload(data, hmo?) {
		const enrolleeList = [];
		this.hmoService
			.find({
				query: {
					facilityId: this.selelctedFacility._id
				}
			})
			.then((payload) => {
				const hmoData = payload.data[0].hmos.filter((x) => x.hmo === hmo._id);
				const index = payload.data[0].hmos.findIndex((x) => x.hmo === hmo._id);
				const facHmo = payload.data[0].hmos[index];

				const currentDate = new Date();
				const prevMonth = currentDate.getMonth();
				const year = currentDate.getFullYear();
				const dataLength = data.length - 1;
				const rowObj: any = <any>{};
				let lastMonth = false;
				let lastMonthEnrollees;
				const lastMonthEnrolleesListIndex = payload.data[0].hmos[index].enrolleeList.findIndex(
					(x) => x.month === prevMonth && x.year === year
				);

				if (hmoData[0].enrolleeList.length >= 1) {
					lastMonthEnrollees = hmoData[0].enrolleeList.filter(
						(x) => x.month === prevMonth && x.year === year
					);
					let lastMonthEnrLen;

					if (lastMonthEnrollees.length > 0) {
						lastMonthEnrLen = lastMonthEnrollees[0].enrollees.length;
					}

					const lastMonthIndex = hmoData[0].enrolleeList.findIndex(
						(x) => x.month === prevMonth && x.year === year
					);
					const presentMonthEnrollees = hmoData[0].enrolleeList.filter(
						(x) => x.month === prevMonth && x.year === year
					);

					if (lastMonthEnrollees.length > 0) {
						lastMonth = true;

						for (let m = 0; m < data.length; m++) {
							const enr = lastMonthEnrollees[0].enrollees.filter((x) => x.filNo === data[dataLength][4]);
							if (Boolean(data[m][0])) {
								if (enr.length === 0) {
									// tslint:disable-next-line:no-shadowed-variable
									const rowObj: any = <any>{};
									rowObj.serial = data[m][0];
									rowObj.surname = data[m][1];
									rowObj.firstname = data[m][2];
									rowObj.gender = data[m][3];
									rowObj.filNo = data[m][4];
									rowObj.category = data[m][5];
									rowObj.sponsor = data[m][6];
									rowObj.plan = data[m][7];
									rowObj.type = data[m][8];
									rowObj.date = this.excelDateToJSDate(data[m][9]);
									rowObj.status = true;
									// thisMonth = true;
								}
							}
							enrolleeList.push(rowObj);
						}

						const enrolleeItem = {
							month: new Date().getMonth() + 1,
							year: new Date().getFullYear(),
							enrollees: enrolleeList
						};

						// tslint:disable-next-line:no-shadowed-variable
						const index = payload.data[0].hmos.findIndex((x) => x.hmo === hmo._id);
						// tslint:disable-next-line:no-shadowed-variable
						const facHmo = payload.data[0].hmos[index];
						facHmo.enrolleeList.push(enrolleeItem);
						payload.data[0].hmos[index] = facHmo;
					} else {
						for (let m = 0; m < data.length; m++) {
							const enr = hmoData[0].enrolleeList[0].enrollees.filter((x) => x.filNo === data[m][4]);
							if (Boolean(data[m][0])) {
								if (enr.length === 0) {
									const rowObjs: any = <any>{};
									rowObjs.serial = data[m][0];
									rowObjs.surname = data[m][1];
									rowObjs.firstname = data[m][2];
									rowObjs.gender = data[m][3];
									rowObjs.filNo = data[m][4];
									rowObjs.category = data[m][5];
									rowObjs.sponsor = data[m][6];
									rowObjs.plan = data[m][7];
									rowObjs.type = data[m][8];
									rowObjs.date = this.excelDateToJSDate(data[m][9]);
									rowObjs.status = 'active';

									enrolleeList.push(rowObjs);
								}
							}
						}
						facHmo.enrolleeList[0].enrollees.push(...enrolleeList);
						payload.data[0].hmos[index] = facHmo;
					}
				} else {
					for (let m = 0; m < data.length; m++) {
						if (Boolean(data[m][0])) {
							// tslint:disable-next-line:no-shadowed-variable
							const rowObj: any = <any>{};
							rowObj.serial = data[m][0];
							rowObj.surname = data[m][1];
							rowObj.firstname = data[m][2];
							rowObj.gender = data[m][3];
							rowObj.filNo = data[m][4];
							rowObj.category = data[m][5];
							rowObj.sponsor = data[m][6];
							rowObj.plan = data[m][7];
							rowObj.type = data[m][8];
							rowObj.date = this.excelDateToJSDate(data[m][9]);
							rowObj.status = 'active';
							enrolleeList.push(rowObj);
						}
					}
					const enrolleeItem = {
						month: new Date().getMonth() + 1,
						year: new Date().getFullYear(),
						enrollees: enrolleeList
					};
					// tslint:disable-next-line:no-shadowed-variable
					const index = payload.data[0].hmos.findIndex((x) => x.hmo === hmo._id);
					// tslint:disable-next-line:no-shadowed-variable
					const facHmo = payload.data[0].hmos[index];
					facHmo.enrolleeList.push(enrolleeItem);
					payload.data[0].hmos[index] = facHmo;
				}

				this.hmoService
					.patch(
						payload.data[0]._id,
						{
							hmos: payload.data[0].hmos
						},
						{}
					)
					.then((hmoPayload) => {
						if (lastMonth === true) {
							const noChangeEnrollees = lastMonthEnrollees[0].enrollees.filter(
								(x) => new Date(x.updatedAt).getMonth() === prevMonth
							);
							if (noChangeEnrollees.length > 0) {
								for (let n = 0; n < noChangeEnrollees.length; n++) {
									if (Boolean(noChangeEnrollees)) {
										const noChangeIndex = payload.data[0].hmos[index].enrolleeList[
											lastMonthEnrolleesListIndex
										].enrollees.findIndex((x) => x.filNo === noChangeEnrollees[n].filNo);
										payload.data[0].hmos[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[
											noChangeIndex
										].status =
											'inactive';
										payload.data[0].hmos[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[
											noChangeIndex
										].updatedAt = Date.now();

										this.hmoService
											.patch(
												payload.data[0]._id,
												{
													hmos: payload.data[0].hmos
												},
												{}
											)
											.then((noChangPayload) => {
												this.systemModuleService.announceSweetProxy(
													`You have successfully uploaded ${data.length} enrollees to ${hmo.name}`,
													'success'
												);
												this.systemModuleService.off();
											})
											.catch((err) => {});
									}
								}
							} else {
								this.systemModuleService.announceSweetProxy(
									`You have successfully uploaded ${data.length} enrollees to ${hmo.name}`,
									'success'
								);
								this.systemModuleService.off();
							}
						} else {
							this.systemModuleService.announceSweetProxy(
								`You have successfully uploaded ${data.length} enrollees to ${hmo.name}`,
								'success'
							);
							this.systemModuleService.off();
						}
					});
			})
			.catch((err) => {
				this.systemModuleService.announceSweetProxy(
					'Something went wrong while uploading the enrollees. Please try again',
					'warning'
				);
			});
	}

	getEnrolleeCount(hmo) {
		const retCount = 0;
		const index = this.hmoEnrolleList.findIndex((x) => x.hmo === hmo);
		if (index > -1) {
			return this.hmoEnrolleList[index].enrolles.length;
		}
		return retCount;
	}
	excelDateToJSDate(date) {
		// return new Date(Math.round((date - 25569) * 86400 * 1000));
		return new Date(date);
	}
	checkHmo() {
		return this.loginHMOListObject.hmos.findIndex((x) => x.hmo === this.selectedHMO._id) > -1;
	}

	save(valid, value) {
		this.systemModuleService.on();
		this.selectedHMO.policyIDRegexFormat = this.policyIDRegexFormat.value;
		this.selectedHMO.checkHmo = this.checkHmo();
		this.selectedHMO.loginHMOListObject = this.loginHMOListObject;
		this.hmoService.addHmo(this.selectedHMO).then(
			(payload) => {
				if (payload.status === 'success') {
					this.frmNewHmo.controls['name'].reset();
					this.apmisLookupText = '';
					this.getLoginHMOList();
					this.systemModuleService.off();
					this.systemModuleService.announceSweetProxy(
						payload.data.message,
						'success',
						null,
						null,
						null,
						null,
						null,
						null,
						null
					);
				} else if (payload.status === 'fail') {
					this.systemModuleService.announceSweetProxy(
						'Selected HMO Policy Format updated. ' + payload.data.message,
						'success'
					);
					this.frmNewHmo.controls['name'].reset();
					this.apmisLookupText = '';
					this.getLoginHMOList();
					this.systemModuleService.off();
				}
				this.policyIDRegexFormat.reset();
			},
			(err) => {
				this.systemModuleService.announceSweetProxy('Operation failed', 'error');
				this.systemModuleService.off();
			}
		);
	}
}
