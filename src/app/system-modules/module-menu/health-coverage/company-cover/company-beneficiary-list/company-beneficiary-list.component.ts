import { Category } from './../../../../../models/facility-manager/setup/category';
import { User } from './../../../../../models/facility-manager/setup/user';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { MatPaginator } from '@angular/material';
import { FacilityCompanyCoverService } from './../../../../../services/facility-manager/setup/facility-company-cover.service';
import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-company-beneficiary-list',
  templateUrl: './company-beneficiary-list.component.html',
  styleUrls: ['./company-beneficiary-list.component.scss']
})
export class CompanyBeneficiaryListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmNewBeneficiary: FormGroup;
  public frmDependant: FormGroup;
  beneficiary = new FormControl('', []);
  newBeneficiary = false;

  pageEvent:any;
  selectedFacility: any = <any>{};
  beneficiaries: any[] = [];
  filteredBeneficiaries: any[] = [];
  operateBeneficiaries: any[] = [];
  selectedCompanyCover: any = <any>{};

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
  routeId = '';
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private locker: CoolLocalStorage,
    private companyCoverService: FacilityCompanyCoverService, private facilityService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = <any>this.locker.getObject('miniFacility');
    this.user = <User>this.locker.getObject('auth');
    this.frmNewBeneficiary = this.formBuilder.group({
      surname: ['', [Validators.required]],
      othernames: ['', [Validators.required]],
      address: ['', []],
      email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
      phone: ['', []],
      principalGender: ['', [<any>Validators.required]],
      principalstatus: ['', [<any>Validators.required]],
      principalEmpID: ['', [<any>Validators.required]],
      operation: ['save'],
      date: [new Date()],
      serial: [0]
    });

    this.addDependant();
    this.route.params.subscribe(parameters => {
      this.routeId = parameters.id;
      this.getBeneficiaryList(parameters.id);
    })
  }
  addDependant() {
    this.frmDependant = this.formBuilder.group({
      'dependantArray': this.formBuilder.array([
        this.formBuilder.group({
          dependantSurname: ['', [Validators.required]],
          dependantOthernames: ['', [Validators.required]],
          dependantGender: ['', [Validators.required]],
          dependantEmail: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
          dependantPhone: ['', []],
          dependantStatus: ['', [<any>Validators.required]],
          readOnly: [false],
          operation: ['save'],
          date: [new Date()]
        })
      ])
    });
  }
  pushNewDependant(dependant?, index?) {
    if (dependant !== undefined && dependant.valid) {
      dependant.value.readOnly = true;
    }
    (<FormArray>this.frmDependant.controls['dependantArray'])
      .push(
      this.formBuilder.group({
        dependantSurname: ['', [Validators.required]],
        dependantOthernames: ['', [Validators.required]],
        dependantGender: ['', [Validators.required]],
        dependantEmail: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
        dependantPhone: ['', []],
        dependantStatus: ['', [<any>Validators.required]],
        readOnly: [false],
        operation: ['save'],
        date: [new Date()]
      })
      );
  }
  closeDependant(dependant, i) {
    (<FormArray>this.frmDependant.controls['dependantArray']).controls.splice(i, 1);
    if ((<FormArray>this.frmDependant.controls['dependantArray']).controls.length === 0) {
      this.addDependant()
    }
  }
  newBeneficiary_show() {
    this.newBeneficiary = !this.newBeneficiary;
  }
  showEdit(beneficiary) {
    if (this.getRole(beneficiary) === 'P') {
      this.frmNewBeneficiary.controls['surname'].setValue(beneficiary.surname);
      this.frmNewBeneficiary.controls['othernames'].setValue(beneficiary.firstName);
      this.frmNewBeneficiary.controls['principalGender'].setValue(beneficiary.gender);
      this.frmNewBeneficiary.controls['principalEmpID'].setValue(beneficiary.filNo);
      this.frmNewBeneficiary.controls['operation'].setValue('update');
      this.frmNewBeneficiary.controls['date'].setValue(beneficiary.date);
      this.frmNewBeneficiary.controls['serial'].setValue(beneficiary.serial);
      this.frmNewBeneficiary.controls['email'].setValue(beneficiary.email);
      this.frmNewBeneficiary.controls['phone'].setValue(beneficiary.phone);
      this.frmNewBeneficiary.controls['address'].setValue(beneficiary.address);
      if (beneficiary.isActive === undefined) {
        this.frmNewBeneficiary.controls['principalstatus'].setValue(this.statuses[0]._id);
      }
      let filtered = this.beneficiaries.filter(x => x.filNo.includes(beneficiary.filNo));
      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
            this.formBuilder.group({
              dependantSurname: [filter.surname],
              dependantOthernames: [filter.firstName],
              dependantGender: [filter.gender],
              dependantEmail: [filter.filNo],
              dependantPhone: [filter.phone],
              dependantStatus: [filter.status],
              operation: ['update'],
              date: [filter.date],
              serial: [filter.serial],
              category: [filter.category],
              readOnly: [true],
            }));

        }
      })
      this.newBeneficiary = true;
    } else {
      this.frmNewBeneficiary.reset();
      const filNoLength = beneficiary.filNo.length;
      const lastCharacter = beneficiary.filNo[filNoLength - 1];
      let sub = beneficiary.filNo.substring(0, (filNoLength - 1));
      let filtered = this.beneficiaries.filter(x => x.filNo.includes(sub));

      let hasRecord = false;
      this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
      filtered.forEach((filter, i) => {
        if (this.getRole(filter) === 'D') {
          hasRecord = true;
          (<FormArray>this.frmDependant.controls['dependantArray'])
            .push(
            this.formBuilder.group({
              dependantSurname: [filter.surname],
              dependantOthernames: [filter.firstName],
              dependantGender: [filter.gender],
              dependantEmail: [filter.filNo],
              dependantPhone: [filter.phone],
              dependantStatus: [filter.status],
              operation: ['update'],
              date: [filter.date],
              serial: [filter.serial],
              category: [filter.category],
              readOnly: [true],
            }));

        } else if (this.getRole(filter) === 'P') {
          this.frmNewBeneficiary.controls['surname'].setValue(filter.surname);
          this.frmNewBeneficiary.controls['othernames'].setValue(filter.firstName);
          this.frmNewBeneficiary.controls['principalGender'].setValue(filter.gender);
          this.frmNewBeneficiary.controls['principalEmpID'].setValue(filter.filNo);
          this.frmNewBeneficiary.controls['operation'].setValue('update');
          this.frmNewBeneficiary.controls['date'].setValue(filter.date);
          this.frmNewBeneficiary.controls['serial'].setValue(beneficiary.serial);
          this.frmNewBeneficiary.controls['email'].setValue(filter.email);
          this.frmNewBeneficiary.controls['phone'].setValue(filter.phone);
          this.frmNewBeneficiary.controls['address'].setValue(filter.address);
          if (beneficiary.isActive === undefined) {
            this.frmNewBeneficiary.controls['principalstatus'].setValue(this.statuses[0]._id);
          }
        }
      })
    }

  }
  save(valid, value, dependantValid, dependantValue) {
    let unsavedFiltered = dependantValue.controls.dependantArray.controls.filter(x => x.value.readOnly === false && x.valid);
    if(unsavedFiltered.length > 0){
      this._notification('Warning', 'There seems to unsaved but valid dependant yet to be saved, please save and try again!');
      return;
    }
    if (valid) {
      let param = {
        model: value,
        operation: value.operation,
        dependants: [],
        facilityId: this.selectedFacility._id,
        company: this.selectedCompanyCover
      };
      // let filtered = dependantValue.dependantArray.filter(x => x.readOnly === true);
      // param.dependants = filtered;


      let filtered = dependantValue.controls.dependantArray.controls.filter(x => x.value.readOnly === true);
      filtered.forEach(item =>{
        param.dependants.push(item.value);
      })


      this.companyCoverService.updateBeneficiaryList(param).then(payload => {
        this.getBeneficiaryList(this.routeId)
      })
    } else {
      this._notification('Warning', 'A value is missing, please fill all required field and try again!');
    }

  }
  cancel(){
    this.frmNewBeneficiary.reset();
    this.frmDependant.reset();
    this.frmDependant.controls['dependantArray'] = this.formBuilder.array([]);
    this.pushNewDependant();
  }
  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }
  getBeneficiaryList(id) {
    this.companyCoverService.find({ query: { 'facilityId._id': this.selectedFacility.facilityId } }).then(payload => {
      if (payload.data.length > 0) {
        const faceCompany = payload.data[0];
        const index = faceCompany.companyCovers.findIndex(x => x.company === id);
        if (index > -1) {
          if (faceCompany.companyCovers[index].enrolleeList.length > 0) {
            const bene = [];
            for (let s = 0; s < faceCompany.companyCovers[index].enrolleeList.length; s++) {
              this.selectedCompanyCover = faceCompany.companyCovers[index].company;
              bene.push(...faceCompany.companyCovers[index].enrolleeList[s].enrollees);
            }
            this.beneficiaries = bene;
            const startIndex = 0 * 10;
            this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
            this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
          }
        }
      }
    }).catch(err => { console.log(err) });
  }
  getRole(beneficiary) {
    let filNo = beneficiary.filNo;
    if (filNo !== undefined) {
      const filNoLength = filNo.length;
      const lastCharacter = filNo[filNoLength - 1];
      return isNaN(lastCharacter) ? 'D' : 'P';
    }
  }
  onPaginateChange(event) {
    const startIndex = event.pageIndex * event.pageSize;
    this.operateBeneficiaries = JSON.parse(JSON.stringify(this.beneficiaries));
    this.filteredBeneficiaries = JSON.parse(JSON.stringify(this.operateBeneficiaries.splice(startIndex, this.paginator.pageSize)));
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
