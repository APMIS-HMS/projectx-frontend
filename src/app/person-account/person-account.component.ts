import { HTML_SAVE_PATIENT } from './../shared-module/helpers/global-config';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { UserFacadeService } from './../system-modules/service-facade/user-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Title } from './../models/facility-manager/setup/title';
import { TitleGenderFacadeService } from './../system-modules/service-facade/title-gender-facade.service';
import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ViewContainerRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { animate, trigger, state, style, transition } from '@angular/animations';
import {
	CountriesService,
	GenderService,
	PersonService,
	UserService,
	FacilitiesService
} from '../services/facility-manager/setup/index';
import { Gender, User, Person, Address } from '../models/index';
import { EMAIL_REGEX, PHONE_REGEX, ALPHABET_REGEX } from 'app/shared-module/helpers/global-config';
import { SecurityQuestionsService } from 'app/services/facility-manager/setup/security-questions.service';
import { TitleCasePipe } from '@angular/common';

@Component({
	selector: 'app-person-account',
	templateUrl: './person-account.component.html',
	styleUrls: [ './person-account.component.scss' ],
	animations: [
		trigger('divState', [
			state(
				'normal',
				style({
					'background-color': 'blue',
					display: 'block',
					'margin-top': '-40px',
					transform: 'translateX(0) scale(0)'
				})
			),
			state(
				'highlighted',
				style({
					'background-color': 'red',
					display: 'block',
					'margin-top': '0px',
					transform: 'translateX(0) scale(1)'
				})
			),
			transition('normal <=> highlighted', animate(300))
			// transition('highlighted => normal', animate(800))
		])
	]
})
export class PersonAccountComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@ViewChild('showhideinput') input;

	show = false;

	countries: any[] = [];
	selectedCountry: any = <any>{};
	selectedState: any = <any>{};
	genders: Gender[] = [];
	titles: Title[] = [];
	securityQuestions: any[] = [];
	errMsg: string;
	mainErr = true;
	isSuccessful = false;
	isSaving = false;

	counterSubscription: Subscription;
	countDown = 10;
	public frmPerson: FormGroup;
	state = 'normal';
	validating = false;
	duplicate = false;

	constructor(
		private formBuilder: FormBuilder,
		private titleGenderFacadeService: TitleGenderFacadeService,
		private personService: PersonService,
		private userService: UserService,
		private userServiceFacade: UserFacadeService,
		private facilitiesService: FacilitiesService,
		private systemModuleService: SystemModuleService,
		private securityQuestionService: SecurityQuestionsService,
		private vcr: ViewContainerRef,
		private toastr: ToastsManager,
		private titleCasePipe: TitleCasePipe
	) {
		this.toastr.setRootViewContainerRef(vcr);
	}

	ngOnInit() {
		this.getGenders();
		this.getTitles();
		this.getSecurityQuestions();
		this.frmPerson = this.formBuilder.group({
			persontitle: [ '', [ <any>Validators.required ] ],
			firstname: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(ALPHABET_REGEX)
				]
			],
			lastname: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(ALPHABET_REGEX)
				]
			],
			gender: [ [ <any>Validators.minLength(2) ] ],
			dob: [ new Date(), [ <any>Validators.required ] ],
			motherMaidenName: [
				'',
				[
					<any>Validators.required,
					<any>Validators.minLength(3),
					<any>Validators.maxLength(50),
					Validators.pattern(ALPHABET_REGEX)
				]
			],
			securityQuestion: [ '', [ <any>Validators.required ] ],
			securityAnswer: [ '', [ <any>Validators.required ] ],
			// email: ['', [<any>Validators.pattern(EMAIL_REGEX)]],
			phone: [ '', [ <any>Validators.required, <any>Validators.pattern(PHONE_REGEX) ] ]
		});

		// this.frmPerson.valueChanges.subscribe(value => {
		//   if (!this.mainErr) {
		//     this.isSuccessful = false;
		//   }

		//   this.mainErr = true;
		//   this.errMsg = '';
		// });

		this.frmPerson.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((value) => {
			this.errMsg = '';
			this.mainErr = true;
			this.validating = true;
			this.personService
				.searchPerson({
					query: {
						firstName: value.firstname,
						dateOfBirth: value.dob,
						gender: value.gender,
						motherMaidenName: value.motherMaidenName,
						isValidating: true
					}
				})
				.then(
					(payload) => {
						this.validating = false;
						if (payload.status === 'success') {
							this.duplicate = true;
							this.errMsg = 'Duplicate record detected, please check and try again!';
							this.mainErr = false;
						} else {
							this.duplicate = false;
						}
					},
					(error) => {}
				);
		});
	}

	validatingPerson() {
		return this.validating || this.duplicate;
	}

	getGenders() {
		this.titleGenderFacadeService.getGenders().then((payload: any) => {
			this.genders = payload;
		});
	}

	getTitles() {
		this.titleGenderFacadeService.getTitles().then((payload: any) => {
			this.titles = payload;
		});
	}
	getSecurityQuestions() {
		this.securityQuestionService.find({}).then(
			(payload) => {
				this.securityQuestions = payload.data;
			},
			(error) => {}
		);
	}
	onNationalityChange(value: any) {
		const country = this.countries.find((item) => item._id === value);
		this.selectedCountry = country;
	}

	submit(valid, val) {
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
			let body = {
				person: personModel
			};
			const errMsg = 'There was an error while creating person, try again!';
			this.personService
				.createPerson(body)
				.then(
					(ppayload) => {
						this.isSuccessful = true;
						let text =
							this.frmPerson.controls['firstname'].value +
							' ' +
							this.frmPerson.controls['lastname'].value +
							' ' +
							'added successful';
						this.frmPerson.reset();
						this.isSaving = false;
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(
							text,
							'success',
							this,
							HTML_SAVE_PATIENT,
							null,
							null,
							null,
							null,
							null
						);
					},
					(err) => {
						this.isSaving = false;
						this.systemModuleService.off();
						this.systemModuleService.announceSweetProxy(errMsg, 'error');
					}
				)
				.catch((err) => {
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
	sweetAlertCallback(result) {
		this.close_onClick();
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
	success(text) {
		this.toastr.success(text, 'Success!');
	}
	error(text) {
		this.toastr.error(text, 'Error!');
	}
	info(text) {
		this.toastr.info(text, 'Info');
	}
	warning(text) {
		this.toastr.warning(text, 'Warning');
	}
}
