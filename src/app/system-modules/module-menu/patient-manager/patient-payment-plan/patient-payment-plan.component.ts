import { FacilityFamilyCoverService } from './../../../../services/facility-manager/setup/facility-family-cover.service';
import { MaritalStatus } from './../../../../models/facility-manager/setup/maritalstatus';
import { PolicyService } from './../../../../services/facility-manager/setup/policy.service';
import { FacilityCompanyCoverService } from './../../../../services/facility-manager/setup/facility-company-cover.service';
import { User } from './../../../../models/facility-manager/setup/user';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { Facility } from './../../../../models/facility-manager/setup/facility';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { HmoService } from './../../../../services/facility-manager/setup/hmo.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, FormArray } from '@angular/forms';
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-patient-payment-plan',
  templateUrl: './patient-payment-plan.component.html',
  styleUrls: ['./patient-payment-plan.component.scss']
})
export class PatientPaymentPlanComponent implements OnInit {
  selectedCompanyCover: any;
  selectedHMOClient: any;
  selectedFamilyCover: any;
  selectedHMO: any;
  selectedPatientPolicy: any = undefined;
  mainErr = true;
  errMsg = 'You have unresolved errors';

  tabWallet = true;
  tabInsurance = false;
  tabCompany = false;
  tabFamily = false;

  walletPlan = new FormControl('', Validators.required);
  hmo = new FormControl('', Validators.required);
  hmoPlan = new FormControl('', Validators.required);
  hmoPlanId = new FormControl('', Validators.required);
  ccPlan = new FormControl('', Validators.required);
  ccPlanId = new FormControl('', Validators.required);
  familyPlanId = new FormControl('', Validators.required);

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedPatient;

  selectedFacility: Facility = <Facility>{};
  hmos: any[] = [];
  companies: any[] = [];
  plans: any[] = [];
  user: User = <User>{};
  insurancePlanForm: FormGroup;
  companyCoverPlanForm: FormGroup;
  familyCoverPlanForm: FormGroup;

  insuranceFormArrayIndex = 0;
  companyFormArrayIndex = 0;
  familyFormArrayIndex = 0;
  addCompanyCondition = false;
  addInsuranceCondition = false;

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

