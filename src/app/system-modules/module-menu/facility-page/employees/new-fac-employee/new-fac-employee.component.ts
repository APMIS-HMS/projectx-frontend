import { error } from 'util';
import { HTML_SAVE_PATIENT } from './../../../../../shared-module/helpers/global-config';
import { TitleCasePipe } from '@angular/common';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CountryServiceFacadeService } from './../../../../service-facade/country-service-facade.service';
import { Component, OnInit, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import { ImageCropperComponent, CropperSettings } from 'ng2-img-cropper';
import {
    ProfessionService, RelationshipService, MaritalStatusService, GenderService, TitleService, CountriesService, EmployeeService,
    PersonService, UserService
} from '../../../../../services/facility-manager/setup/index';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX } from 'app/shared-module/helpers/global-config';
import {
    Facility, Address, Profession, Relationship, Employee, Person, Department, MinorLocation, Gender, Title, Country, User, Role
} from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SecurityQuestionsService } from 'app/services/facility-manager/setup/security-questions.service';

@Component({
    selector: 'app-new-fac-employee',
    templateUrl: './new-fac-employee.component.html',
    styleUrls: ['./new-fac-employee.component.scss']
})
export class NewFacEmployeeComponent implements OnInit {

    securityQuestions: any[] = [];

    isSuccessful = false;
    isSaving = false;
    validating = false;
    duplicate = false;


    mainErr = true;
    skipNok = false;
    errMsg = 'You have unresolved errors';

    selectedPerson: Person = <Person>{};
    user: User = <User>{};
    apmisId_show = true;
    frmNewPerson1_show = false;
    frmNewPerson2_show = false;
    frmNewPerson3_show = false;
    frmNewEmp4_show = false;
    frmPerson_show = false;

    showSecurityQuestions = true;
    validateField = Validators;

    newEmpIdControl = new FormControl();
    public frmNewEmp1: FormGroup;
    public frmNewEmp2: FormGroup;
    public frmNewEmp3: FormGroup;
    public frmNewEmp4: FormGroup;
    public frmPerson: FormGroup;

    @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
    @ViewChild('cropper', undefined)
    cropper: ImageCropperComponent;
    public events: any[] = []; // use later to display form changes
    shouldMoveFirst = false;

    empImg: any;
    cropperSettings: CropperSettings;
    facility: Facility = <Facility>{};
    departments: Department[] = [];
    units: any[] = [];
    minorLocations: MinorLocation[] = [];
    genders: Gender[] = [];
    titles: Title[] = [];
    countries: Country[] = [];
    states: any[] = [];
    contactStates: any = [];
    cities: any[];
    lgs: any[] = [];
    cadres: any[] = [];
    maritalStatuses: any[] = [];
    relationships: Relationship[] = [];
    professions: Profession[] = [];

