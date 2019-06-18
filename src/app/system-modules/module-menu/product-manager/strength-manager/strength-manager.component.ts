import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { StrengthService } from '../../../../services/facility-manager/setup/index';
import { Facility, Strength } from '../../../../models/index';

@Component({
	selector: 'app-strength-manager',
	templateUrl: './strength-manager.component.html',
	styleUrls: ['./strength-manager.component.scss']
})
export class StrengthManagerComponent implements OnInit {
	strengthGroup: FormGroup;
	strengths: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedItem: any = <Strength>{};
	btnLabel = 'Create';
	isBtnEnable = true;
	loading = true;
	searchControl = new FormControl();
	mainErr: Boolean = true;
	errMsg: String = 'You have unresolved errors';

	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		private _locker: CoolLocalStorage,
		private _fb: FormBuilder,
		private _strengthService: StrengthService
	) {
	}

	ngOnInit() {
		this.strengthGroup = this._fb.group({
			strength: ['', [<any>Validators.required]],
		});
		this.selectedFacility = <Facility> this._locker.getObject('selectedFacility');
		this.strengthGroup.controls['strength'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe(value => {
				this._strengthService.find({
					query: {
						strength: { $regex: this.strengthGroup.controls['strength'].value, '$options': 'i' },
					}
				}).then(payload => {
					const index = payload.data.filter(x => x.strength.toLowerCase() === this.strengthGroup.controls['strength'].value.toLowerCase());
					if (index.length > 0) {
						if (this.selectedItem.name === undefined) {
							this.isBtnEnable = false;
						}
					} else {
						this.isBtnEnable = true;
					}
				});
			});
		this.getStrengths();
	}

	onClickAdd(value: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if (this.selectedItem._id === undefined) {
				value.facilityId = this.selectedFacility._id;
				this._strengthService.create(value)
					.then(payload => {
						this.strengthGroup.reset();
						this.strengths.push(payload);
					})
					.catch(err => {
					});
			} else {
				value = this.selectedItem;
				value.strength = this.strengthGroup.get('strength').value;

				this._strengthService.update(value)
					.then(payload => {
						this.strengthGroup.reset();
						this.selectedItem = {};
						this.btnLabel = 'Create';
					})
					.catch(err => {
					});
			}

		} else {
			this.mainErr = false;
		}
	}

	onClickEdit(value: any) {
		this.strengthGroup.controls['strength'].setValue(value.strength);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.strengthGroup.controls['strength'].setValue('');
		this.btnLabel = 'Create';
	}

	close_onClick() {
		this.closeModal.emit(true);
	  }

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._strengthService.update(value)
			.then(data => {
				// Do nothing for now
			})
			.catch(err => {
			});
	}

	getStrengths() {
		this._strengthService.find({})
			.then(data => {
				this.strengths = data.data;
				this.loading = false;
			});
	}
}