  constructor(private formBuilder: FormBuilder, private hmoService: HmoService, private companyService: FacilityCompanyCoverService,
    private locker: CoolLocalStorage, private facilityService: FacilitiesService, private policyService: PolicyService,
    private companyCoverService: FacilityCompanyCoverService, private familyCoverService: FacilityFamilyCoverService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.hmoService.hmos(this.selectedFacility._id).then(payload => {
      if (payload.body.length > 0) {
        this.hmos = payload.body[0].hmos;
      }
    });
    this.companyService.companycovers(this.selectedFacility._id).then(payload => {
      this.companies = payload.body[0].companyCovers;
    });
    this.addInsurancePlan();
    this.addCompanyCoverPlan();
    this.addDependant();
    this.subscribeToValueChanges();
    this.subscribeToCompanyCoverValueChanges();
    this.subscribeToFamilyCoverValueChanges();
    this.getPersonPolicies();
  }
  getPersonPolicies() {
    this.policyService.find({ query: { 'personId._id': this.selectedPatient.personId } }).then(payload => {
      if (payload.data.length > 0 && payload.data[0].companyCovers !== undefined) {
        payload.data[0].companyCovers.forEach((item, i) => {
          this.selectedPatientPolicy = payload.data[0];
          this.companyService.companycovers(this.selectedFacility._id, item.company._id).then(payload2 => {
            (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
              .push(
              this.formBuilder.group({
                company: [item.company._id, [<any>Validators.required]],
                plans: [payload2.body],
                companyPlan: [item.category, [<any>Validators.required]],
                companyPlanId: [item.filNo, [<any>Validators.required]],
                client: [null],
                readOnly: [false],
                addToCompanyPlan: [false],
                isPrincipal: [false],
                addCompanyCondition: [false]
              })
              );
            // (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.reverse();
          });
          // (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.reverse();
          const index = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length - 1;
          this.companyFormArrayIndex = index;
          this.subscribeToCompanyCoverValueChanges();
          // (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.reverse();
        })
      }

      if (payload.data.length > 0 && payload.data[0].hmoCovers !== undefined) {
        payload.data[0].hmoCovers.forEach((item, i) => {
          this.selectedPatientPolicy = payload.data[0];
          this.hmoService.hmos(this.selectedFacility._id, item.hmo._id).then(payload2 => {
            (<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
              .push(
              this.formBuilder.group({
                hmo: [item.hmo._id, [<any>Validators.required]],
                hmoPlan: [item.plan, [<any>Validators.required]],
                hmoPlanId: [item.filNo, [<any>Validators.required]],
                plans: [payload2.body],
                client: [null],
                readOnly: [false],
                addToHMOPlan: [false],
                isPrincipal: [false],
                addInsuranceCondition: [false]
              })
              );
          });
          const index = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length - 1;
          this.companyFormArrayIndex = index;
          this.subscribeToCompanyCoverValueChanges();
        })
      }

      if (payload.data.length > 0 && payload.data[0].familyCovers !== undefined) {
        payload.data[0].familyCovers.forEach((item, i) => {
          (<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
            .push(
            this.formBuilder.group({
              surname: [item.surname, [Validators.required]],
              familyPlanId: [item.filNo, [Validators.required]],
              othernames: [item.othernames, [Validators.required]],
              gender: [item.gender, [Validators.required]],
              email: [item.email, [<any>Validators.pattern(EMAIL_REGEX)]],
              phone: [item.phone, []],
              status: [item.status, [<any>Validators.required]],
              filNo: [item.filNo],
              readOnly: [true],
              operation: ['update'],
              serial: [item.serial]
            })
            );
          const index = (<FormArray>this.familyCoverPlanForm.controls['dependantArray']).controls.length - 1;
          this.familyFormArrayIndex = index;
          this.subscribeToFamilyCoverValueChanges();
        })
      }
    })
  }
  addInsurancePlan() {
    this.insurancePlanForm = this.formBuilder.group({
      'insurancePlanArray': this.formBuilder.array([
        this.formBuilder.group({
          hmo: ['', [<any>Validators.required]],
          hmoPlan: ['', [<any>Validators.required]],
          hmoPlanId: ['', [<any>Validators.required]],
          plans: [''],
          client: [null],
          readOnly: [false],
          addToHMOPlan: [false],
          isPrincipal: [false],
          addInsuranceCondition: [false]
        })
      ])
    });
  }

  addCompanyCoverPlan() {
    this.companyCoverPlanForm = this.formBuilder.group({
      'companyCoverPlanArray': this.formBuilder.array([
        this.formBuilder.group({
          company: ['', [<any>Validators.required]],
          companyPlan: ['', [<any>Validators.required]],
          companyPlanId: ['', [<any>Validators.required]],
          plans: [''],
          client: [null],
          readOnly: [false],
          addToCompanyPlan: [false],
          isPrincipal: [false],
          addCompanyCondition: [false]
        })
      ])
    });
  }

  addDependant() {
    this.familyCoverPlanForm = this.formBuilder.group({
      'dependantArray': this.formBuilder.array([
        this.formBuilder.group({
          surname: ['', [Validators.required]],
          familyPlanId: ['', [Validators.required]],
          othernames: ['', [Validators.required]],
          gender: ['', [Validators.required]],
          email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
          phone: ['', []],
          status: ['', [<any>Validators.required]],
          filNo: [''],
          readOnly: [false],
          operation: ['save'],
          serial: [0]
        })
      ])
    });
  }
  subscribeToValueChanges() {
    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmo'].valueChanges.subscribe(value => {
      this.selectedHMO = value;
      this.hmoService.hmos(this.selectedFacility._id, value).then(payload => {
        this.plans = payload.body;
        (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['plans'].setValue(this.plans, { onlySelf: true });
      });
    });


    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['addToHMOPlan'].valueChanges.subscribe(value => {
      if (value === true) {
        (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmoPlanId'].setErrors(null);
      }
    });

    (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmoPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls[this.insuranceFormArrayIndex]).controls['hmo'].value;
        if (this.selectedHMO === undefined) {
          this._notification('Warning', 'Please select an HMO to search from and try again!');
        } else {
          this.hmoService.hmos(this.selectedFacility._id, this.selectedHMO, value).then(payload => {
            if (payload.body !== null) {
              this.selectedHMOClient = payload.body;
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['client'].setValue(payload.body);
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlan'].setValue(payload.body.plan);
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['addInsuranceCondition'].setValue(false);
              this.addInsuranceCondition = false;
            } else {
              this.selectedHMOClient = undefined;
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlanId'].setErrors({ idNotFound: true });
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['hmoPlan'].reset();
              (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
                .controls[this.insuranceFormArrayIndex]).controls['addInsuranceCondition'].setValue(true);
              this.addInsuranceCondition = true;
            }
          })
        }
      });
  }
  subscribeToCompanyCoverValueChanges() {
    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['company'].valueChanges.subscribe(value => {
      this.selectedCompanyCover = value;
      this.companyService.companycovers(this.selectedFacility._id, value).then(payload => {
        this.plans = payload.body;
        (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['plans'].setValue(this.plans, { onlySelf: true });
      });
    });


    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['addToCompanyPlan'].valueChanges.subscribe(value => {
      if (value === true) {
        (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['companyPlanId'].setErrors(null);
      }
    });


    (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['companyPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.selectedCompanyCover = (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls[this.companyFormArrayIndex]).controls['company'].value;
        if (this.selectedCompanyCover === undefined) {
          this._notification('Warning', 'Please select a Company to search from and try again!');
        } else {
          this.companyService.companycovers(this.selectedFacility._id, this.selectedCompanyCover, value).then(payload => {
            if (payload.body !== null) {
              this.selectedCompanyCover = payload.body;
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['client'].setValue(payload.body);
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlan'].setValue(payload.body.category);
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['addCompanyCondition'].setValue(false);
            } else {
              this.selectedCompanyCover = undefined;
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlanId'].setErrors({ idNotFound: true });
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['companyPlan'].reset();
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['addCompanyCondition'].setValue(true);
              (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
                .controls[this.companyFormArrayIndex]).controls['client'].reset();
            }
          })
        }
      });
  }
  subscribeToFamilyCoverValueChanges() {
    (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray']).controls[this.familyFormArrayIndex]).controls['familyPlanId'].valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.familyCoverService.familycovers(this.selectedFacility._id, value).then(payload => {
          if (payload.body !== null && payload.body.familyCovers !== undefined && payload.body.familyCovers.length > 0) {
            let familyCover = payload.body.familyCovers[0];
            this.selectedFamilyCover = familyCover;
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['surname'].setValue(familyCover.surname);
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['othernames'].setValue(familyCover.othernames);
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['gender'].setValue(familyCover.gender);
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['email'].setValue(familyCover.email);
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['phone'].setValue(familyCover.phone);
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['status'].setValue(familyCover.status);
          } else {
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['surname'].reset();
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['othernames'].reset();
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['gender'].reset();
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['email'].reset();
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['phone'].reset();
            (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
              .controls[this.familyFormArrayIndex]).controls['status'].reset();
          }
        })
      });
  }
  pushNewInsurancePlan() {
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .push(
      this.formBuilder.group({
        hmo: ['', [<any>Validators.required]],
        hmoPlan: ['', [<any>Validators.required]],
        hmoPlanId: ['', [<any>Validators.required]],
        plans: [''],
        client: [null],
        readOnly: [false],
        addToHMOPlan: [false],
        isPrincipal: [false],
        addInsuranceCondition: [false]
      })
      );
    const index = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length - 1;
    this.insuranceFormArrayIndex = index;
    this.subscribeToValueChanges();
  }

