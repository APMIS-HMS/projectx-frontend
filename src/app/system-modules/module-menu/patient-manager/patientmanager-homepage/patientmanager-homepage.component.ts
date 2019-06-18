import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { EMAIL_REGEX } from 'app/shared-module/helpers/global-config';
import {
    NUMERIC_REGEX,
    ALPHABET_REGEX,
    BloodGroups,
    Genotypes
} from './../../../../shared-module/helpers/global-config';
import { FacilityCompanyCoverService } from './../../../../services/facility-manager/setup/facility-company-cover.service';
import { CountryServiceFacadeService } from './../../../service-facade/country-service-facade.service';
import { TitleGenderFacadeService } from 'app/system-modules/service-facade/title-gender-facade.service';
import {
    Component,
    OnInit,
    EventEmitter,
    ElementRef,
    ViewChild,
    Output,
    OnChanges,
    Input,
    SimpleChanges,
    SimpleChange
} from '@angular/core';
// tslint:disable-next-line:max-line-length
import {
    PatientService,
    PersonService,
    FacilitiesService,
    FacilitiesServiceCategoryService,
    HmoService,
    GenderService,
    RelationshipService,
    CountriesService,
    TitleService,
    TagService
} from '../../../../services/facility-manager/setup/index';
import { FacilityFamilyCoverService } from './../../../../services/facility-manager/setup/facility-family-cover.service';
import { Facility, Patient, Gender, Relationship, Employee, Person, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { differenceInDays, differenceInMonths, differenceInWeeks, differenceInYears } from 'date-fns';
import { IPagerSource } from '../../../../core-ui-modules/ui-components/PagerComponent';

@Component({
    selector: 'app-patientmanager-homepage',
    templateUrl: './patientmanager-homepage.component.html',
    styleUrls: ['./patientmanager-homepage.component.scss']
})
export class PatientmanagerHomepageComponent implements OnInit, OnChanges {
    selectedValue: string;
    nextOfKinForm: FormGroup;
    patientEditForm: FormGroup;
    paginationObj: IPagerSource = { totalPages: 0, totalRecord: 0, pageSize: 15, currentPage: 0 };

    isEdit = false;
    tabWallet = false;
    tabInsurance = true;
    tabCompany = false;
    tabFamily = false;
    button;

    editPatient = false;
    payPlan = false;
    newUpload = false;
    @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
    @Output() empDetail: EventEmitter<string> = new EventEmitter<string>();
    @Input() resetData: Boolean;
    @Input() searchedPatients: any;
    @Input() searchEmpty: any;
    @Output() resetDataNew: EventEmitter<Boolean> = new EventEmitter<Boolean>();
    @ViewChild('fileInput') fileInput: ElementRef;

    facility: Facility = <Facility>{};
    user: User = <User>{};
    loginEmployee: Employee = <Employee>{};
    patients: Patient[] = [];
    genders: any[] = [];
    relationships: Relationship[] = [];
    selectedPatient: any = <any>{};
    searchControl = new FormControl();
    loading = false;
    countries: any = [];
    states: any = [];
    lgas: any = [];
    cities: any = [];
    titles: any = [];
    bloodGroups: any[] = [];
    genotypes: any[] = [];

    patientToEdit;

    selectedIndex: any = 0;
    tabGroup: any;

    tagName = new FormControl('', [
        <any>Validators.required,
        <any>Validators.minLength(3),
        <any>Validators.maxLength(50)
    ]);
    tag;
    tags;
    changetagButton: boolean = false;

    walletPlanPrice = new FormControl('', Validators.required);
    walletPlan = new FormControl('', Validators.required);
    walletPlanCheck = new FormControl('');
    insuranceId = new FormControl('', Validators.required);
    hmoPlan = new FormControl('', Validators.required);
    hmoPlanId = new FormControl('', Validators.required);
    hmoPlanPrice = new FormControl('', Validators.required);
    hmoPlanCheck = new FormControl('');
    ccPlan = new FormControl('', Validators.required);
    ccPlanId = new FormControl('', Validators.required);
    ccPlanCheck = new FormControl('');
    employeeId = new FormControl('', Validators.required);
    familyPlanId = new FormControl('', Validators.required);
    familyPlanCheck = new FormControl('');
    faPlanPrice = new FormControl('');
    faPlan = new FormControl('');
    faFileNo = new FormControl('');
    isDefault = new FormControl('');
    identity = new FormControl('');
    patient: any;
    family: any;
    familyClientId: any;

    principalName;
    principalPersonId;
    principalFamilyId;
    noPatientId;

    companyFacilities: any;
    loginCompanyListObject: any = {};
    companyEnrolleList;
    filteredccs: Observable<any[]>;

    filteredHmos: Observable<any[]>;
    dictionaries;
    showSearchResult: boolean = false;
    hmos;

    services: any;
    servicePricePlans: any;

    pageSize = 1;
    index: any = 0;
    limit: any = 10;
    showLoadMore = true;
    total: any = 0;
    updatePatientBtnText = 'Update';
    loadMoreText = '';
    btnLabel = 'Add Tag';
    tagLoader: boolean = false;

    mainErr: boolean = true;
    errMsg: string;

    bulkUpload: boolean = false;

    constructor(
        private patientService: PatientService,
        private personService: PersonService,
        private facilityService: FacilitiesService,
        private locker: CoolLocalStorage,
        private router: Router,
        private route: ActivatedRoute,
        private toast: ToastsManager,
        private genderService: TitleGenderFacadeService,
        private relationshipService: RelationshipService,
        private formBuilder: FormBuilder,
        private _countryService: CountriesService,
        private systemService: SystemModuleService,
        private authFacadeService: AuthFacadeService,
        private hmoService: HmoService,
        private _titleService: TitleService,
        private countryFacadeService: CountryServiceFacadeService,
        private _facilitiesServiceCategoryService: FacilitiesServiceCategoryService,
        private familyCoverService: FacilityFamilyCoverService,
        private tagService: TagService,
        private companyCoverService: FacilityCompanyCoverService
    ) {
        this.bloodGroups = BloodGroups;
        this.genotypes = Genotypes;
        this.facility = <Facility>this.locker.getObject('selectedFacility');
        this.systemService.on();
        this.patientService.listner.subscribe((payload) => {
            this.pageSize = 1;
            this.index = 0;
            this.showLoadMore = true;
            this.total = 0;
            this.patients = [];
            this.getPatients(this.limit);
        });
        this.patientService.createListener.subscribe(
            (payload) => {
                this.pageSize = 1;
                this.index = 0;
                this.showLoadMore = true;
                this.total = 0;
                this.patients = [];
                this.getPatients(this.limit);
                const msg =
                    payload.personDetails.lastName + ' ' + payload.personDetails.firstName + ' created successfully!';
                this._notification('Success', msg);
            },
            (error) => { }
        );

		/* const away = this.searchControl.valueChanges
          .debounceTime(400)
          .distinctUntilChanged()
          .switchMap((term: Patient[]) => this.patientService.searchPatient(this.facility._id, this.searchControl.value));

        away.subscribe((payload: any) => {
          this.patients = payload.body;
        }); */

        this.filteredHmos = this.hmoPlanId.valueChanges.pipe(
            startWith(''),
            map((hmo: any) => (hmo ? this.filterHmos(hmo) : this.hmos.slice()))
        );

        this.filteredccs = this.ccPlanId.valueChanges.pipe(
            startWith(''),
            map((cc: any) => (cc ? this.filterCCs(cc) : this.companyFacilities.slice()))
        );

        this.tagName.valueChanges.debounceTime(200).distinctUntilChanged().subscribe((payload) => {
            if (payload.length >= 3) {
                this.showSearchResult = true;
                this.tagService
                    .suggestPatientTags({
                        query: {
                            facilityId: this.facility._id,
                            word: payload
                        }
                    })
                    .then((suggestPayload) => {
                        this.dictionaries = suggestPayload;
                    });
            } else {
                this.showSearchResult = false;
            }
        });
    }

	/* searchPatients(searchText: string) {
      this.searchControl.setValue(searchText);
    } */
    getGender() {
        this.genderService.getGenders().then((payload: any) => {
            this.genders = payload;
        }, error => {
            this.getGender();
        })
    }

    getRelationships() {
        this.relationshipService.find({}).then(payload => {
            this.relationships = payload.data;
        }, error => {
            this.getRelationships();
        })
    }

    setAppointment(patient) {
        if (patient !== undefined && this.loginEmployee !== undefined) {
            this.router.navigate(['/dashboard/clinic/schedule-appointment', patient._id, this.loginEmployee._id]);
        }
    }

    ngOnInit() {
        this.systemService.off();
        this.pageInView.emit('Patient Manager');
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            this.loginEmployee = payload;
        })
        this.user = <User>this.locker.getObject('auth');
        this.getGender();
        this.getRelationships();
        // this.facility = <Facility>this.locker.getObject('selectedFacility');
        // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
        // this.getPatients(this.limit);
        this._getAllCountries();
        this._getAllTitles();

        this.gethmos();
        this.getLoginCompanyList();
        this.getCashPlans();

        this.systemService.currentMessage.subscribe((message: any) => {
            if (message) {
                /* this.pageSize = 1;
                  this.index = 0;
                  this.showLoadMore = true;
                  this.total = 0;
                  this.patients = [];
                  this.getPatients(); */
                this.getPatients(this.limit);
                this.slideEdit(message);
            }
        });

        this.patientEditForm = this.formBuilder.group({
            title: ['', [<any>Validators.required]],
            firstName: ['', [<any>Validators.required]],
            lastName: ['', [<any>Validators.required]],
            email: [{ value: '', disabled: false }/*, [<any>Validators.required]*/],
            phoneNumber: [{ value: '', disabled: false }, [<any>Validators.required]],
            dob: ['', [<any>Validators.required]],
            gender: ['', [<any>Validators.required]],
            country: ['', [<any>Validators.required]],
            state: ['', [<any>Validators.required]],
            city: ['', [<any>Validators.required]],
            bloodGroup: ['N/A', []],
            genotype: ['N/A', []],
            lga: ['', [<any>Validators.required]],
            street: ['', [<any>Validators.required]],
            nextOfKin: this.formBuilder.array([])
        });


        //   this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
        //     this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
        //         this.contactStates = states;
        //     }).catch(err => { });
        // });
        // this.frmNewEmp2.controls['empContactState'].valueChanges.subscribe((value) => {
        //     let country = this.frmNewEmp2.controls['empCountry'].value;
        //     this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
        //         this.cities = lgsAndCities.cities;
        //     }).catch(err => {
        //         console.log(err);
        //     });
        // });

        this.patientEditForm.controls['country'].valueChanges.subscribe(val => {
            this.countryFacadeService.getOnlyStates(val, true).then((states: any) => {
                this.states = states;
            }).catch(err => {
            });

        });

        this.patientEditForm.controls['state'].valueChanges.subscribe(val => {
            // if (val !== null && val !== undefined) {
            //   this.lgas = this.states.filter(x => x._id === val._id)[0].lgs;
            //   this.cities = this.states.filter(x => x._id === val._id)[0].cities;
            // }
            const country = this.patientEditForm.controls['country'].value;
            this.countryFacadeService.getOnlyLGAndCities(country, val, true).then((lgsAndCities: any) => {
                this.cities = lgsAndCities.cities;
                this.lgas = lgsAndCities.lgs;
            }).catch(err => {
            });
        });

    }

    ngOnChanges(changes: SimpleChanges) {
        this.index = 0;
        if (changes) {
            if (this.resetData === true) {
                this.getPatients();
                this.showLoadMore = true;
            }
            if (changes.searchedPatients.currentValue) {
                this.patients = changes.searchedPatients.currentValue;
                this.total = this.patients.length;
                if (this.total <= this.patients.length) {
                    this.showLoadMore = false;
                } else {
                    this.showLoadMore = true;
                }
                this.getShowing();
            }
            if (changes.searchEmpty) {
                if (changes.searchEmpty.currentValue === true) {
                    this.getPatients();
                    this.showLoadMore = true;
                } else {

                }
            }
        }

    }

    newTag(valid: boolean) {
        this.systemService.on();
        this.tagLoader = true;
        const tag: any = <any>{};
        if (this.identity.value === true) {
            tag.tagType = 'identification';
        }
        tag.identity = this.identity.value;
        tag.name = this.tagName.value;
        tag.facilityId = this.facility._id;
        tag.patientId = this.patientToEdit._id;
        this.tagService.createSuggestedPatientTags(tag).then(payl => {
            this.systemService.off();
            if (payl.status === "error") {
                this.mainErr = false;
                this.errMsg = payl.message;
            } else {
                this.patientToEdit.tags = payl.data.tags;
            }
            this.tagLoader = false;
            this.tagName.setValue('');
            this.identity.reset();
        });
    }

    hideSuggestions() {
        this.showSearchResult = false;
    }

    fillingWithSearchInfo(tag) {
        this.tagName.setValue(tag.name);
    }

    combineTagsToString(tags) {
        let length = tags.length;
        let tagsString = '';
        let arr = [];
        let name;
        while (length--) {
            if (tags[length].tagType !== undefined) {
                name = tags[length].name + ' (i)';
            } else {
                name = tags[length].name;
            }
            arr.push(name);
        }
        return arr.join(', ');
    }

    removeTag(tag) {
        const toDelete = this.patientToEdit.tags.findIndex(x => x._id === tag._id);
        if (toDelete > -1) {
            this.patientToEdit.tags.splice(toDelete, 1);
            this.patientService.patch(this.patientToEdit._id, this.patientToEdit, {}).then(deletePayload => {
            }).catch(err => {
            });
        }

    }

    changeButton() {
        if (this.identity.value === true) {
            this.btnLabel = 'Create Tag';
        } else {
            this.btnLabel = 'Add Tag';
        }
    }

    sortPatientsByName() {
        const sortedPatient = this.patients;
        sortedPatient.sort(function (x, y) {
            const xLastName = x.personDetails.lastName.toLowerCase();
            const yLastName = y.personDetails.lastName.toLowerCase();
            if (xLastName < yLastName) {
                return -1;
            }
            if (xLastName > yLastName) {
                return 1;
            }
            return 0;
        });
    }

    sortPatientsByAge() {
        this.patients.sort(function (x, y) {
            return x.personDetails.age - y.personDetails.age;
        });
    }

    sortPatientsByGender() {
        const sortedPatient = this.patients;
        sortedPatient.sort(function (x, y) {
            const xGender = x.personDetails.gender.name.toLowerCase();
            const yGender = y.personDetails.gender.name.toLowerCase();
            if (xGender < yGender) {
                return -1;
            }
            if (xGender > yGender) {
                return 1;
            }
            return 0;
        });
    }

    navEpDetail(patient) {
        this.locker.setObject('patient', patient);
        this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', patient.personId]).then(() => {
            this.patientService.announcePatient(patient);
        }).catch(err => {
        });
    }

    getPatients(limit?) {
        this.loading = true;
        this.systemService.on();
        this.patientService.find({
            query: {
                facilityId: this.facility._id,
                $limit: this.paginationObj.pageSize,// this.limit,
                $skip: this.paginationObj.currentPage * this.paginationObj.pageSize, // this.index * this.limit,
                $sort: { createdAt: -1 }
            }
        }).then(payload => {
            this.systemService.off();
            this.loading = false;
            this.total = payload.total;
            //this.paginationObj = { totalPages : payload.total, currentPage : this.paginationObj.currentPage , pageSize :this.paginationObj.pageSize};
            this.paginationObj.totalRecord = payload.total;

            //this.paginationObj.
            this.patients = payload.data;
            /*if (payload.data.length > 0) {
                if (this.resetData !== true) {
                    this.patients.push(...payload.data);
                } else {
                    this.resetData = false;
                    this.resetDataNew.emit(this.resetData);

                }
                if (this.total <= this.patients.length) {
                    this.showLoadMore = false;
                }
            } else {
                this.patients = [];
            }*/
            this.getShowing();
        })
            .catch((errr) => {
                console.dir(errr);
                this.systemService.off();
                this.loading = false;
            });
        //this.index++;
    }

    getPatientCovers(patientId) {
        this.patientService
            .find({
                facilityId: this.facility._id,
                patientId: patientId
            })
            .then((payload) => { });
    }

    getCashPlans() {
        this._facilitiesServiceCategoryService
            .find({
                query: {
                    facilityId: this.facility._id,
                    'categories.name': 'Medical Records',
                    $select: ['_id', 'categories.name', 'categories._id']
                }
            })
            .then((payload) => {
                const cat = payload.data[0].categories;

                const cate = cat.filter((x) => x.name === 'Medical Records');
                this.selectCategory(cate[0]);
            });
    }

    selectCategory(category) {
        if (category._id !== undefined) {
            this._facilitiesServiceCategoryService
                .allServices({
                    query: {
                        facilityId: this.facility._id,
                        categoryId: category._id
                    }
                })
                .then((payload) => {
                    this.services = payload.services;
                });
        } else {
        }
    }

    getServicePlans(service) {
        this.servicePricePlans = service.price;
    }

    filterHmos(val: any) {
        if (val.hmoName === undefined) {
            return this.hmos.filter((hmo) => hmo.hmoName.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.hmos.filter((hmo) => hmo.hmoName.toLowerCase().indexOf(val.hmoName.toLowerCase()) === 0);
        }
    }

    gethmos() {
        this.hmoService
            .getHmos({
                query: {
                    facilityId: this.facility._id
                }
            })
            .then((payload) => {
                this.hmos = payload;
            })
            .catch((err) => { });
    }

    displayFn(hmo: any): string {
        return hmo ? hmo.hmoName : hmo;
    }

    displayFnc(cc) {
        return cc ? cc.name : cc;
    }

    filterCCs(val: any) {
        if (val.name === undefined) {
            return this.companyFacilities.filter((cc) => cc.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
        } else {
            return this.companyFacilities.filter((cc) => cc.name.toLowerCase().indexOf(val.name.toLowerCase()) === 0);
        }
    }

    getLoginCompanyList() {
        this.companyCoverService
            .find({
                query: {
                    'facilityId._id': this.facility._id
                }
            })
            .then((payload) => {
                if (payload.data.length > 0) {
                    this.loginCompanyListObject = payload.data[0];
                    this._getCompanyFacilities(payload.data[0]);
                } else {
                    this.loginCompanyListObject.facilityId = this.facility;
                    this.loginCompanyListObject.companyCovers = [];
                }
            });
    }

    _getCompanyFacilities(facilityCompany) {
        this.companyEnrolleList = facilityCompany.companyCovers.map((obj) => {
            return { company: obj.company, enrolles: obj.enrolleeList };
        });
        const flist = this.companyEnrolleList.map((obj) => {
            return obj.company;
        });
        this.facilityService
            .find({
                query: { _id: { $in: flist } }
            })
            .then((payload) => {
                this.companyFacilities = payload.data;
            });
    }

    getShowing() {
        const ret = this.index * this.limit;
        if (ret >= this.total && this.index > 0) {
            this.loadMoreText = 'Showing ' + this.total + ' of ' + this.total + ' records';
            return;
        }
        this.loadMoreText = 'Showing ' + ret + ' of ' + this.total + ' records';
    }

	/* onScroll() {
      this.pageSize = this.pageSize + 1;
      const limit = this.limit * this.pageSize;
      this.getPatients(limit);
    }
    onScrollUp() {
      if (this.pageSize > 1) {
        this.pageSize = this.pageSize - 1;
      }
      const limit = this.limit * this.pageSize;
      this.getPatients(limit);
    } */
    loadMore() {
        this.getPatients();
    }

    slideEdit(patient) {
        this.patientToEdit = patient;
        this.patientService.get(patient._id, {}).then(payload => {
            this.selectedPatient = payload.personDetails;
            this.patient = payload;
            this.editPatient = true;
            if (this.selectedPatient.nextOfKin.length > 0) {
                const nextOfKincontrol = <FormArray>this.patientEditForm.controls['nextOfKin'];
                this.selectedPatient.nextOfKin.forEach((nextOfKin, i) => {
                    nextOfKincontrol.push(this._populateNextOfKin(nextOfKin));
                });
            }

            this._populateAndSelectData(this.selectedPatient);
        })
    }

    updatePatient(value: any, valid: boolean) {
        this.updatePatientBtnText = 'Updating... <i class="fa fa-spinner fa-spin"></i>';
        const nextOfKinArray = [];
         this.selectedPatient['title'] = value.title;
        this.selectedPatient['firstName'] = value.firstName;
        this.selectedPatient['lastName'] = value.lastName;
        this.selectedPatient['personFullName'] = value.firstName + ' ' + value.lastName;
        this.selectedPatient['gender'] = value.gender;
        this.selectedPatient['genderId'] = value.gender._id;
        this.selectedPatient['dateOfBirth'] = value.dob;
        this.selectedPatient['bloodGroup'] = value.bloodGroup;
        this.selectedPatient['genotype'] = value.genotype;
        this.selectedPatient['nationalityObject'] = {
            country: value.country.name,
            lga: value.lga.name,
            state: value.state.name
        };
        this.selectedPatient['homeAddress'] = {
            city: value.city,
            country: value.country,
            lga: value.lga,
            state: value.state,
            street: value.street
        };
        this.selectedPatient['fullAddress'] = value.street + ', ' + value.city.name + ', ' + value.state.name + ', ' + value.country.name;

        if (value.nextOfKin.length > 0) {
            value.nextOfKin.forEach(element => {
                nextOfKinArray.push(element);
            });
        }
        this.selectedPatient['nextOfKin'] = nextOfKinArray;

        const patientIndex = this.patients.findIndex(p => p.personDetails._id === this.selectedPatient._id);
        this.personService.patch(this.selectedPatient._id, this.selectedPatient, {}).then(res => {

            this.updatePatientBtnText = 'Update';
            this.patients[patientIndex].personDetails = res;
            this.getPatients();
            this.close_onClick();
            this.systemService.announceSweetProxy('Patient details has been updated successfully.', 'success');
        }).catch(err => {

            this.updatePatientBtnText = 'Update';
            this.systemService.announceSweetProxy('There was an error updating user record, Please try again later.', 'error');
        });
    }

    idTags(patient) {
        this.slideEdit(patient);
        this.selectedIndex = 1;
    }

    openBulkUploadModal() {
        this.bulkUpload = true;
    }

    private _populateAndSelectData(value: any) {
        if (value.homeAddress) {
            this.patientEditForm.controls['street'].setValue(value.homeAddress.street);
            this.patientEditForm.controls['country'].setValue(value.homeAddress.country);
            this.patientEditForm.controls['state'].setValue(value.homeAddress.state);
            this.patientEditForm.controls['city'].setValue(value.homeAddress.city);
            this.patientEditForm.controls['lga'].setValue(value.homeAddress.lga);
        }

        if (value.email !== undefined) {
            this.patientEditForm.controls['email'].disable();
            // this.patientEditForm.get('email').disable();
        }

        if (value.bloodGroup !== undefined) {
            this.patientEditForm.controls['bloodGroup'].setValue(value.bloodGroup);
        } else {
            this.patientEditForm.controls['bloodGroup'].setValue('N/A');
        }
        if (value.genotype !== undefined) {
            this.patientEditForm.controls['genotype'].setValue(value.genotype);
        } else {
            this.patientEditForm.controls['genotype'].setValue('N/A');
        }

        this.patientEditForm.controls['phoneNumber'].setValue(value.primaryContactPhoneNo);
        this.patientEditForm.controls['dob'].setValue(value.dateOfBirth);

        this.patientEditForm.controls['title'].setValue(value.title);
        this.patientEditForm.controls['gender'].setValue(value.gender);
    }

    isEditFn(patient?, cover?, button?) {
        this.isEdit = !this.isEdit;
        this.button = button;
        if (cover === 'wallet') {
            this.tabWallet_click();
        } else if (cover === 'company') {
            this.tabCompany_click();
        } else if (cover === 'insurance') {
            this.tabInsurance_click();
        } else if (cover === 'family') {
            this.tabFamily_click();
        } else {
        }
    }

    backBtn() {
        this.isEdit = false;
    }

    next(cover) {
        this.systemService.on();
        this.loading = true;
        const data = JSON.parse(JSON.stringify(this.patient.paymentPlan));
        if (this.isDefault.value === true) {
            const index = data.findIndex(c => c.isDefault === true);
            if (index > -1) {
                data[index].isDefault = false;
            }
        }
        if (this.tabWallet === true) {
            data.push({
                planType: cover,
                bearerPersonId: this.patient.personDetails._id,
                isDefault: Boolean(this.isDefault.value)
            });
            this.UpdatePaymentPlan(data);
        } else if (this.tabInsurance === true) {
            this.hmoService.find({ query: { 'facilityId': this.facility._id } }).then(payload => {
                if (payload.data.length > 0) {
                    const facHmo = payload.data[0];
                    const index = facHmo.hmos.findIndex(x => x.hmo === this.hmoPlanId.value.hmoId);
                    if (index > -1) {
                        if (facHmo.hmos[index].enrolleeList.length > 0) {
                            const bene = [];
                            for (let s = 0; s < facHmo.hmos[index].enrolleeList.length; s++) {
                                const hmo = facHmo.hmos[index].hmo;
                                bene.push(...facHmo.hmos[index].enrolleeList[s].enrollees);
                            }
                            const fil = bene.filter(x => x.filNo === this.insuranceId.value);

                            if (fil.length > 0) {
                                if (fil[0].status.toLowerCase() !== 'active') {
                                    this.systemService.off();
                                    this.loading = false;
                                    const text = 'Insurance Id does not have an active status for the selected HMO';
                                    this.errMsg = text;
                                    this.mainErr = false;
                                    // this.systemService
                                    //   .announceSweetProxy(text, 'error');
                                    return false;
                                } else {
                                    if (fil[0].firstname !== this.patient.personDetails.firstName ||
                                        fil[0].surname !== this.patient.personDetails.lastName) {
                                        this.systemService.off();
                                        this.loading = false;
                                        const text = 'Information of policy doesn\'t match patient details. Please check and try again! ';
                                        this.errMsg = text;
                                        this.mainErr = false;
                                        return false;
                                        // this.systemService
                                        //   .announceSweetProxy(text, 'error');
                                    } else {
                                        this.systemService.off();
                                        data.push({
                                            planType: cover,
                                            bearerPersonId: this.patient.personDetails._id,
                                            isDefault: Boolean(this.isDefault.value),
                                            planDetails: {
                                                hmoId: this.hmoPlanId.value.hmoId,
                                                principalId: this.insuranceId.value
                                            }
                                        });
                                        this.UpdatePaymentPlan(data);
                                    }
                                }
                            } else {
                                this.systemService.off();
                                this.loading = false;
                                const text = 'Insurance Id does not exist for the selected HMO';
                                this.errMsg = text;
                                this.mainErr = false;
                                // this.systemService
                                //   .announceSweetProxy(text, 'error');
                                return false;
                            }
                        }
                    }
                }
            }).catch(err => {
            });

        } else if (this.tabCompany === true) {
            this.companyCoverService.find({
                query: {
                    'facilityId._id': this.facility._id
                }
            }).then(payload => {
                const companyCover = payload.data[0];
                const index = companyCover.companyCovers.findIndex(x => x.company === this.ccPlanId.value._id);
                if (index > -1) {
                    if (companyCover.companyCovers[index].enrolleeList.length > 0) {
                        const bene = [];
                        for (let s = 0; s < companyCover.companyCovers[index].enrolleeList.length; s++) {
                            const company = companyCover.companyCovers[index].company
                            bene.push(...companyCover.companyCovers[index].enrolleeList[s].enrollees);
                        }
                        const fil = bene.filter(x => x.filNo === this.employeeId.value);
                        if (fil.length > 0) {
                            if (fil[0].status.toLowerCase() !== 'active') {
                                this.systemService.off();
                                const text = 'Employee Id does not have an active status for the selected Company';
                                this.errMsg = text;
                                this.mainErr = false;
                                this.systemService
                                    .announceSweetProxy(text, 'error');
                            } else {
                                if (fil[0].firstname !== this.patient.personDetails.firstName ||
                                    fil[0].surname !== this.patient.personDetails.lastName) {
                                    this.systemService.off();
                                    const text = 'Employee Id does not have an active status for the selected Company';
                                    this.errMsg = text;
                                    this.mainErr = false;
                                    this.systemService
                                        .announceSweetProxy(text, 'error');
                                } else {
                                    this.systemService.off();
                                    data.push({
                                        planType: cover,
                                        bearerPersonId: this.patient.personDetails._id,
                                        isDefault: Boolean(this.isDefault.value),
                                        planDetails: {
                                            companyId: this.ccPlanId.value._id,
                                            principalId: this.employeeId.value
                                        }
                                    });
                                    this.UpdatePaymentPlan(data);
                                }
                            }
                        } else {
                            this.systemService.off();
                            const text = 'Employee Id does not exist for the selected Company';
                            this.errMsg = text;
                            this.mainErr = false;
                            this.systemService
                                .announceSweetProxy(text, 'error');
                        }
                    }
                }
            })
        } else if (this.tabFamily === true) {
            this.familyClientId = this.faFileNo.value;
            console.log(this.familyPlanId.value);
            this.familyCoverService.find({ 
                query: { 
                    'facilityId': this.facility._id
                    // 'familyCovers.filNo': this.familyPlanId.value 
                } 
            }).then(payload => {
                console.log(payload);
                if (payload.data.length > 0) {
                    const facFamilyCover = payload.data[0];
                    const selectedFamilyCover = facFamilyCover;
                    const beneficiaries = facFamilyCover.familyCovers;
                    const info = beneficiaries.filter(x => x.filNo === this.familyPlanId.value);
                    if (info.length === 0) {
                        this.systemService.off();
                        this.loading = false;
                        const text = 'Principal Id doesn\'t exist';
                        console.log(text);
                        this.errMsg = text;
                        this.mainErr = false;
                        // this.systemService.announceSweetProxy('Principal Id doesn\'t exist', 'error');
                    } else {
                        const filEx = beneficiaries.filter(x => x.filNo === this.familyClientId);
                        if (filEx.length > 0) {
                            if (filEx[0].patientId !== undefined) {
                                this.loading = false;
                                this.systemService.off();
                                const text = 'Client Id has already been assigned to a patient. Please try another Client Id';
                                this.errMsg = text;
                                this.mainErr = false;
                                // this.systemService.announceSweetProxy
                                // ('Client Id has already been assigned to a patient. Please try another Client Id', 'error');
                            } else {
                                if (info[0].patientId === undefined) {
                                    if (this.getRole(this.familyClientId) !== 'P') {
                                        this.systemService.off();
                                        this.loading = false;
                                        const text = 'Principal ID does not exist as a patient. Please register principal.';
                                        console.log(text);
                                        this.errMsg = text;
                                        this.mainErr = false;
                                        // this.systemService.announceSweetProxy
                                        // ('Principal doesn\'t exist as a patient. Please register principal.', 'error');
                                        return false;
                                    } else {
                                        this.noPatientId = true;
                                    }
                                }
                                this.principalName = info[0].othernames + ' ' + info[0].surname;
                                this.principalPersonId = (this.noPatientId !== true) ? info[0].patientObject.personDetails._id : '';
                                this.principalFamilyId = facFamilyCover._id;
                                this.loading = false;
                                data.push({
                                    planType: cover,
                                    bearerPersonId: this.patient.personDetails._id,
                                    isDefault: Boolean(this.isDefault.value),
                                    planDetails: {
                                        principalId: this.familyPlanId.value,
                                        principalName: this.principalName.value,
                                        familyId: this.principalFamilyId.value
                                    }
                                });

                                this.UpdatePaymentPlan(data);
                            }
                        } else {
                            this.loading = false;
                            this.systemService.off();
                            const text = 'Client Id doesn\'t exist in Principal family';
                            this.errMsg = text;
                            this.mainErr = false;
                            // this.systemService.announceSweetProxy
                            // ('Client Id doesn\'t exist in Principal family', 'error');
                        }
                    }
                }
            }).catch(err => {
            });

        }
    }

    UpdatePaymentPlan(data) {
        this.patientService.patch(this.patient._id, {
            paymentPlan: data
        }, {}).then(payload => {
            this.systemService.off();
            this.loading = false;
            this.patient = payload;
            this.systemService.announceSweetProxy('Payment Methods successfully updated', 'success');
            this.backBtn();
        });
    }

    getRole(beneficiary) {
        const filNo = beneficiary;
        if (filNo !== undefined) {
            const filNoLength = filNo.length;
            const lastCharacter = filNo[filNoLength - 1];
            return isNaN(lastCharacter) ? 'D' : 'P';
        }
    }

    private _populateNextOfKin(nextOfKin) {
        return this.formBuilder.group({
            address: [nextOfKin.address],
            email: [nextOfKin.email],
            fullName: [nextOfKin.fullName],
            phoneNumber: [nextOfKin.phoneNumber],
            relationship: [nextOfKin.relationship]
        });
    }

    private _initNextOfKin() {
        return this.formBuilder.group({
            address: ['', [<any>Validators.required]],
            email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
            fullName: ['', [<any>Validators.required, <any>Validators.pattern(ALPHABET_REGEX)]],
            phoneNumber: ['', [<any>Validators.required, <any>Validators.pattern(NUMERIC_REGEX)]],
            relationship: ['', [<any>Validators.required]]
        });
    }

    addNewNextOfKin() {
        const control = <FormArray>this.patientEditForm.controls['nextOfKin'];
        control.push(this._initNextOfKin());
    }

    payPlanShow(patient) {
        this.selectedPatient = patient;
        this.payPlan = true;
    }

    removeNextOfKin(i: number) {
        const control = <FormArray>this.patientEditForm.controls['nextOfKin'];
        control.removeAt(i);
    }

    close_onClick() {
        this.editPatient = false;
        this.systemService.changeMessage(null);
        this.payPlan = false;
        this.newUpload = false;
        this.bulkUpload = false;
        this.selectedIndex = 0;
        // Reset the next of kin form array
        this.patientEditForm.controls['nextOfKin'] = this.formBuilder.array([]);
    }

    private _getAllCountries() {
        this._countryService.findAll()
            .then(res => {
                this.countries = res.data;
            }).catch(err => console.log());
    }

    private _getAllTitles() {
        this.genderService.getTitles()
            .then(res => {
                this.titles = res;
            }).catch(err => {
                // this._getAllTitles();
            });
    }

    // Notification
    private _notification(type: string, text: string): void {
        this.facilityService.announceNotification({
            users: [this.user._id],
            type: type,
            text: text
        });
    }

    onChange(e) {
        // upload stuff
    }

    showImageBrowseDlg() {
        this.fileInput.nativeElement.click()
    }

    newUpload_show(patient) {
        this.selectedPatient = patient;
        this.newUpload = true;
    }

    compareState(l1: any, l2: any) {
        return l1.includes(l2);
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

    pageClickedEvent(index: number) {
        // goto next page using the current index
        this.paginationObj.currentPage = index;
        this.getPatients();
    }

}
