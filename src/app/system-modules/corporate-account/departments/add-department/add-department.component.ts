import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, CompanyHealthCoverService, CorporateFacilityService } from '../../../../services/facility-manager/setup/index';
import { Facility, CompanyHealthCover, CorporateFacility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
	selector: 'app-add-department',
	templateUrl: './add-department.component.html',
	styleUrls: ['./add-department.component.scss']
})
export class AddDepartmentComponent implements OnInit {

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

	mainErr = true;
	errMsg = 'You have unresolved errors';

	public frmNewDept: FormGroup;
	selectedFacility: CorporateFacility = <CorporateFacility>{};
	constructor(private formBuilder: FormBuilder, private companyHealthCoverService: CompanyHealthCoverService,
		private corporateFacilityService: CorporateFacilityService,
		private locker: CoolLocalStorage) { }

	ngOnInit() {
		this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
		this.addNew();
	}

	addNew() {
		this.frmNewDept = this.formBuilder.group({
			deptName: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]]
		});
	}

	close_onClick() {
		this.closeModal.emit(true);
	}
	newDept(valid: boolean, model: any) {
		if (this.selectedFacility.departments === undefined) {
			this.selectedFacility.departments = [];
		}
		this.selectedFacility.departments.push({
			name: model.deptName,
			units: []
		});
		this.corporateFacilityService.update(this.selectedFacility)
			.then(payload => {
				this.locker.setObject('selectedFacility', payload);
				this.selectedFacility = payload;
				this.frmNewDept.controls['deptName'].reset();
			})
			.catch(err => {
			});
	}
}
