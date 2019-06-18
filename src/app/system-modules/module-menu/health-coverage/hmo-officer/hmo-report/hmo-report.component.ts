import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FacilityTypesService, HmoService } from '../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { IDateRange } from 'ng-pick-daterange';

@Component({
	selector: 'app-hmo-report',
	templateUrl: './hmo-report.component.html',
	styleUrls: [ './hmo-report.component.scss' ]
})
export class HmoReportComponent implements OnInit {
	hmoFormGroup: FormGroup;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() selectedBill;
	dateRange: any;
	// dateRange: any = { from: new Date().toString(), to: new Date(new Date().getTime() + (6 * 24 * 60 * 60 * 1000)).toString() };

	selectedFacility: Facility = <Facility>{};
	selectedHMO: Facility = <Facility>{};
	selectedFacilityType: FacilityType = <FacilityType>{};
	loading: Boolean = false;
	apmisLookupUrl = 'facilities';
	apmisLookupText = '';
	apmisLookupQuery = {};
	apmisLookupDisplayKey = 'name';
	apmisLookupOtherKeys = [];
	hmoBillHistory = [];
	disableSearchBtn = false;
	searchBtn = true;
	searchingBtn = false;
	grandTotal: number = 0.0;
	constructor(
		private _fb: FormBuilder,
		private locker: CoolLocalStorage,
		private hmoService: HmoService,
		private authFacadeService: AuthFacadeService,
		private facilityTypeService: FacilityTypesService,
		private systemModuleService: SystemModuleService
	) {}

	ngOnInit() {
		this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
		this._getFacilityTypes();

		this.hmoFormGroup = this._fb.group({
			name: [ '', Validators.required ],
			startDate: [ '', Validators.required ],
			endDate: [ '', Validators.required ]
		});

		this.hmoFormGroup.controls['name'].valueChanges.subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.apmisLookupQuery = {
					facilityTypeId: 'HMO',
					name: { $regex: -1, $options: 'i' },
					$select: [ 'name', 'email', 'primaryContactPhoneNo', 'shortName', 'website', 'policyIDRegexFormat' ]
				};
			} else {
				this.apmisLookupQuery = {
					facilityTypeId: 'HMO',
					name: { $regex: value, $options: 'i' },
					$select: [ 'name', 'email', 'primaryContactPhoneNo', 'shortName', 'website', 'policyIDRegexFormat' ]
				};
			}
		});
	}

	onClickFindBillHistory() {
		if (!!this.selectedHMO._id && !!this.dateRange.from && !!this.dateRange.to) {
			this.loading = true;
			this.disableSearchBtn = true;
			this.searchBtn = false;
			this.searchingBtn = true;
			const query = {
				facilityId: this.selectedFacility._id,
				hmoId: this.selectedHMO._id,
				startDate: this.dateRange.from,
				endDate: this.dateRange.to
			};
			/// console.log(query);
			this.hmoService
				.findBillHistory({ query })
				.then((res) => {
					// console.log(res);
					this.loading = false;
					this.disableSearchBtn = false;
					this.searchBtn = true;
					this.searchingBtn = false;
					if (res.status === 'success' && !!res.data.historyBills && res.data.historyBills.length > 0) {
						const totalBills = [];
						res.data.historyBills.map((a) => {
							a.billItems.map((x) => {
								this.grandTotal += x.totalPrice;
								totalBills.push({
									date: x.covered.verifiedAt,
									coverType: x.covered.coverType,
									amount: x.totalPrice,
									patient: {
										firstName: x.patientObject.personDetails.firstName,
										lastName: x.patientObject.personDetails.lastName,
										apmisId: x.patientObject.personDetails.apmisId,
										title: x.patientObject.personDetails.title
									},
									service: x.serviceObject ? x.serviceObject.name : undefined,
									hmoName: a.coverFile.name,
									fileId  : a.coverFile.id
								});
							});
						});

						this.hmoBillHistory = totalBills;
						
					}
				})
				.catch((err) => {
					this.loading = false;
					this.disableSearchBtn = false;
					this.searchBtn = true;
					this.searchingBtn = false;
				});
		} else {
			this.systemModuleService.announceSweetProxy('Please select HMO and date range', 'error');
		}
	}

	close_onClick() {
		this.closeModal.emit(true);
	}

	setReturnValue(dateRange: any) {
		if (dateRange !== null) {
			this.dateRange = dateRange;
		}
	}

	_getFacilityTypes() {
		this.facilityTypeService.findAll().then((res) => {
			if (!!res.data && res.data.length > 0) {
				const selectedFacilityType = res.data.filter((x) => x.name === 'HMO');
				if (selectedFacilityType.length > 0) {
					this.selectedFacilityType = selectedFacilityType[0];
				}
			}
		});
	}

	apmisLookupHandleSelectedItem(value) {
		this.apmisLookupText = value.name;
		this.selectedHMO = value;
	}

	onClickPrintDocument() {
		const printContents = document.getElementById('print-section').innerHTML;
		let popupWin = window.open('', '', 'top=0,left=0,height=100%,width=auto');
		popupWin.document.open();
		popupWin.document.write(`
      <html>
        <head>
          <title>HMO Billing History</title>
          <style>
            table{
              width: 100%;
              position: relative;
              border-collapse: collapse;
              font-size: 1.0rem;
            }
            table, td { 
                border: 0.5px solid #ddd;
                
            } 
            th {
                height: 50px;
                background: transparent;
                border: 0.5px solid #ddd;
            }
            td {
                vertical-align: center;
                text-align: left;
                padding: 5px;
            }
            tr:nth-child(even) {background-color: #f8f8f8}
            .print-header{
              display:flex;
              Justify-content:space-between;
              margin-bottom:40px;
              background-color:#eee;
              width:100%;
            }
            .main-fac{
              display:flex;
              justify-content:space-between;
              align-items:center;
              margin:0 10px;
              flex-wrap:wrap;
            }
            .img-wrap{
              width:40px;
              height:40px;
              border-radius:50%;
              display:flex;
              justify-content:center;
              align-items:center;
              overflow:hidden;
              margin:0 auto;
              margin-right:10px;
            }
            .img-wrap img{
              width:100%;
            }
            .fac{
              font-size:1.1rem;
              color:#0288D1;
            }
            .fac-type{
              font-size:1rem;
              color:#ff2500;
            }
            .modal_title {
              font-family: "Josefin Sans", sans-serif;
              font-weight:bold;
              margin: 0px auto;
              font-size: 1.7rem;
              text-align: center;
          }
          
          .modal_mini_title {
              margin: 0px auto;
              font-size: 1.0rem;
              text-align: center;
              color:#0288D1;
          }
          .doc-title{
            border-bottom:1px solid #0288D1;
            margin-bottom:30px;
            padding-bottom:20px;
          }
          </style>
        </head>
        <body onload="window.print();window.close()">${printContents}</body>
      </html>`);
		popupWin.document.close();
	}
}
