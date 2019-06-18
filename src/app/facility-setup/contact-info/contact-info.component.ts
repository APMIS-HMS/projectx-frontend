import { Component, OnInit, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	CountriesService, FacilityTypesService, FacilitiesService, GenderService,
	PersonService, TitleService, UserService, MaritalStatusService, FacilityModuleService
} from '../../services/facility-manager/setup/index';
import { Address, Role, Facility, Gender, ModuleViewModel, User, Title, MaritalStatus, Person } from '../../models/index';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-contact-info',
	templateUrl: './contact-info.component.html',
	styleUrls: ['../facility-setup.component.scss', './contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};


	selectedCountry_key = []; // states of the selected country load key
	stateAvailable = false; // boolean variable to check if the list of user selected state exists in code

	show = false;
	@ViewChild('showhideinput') input;

	countries: any[] = [];
	titles: Title[] = [];
	genders: Gender[] = [];
	cities: any[] = [];
	lgas: any[] = [];
	maritalStatuses: MaritalStatus[] = [];
	facilityTypes: any[] = [];
	ownerships: any[] = [];
	selectedFacilityType: any = {};
	selectedCountry: any = {};
	selectedFacility: Facility = <Facility>{};

	frm_numberVerifier: FormGroup;
	InputedToken: string;
	errMsg: string;
	mainErr = true;
	sg1_2_show = true;
	back_key_show = false;
	next_key_show = false;

	isEmailExist: Boolean;

	public facilityForm1_1: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private countriesService: CountriesService,
		private genderService: GenderService,
		private titleService: TitleService,
		private maritalStatusService: MaritalStatusService,
		private userService: UserService,
		private personService: PersonService,
		private facilityTypeService: FacilityTypesService,
		private facilityModuleService: FacilityModuleService,
		public facilityService: FacilitiesService
	) { }

	ngOnInit() {
		// this.getTitles();
		// this.getGenders();
		// this.getMaritalStatus();
		this.prime();

		this.facilityForm1_1 = this.formBuilder.group({
			facilitystate: ['', [<any>Validators.required]],
			facilitylga: ['', [<any>Validators.required]],
			facilitycity: ['', [<any>Validators.required]],
			facilityaddress: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
			facilitylandmark: ['', [<any>Validators.required]],

			contactFName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
			contactLName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern('^[a-zA-Z ]+$')]],
			contactEmail: ['', [<any>Validators.required, <any>Validators.minLength(4)]],
			facilityphonNo: ['', [<any>Validators.required, <any>Validators.minLength(10), <any>Validators.pattern('^[0-9]+$')]],
			password: ['', [<any>Validators.required, <any>Validators.minLength(5)]],
			repass: ['', [<any>Validators.required, <any>Validators.minLength(5)]]
		});

		this.facilityForm1_1.controls['facilitystate'].valueChanges.subscribe(payload => {
			this.cities = payload.cities;
			this.lgas = payload.lgs;
		})


		// this.countriesService.findAll().then((payload) => {
		// 	this.countries = payload.data;
		// 	this.stateAvailable = false;
		// 	const country = this.countries.find(item => item._id === this.inputFacility.address.country);
		// 	this.selectedCountry = country;
		// 	if (this.selectedCountry.states.length > 0) {
		// 		this.stateAvailable = true;
		// 	}
		// })

		this.facilityForm1_1.controls['facilitystate'].valueChanges.subscribe(payload => {
			this.cities = payload.cities;
			this.lgas = payload.lgs;
		})
	}

	facilitySetup1_1(valid, val) {
		if (valid) {
			if (val.facilitystate === '' || val.facilitystate === ' ' || val.facilitylga === '' || val.facilitylga === ' ' ||
				val.facilitycity === '' || val.facilitycity === ' ' || val.facilityaddress === ' ' ||
				val.facilityaddress === '' || val.facilitylandmark === ' ' || val.facilitylandmark === '' || val.contactFName === ''
				|| val.contactFName === ' ' || val.contactLName === ''
				|| val.contactLName === ' ' || val.contactEmail === '' || val.facilityphonNo === '' || val.facilityphonNo === ' ' || val.password === '' ||
				val.password === ' ' || val.repass === '' || val.repass === ' ') {
				this.mainErr = false;
				this.errMsg = 'you left out a required field';
			} else if (val.password !== val.repass) {
				this.mainErr = false;
				this.errMsg = 'your passwords do not match';
			} else {
				if (this.inputFacility._id === undefined) {
					const model: Facility = <Facility>{
						name: this.inputFacility.name,
						email: this.inputFacility.email,
						contactPhoneNo: val.facilityphonNo,
						contactFullName: val.contactLName + ' ' + val.contactFName,
						facilityTypeId: this.inputFacility.facilityTypeId,
						facilityClassId: this.inputFacility.facilityClassId,
						facilityOwnershipId: this.inputFacility.facilityOwnershipId,
						address: <Address>({
							state: this.facilityForm1_1.controls['facilitystate'].value._id,
							lga: this.facilityForm1_1.controls['facilitylga'].value,
							city: this.facilityForm1_1.controls['facilitycity'].value,
							street: this.facilityForm1_1.controls['facilityaddress'].value,
							landmark: this.facilityForm1_1.controls['facilitylandmark'].value,
							country: this.inputFacility.address.country,
						}),
						website: this.inputFacility.website,
						shortName: this.inputFacility.shortName,
						password: this.facilityForm1_1.controls['password'].value,

					}
					this.facilityService.create(model).then((payload) => {
						this.selectedFacility = payload;
						this.inputFacility = payload;

						const personModel = <Person>{
							title: this.titles[0]._id,
							firstName: this.facilityForm1_1.controls['contactFName'].value,
							lastName: this.facilityForm1_1.controls['contactLName'].value,
							gender: this.genders[0]._id,
							homeAddress: model.address,
							primaryContactPhoneNo: model.contactPhoneNo,
							lgaOfOriginId: this.facilityForm1_1.controls['facilitylga'].value,
							nationalityId: this.inputFacility.address.country,
							stateOfOriginId: this.facilityForm1_1.controls['facilitystate'].value._id,
							email: this.facilityForm1_1.controls['contactEmail'].value,
							maritalStatus: this.maritalStatuses[0].name
						};
						const userModel = <User>{
							email: this.facilityForm1_1.controls['contactEmail'].value,
							password: this.facilityForm1_1.controls['password'].value
						};

						this.personService.create(personModel).then((ppayload) => {
							userModel.personId = ppayload._id;
							if (userModel.facilitiesRole === undefined) {
								userModel.facilitiesRole = [];
							}
							userModel.facilitiesRole.push(<Role>{ facilityId: payload._id })
							this.userService.create(userModel).then((upayload) => {
								this.sg1_2_show = false;
								this.next_key_show = true;
								this.back_key_show = false;
								this.mainErr = true;
							});


						});
					},
						error => {
						});
				} else {
					this.sg1_2_show = false;
					this.next_key_show = true;
					this.back_key_show = false;
					this.mainErr = true;
				}

			}
		} else {
			this.mainErr = false;
		}
	}

	onCheckEmailAddress(value) {
		if (value.length > 4) {
			const email = this.facilityForm1_1.controls['facilityemail'];
			if (value.includes('@')) {
				this.facilityService.find({ query: { email: value } }).then(payload => {
					if (payload.data.length > 0) {
						// this.isEmailExist = false;
						email.setErrors({ duplicate: true });
					} else {
						// this.isEmailExist = true;
					}
				});
			} else {
				email.setErrors({ invalid: true });
			}
		}
	}


	prime() {

		const title$ = Observable.fromPromise(this.titleService.findAll());
		const gender$ = Observable.fromPromise(this.genderService.findAll());
		const maritalStatus$ = Observable.fromPromise(this.maritalStatusService.findAll());
		const country$ = Observable.fromPromise(this.countriesService.findAll());

		Observable.forkJoin([title$, gender$, maritalStatus$, country$]).subscribe((results: any) => {
			this.titles = results[0].data;
			this.genders = results[1].data;
			this.maritalStatuses = results[2].data;

			this.countries = results[3].data;
			this.stateAvailable = false;
			const country = this.countries.find(item => item._id === this.inputFacility.address.country);
			this.selectedCountry = country;
			if (this.selectedCountry.states.length > 0) {
				this.stateAvailable = true;
			}

			if (this.inputFacility.contactFullName !== undefined && this.inputFacility.contactFullName.length > 0) {


				const filterState = this.selectedCountry.states.filter(x => x._id === this.inputFacility.address.state);
				if (filterState.length > 0) {
					this.facilityForm1_1.controls['facilitystate'].setValue(filterState[0]);
				}
				this.facilityForm1_1.controls['facilityphonNo'].setValue(this.inputFacility.contactPhoneNo);
				this.facilityForm1_1.controls['contactFName'].setValue(this.inputFacility.contactFullName.split(' ')[0]);
				this.facilityForm1_1.controls['contactLName'].setValue(this.inputFacility.contactFullName.split(' ')[1]);
				this.facilityForm1_1.controls['facilitylga'].setValue(this.inputFacility.address.lga);
				this.facilityForm1_1.controls['facilitycity'].setValue(this.inputFacility.address.city);
				this.facilityForm1_1.controls['facilityaddress'].setValue(this.inputFacility.address.street);
				this.facilityForm1_1.controls['facilitylandmark'].setValue(this.inputFacility.address.landmark);
				this.facilityForm1_1.controls['password'].setValue(this.inputFacility.password);
				this.facilityForm1_1.controls['repass'].setValue(this.inputFacility.password);

			}
		})
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

	getCountries() {
		this.countriesService.findAll().then((payload) => {
			this.countries = payload.data;
		})
	}

	back_facilityForm1_1() {
		this.sg1_2_show = false;
		this.back_key_show = true;
		this.next_key_show = false;
	}

	onStateChange(value: any) {
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	toggleShow(e) {
		this.show = !this.show;
		if (this.show) {
			this.input.nativeElement.type = 'text';
		} else {
			this.input.nativeElement.type = 'password';
		}
	}

}