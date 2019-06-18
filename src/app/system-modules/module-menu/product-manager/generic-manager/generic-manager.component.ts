import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GenericService } from '../../../../services/facility-manager/setup/index';
import { Facility, Generic } from '../../../../models/index';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';

@Component({
	selector: 'app-generic-manager',
	templateUrl: './generic-manager.component.html',
	styleUrls: ['./generic-manager.component.scss']
})
export class GenericManagerComponent implements OnInit {
	genericGroup: FormGroup;
	generics: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedItem: any = <Generic>{};
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
		private _genericservice: GenericService
	) {
	}

	ngOnInit() {
		this.genericGroup = this._fb.group({
			name: ['', [<any>Validators.required]],
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.genericGroup.controls['name'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe(value => {
				this._genericservice.find({
					query: {
						name: { $regex: this.genericGroup.controls['name'].value, '$options': 'i' },
					}
				}).then(payload => {
					const index = payload.data.filter(x => x.name.toLowerCase() === this.genericGroup.controls['name'].value.toLowerCase());
					if (index.length > 0) {
						if (this.selectedItem.name === undefined) {
							this.isBtnEnable = false;
						}
					} else {
						this.isBtnEnable = true;
					}
				});
			});
		this.getGenerics();
	}

	onClickAdd(value: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if (this.selectedItem._id === undefined) {
				value.facilityId = this.selectedFacility._id;
				this._genericservice.create(value)
					.then(payload => {
						this.genericGroup.reset();
						this.generics.push(payload);
					})
					.catch(err => {
					});
			} else {
				value = this.selectedItem;
				value.name = this.genericGroup.get('name').value;

				this._genericservice.update(value)
					.then(payload => {
						this.genericGroup.reset();
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

	close_onClick() {
		this.closeModal.emit(true);
	  }

	onClickEdit(value: any) {
		this.genericGroup.controls['name'].setValue(value.name);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.genericGroup.controls['name'].setValue('');
		this.btnLabel = 'Create';
	}

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._genericservice.update(value)
			.then(data => {
				// Do nothing
			})
			.catch(err => {
			});
	}

	getGenerics() {
		this._genericservice.find({})
			.then(data => {
				this.generics = data.data;
				this.loading = false;
			});
	}

}
