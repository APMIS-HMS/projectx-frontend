import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { EMAIL_REGEX, WEBSITE_REGEX, PHONE_REGEX, GEO_LOCATIONS } from 'app/shared-module/helpers/global-config';
import { Observable } from 'rxjs/Observable';

import {
	CountriesService, FacilitiesService, UserService,
	PersonService, EmployeeService, GenderService, RelationshipService, MaritalStatusService, TitleService,
	DepartmentService
} from '../../../../../../services/facility-manager/setup/index';
import { Facility, User, Employee, Person, Country, Gender, Relationship, MaritalStatus } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { CountryServiceFacadeService } from '../../../../../../system-modules/service-facade/country-service-facade.service';

@Component({
	selector: 'app-edit-emp-basic',
	templateUrl: './edit-emp-basic.component.html',
	styleUrls: ['./edit-emp-basic.component.scss']
})
export class EditEmpBasicComponent implements OnInit {
	@Input() selectedPerson: any;
	@Input() departmentBool: Boolean;
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	mainErr = true;
	errMsg = "";
	editEmployeeDetails = false;

	facility;
	departments: any;
	selectedEmployee;
	selectedFacility;
	loading: any;

	selectedDepartment: any;

	countries: any;
	states: any;
	cities;
	lgas;
	lgasOfOrigin;
	titles;
	genders;
	maritalStatuses;
	statesOfOrigin;

	stateAvailable;
	selectedCountry;

	public facilityForm1: FormGroup;
	public facilityForm2: FormGroup;

	userSettings: any = {
		geoCountryRestriction: [GEO_LOCATIONS],
		showCurrentLocation: false,
		resOnSearchButtonClickOnly: false,
		recentStorageName: 'componentData3'
	};

	constructor(private formBuilder: FormBuilder,
		private employeeService: EmployeeService,
		public facilityService: FacilitiesService,
		private userService: UserService,
		private countryService: CountriesService,
		private genderService: GenderService,
		private titleService: TitleService,
		private maritalStatusService: MaritalStatusService,
		private personService: PersonService,
		private locker: CoolLocalStorage,
		private systemModulesService: SystemModuleService,
		private departmentService: DepartmentService,
		private authFacadeService: AuthFacadeService,
		private _countryServiceFacade: CountryServiceFacadeService) { }

