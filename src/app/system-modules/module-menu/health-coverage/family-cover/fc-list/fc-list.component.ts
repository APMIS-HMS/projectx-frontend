import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FacilityFamilyCoverService } from './../../../../../services/facility-manager/setup/facility-family-cover.service';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { ActivatedRoute } from '@angular/router';
import { User } from './../../../../../models/facility-manager/setup/user';
import { MatPaginator } from '@angular/material';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-fc-list',
  templateUrl: './fc-list.component.html',
  styleUrls: ['./fc-list.component.scss']
})
export class FcListComponent implements OnInit {

  @Output() showBeneficiaries: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public frmNewBeneficiary: FormGroup;
  public frmDependant: FormGroup;
  principal = new FormControl('', []);
  newFamily = false;

  selectedFacility: any = <any>{};
  beneficiaries: any[] = [];
  filteredBeneficiaries: any[] = [];
  operateBeneficiaries: any[] = [];
  selectedFamilyCover: any = <any>{};
  selectedFamilyCoverId: any;

  loading: any = false;
  updatePatientBtnText: any = 'Add Family'

  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 100];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user: User = <User>{};
  genders: any[] = [
    {
      name: 'Male',
      _id: 'M'
    },
    {
      name: 'Female',
      _id: 'F'
    }
  ];
  statuses: any[] = [
    {
      name: 'Active',
      _id: 'Active'
    },
    {
      name: 'Inactive',
      _id: 'Inactive'
    }
  ];
  pageEvent: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolLocalStorage,
    private familyCoverService: FacilityFamilyCoverService, private facilityService: FacilitiesService,
    private systemModuleService: SystemModuleService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmNewBeneficiary = this.formBuilder.group({
      surname: ['', [Validators.required]],
      othernames: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', [<any>Validators.required]],
      status: ['', [<any>Validators.required]],
      filNo: ['', [<any>Validators.required]],
      gender: ['', [<any>Validators.required]],
      serial: [0, [<any>Validators.required]],
      operation: ['save']
    });
    this.addDependant();
    this.getBeneficiaryList(this.selectedFacility._id);
    this.closeDependant(null, 0);
  }

  addDependant(beneficiary?) {

    if (beneficiary) {
      this.showEdit(beneficiary, true);
      // this.pushNewDependant(undefined, undefined);
    } else {
      this.frmDependant = this.formBuilder.group({
        'dependantArray': this.formBuilder.array([
          this.formBuilder.group({
            surname: ['', [Validators.required]],
            othernames: ['', [Validators.required]],
            gender: ['', [Validators.required]],
            address: [''],
            email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
            phone: ['', []],
            status: ['', [<any>Validators.required]],
            filNo: [''],
            readOnly: [true],
            operation: ['save'],
            serial: [0]
          })
        ])
      });
    }

  }
  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid) {
      dependant.value.readOnly = true;
    }
    (<FormArray>this.frmDependant.controls['dependantArray'])
      .push(
        this.formBuilder.group({
          surname: ['', [Validators.required]],
          othernames: ['', [Validators.required]],
          gender: ['', [Validators.required]],
          email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
          phone: ['', []],
          address: [''],
          status: ['', [<any>Validators.required]],
          filNo: [''],
          readOnly: [true],
          operation: ['save'],
          serial: [0]
        })
      );
  }
  closeDependant(dependant, i) {
    const frmControls = (<FormArray>this.frmDependant.controls['dependantArray']).controls;
    frmControls.splice(i, 1);
    if (frmControls.length === 0) {
      //this.addDependant()
      // let log the current state for the control
      console.log(frmControls);
    }
  }

  showEdit(beneficiary, isAdd?) {
    this.selectedFamilyCoverId = beneficiary.familyId;
    if (this.getRole(beneficiary) === 'P') {
      this.frmNewBeneficiary.controls['surname'].setValue(beneficiary.surname);
      this.frmNewBeneficiary.controls['othernames'].setValue(beneficiary.othernames);
      this.frmNewBeneficiary.controls['gender'].setValue(beneficiary.gender);
      this.frmNewBeneficiary.controls['filNo'].setValue(beneficiary.filNo);
      this.frmNewBeneficiary.controls['operation'].setValue('update');
      this.frmNewBeneficiary.controls['serial'].setValue(beneficiary.serial);
      this.frmNewBeneficiary.controls['email'].setValue(beneficiary.email);
      this.frmNewBeneficiary.controls['phone'].setValue(beneficiary.phone);
      this.frmNewBeneficiary.controls['address'].setValue(beneficiary.address);
      if (beneficiary.isActive === undefined) {
        this.frmNewBeneficiary.controls['status'].setValue(this.statuses[0]._id);
      }
      const filtered = this.beneficiaries.filter(x => x.filNo.includes(beneficiary.filNo));
      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
              this.formBuilder.group({
                surname: [filter.surname],
                othernames: [filter.othernames],
                gender: [filter.gender],
                email: [filter.email],
                address: [filter.address],
                phone: [filter.phone],
                status: [filter.status],
                operation: ['update'],
                filNo: [filter.filNo],
                serial: [filter.serial],
                category: 'Dependant',
                readOnly: [true],
              }));

        }
      })
      this.newFamily = true;
      if (!hasRecord && !isAdd) {
        //this.addDependant();
      }
    } else {
      this.frmNewBeneficiary.reset();
      const filNoLength = beneficiary.filNo.length;
      const lastCharacter = beneficiary.filNo[filNoLength - 1];
      const sub = beneficiary.filNo.substring(0, (filNoLength - 1));
      const filtered = this.beneficiaries.filter(x => x.filNo.includes(sub));
      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
              this.formBuilder.group({
                surname: [filter.surname],
                othernames: [filter.othernames],
                gender: [filter.gender],
                email: [filter.email],
                phone: [filter.phone],
                address: [filter.address],
                status: [filter.status],
                operation: ['update'],
                filNo: [filter.filNo],
                serial: [filter.serial],
                category: 'Dependant',
                readOnly: [true],
              }));
          if (!hasRecord) {
            //this.addDependant();
          }
        } else if (this.getRole(filter) === 'P') {
          this.frmNewBeneficiary.controls['surname'].setValue(filter.surname);
          this.frmNewBeneficiary.controls['othernames'].setValue(filter.othernames);
          this.frmNewBeneficiary.controls['gender'].setValue(filter.gender);
          this.frmNewBeneficiary.controls['filNo'].setValue(filter.filNo);
          this.frmNewBeneficiary.controls['operation'].setValue('update');
          // this.frmNewBeneficiary.controls['date'].setValue(filter.date);
          this.frmNewBeneficiary.controls['serial'].setValue(filter.serial);
          this.frmNewBeneficiary.controls['email'].setValue(filter.email);
          this.frmNewBeneficiary.controls['phone'].setValue(filter.phone);
          this.frmNewBeneficiary.controls['address'].setValue(filter.address);
          if (beneficiary.isActive === undefined) {
            this.frmNewBeneficiary.controls['status'].setValue(this.statuses[0]._id);
          }
        }
      });
      this.newFamily = true;
    }

  }
  change(value) {
  }
  save(valid, value, dependantValid, dependantValue) {
    this.loading = true;
    this.updatePatientBtnText = 'Adding Family... <i class="fa fa-spinner fa-spin"></i>';
    if (valid) {
      console.log(value);
      let _dependants = [];
      value.serial = 0;
      console.log(1);
      _dependants.push(value);
      dependantValue.controls.dependantArray.value.forEach((item, i) => {
        console.log(item);
        console.log('value' + i);
        item.serial = i + 1;
        item.filNo = value.filNo + String.fromCharCode(65 + i);
        _dependants.push(item);
        console.log(item);
      });
      console.log(2);
      const param = {
        familyCovers: _dependants,
        facilityId: this.selectedFacility._id
      };
      console.log(param);
      if (value.operation === 'save') {
        this.familyCoverService.create(param).then(payload => {
          console.log(payload);
          this.loading = false;
          this.updatePatientBtnText = 'Add Family';
          this.getBeneficiaryList(this.selectedFacility._id);
          this.cancel();
          this.systemModuleService.announceSweetProxy('Family Cover Records Updated Successfully',
            'success', null, null, null, null, null, null, null);
        }, err => {
          console.log(err);
        });
      } else {
        console.log(this.selectedFamilyCoverId,param);
        this.familyCoverService.patch(this.selectedFamilyCoverId, { familyCovers: param.familyCovers }, {}).then(payload => {
          console.log(payload);
          this.loading = false;
          this.updatePatientBtnText = 'Add Family';
          this.getBeneficiaryList(this.selectedFacility._id);
          this.cancel();
          this.systemModuleService.announceSweetProxy('Family Cover Records Updated Successfully',
            'success', null, null, null, null, null, null, null);
        }, err => {
          console.log(err);
        });
      }
      // this.familyCoverService.updateBeneficiaryList(param)

    } else {
      this.loading = false;
      this.updatePatientBtnText = 'Add Family';
      this.systemModuleService.announceSweetProxy('A value is missing, please fill all required field and try again!', 'warning');
    }

  }
  cancel() {
    this.frmNewBeneficiary.reset();
    this.frmDependant.reset();
    this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
    //this.pushNewDependant();
  }

  getBeneficiaryList(id?) {
    console.log(id);
    this.familyCoverService.findBeneficiaries({ query: { 'facilityId': this.selectedFacility._id } }).then(payload => {
      console.log(payload);
      this.beneficiaries = payload.data;
      // if (payload.data.length > 0) {
      // const facFamilyCover = payload.data;
      // this.selectedFamilyCover = facFamilyCover;
      // facFamilyCover.map(x => {
      //   console.log(x);
      // });
      // this.beneficiaries= payload.data;
      // console.log(this.beneficiaries);
      //   const startIndex = 0 * 10;
      //   this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
      //   this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
      // }
    }, err => {
      console.log(err);
    });
  }
  getRole(beneficiary) {
    return (beneficiary.serial === 0) ? 'P' : 'D';
  }
  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }

  newFamily_show() {
    this.newFamily = !this.newFamily;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

  show_beneficiaries() {
    this.showBeneficiaries.emit(true);
  }
}