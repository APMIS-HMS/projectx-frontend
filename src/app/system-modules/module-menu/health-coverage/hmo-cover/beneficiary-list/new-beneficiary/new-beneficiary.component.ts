import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HmoService } from '../../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-new-beneficiary',
	templateUrl: './new-beneficiary.component.html',
	styleUrls: [ './new-beneficiary.component.scss' ]
})
export class NewBeneficiaryComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() beneficiaryValueChanged = new EventEmitter();
	// @Output() personValueChanged = new EventEmitter();
	@Input() selectedBeneficiary: any = <any>{};
	mainErr = true;
	errMsg = 'You have unresolved errors';
	public frm_UpdateCourse: FormGroup;
	genders = [];
	types = [];
	selectedFacility: any = <any>{};
	disableButton = false;

	constructor(
		private formBuilder: FormBuilder,
		private hmoService: HmoService,
		private systemModuleService: SystemModuleService,
		private locker: CoolLocalStorage
	) {}

	ngOnInit() {
		this.selectedFacility = this.locker.getObject('selectedFacility');
		this.genders = [ 'M', 'F' ];
		this.types = [ 'CAPITATION', 'FEE-FOR-SERVICE' ];
		this.frm_UpdateCourse = this.formBuilder.group({
			id: [ '' ],
			index: [ '' ],
			category: [ '' ],
			serial: [ '' ],
			sponsor: [ '', [ <any>Validators.required ] ],
			type: [ '', [ <any>Validators.required ] ],
			plan: [ '', [ <any>Validators.required ] ],
			firstname: [ '', [ <any>Validators.required ] ],
			surname: [ '', [ <any>Validators.required ] ],
			gender: [ '' ],
			filNo: [ '', [ <any>Validators.required ] ],
			date: [ '', [ <any>Validators.required ] ],
			status: [ false, [ <any>Validators.required ] ]
		});

		// this.frm_UpdateCourse.setValue(this.selectedBeneficiary);
		// category: ""
		// date: Tue Nov 06 2018 16: 12: 37 GMT + 0100(West Africa Standard Time) { }
		// filNo: "PRINCIPAL"
		// gender: "LCP/GTB00092/07643/A"
		// id: "5a662bb8d029190b7456f7ea"
		// index: 0
		// serial: "IBEWUIKE"
		// sponsor: "BASIC CORPORATE"
		// status: true
		// surname: "JOHN"
		// type: ""
		this.frm_UpdateCourse.controls['id'].setValue(
			this.selectedBeneficiary.id === undefined ? '' : this.selectedBeneficiary.id
		);
		this.frm_UpdateCourse.controls['category'].setValue(
			this.selectedBeneficiary.category === undefined ? '' : this.selectedBeneficiary.category
		);
		this.frm_UpdateCourse.controls['serial'].setValue(
			this.selectedBeneficiary.serial === undefined ? '' : this.selectedBeneficiary.serial
		);
		this.frm_UpdateCourse.controls['sponsor'].setValue(
			this.selectedBeneficiary.sponsor === undefined ? '' : this.selectedBeneficiary.sponsor
		);
		this.frm_UpdateCourse.controls['type'].setValue(
			this.selectedBeneficiary.type === undefined ? '' : this.selectedBeneficiary.type
		);
		this.frm_UpdateCourse.controls['plan'].setValue(
			this.selectedBeneficiary.plan === undefined ? '' : this.selectedBeneficiary.plan
		);
		this.frm_UpdateCourse.controls['firstname'].setValue(
			this.selectedBeneficiary.firstname === undefined ? '' : this.selectedBeneficiary.firstname
		);
		this.frm_UpdateCourse.controls['surname'].setValue(
			this.selectedBeneficiary.surname === undefined ? '' : this.selectedBeneficiary.surname
		);
		this.frm_UpdateCourse.controls['filNo'].setValue(
			this.selectedBeneficiary.filNo === undefined ? '' : this.selectedBeneficiary.filNo
		);
		this.frm_UpdateCourse.controls['gender'].setValue(
			this.selectedBeneficiary.gender === undefined ? '' : this.selectedBeneficiary.gender
		);
		this.frm_UpdateCourse.controls['date'].setValue(
			this.selectedBeneficiary.date === undefined ? '' : this.selectedBeneficiary.date
		);
		this.frm_UpdateCourse.controls['status'].setValue(
			this.selectedBeneficiary.status === undefined ? '' : this.selectedBeneficiary.status
		);
		this.frm_UpdateCourse.controls['index'].setValue(
			this.selectedBeneficiary.index === undefined ? '' : this.selectedBeneficiary.index
		);
	}

	close_onClick() {
		this.frm_UpdateCourse.reset();
		this.closeModal.emit(true);
	}
	view() {
		if (this.frm_UpdateCourse.valid) {
			this.disableButton = true;
			if (this.selectedBeneficiary.index !== '') {
				this.systemModuleService.announceSweetProxy(
					'You are about to edit this beneficiary report',
					'question',
					this,
					null,
					null
				);
			} else {
				this.updateBeneficiaryList(this.frm_UpdateCourse.value);
			}
		} else {
			this.systemModuleService.announceSweetProxy('Require field(s) is missing', 'error');
		}
	}

	updateBeneficiaryList(value) {
		this.hmoService
			.patchBeneficiary(value.index, value, {
				query: {
					facilityId: this.selectedFacility._id,
					hmoId: value.id
				}
			})
			.then(
				(payload) => {
					this.disableButton = false;
					this.systemModuleService.announceSweetProxy('Beneficiary information updated', 'success');
					this.systemModuleService.off();
					this.beneficiaryValueChanged.emit(payload);
				},
				(err) => {
					this.systemModuleService.announceSweetProxy('Beneficiary information failed', 'error');
					this.systemModuleService.off();
				}
			);
	}

	sweetAlertCallback(result) {
		if (result.value) {
			this.systemModuleService.on();
			let data_ = [];
			data_.push(this.frm_UpdateCourse.value);
			this.updateBeneficiaryList(this.frm_UpdateCourse.value);
		} else {
			this.close_onClick();
		}
	}
}