	ngOnInit() {
		this.facility = <any>this.locker.getObject("selectedFacility");
		this.selectedEmployee = this.locker.getObject("selectedEmployee");

		this.getDepartmentById();

		this.facilityForm1 = this.formBuilder.group({
			dept: [this.selectedEmployee.departmentId, [<any>Validators.required]],
		});
		this.facilityForm2 = this.formBuilder.group({
			title: [this.selectedPerson.title, [<any>Validators.required]],
			firstname: [this.selectedPerson.firstName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			lastname: [this.selectedPerson.lastName, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			othernames: [this.selectedPerson.otherNames, []],
			gender: [this.selectedPerson.gender, [<any>Validators.required]],
			maritalStatus: [this.selectedPerson.maritalStatus, [<any>Validators.required]],
			date: [new Date(this.selectedPerson.dateOfBirth).toDateString(), [<any>Validators.required]],
			nationality: [this.selectedPerson.nationality, [<any>Validators.required]],
			stateofOrigin: [this.selectedPerson.stateOfOrigin, [<any>Validators.required]],
			localgovtarea: [this.selectedPerson.lgaOfOrigin, [<any>Validators.required]],
			homeaddress: [this.selectedPerson.homeAddress.street, [<any>Validators.required]],
			stateofresidence: [this.selectedPerson.homeAddress.state, [<any>Validators.required]],
			lgaofresidence: [this.selectedPerson.homeAddress.lga, [<any>Validators.required]],
			mothermaidenname: [this.selectedPerson.motherMaidenName, [<any>Validators.required]],
			email: [this.selectedPerson.email, [<any>Validators.required, Validators.pattern(EMAIL_REGEX)]],
			phoneno: [this.selectedPerson.primaryContactPhoneNo, [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]]
		});


		this.getDepartments();
		this.prime();

		this.facilityForm2.controls['nationality']
			.valueChanges.subscribe(payload => {
				this.selectedCountry = payload;
				this._countryServiceFacade.getOnlyStates(payload, true).then(payl => {
					this.statesOfOrigin = payl;
					this.states = payl;
				})
			});

		this.facilityForm2.controls['stateofOrigin']
			.valueChanges.subscribe(payload => {
				this._countryServiceFacade.getOnlyLGAndCities(this.selectedCountry, payload, true).then((payl: any) => {
					this.lgasOfOrigin = payl.lgs;
				})
			});

		this.facilityForm2.controls['stateofresidence']
			.valueChanges.subscribe(payload => {
				this._countryServiceFacade.getOnlyLGAndCities(this.selectedCountry, payload, true).then((payl: any) => {
					this.lgas = payl.lgs;
				})
			});

	}

	prime() {

		const title$ = Observable.fromPromise(this.titleService.findAll());
		const gender$ = Observable.fromPromise(this.genderService.findAll());
		const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
		const country$ = Observable.fromPromise(this._countryServiceFacade.getOnlyCountries());

		Observable.forkJoin([title$, gender$, maritalStatus$, country$]).subscribe((results: any) => {
			this.titles = results[0].data;
			this.genders = results[1].data;
			this.maritalStatuses = results[2].data;

			this.countries = results[3];
			this.stateAvailable = false;
			if (this.selectedPerson.homeAddress.country) {
				const country = this.countries.filter(item => item.name === this.selectedPerson.homeAddress.country);
				this.selectedCountry = country[0];
				this._countryServiceFacade.getOnlyStates(this.selectedCountry.name, true).then((payl) => {
					this.states = payl;
					this.statesOfOrigin = payl;
					let stateOfOrigin = this.statesOfOrigin.filter(x => x.name == this.selectedPerson.stateOfOrigin);
						this._countryServiceFacade.getOnlyLGAndCities(this.selectedCountry.name, stateOfOrigin[0].name, true).then((paylo: any) => {
						this.lgasOfOrigin = paylo.lgs;
					});
					let stateofresidence = this.states.filter(x => x.name == this.selectedPerson.homeAddress.state);
					this._countryServiceFacade.getOnlyLGAndCities(this.selectedCountry.name, stateofresidence[0].name, true).then((paylo: any) => {
						this.lgas = paylo.lgs;
					})
				})
			}



		});

		this.facilityForm2.controls['stateofOrigin'].valueChanges.subscribe(payload => {
			this.lgasOfOrigin = payload.lgs;
		});
		this.facilityForm2.controls['stateofresidence'].valueChanges.subscribe(payload => {
			this.lgas = payload.lgs;
		});
	}

	close_onClick($event) {
		this.closeModal.emit(true);
		this.departmentBool = false;
	}
	saveDepartment() {
		this.loading = true;
		this.selectedEmployee.departmentId = this.facilityForm1.controls['dept'].value;

		this.employeeService.update(this.selectedEmployee).then(payload => {
			this.loading = false;
			this.locker.setObject('selectedEmployee', payload);
			this.employeeService.announceEmployee(payload);
			this.systemModulesService.announceSweetProxy('Department Successfully Updated.', 'success');
			this.close_onClick(true);
		}).catch(err => {
			this.systemModulesService.announceSweetProxy('Something went wrong. Please Try Again!', 'error');
		});
	}

	savePerson() {
		if (!this.facilityForm2.valid) {
			this.mainErr = false;
			this.errMsg = 'A required field has been left empty';
		} else {
			this.loading = true;
			let person: any = {
				_id: this.selectedPerson._id,
				title: this.facilityForm2.controls['title'].value,
				apmisId: this.selectedPerson.apmisId,
				firstName: this.facilityForm2.controls['firstname'].value,
				lastName: this.facilityForm2.controls['lastname'].value,
				otherNames: this.facilityForm2.controls['othernames'].value,
				gender: this.facilityForm2.controls['gender'].value,
				maritalStatus: this.facilityForm2.controls['maritalStatus'].value,
				dateOfBirth: this.facilityForm2.controls['date'].value,
				nationality: this.facilityForm2.controls['nationality'].value,
				stateOfOrigin: this.facilityForm2.controls['stateofOrigin'].value,
				lgaOfOrigin: this.facilityForm2.controls['localgovtarea'].value,
				homeAddress: {
					street: this.facilityForm2.controls['homeaddress'].value,
					state: this.facilityForm2.controls['stateofresidence'].value,
					lga: this.facilityForm2.controls['lgaofresidence'].value,
					country: this.facilityForm2.controls['nationality'].value
				},
				email: this.facilityForm2.controls['email'].value,
				motherMaidenName: this.facilityForm2.controls['mothermaidenname'].value,
				primaryContactPhoneNo: this.facilityForm2.controls['phoneno'].value,

			}
			if (person.motherMaidenName === undefined) {
				person.motherMaidenName = ' ';
			}
			this.personService.update(person, this.facility._id).then(payload => {
				this.selectedEmployee.personDetails = payload;
				this.locker.setObject('selectedEmployee', this.selectedEmployee);
				this.systemModulesService.announceSweetProxy('Person Information Successfully Saved.', 'success');
				this.loading = false;
				this.close_onClick(true);
			}).catch(err => {
				this.systemModulesService.announceSweetProxy('Error occured while saving information, please check it and try again.', 'error');
			});
		}
	}

	getDepartments() {
		this.facilityService.get(this.facility._id, {}).then(payload => {
			this.departments = payload.departments;
		}).catch(err => {
		});
	}

	getTitles() {
		this.titleService.findAll().then((payload: any) => {
			this.titles = payload.data;
		})
	}

	getGenders() {
		this.genderService.findAll().then((payload) => {
			this.genders = payload.data;
		})
	}

	getMaritalStatus() {
		this.maritalStatusService.findAll().then((payload: any) => {
			this.maritalStatuses = payload.data;
		})
	}

	_getCountries() {
		this._countryServiceFacade.getOnlyCountries().then((payload: any) => {
			this.countries = payload;
		}).catch(error => {
		});
	}

	getStates(country) {
		this.countryService.find({
			query: {

			}
		})
	}

	compare(l1: any, l2: any) {
		return l1 == l2;
	}

	compareDepartments(d1: any, d2: any) {
		return d1 == d2;
	}

	getDepartmentById() {

		const deptId = this.selectedEmployee.departmentId;
		const depts = this.facility.departments;
		const dept = depts.filter(x => x.name == deptId);
		if(dept.length > 0){
			this.selectedDepartment = dept[0].name;
		}
	}


}
