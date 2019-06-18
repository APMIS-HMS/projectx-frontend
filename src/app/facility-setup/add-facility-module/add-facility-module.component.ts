import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, FacilityModuleService } from '../../services/facility-manager/setup/index';
import { Facility, ModuleViewModel } from '../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-add-facility-module',
	templateUrl: './add-facility-module.component.html',
	styleUrls: ['../facility-setup.component.scss']
})
export class AddFacilityModuleComponent implements OnInit {
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Input() inputFacility: Facility = <Facility>{};
	sg4_show = false;
	f_module = true;
	back_f_module = false;

	frm_numberVerifier: FormGroup;
	facility: Facility = <Facility>{};
	modules: ModuleViewModel[] = [];
	partOneModules: ModuleViewModel[] = [];
	partTwoModules: ModuleViewModel[] = [];
	errMsg: string;
	mainErr = true;

	public frm_selectModules: FormGroup;
	public facilityForm4: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private _route: ActivatedRoute,
		private _facilityService: FacilitiesService,
		private facilityModuleService: FacilityModuleService
	) { }

	ngOnInit() {
		this.getModules();
		this.frm_selectModules = this.formBuilder.group({
			chk_pharmacy: [''],
			chk_diagnostic: [''],
			chk_clinics: [''],
			chk_theater: [''],
			chk_documentation: [''],
			chk_registeration: [''],
			chk_ward: [''],
			chk_facility: ['']
		});

		this.facilityForm4 = this.formBuilder.group({
			buildingtype: [''],
			regPoint_count: [''],
			wards_count: [''],
			paymentPoint_count: [''],
			pharmacyDispense_count: [''],
			pharmacyStore_count: [''],
			theater_count: [''],
			lab_Count: ['']
		});
	}

	getModules() {
		this.facilityModuleService.findAll().then((payload) => {
			if (this.inputFacility.facilitymoduleId.length > 0) {
				payload.data.forEach(moduleItem => {
					if(this.inputFacility.facilitymoduleId.includes(moduleItem._id)){
						moduleItem.checked = true;
						this.modules.push(moduleItem);
					}else{
						moduleItem.checked = false;
							this.modules.push(moduleItem);
					}
				});
			}
			else {
				payload.data.forEach(element => {
					element.checked = false;
					this.modules.push(element);
				});
			}

			let count: number = this.modules.length;
			let partOne: number = Math.floor(count / 2);
			let partTwo = count - partOne;
			let partOneModule = this.modules.slice(0, partOne);
			let partTwoModule = this.modules.slice(partOne);

			partOneModule.forEach((item, i) => {
				this.partOneModules.push({
					_id: item._id,
					name: item.name,
					checked: item.checked
				});
			});

			partTwoModule.forEach((item, i) => {
				this.partTwoModules.push({
					_id: item._id,
					name: item.name,
					checked: item.checked
				})
			})
		})
	}



	selectModules_next() {
		this.f_module = false;
		this.sg4_show = true;
		this._facilityService.update(this.inputFacility).then(payload => {
			this.inputFacility = payload;
		}, error => {
		});
	}

	addModuleItem(value) {
		if (!this.inputFacility.facilitymoduleId.includes(value._id)) {
			this.inputFacility.facilitymoduleId.push(value._id);
		}
	}

	back_facilityForm4() {
		this.modules = [];
		this.partOneModules = [];
		this.partTwoModules = [];
		this.getModules();
		this.f_module = true;
		this.sg4_show = false;
		this.back_f_module = false;
	}

	back_selectModules() {
		this.f_module = false;
		this.sg4_show = false;
		this.back_f_module = true;
	}

	facilitySetup_finish() {
		this.closeModal.emit(true);
	}


	close_onClick() {
		this.closeModal.emit(true);
	}

}
