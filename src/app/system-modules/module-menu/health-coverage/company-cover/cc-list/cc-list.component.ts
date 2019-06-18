import { Router } from '@angular/router';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilityCompanyCoverService } from './../../../../../services/facility-manager/setup/facility-company-cover.service';
import { FacilityTypesService } from './../../../../../services/facility-manager/setup/facility-types.service';
import { SystemModuleService } from './../../../../../services/module-manager/setup/system-module.service';
import { User } from './../../../../../models/facility-manager/setup/user';
import { FacilityType } from './../../../../../models/facility-manager/setup/facilitytype';
import { Facility } from './../../../../../models/facility-manager/setup/facility';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import * as XLSX from 'xlsx';
import { element } from 'protractor';

type AOA = any[][];

@Component({
  selector: 'app-cc-list',
  templateUrl: './cc-list.component.html',
  styleUrls: ['./cc-list.component.scss']
})
export class CcListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();

  public frmAddCompany: FormGroup;
  addCompany = false;
  apmisLookupUrl = 'facilities';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = 'name';
  apmisLookupOtherKeys = []

  selelctedFacility: Facility = <Facility>{};
  selectedCompanyCover: Facility = <Facility>{};
  selectedFacilityType: FacilityType = <FacilityType>{};
  loginCompanyListObject: any = <any>{};
  user: User = <User>{};


  companyFacilities:any[] = [];
  companyEnrolleList:any[] = [];
  company:any;
  ev:any;

  loading = true;



  // tslint:disable-next-line:max-line-length
  constructor(private formBuilder: FormBuilder, private companyCoverService: FacilityCompanyCoverService, private facilityService: FacilitiesService,
    private facilityTypeService: FacilityTypesService, 
    private locker: CoolLocalStorage, 
    private router: Router,
    private systemModuleService: SystemModuleService) {

  }

  ngOnInit() {
    this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmAddCompany = this.formBuilder.group({
      name: ['', [Validators.required]],
    });

    this.frmAddCompany.controls['name'].valueChanges.subscribe(value => {
      if (value !== null && value.length === 0) {
        this.apmisLookupQuery = {
          isHDO: false,
          name: { $regex: -1, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'website', 'addressObj']
        }
      } else {
        this.apmisLookupQuery = {
          isHDO: false,
          name: { $regex: value, '$options': 'i' },
          $select: ['name', 'email', 'contactPhoneNo', 'contactFullName', 'website', 'addressObj']
        }
      }
    });
    this.getLoginCompanyList();
  }
  /* public upload(e, companyCover) {

    const fileBrowser = this.fileInput.nativeElement;
    if (fileBrowser.files && fileBrowser.files[0]) {
      const formData = new FormData();
      formData.append('excelfile', fileBrowser.files[0]);
      formData.append('companyCoverId', companyCover._id);
      this.facilityService.upload(formData, this.selectedCompanyCover._id).then(res => {
        const enrolleeList: any[] = [];
        if (res.body !== undefined && res.body.error_code === 0) {
          res.body.data.Sheet1.forEach(row => {
            const rowObj: any = <any>{};
            rowObj.serial = row.A;
            rowObj.surname = row.B;
            rowObj.firstName = row.C;
            rowObj.gender = row.D;
            rowObj.filNo = row.E;
            rowObj.category = row.F;
            rowObj.date = this.excelDateToJSDate(row.G);
            enrolleeList.push(rowObj);
          });
          const index = this.loginCompanyListObject.companyCovers.findIndex(x => x._id === companyCover._id);
          const facCompany = this.loginCompanyListObject.companyCovers[index];
          const enrolleeItem = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            enrollees: enrolleeList
          }
          facCompany.enrolleeList.push(enrolleeItem);
          this.loginCompanyListObject.companyCovers[index] = facCompany;
          this.companyCoverService.update(this.loginCompanyListObject).then(pay => {
            this.getLoginCompanyList();
          })
        }
      }).catch(err => {
        this._notification('Error', 'There was an error uploading the file');
      });
    }
  } */
  excelDateToJSDate(date) {
    return new Date(Math.round((date - 25569) * 86400 * 1000));
  }
  getLoginCompanyList() {
    this.companyCoverService.find({
      query: {
        'facilityId._id': this.selelctedFacility._id
      }
    }).then(payload => {
      if (payload.data.length > 0) {
        this.loginCompanyListObject = payload.data[0];
        this._getCompanyFacilities(payload.data[0]);
      } else {
        this.loginCompanyListObject.facilityId = this.selelctedFacility;
        this.loginCompanyListObject.companyCovers = [];
      }
    })
  }
  _getCompanyFacilities(facilityCompany) {
    this.companyEnrolleList = facilityCompany.companyCovers.map(obj => {
      return { company: obj.company, enrolles: obj.enrolleeList };
    });
    const flist = this.companyEnrolleList.map(obj => {
      return obj.company;
    });
    this.facilityService.find({
      query: { _id: { $in: flist } }
    }).then(payload => {
      this.companyFacilities = payload.data;
    });
  }
  submitExcel(e, hmo) {
    this.ev = e;
    this.company = hmo;
    this.systemModuleService.announceSweetProxy
      ('You are trying to upload an excel file. Please make sure it conforms with the accepted excel sheet format', 'question', this);
  }
  sweetAlertCallback(result) {
    if (result.value) {
      this.upload(this.ev, this.company);
    }
  }
  upload(e, hmo) {
    this.systemModuleService.on();
    const target: DataTransfer = <DataTransfer>(e.target);
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
      const datas = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      const data = datas.filter(function (x) { // Removing empty rows from the array.
        return x.length;
      });
      this.finalExcelFileUpload(data, hmo);
    };
    reader.readAsBinaryString(target.files[0]);
  }

  finalExcelFileUpload(data, company?) {
    const enrolleeList = [];
    this.companyCoverService.find({
      query: {
        "facilityId._id": this.selelctedFacility._id
      }
    }).then(payload => {
      const companyData = payload.data[0].companyCovers.filter(x => x.company === company._id);

      const index = payload.data[0].companyCovers.findIndex(x => x.company === company._id);
      const faccompany = payload.data[0].companyCovers[index];

      const currentDate = new Date();
      const prevMonth = currentDate.getMonth();
      const year = currentDate.getFullYear();
      const dataLength = data.length - 1;
      const rowObj: any = <any>{};
      let lastMonth = false;
      let lastMonthEnrollees;
      const lastMonthEnrolleesListIndex = payload.data[0].companyCovers[index].enrolleeList.findIndex(x => x.month === prevMonth && x.year === year);

      if (companyData[0].enrolleeList.length >= 1) {
        lastMonthEnrollees = companyData[0].enrolleeList.filter(x => x.month === prevMonth && x.year === year);
        let lastMonthEnrLen;

        if (lastMonthEnrollees.length > 0) { lastMonthEnrLen = lastMonthEnrollees[0].enrollees.length; }

        const lastMonthIndex = companyData[0].enrolleeList.findIndex(x => x.month === prevMonth && x.year === year);
        const presentMonthEnrollees = companyData[0].enrolleeList.filter(x => x.month === prevMonth && x.year === year);


        if (lastMonthEnrollees.length > 0) {

          lastMonth = true;

          for (let m = 0; m < data.length; m++) {
            const enr = lastMonthEnrollees[0].enrollees.filter(x => x.filNo === data[dataLength][4]);
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
                rowObj.status = 'active';
                // thisMonth = true;
              }
            }
            enrolleeList.push(rowObj);
          }

          const enrolleeItem = {
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            enrollees: enrolleeList
          }

          // tslint:disable-next-line:no-shadowed-variable
          const index = payload.data[0].companyCovers.findIndex(x => x.company === company._id);
          // tslint:disable-next-line:no-shadowed-variable
          const faccompany = payload.data[0].companyCovers[index];
          faccompany.enrolleeList.push(enrolleeItem);
          payload.data[0].companyCovers[index] = faccompany;

        } else {
          for (let m = 0; m < data.length; m++) {
            const enr = companyData[0].enrolleeList[0].enrollees.filter(x => x.filNo === data[m][4]);
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
          faccompany.enrolleeList[0].enrollees.push(...enrolleeList);
          payload.data[0].companyCovers[index] = faccompany;
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
        }
        // tslint:disable-next-line:no-shadowed-variable
        const index = payload.data[0].companyCovers.findIndex(x => x.company === company._id);
        // tslint:disable-next-line:no-shadowed-variable
        const faccompany = payload.data[0].companyCovers[index];
        faccompany.enrolleeList.push(enrolleeItem);
        payload.data[0].companyCovers[index] = faccompany;
      }

      this.companyCoverService.patch(payload.data[0]._id, {
        companyCovers: payload.data[0].companyCovers
      }, {}).then(companyPayload => {
        if (lastMonth === true) {
          const noChangeEnrollees = lastMonthEnrollees[0].enrollees.filter(x => new Date(x.updatedAt).getMonth() === prevMonth);
          if (noChangeEnrollees.length > 0) {
            for (let n = 0; n < noChangeEnrollees.length; n++) {
              if (Boolean(noChangeEnrollees)) {

                const noChangeIndex = payload.data[0].companyCovers[index].enrolleeList[lastMonthEnrolleesListIndex]
                  .enrollees.findIndex(x => x.filNo === noChangeEnrollees[n].filNo);
                payload.data[0].companyCovers[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[noChangeIndex].status = 'inactive';
                payload.data[0].companyCovers[index].enrolleeList[lastMonthEnrolleesListIndex].enrollees[noChangeIndex].updatedAt = Date.now();

                this.companyCoverService.patch(payload.data[0]._id, {
                  companyCovers: payload.data[0].companyCovers
                }, {}).then(noChangPayload => {
                  this.systemModuleService.announceSweetProxy
                  (`You have successfully uploaded ${data.length} enrollees to ${company.name}`, 'success');
                  this.systemModuleService.off();
                }).catch(err => {
                
                });
              }
            }
          } else {
            this.systemModuleService.announceSweetProxy
            (`You have successfully uploaded ${data.length} enrollees to ${company.name}`, 'success');
            this.systemModuleService.off();
          }
        } else {
          this.systemModuleService.announceSweetProxy(`You have successfully uploaded ${data.length} enrollees to ${company.name}`, 'success');
          this.systemModuleService.off();
        }
      });

    }).catch(err => {
      this.systemModuleService.announceSweetProxy('Something went wrong while uploading the enrollees. Please try again', 'warning');
    });
  }
  getEnrolleeCount(company) {
    const retCount = 0;
    const index = this.companyEnrolleList.findIndex(x => x.company === company);
    if (index > -1) {
      return this.companyEnrolleList[index].enrolles.length;
    }
    return retCount;
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = value.name;
    let isExisting = false;
    this.loginCompanyListObject.companyCovers.forEach(item => {
      if (item._id === value._id) {
        isExisting = true;
      }
    });
    if (!isExisting) {
      this.selectedCompanyCover = value;
    } else {
      this.selectedCompanyCover = <any>{};
      this._notification('Info', 'Selected Company is already in your list of Company Covers');
    }
  }

  checkCompanyCover() {
    return this.loginCompanyListObject.companyCovers.findIndex(x => x.Company_id === this.selectedCompanyCover._id) > -1;
  }
  save(valid?, value?) {
    if (this.checkCompanyCover()) {
      if (this.selectedCompanyCover._id === undefined) {
        this._notification('Warning', 'Please select a Company to continue!');
        return;
      }
      this._notification('Warning', 'The selected Company is already in the list of Company Covers');
      return;
    }
    const newCompanyCover = {
      company: this.selectedCompanyCover,
      enrolleeList: []
    }
    this.loginCompanyListObject.companyCovers.push(newCompanyCover);
    if (this.selectedCompanyCover._id !== undefined) {
      if (this.loginCompanyListObject._id === undefined) {
        this.companyCoverService.create(this.loginCompanyListObject).then(payload => {
          this.frmAddCompany.controls['name'].reset();
          this.apmisLookupText = '';
          this.getLoginCompanyList();
          this._notification('Success', 'Selected Company added to your Company list successfully');
        })
      } else {
        this.companyCoverService.update(this.loginCompanyListObject).then(payload => {
          this.frmAddCompany.controls['name'].reset();
          this.apmisLookupText = '';
          this.getLoginCompanyList();
          this._notification('Success', 'Selected Company added to your Company list successfully');
        })
      }
    }
  }
  show_beneficiaries(cover) {
    this.router.navigate(['/dashboard/health-coverage/company-beneficiaries/', cover._id]);
  }

  addCompany_show() {
    this.addCompany = !this.addCompany;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