    nextOfKinReadOnly = false;
    constructor(private formBuilder: FormBuilder,
        private titleService: TitleService,
        private countryService: CountriesService,
        private genderService: GenderService,
        private maritalStatusService: MaritalStatusService,
        private relationshipService: RelationshipService,
        private professionService: ProfessionService,
        private locker: CoolLocalStorage, private employeeService: EmployeeService,
        private personService: PersonService, private userService: UserService,
        private systemModuleService: SystemModuleService,
        private titleCasePipe: TitleCasePipe,
        private securityQuestionService: SecurityQuestionsService,
        private countryFacadeService: CountryServiceFacadeService
    ) {
        this.cropperSettings = new CropperSettings();
        this.cropperSettings.width = 400;
        this.cropperSettings.height = 400;
        this.cropperSettings.croppedWidth = 400;
        this.cropperSettings.croppedHeight = 400;
        this.cropperSettings.canvasWidth = 400;
        this.cropperSettings.canvasHeight = 300;

        this.empImg = {};
    }

    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropper.setImage(image);
        };
        myReader.readAsDataURL(file);
    }
    updatePerson(person: Person) {
        // this.personService.update(person).then(rpayload => {
        //     this.selectedEmployee.employeeDetails = rpayload;
        //     this.close_onClick();
        // });
    }
    previewFile() {
        // this.selectedPerson.profileImage = this.empImg.image;
        // this.updatePerson(this.selectedPerson);
    }

    ngOnInit() {
        this.facility = <Facility>this.locker.getObject('selectedFacility');
        this.departments = this.facility.departments;
        this.minorLocations = this.facility.minorLocations;
        this.prime();
        this.newEmpIdControl.valueChanges.subscribe(value => {
            this.mainErr = true;
            this.errMsg = '';
        });

        this.frmPerson = this.formBuilder.group({
            persontitle: [new Date(), [<any>Validators.required]],
            firstname: ['', [<any>Validators.required, <any>Validators.minLength(3),
            <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            lastname: ['', [<any>Validators.required, <any>Validators.minLength(3),
            <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            gender: [[<any>Validators.minLength(2)]],
            dob: [new Date(), [<any>Validators.required]],
            motherMaidenName: ['', [<any>Validators.required, <any>Validators.minLength(3),
            <any>Validators.maxLength(50), Validators.pattern(ALPHABET_REGEX)]],
            securityQuestion: ['', [<any> this.validateField]],
            securityAnswer: ['', [<any> this.validateField]],
            // email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
            phone: ['', [<any>Validators.required, <any>Validators.pattern(PHONE_REGEX)]]
        });


        this.frmPerson.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.errMsg = '';
                this.mainErr = true;
                this.validating = true;
                this.personService.searchPerson({
                    query: {
                        firstName: value.firstname,
                        lastName: value.lastname,
                        primaryContactPhoneNo: value.phone,
                        motherMaidenName: value.motherMaidenName,
                        isValidating: true
                    }
                }).then(payload => {
                    this.validating = false;
                    if (payload.status === 'success') {
                        this.duplicate = true;
                        this.errMsg = 'Duplicate record detected, please check and try again!';
                        this.mainErr = false;
                    } else {
                        this.duplicate = false;
                    }
                }, error => {
                });
            });







        this.frmNewEmp1 = this.formBuilder.group({
            empTitle: ['', [<any>Validators.required]],
            empFirstName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empOtherNames: ['', [<any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empLastName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(20)]],
            empGender: ['', [<any>Validators.required]],
            fileNumber: ['', [<any>Validators.required]],
            empNationality: ['', [<any>Validators.required]],
            empState: ['', [<any>Validators.required]],
            empLga: ['', [<any>Validators.required]],
            // tslint:disable-next-line:quotemark
            empEmail: ['', [<any>Validators.pattern("^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$"), <any>Validators.required]],
            confirmEmpEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$'),
            <any>Validators.required]],
            empPhonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]

        });

        this.frmNewEmp1.controls['empNationality'].valueChanges.subscribe((value: any) => {

            this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
                this.states = states;
            }).catch(err => { });
        });

        this.frmNewEmp1.controls['empState'].valueChanges.subscribe((value: any) => {
            const country = this.frmNewEmp1.controls['empNationality'].value;
            this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
                this.lgs = lgsAndCities.lgs;
            }).catch(err => {
            });
        });

        this.frmNewEmp2 = this.formBuilder.group({
            empMaritalStatus: ['', [<any>Validators.required]],
            empCountry: ['', [<any>Validators.required]],
            empContactState: ['', [<any>Validators.required]],
            empCity: ['', [<any>Validators.required]],
            empHomeAddress: ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(100)]],
            empDOB: [new Date(), [<any>Validators.required]],
            secQst: ['', []],
            secAns: ['', []]
        });
        this.frmNewEmp2.controls['empCountry'].valueChanges.subscribe((value) => {
            this.countryFacadeService.getOnlyStates(value, true).then((states: any) => {
                this.contactStates = states;
            }).catch(err => { });
        });
        this.frmNewEmp2.controls['empContactState'].valueChanges.subscribe((value) => {
            const country = this.frmNewEmp2.controls['empCountry'].value;
            this.countryFacadeService.getOnlyLGAndCities(country, value, true).then((lgsAndCities: any) => {
                this.cities = lgsAndCities.cities;
            }).catch(err => {
            });
        });
        this.frmNewEmp3 = this.formBuilder.group({

            nok_fullname: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(40)]],
            nok_apmisID: [''],
            nok_relationship: ['', [<any>Validators.required]],
            nok_email: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            nok_phoneNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
            nok_Address: ['', [<any>Validators.required, <any>Validators.minLength(5), <any>Validators.maxLength(100)]]
        });

        const apmisIdObs = this.frmNewEmp3.controls['nok_apmisID'].valueChanges.debounceTime(400)
            .distinctUntilChanged()
            .switchMap((term: Person[]) => this.personService.find({
                query: {
                    apmisId: this.frmNewEmp3.controls['nok_apmisID'].value.toUpperCase()
                }
            }));
        apmisIdObs.subscribe((payload: any) => {
            if (payload.data.length > 0) {
                const person = payload.data[0];
                this.frmNewEmp3.controls['nok_Address'].setValue(person.fullAddress);
                this.frmNewEmp3.controls['nok_email'].setValue(person.email);
                this.frmNewEmp3.controls['nok_fullname'].setValue(person.personFullName);
                this.frmNewEmp3.controls['nok_phoneNo'].setValue(person.phoneNumber);
                this.nextOfKinReadOnly = true;
            } else {
                this.frmNewEmp3.controls['nok_Address'].reset();
                this.frmNewEmp3.controls['nok_email'].reset();
                this.frmNewEmp3.controls['nok_fullname'].reset();
                this.frmNewEmp3.controls['nok_phoneNo'].reset();
                this.nextOfKinReadOnly = false;
            }
        });

        this.frmNewEmp4 = this.formBuilder.group({

            empDept: ['', [<any>Validators.required]],
            empUnit: ['', []],
            empLoc: ['', [<any>Validators.required]],
            empWorkEmail: ['', [<any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$')]],
            empWorkPhonNo: ['', [<any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
            empJobTitle: ['', [<any>Validators.required]],
            empLevel: ['', [<any>Validators.required]]

        });
        this.frmNewEmp4.controls['empDept'].valueChanges.subscribe(value => {
            this.departments.forEach((item, i) => {
                if (value === item._id) {
                    this.units = item.units;
                }
            })
        });
        this.frmNewEmp4.controls['empJobTitle'].valueChanges.subscribe((value) => {
            this.cadres = value.caders;
        });

        this.getSecurityQuestions();

    }
    prime() {
        const profession$ = Observable.fromPromise(this.professionService.findAll());
        const relationship$ = Observable.fromPromise(this.relationshipService.findAll());
        const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
        const gender$ = Observable.fromPromise(this.genderService.findAll());
        const title$ = Observable.fromPromise(this.titleService.findAll());
        const country$ = Observable.fromPromise(this.countryService.findAll());
        Observable.forkJoin([profession$, relationship$, maritalStatus$, gender$, title$, country$]).subscribe((results: any) => {
            this.professions = results[0].data;
            this.relationships = results[1].data;
            this.maritalStatuses = results[2].data;
            this.genders = results[3].data;
            this.titles = results[4].data;
            this.countries = results[5].data;
        });
    }
    validatingPerson() {
        return this.validating && this.duplicate;
    }
    getSecurityQuestions() {
        this.securityQuestionService.find({})
            .then(payload => {
                this.securityQuestions = payload.data;
            }, error => {

            });
    }
    empApmisID() {
        // validate apimisID

        Observable.fromPromise(this.personService.find({
            query: { apmisId: this.newEmpIdControl.value.toUpperCase() }
        })).mergeMap((person: any) => {
            if (person.data.length > 0) {
                this.selectedPerson = person.data[0];
                return Observable.fromPromise(this.employeeService.
                    find({ query: { personId: this.selectedPerson._id, facilityId: this.facility._id } }));
            } else {
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
                return Observable.of(undefined);
            }


        }).subscribe((result: any) => {
            if (result === undefined) {
                this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
                this.mainErr = false;
            } else if (result.data.length > 0) {
                this.errMsg = 'This APMIS ID is valid but has been previously used to generate an employee!';
                this.mainErr = false;
            } else {
                this.frmNewEmp4_show = true;
                this.apmisId_show = false;
                this.mainErr = true;
                this.frmNewEmp4_show = true;
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.apmisId_show = false;
                this.mainErr = true;
                this.shouldMoveFirst = true;
            }
        });


        // Observable.forkJoin([findPerson$, findPersonInFacilityEmployee$]).subscribe(results => {
        // });

        // this.personService.find({
        //     query: { apmisId: this.newEmpIdControl.value.toUpperCase() }
        // }).then(payload => {
        //     if (payload.data.length > 0) {
        //         this.selectedPerson = payload.data[0];
        //         //validate duplicate employee registration with facility
        //         this.employeeService.find({
        //             query: { facilityId: this.facility._id, personId: this.selectedPerson._id }
        //         }).then(innerPayload => {
        //             if (innerPayload.data.length === 0) {
        //                 this.frmNewEmp4_show = true;
        //                 this.apmisId_show = false;
        //                 this.mainErr = true;
        //                 this.frmNewEmp4_show = true;
        //                 this.frmNewPerson1_show = false;
        //                 this.frmNewPerson2_show = false;
        //                 this.frmNewPerson3_show = false;
        //                 this.apmisId_show = false;
        //                 this.mainErr = true;
        //             }
        //         });
        //     } else {
        //         this.errMsg = 'Invalid APMIS ID, correct the value entered and try again!';
        //         this.mainErr = false;
        //     }
        // });
    }
    back_empApmisID() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.apmisId_show = true;
        this.mainErr = true;
    }

    newPerson1_show() {
        this.frmPerson_show = true;
        this.showSecurityQuestions = false;
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.apmisId_show = false;
        this.shouldMoveFirst = false;
    }
    newPerson1(valid, val) {
        if (valid) {
            if (val.confirmEmpEmail === val.empEmail) {
                if (val.empTitle === '' || val.empTitle === ' ' || val.empFirstName === ''
                    || val.empFirstName === ' ' || val.empLastName === '' || val.empLastName === ' '
                    || val.empPhonNo === ' ' || val.empPhonNo === ''
                    || val.empGender === '' || val.empNationality === '' || val.empLga === '' || val.empState === '') {
                    this.mainErr = false;
                    this.errMsg = 'You left out a required field';
                } else {
                    this.frmNewPerson1_show = false;
                    this.frmNewPerson2_show = true;
                    this.frmNewPerson3_show = false;
                    this.frmNewEmp4_show = false;
                    this.apmisId_show = false;
                    this.mainErr = true;
                }
            } else {
                this.mainErr = false;
                this.errMsg = 'Email address must match Confirm email address';
            }
        } else {
            this.mainErr = false;
        }
    }

    back_newPerson1() {
        this.frmNewPerson1_show = true;
        this.showSecurityQuestions = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.apmisId_show = false;
        this.mainErr = true;
    }

    newPerson2(valid, val) {
        if (valid) {
            if (val.empMaritalStatus === '' || val.empHomeAddress === ' ' || val.empHomeAddress === '' || val.empDOB === ' ') {
                this.mainErr = false;
                this.errMsg = 'You left out a required field';
            } else {
                this.mainErr = true;
                this.errMsg = '';
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = true;
                this.frmNewEmp4_show = false;
                this.apmisId_show = false;
            }
        } else {
            this.mainErr = false;
        }
    }

    back_newPerson2() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = true;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = false;
        this.apmisId_show = false;
        this.mainErr = true;
    }

    savePerson() {
        {
            const person: Person = <Person>{ nextOfKin: [] };
            person.dateOfBirth = this.frmNewEmp2.controls['empDOB'].value.momentObj;
            person.email = this.frmNewEmp1.controls['empEmail'].value;
            person.firstName = this.frmNewEmp1.controls['empFirstName'].value;
            person.gender = this.frmNewEmp1.controls['empGender'].value;
            person.homeAddress = <Address>{
                street: this.frmNewEmp2.controls['empHomeAddress'].value,
                city: this.frmNewEmp2.controls['empCity'].value,
                // lga: this.frmNewEmp1.controls["empLga"].value,
                country: this.frmNewEmp2.controls['empCountry'].value,
                state: this.frmNewEmp2.controls['empContactState'].value

            };
            person.lastName = this.frmNewEmp1.controls['empLastName'].value;
            person.maritalStatus = this.frmNewEmp2.controls['empMaritalStatus'].value;
            if (!this.skipNok) {
                person.nextOfKin.push(
                    {
                        fullName: this.frmNewEmp3.controls['nok_fullname'].value,
                        address: this.frmNewEmp3.controls['nok_Address'].value,
                        phoneNumber: this.frmNewEmp3.controls['nok_phoneNo'].value,
                        email: this.frmNewEmp3.controls['nok_email'].value,
                        relationship: this.frmNewEmp3.controls['nok_relationship'].value,
                    });
            }

            person.otherNames = this.frmNewEmp1.controls['empOtherNames'].value;
            person.primaryContactPhoneNo = this.frmNewEmp1.controls['empPhonNo'].value;
            person.title = this.frmNewEmp1.controls['empTitle'].value;
            person.lgaOfOriginId = this.frmNewEmp1.controls['empLga'].value;
            person.nationalityId = this.frmNewEmp1.controls['empNationality'].value;
            person.stateOfOriginId = this.frmNewEmp1.controls['empState'].value;
            // person.profileImage = this.empImg.image;
            const body = {
                person: person,
                facilityId: this.facility._id
            }
            this.personService.createPerson(body).then(payload => {
                this.selectedPerson = payload;
                // this.user.email = this.selectedPerson.apmisId;
                // this.user.personId = this.selectedPerson._id;
                // this.user.facilitiesRole = [];
                // this.user.facilitiesRole.push(<Role>{ facilityId: this.facility._id });
                // this.userService.create(this.user).then((upayload) => {
                // });
                if (this.skipNok) {
                    this.saveEmployee();
                }
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = true;
                this.apmisId_show = false;
                this.mainErr = true;
            });
        }
    }

    newPerson3(valid, val) {
        if (this.skipNok || valid) {
            if (this.skipNok) {

                this.savePerson();
            } else {
                if (valid) {
                    if (val.nok_fullname === '' || val.nok_fullname === ' ' || val.nok_relationship === ''
                        || val.nok_relationship === ' ' || val.nok_phoneNo === ' ' || val.nok_phoneNo === ''
                        || val.nok_Address === ' ' || val.nok_Address === '') {
                        this.mainErr = false;
                        this.errMsg = 'you left out a required field';
                    } else {
                        this.mainErr = false;
                        this.savePerson();
                    }
                } else {
                    this.mainErr = false;
                    this.errMsg = 'you left out a required field';
                }
            }
        } else {
            this.mainErr = false;
            this.errMsg = 'you left out a required field';
        }
    }
    skip_nok() {
        this.frmNewPerson1_show = false;
        this.frmNewPerson2_show = false;
        this.frmNewPerson3_show = false;
        this.frmNewEmp4_show = true;
        this.apmisId_show = false;
        this.mainErr = true;
        this.skipNok = true;
    }
    back_newPerson3() {
        if (this.shouldMoveFirst === true) {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = false;
            this.frmNewEmp4_show = false;
            this.apmisId_show = true;
            this.mainErr = true;
        } else {
            this.frmNewPerson1_show = false;
            this.frmNewPerson2_show = false;
            this.frmNewPerson3_show = true;
            this.frmNewEmp4_show = false;
            this.apmisId_show = false;
            this.mainErr = true;
        }

    }
    saveEmployee() {
        this.systemModuleService.on();
        const model: Employee = <Employee>{};
        model.facilityId = this.facility._id;
        model.departmentId = this.frmNewEmp4.controls['empDept'].value;
        if (model.units === undefined) {
            model.units = [];
        }
        if (this.frmNewEmp4.controls['empUnit'].value !== undefined) {
            model.units.push(this.frmNewEmp4.controls['empUnit'].value);
        }
        model.minorLocationId = this.frmNewEmp4.controls['empLoc'].value;
        model.officialContactNumber = this.frmNewEmp4.controls['empWorkPhonNo'].value;
        model.officialEmailAddress = this.frmNewEmp4.controls['empWorkEmail'].value;
        model.personId = this.selectedPerson._id;
        model.professionId = this.frmNewEmp4.controls['empJobTitle'].value;
        model.cadre = this.frmNewEmp4.controls['empLevel'].value;


        this.employeeService.create(model).then(payload => {

            this.employeeService.saveEmployee(model).then(pay => {
                this.frmNewPerson1_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = false;
                this.apmisId_show = false;
                this.mainErr = true;
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy('Employee created successfully!', 'success',
                    null, null, null, null, null, null, null);
                this.closeModal.emit(true);
            }, err => {
                this.systemModuleService.announceSweetProxy('There was an error saving employee, try again!', error);
            })

        }).catch(err => {
        });
    }
    submit(frm, valid) {

        if (valid) {

            this.isSaving = true;
            this.systemModuleService.on();
            const personModel = <any>{
                title: this.titleCasePipe.transform(this.frmPerson.controls['persontitle'].value),
                firstName: this.titleCasePipe.transform(this.frmPerson.controls['firstname'].value),
                lastName: this.titleCasePipe.transform(this.frmPerson.controls['lastname'].value),
                gender: this.frmPerson.controls['gender'].value,
                dateOfBirth: this.frmPerson.controls['dob'].value,
                motherMaidenName: this.titleCasePipe.transform(this.frmPerson.controls['motherMaidenName'].value),
                // email: this.frmPerson.controls['email'].value,
                primaryContactPhoneNo: this.frmPerson.controls['phone'].value,
                securityQuestion: this.frmPerson.controls['securityQuestion'].value,
                securityAnswer: this.titleCasePipe.transform(this.frmPerson.controls['securityAnswer'].value)
            };
            const body = {
                person: personModel
            }
            const errMsg = 'There was an error while creating person, try again!';
            this.personService.createPerson(body).then((ppayload) => {
                this.isSaving = false;
                this.isSuccessful = true;
                this.systemModuleService.off();
                this.selectedPerson = ppayload;
                // this.isSuccessful = true;
                // let text = this.frmPerson.controls['firstname'].value + ' '
                //     + this.frmPerson.controls['lastname'].value + ' '
                //     + 'added successful';
                // this.frmPerson.reset();
                // this.isSaving = false;
                // this.systemModuleService.off();
                // this.systemModuleService.announceSweetProxy(text, 'success', this, HTML_SAVE_PATIENT);

                this.frmNewPerson1_show = false;
                this.frmPerson_show = false;
                this.frmNewPerson2_show = false;
                this.frmNewPerson3_show = false;
                this.frmNewEmp4_show = true;
                this.apmisId_show = false;
            }, err => {
                this.isSaving = false;
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy(errMsg, 'error');
            }).catch(err => {
                this.isSaving = false;
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy(errMsg, 'error');
            });
        } else {
            this.isSaving = false;
            this.mainErr = false;
            this.errMsg = 'An error has occured, please check and try again!';
            this.systemModuleService.off();
        }













    }

    newEmp4(valid, val) {
        if (valid) {
            if (val.empDept === '' || val.empLoc === '' || val.empJobTitle === '') {
                this.mainErr = false;
                this.errMsg = 'you left out a required field';
            } else {
                if (this.skipNok) {
                    this.savePerson();
                } else {
                    this.saveEmployee();

                }

                // this.frmNewPerson1_show = false;
                // this.frmNewPerson2_show = false;
                // this.frmNewPerson3_show = false;
                // this.frmNewEmp4_show = false;
                // this.apmisId_show = false;
                // this.mainErr = true;

                // this.closeModal.emit(true);

            }
        } else {
            this.mainErr = false;
        }

    }

    onEmpTitleChange(val) { }
    onEmpGenderChange(val) { }
    onEmpNationalityChange(val: Country) {
    }
    onEmpStateChange(val) { }
    onEmpLgaChange(val) { }
    onEmpMaritalStatusChange(val) { }
    onEmpDeptChange(val) {
        this.units = [];
        if (val !== undefined) {
            const deptIndex = this.facility.departments.findIndex(x => x.name === val);
            if (deptIndex > -1) {
                this.units = this.facility.departments[deptIndex].units;
            }

        }
    }
    onEmpLocChange(val) { }
    onNokRelationshipChange(val) { }
    onEmpJobTitleChange(val) {
        this.cadres = [];
        if (val !== undefined) {
            const proIndex = this.professions.findIndex(x => x.name === val);
            if (proIndex > -1) {
                this.cadres = this.professions[proIndex].caders;
            }
        }
    }
    onEmpLevelChange(val) { }

    close_onClick() {
        this.closeModal.emit(true);
    }

}
