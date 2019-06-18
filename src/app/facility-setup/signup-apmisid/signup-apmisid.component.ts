import { TitleCasePipe } from '@angular/common';
import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable'
import { PersonService } from 'app/services/facility-manager/setup';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';
import { SecurityQuestionsService } from 'app/services/facility-manager/setup/security-questions.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-signup-apmisid',
	templateUrl: './signup-apmisid.component.html',
	styleUrls: ['./signup-apmisid.component.scss']
})
export class SignupApmisid implements OnInit {

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() facilityInfo: EventEmitter<boolean> = new EventEmitter<boolean>();

	errMsg: string;
	mainErr = true;
	securityQuestions:any[] = [];
	public facilityForm1: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _personService: PersonService,
		private _facilityFacadeService:FacilityFacadeService,
		private securityQuestionService:SecurityQuestionsService,
		private titlePipeCase:TitleCasePipe,
		private systemModuleService:SystemModuleService
	) { }

	ngOnInit() {
		this.facilityForm1 = this.formBuilder.group({
			apmisId: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
			securityQuestion: ['', [<any>Validators.required]],
			securityAnswer: ['', [<any>Validators.required]]
		});

		this.getSecurityQuestions();
	}

	getSecurityQuestions() {
		this.securityQuestionService.find({})
		  .then(payload => {
			this.securityQuestions = payload.data;
		  }, error => {
	
		  });
	  }

	close_onClick() {
		this.closeModal.emit(true);
	}
	facilityInfo_show(form) {
		this._personService.searchPerson({
			query: {
				'apmisId': form.apmisId,
				'securityQuestion': form.securityQuestion,
				'securityAnswer':this.titlePipeCase.transform(form.securityAnswer)
			}
		}).then(payload => {
			this._facilityFacadeService.facilityCreatorApmisID = '';
			this._facilityFacadeService.facilityCreatorPersonId = '';
			if(payload !== null){
				this._facilityFacadeService.facilityCreatorApmisID = form.apmisId;
				this._facilityFacadeService.facilityCreatorPersonId = payload;
				this.facilityInfo.emit(true);
			}else{
				this.systemModuleService.announceSweetProxy('Invalid APMIS ID and/or Answer to Security Question!', 'info');
			}
		}, error => {
			this._facilityFacadeService.facilityCreatorApmisID = '';
			this._facilityFacadeService.facilityCreatorPersonId = '';
			this.systemModuleService.announceSweetProxy('There was an error while validating this APMIS ID, try again!', 'error');
		});
		
	}

}