  pushNewCompanyCoverPlan() {
    (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
      .push(
      this.formBuilder.group({
        company: ['', [<any>Validators.required]],
        companyPlan: ['', [<any>Validators.required]],
        companyPlanId: ['', [<any>Validators.required]],
        plans: [''],
        client: [null],
        readOnly: [false],
        addToCompanyPlan: [false],
        isPrincipal: [false],
        addCompanyCondition: [false]
      })
      );
    const index = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length - 1;
    this.companyFormArrayIndex = index;
    this.subscribeToCompanyCoverValueChanges();
  }

  saveINullPolicyNullClientWithPrincipal(insurance) {
    let newModel = {
      catetory: 'STAFF',
      date: new Date(),
      principalEmpID: insurance.value.hmoPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.lastName,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (insurance.value.client === undefined || insurance.value.client === null) {
      insurance.value.client = {};
      insurance.value.client = newModel;
    }
    const index = this.hmos.findIndex(x => x.hmo._id === insurance.value.hmo);
    insurance.value.client.hmo = this.hmos[index].hmo;


    let param = {
      model: insurance.value.client,
      operation: 'save',
      dependants: [],
      facilityId: this.selectedFacility._id,
      hmo: this.hmos[index].hmo,
      hmoPlan: insurance.value.hmoPlan
    };
    this.hmoService.updateBeneficiaryList(param).then(payload => {
      const comCoverId = insurance.value.hmoPlanId;
      this.hmoService.hmos(this.selectedFacility._id, insurance.value.hmo, comCoverId).then(pay => {

        let newPolicy: any = {};
        let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
        copyPatient = this.trimPerson(copyPatient);

        newPolicy.personId = copyPatient.personDetails;

        pay.body.hmo = this.hmos[index].hmo;
        newPolicy.hmoCovers = [pay.body];


        this.policyService.create(newPolicy).then(payload => {
        })


      });
    })
  }
  saveINullPolicyNullClientWithDependant(insurance) {
    let newModel = {
      catetory: 'DEPENDANT',
      date: new Date(),
      principalEmpID: insurance.value.hmoPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (insurance.value.client === undefined || insurance.value.client === null) {
      insurance.value.client = {};
      insurance.value.client = newModel;
    }
    const index = this.hmos.findIndex(x => x.hmo._id === insurance.value.hmo);
    insurance.value.client.hmo = this.hmos[index].hmo;


    let param = {
      model: undefined,
      operation: 'save',
      dependants: [insurance.value.client],
      facilityId: this.selectedFacility._id,
      hmo: this.hmos[index].hmo,
      hmoPlan: insurance.value.hmoPlan
    };
    this.hmoService.updateBeneficiaryList(param).then(payload => {







      const comCoverId = insurance.value.hmoPlanId;
      this.hmoService.hmos(this.selectedFacility._id, insurance.value.hmo, comCoverId).then(pay => {

        let newPolicy: any = {};
        let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
        copyPatient = this.trimPerson(copyPatient);

        newPolicy.personId = copyPatient.personDetails;

        pay.body.hmo = this.hmos[index].hmo;
        newPolicy.hmoCovers = [pay.body];


        this.policyService.create(newPolicy).then(payload => {
        })


      });











    })
  }
  saveINullPolicyClient(insurance, newPolicy, index) {
    insurance.value.client.hmo = this.hmos[index].hmo;
    newPolicy.hmoCovers = [insurance.value.client];


    this.policyService.create(newPolicy).then(payload => {
    })
  }
  saveIPolicyNullClientWithPrincipal(insurnace) {
    let newModel = {
      catetory: 'STAFF',
      date: new Date(),
      principalEmpID: insurnace.value.hmoPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (insurnace.value.client === undefined || insurnace.value.client === null) {
      insurnace.value.client = {};
      insurnace.value.client = newModel;
    }
    const index = this.hmos.findIndex(x => x.hmo._id === insurnace.value.hmo);
    insurnace.value.client.hmo = this.hmos[index];


    let param = {
      model: insurnace.value.client,
      operation: 'save',
      dependants: [],
      facilityId: this.selectedFacility._id,
      hmo: this.hmos[index].hmo,
      hmoPlan: insurnace.value.hmoPlan
    };
    this.hmoService.updateBeneficiaryList(param).then(payload => {

      const comCoverId = insurnace.value.hmoPlanId;
      this.hmoService.hmos(this.selectedFacility._id, insurnace.value.hmo, comCoverId).then(pay => {

        pay.body.hmo = this.hmos[index].hmo;
        if (this.selectedPatientPolicy.hmoCovers === undefined) {
          this.selectedPatientPolicy.hmoCovers = []
        }
        this.selectedPatientPolicy.hmoCovers.push(pay.body);


        this.policyService.update(this.selectedPatientPolicy).then(payload => {
        })


      });










    })
  }
  saveIPolicyNullClientWithDependant(insurnace) {
    let newModel = {
      catetory: 'DEPENDANT',
      date: new Date(),
      principalEmpID: insurnace.value.hmoPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.lastName,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (insurnace.value.client === undefined || insurnace.value.client === null) {
      insurnace.value.clien = {};
      insurnace.value.client = newModel;
    }
    const index = this.hmos.findIndex(x => x.hmo._id === insurnace.value.hmo);
    insurnace.value.client.hmo = this.hmos[index].hmo;


    let param = {
      model: undefined,
      operation: 'save',
      dependants: [insurnace.value.client],
      facilityId: this.selectedFacility._id,
      hmo: this.hmos[index].hmo,
      hmoPlan: insurnace.value.hmoPlan
    };
    this.hmoService.updateBeneficiaryList(param).then(payload => {


      const comCoverId = insurnace.value.hmoPlanId;
      this.hmoService.hmos(this.selectedFacility._id, insurnace.value.hmo, comCoverId).then(pay => {



        pay.body.hmo = this.hmos[index].hmo;
        if (this.selectedPatientPolicy.hmoCovers === undefined) {
          this.selectedPatientPolicy.hmoCovers = []
        }
        this.selectedPatientPolicy.hmoCovers.push(pay.body);


        this.policyService.update(this.selectedPatientPolicy).then(payload => {
        })

      });



    })
  }
  saveIPolicyClient(insurnace) {

    const index = this.hmos.findIndex(x => x.hmo._id === insurnace.value.company);
    insurnace.value.client.company = this.hmos[index].hmo;
    this.selectedPatientPolicy.companyCovers.push(insurnace.value.client);


    this.policyService.update(this.selectedPatientPolicy).then(payload => {
    })
  }



  onSubmit(insurance, i) {
    // this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
    //   .controls[this.insuranceFormArrayIndex]).controls['readOnly'].setValue(true);
    this.selectedHMO = (<FormGroup>(<FormArray>this.insurancePlanForm.controls['insurancePlanArray'])
      .controls[this.insuranceFormArrayIndex]).controls['readOnly'].value;


    //selected patient has no existing policy
    if (this.selectedPatientPolicy === undefined) {
      let newPolicy: any = {};
      let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
      copyPatient = this.trimPerson(copyPatient);

      newPolicy.personId = copyPatient.personDetails;
      const index = this.hmos.findIndex(x => x.hmo._id === insurance.value.hmo);
      if (insurance.value.client === null) {
        // selected patient has no existing policy and has no record in the insurance cover master file
        // add him/her to master file
        // add to insurance cover to policy and create;
        if (insurance.value.isPrincipal) {
          this.saveINullPolicyNullClientWithPrincipal(insurance);
        } else {
          this.saveINullPolicyNullClientWithDependant(insurance);
        }
      } else {
        this.saveINullPolicyClient(insurance, newPolicy, index);
      }
    } else {
      if (insurance.value.client === null) {
        if (insurance.value.isPrincipal) {
          this.saveIPolicyNullClientWithPrincipal(insurance);
        } else {
          this.saveIPolicyNullClientWithDependant(insurance);
        }
      } else {
        this.saveIPolicyClient(insurance);
      }

    }








  }
  trimPerson(copyPatient) {
    delete copyPatient.personDetails.addressObj;
    delete copyPatient.personDetails.age;
    delete copyPatient.personDetails.countryItem;
    delete copyPatient.personDetails.gender;
    delete copyPatient.personDetails.homeAddress;
    delete copyPatient.personDetails.maritalStatus;
    delete copyPatient.personDetails.nationality;
    delete copyPatient.personDetails.nationalityObject;
    delete copyPatient.personDetails.nextOfKin;
    delete copyPatient.personDetails.title;
    delete copyPatient.personDetails.wallet;
    delete copyPatient.personDetails.personFullName;
    delete copyPatient.personDetails.fullAddress;
    return copyPatient;
  }
  saveNullPolicyNullClientWithPrincipal(company) {
    let newModel = {
      catetory: 'STAFF',
      date: new Date(),
      principalEmpID: company.value.companyPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (company.value.client === undefined || company.value.client === null) {
      company.value.client = {};
      company.value.client = newModel;
    }
    const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
    company.value.client.company = this.companies[index];


    let param = {
      model: company.value.client,
      operation: 'save',
      dependants: [],
      facilityId: this.selectedFacility._id,
      company: this.companies[index].hmo
    };
    this.companyCoverService.updateBeneficiaryList(param).then(payload => {
      const comCoverId = company.value.companyPlanId;
      this.companyCoverService.companycovers(this.selectedFacility._id, company.value.company, comCoverId).then(pay => {
        let newPolicy: any = {};
        let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
        copyPatient = this.trimPerson(copyPatient);

        newPolicy.personId = copyPatient.personDetails;

        pay.body.company = this.companies[index].hmo;
        newPolicy.companyCovers = [pay.body];


        this.policyService.create(newPolicy).then(payload => {
        })


      });
    })
  }
  saveNullPolicyNullClientWithDependant(company) {
    let newModel = {
      catetory: 'DEPENDANT',
      date: new Date(),
      principalEmpID: company.value.companyPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (company.value.client === undefined || company.value.client === null) {
      company.value.client = {};
      company.value.client = newModel;
    }
    const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
    company.value.client.company = this.companies[index];


    let param = {
      model: undefined,
      operation: 'save',
      dependants: [company.value.client],
      facilityId: this.selectedFacility._id,
      company: this.companies[index].hmo
    };
    this.companyCoverService.updateBeneficiaryList(param).then(payload => {







      const comCoverId = company.value.companyPlanId;
      this.companyCoverService.companycovers(this.selectedFacility._id, company.value.company, comCoverId).then(pay => {

        let newPolicy: any = {};
        let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
        copyPatient = this.trimPerson(copyPatient);

        newPolicy.personId = copyPatient.personDetails;

        pay.body.company = this.companies[index].hmo;
        newPolicy.companyCovers = [pay.body];


        this.policyService.create(newPolicy).then(payload => {
        })


      });











    })
  }
  saveNullPolicyClient(company, newPolicy, index) {
    company.value.client.company = this.companies[index];
    newPolicy.companyCovers = [company.value.client];


    this.policyService.create(newPolicy).then(payload => {
    })
  }
  savePolicyNullClientWithPrincipal(company) {
    let newModel = {
      catetory: 'STAFF',
      date: new Date(),
      principalEmpID: company.value.companyPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (company.value.client === undefined || company.value.client === null) {
      company.value.client = {};
      company.value.client = newModel;
    }
    const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
    company.value.client.company = this.companies[index];


    let param = {
      model: company.value.client,
      operation: 'save',
      dependants: [],
      facilityId: this.selectedFacility._id,
      company: this.companies[index].hmo
    };
    this.companyCoverService.updateBeneficiaryList(param).then(payload => {







      const comCoverId = company.value.companyPlanId;
      this.companyCoverService.companycovers(this.selectedFacility._id, company.value.company, comCoverId).then(pay => {
        pay.body.company = this.companies[index].hmo;
        if (this.selectedPatientPolicy.companyCovers === undefined) {
          this.selectedPatientPolicy.companyCovers = []
        }
        this.selectedPatientPolicy.companyCovers.push(pay.body);


        this.policyService.update(this.selectedPatientPolicy).then(payload => {
        })


      });










    })
  }
  savePolicyNullClientWithDependant(company) {
    let newModel = {
      catetory: 'DEPENDANT',
      date: new Date(),
      principalEmpID: company.value.companyPlanId,
      othernames: this.selectedPatient.personDetails.firstName + ' ' + this.selectedPatient.personDetails.otherNames,
      principalGender: this.selectedPatient.personDetails.gender.name === 'Male' ? 'M' : 'F',
      serial: 0,
      surname: this.selectedPatient.personDetails.surname,
      address: this.selectedPatient.personDetails.fullAddress,
      email: this.selectedPatient.personDetails.email,
      phone: this.selectedPatient.personDetails.phoneNumber,
      principalstatus: 'Inactive'
    }
    if (company.value.client === undefined || company.value.client === null) {
      company.value.clien = {};
      company.value.client = newModel;
    }
    const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
    company.value.client.company = this.companies[index];


    let param = {
      model: undefined,
      operation: 'save',
      dependants: [company.value.client],
      facilityId: this.selectedFacility._id,
      company: this.companies[index].hmo
    };
    this.companyCoverService.updateBeneficiaryList(param).then(payload => {
      const comCoverId = company.value.companyPlanId;
      this.getPersonPolicies();
    })
  }
  savePolicyClient(company) {

    const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
    company.value.client.company = this.companies[index].hmo;
    this.selectedPatientPolicy.companyCovers.push(company.value.client);


    this.policyService.update(this.selectedPatientPolicy).then(payload => {
    })
  }


  onSubmitCompanyCover(company, i) {
    // this.selectedHMO = (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
    //   .controls[this.companyFormArrayIndex]).controls['readOnly'].setValue(true);
    this.selectedHMO = (<FormGroup>(<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray'])
      .controls[this.companyFormArrayIndex]).controls['readOnly'].value;
    //selected patient has no existing policy
    if (this.selectedPatientPolicy === undefined) {
      let newPolicy: any = {};
      let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
      copyPatient = this.trimPerson(copyPatient);

      newPolicy.personId = copyPatient.personDetails;
      const index = this.companies.findIndex(x => x.hmo._id === company.value.company);
      if (company.value.client === null) {
        // selected patient has no existing policy and has no record in the company cover master file
        // add him/her to master file
        // add to company cover to policy and create;
        if (company.value.isPrincipal) {
          this.saveNullPolicyNullClientWithPrincipal(company);
        } else {
          this.saveNullPolicyNullClientWithDependant(company);
        }
      } else {
        this.saveNullPolicyClient(company, newPolicy, index)
      }
    } else {
      if (company.value.client === null) {
        if (company.value.isPrincipal) {
          this.savePolicyNullClientWithPrincipal(company)
        } else {
          this.savePolicyNullClientWithDependant(company);
        }
      } else {
        this.savePolicyClient(company);
      }

    }
  }
  onSubmitFamilyCover(family, i) {
    // this.selectedHMO = (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
    //   .controls[this.familyFormArrayIndex]).controls['readOnly'].setValue(true);
    this.selectedHMO = (<FormGroup>(<FormArray>this.familyCoverPlanForm.controls['dependantArray'])
      .controls[this.familyFormArrayIndex]).controls['readOnly'].value;
    if (this.selectedPatientPolicy === undefined) {
      let newPolicy: any = {};
      let copyPatient = JSON.parse(JSON.stringify(this.selectedPatient));
      copyPatient = this.trimPerson(copyPatient);

      newPolicy.personId = copyPatient.personDetails;
      let copyCover = JSON.parse(JSON.stringify(this.selectedFamilyCover));
      delete copyCover._id;
      delete copyCover.updatedAt;
      delete copyCover.createdAt;
      copyCover.facilityId = this.selectedFacility._id;
      newPolicy.familyCovers = [copyCover];
      this.policyService.create(newPolicy).then(payload => {
      })

    } else {
      let copyCover = JSON.parse(JSON.stringify(this.selectedFamilyCover));
      delete copyCover._id;
      delete copyCover.updatedAt;
      delete copyCover.createdAt;
      copyCover.facilityId = this.selectedFacility._id;
      this.selectedPatientPolicy.familyCovers.push(copyCover);
      this.policyService.update(this.selectedPatientPolicy).then(payload => {
      })
    }
  }
  isLastChild(i) {
    const len = (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length;
    if (i === (len - 1)) {
      return true;
    }
    return false;
  }
  isCompanyLastChild(i) {
    const len = (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length;
    if (i === (len - 1)) {
      return true;
    }
    return false;
  }
  isFamilyLastChild(i) {
    const len = (<FormArray>this.familyCoverPlanForm.controls['dependantArray']).controls.length;
    if (i === (len - 1)) {
      return true;
    }
    return false;
  }
  closeInsurancePlan(insurance, i) {
    (<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.splice(i, 1);
    if ((<FormArray>this.insurancePlanForm.controls['insurancePlanArray']).controls.length === 0) {
      this.insuranceFormArrayIndex = 0;
      this.addInsurancePlan();
    }
  }
  closeCompanyPlan(company, i) {
    (<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.splice(i, 1);
    if ((<FormArray>this.companyCoverPlanForm.controls['companyCoverPlanArray']).controls.length === 0) {
      this.companyFormArrayIndex = 0;
      this.addCompanyCoverPlan()
    }
  }
  formArrayControlChanges(insurance, i) {
    this.insuranceFormArrayIndex = i;
  }
  companyFormArrayControlChanges(insurance, i) {
    this.companyFormArrayIndex = i;
  }
  getRole(client) {
    if (client !== undefined) {

      let filNo = client.filNo;
      if (filNo !== undefined) {
        const filNoLength = filNo.length;
        const lastCharacter = filNo[filNoLength - 1];
        return isNaN(lastCharacter) ? 'D' : 'P';
      }
    } else {
      return '';
    }
  }
  tabWallet_click() {
    this.tabWallet = true;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabCompany_click() {
    this.tabWallet = false;
    this.tabCompany = true;
    this.tabFamily = false;
    this.tabInsurance = false;
  }
  tabFamily_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = true;
    this.tabInsurance = false;
  }
  tabInsurance_click() {
    this.tabWallet = false;
    this.tabCompany = false;
    this.tabFamily = false;
    this.tabInsurance = true;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  private _notification(type: string, text: string): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
