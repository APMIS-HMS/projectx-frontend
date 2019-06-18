import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { PresentationService } from '../../../../services/facility-manager/setup/index';
import { Facility, Presentation } from '../../../../models/index';
import { ProductEmitterService } from '../../../../services/facility-manager/product-emitter.service';

@Component({
	selector: 'app-presentation-manager',
	templateUrl: './presentation-manager.component.html',
	styleUrls: ['./presentation-manager.component.scss']
})
export class PresentationManagerComponent implements OnInit {
	presentationGroup: FormGroup;
	presentations: any[] = [];
	selectedFacility: Facility = <Facility>{};
	selectedItem: any = <Presentation>{};
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
		private _presentationService: PresentationService
	) {
	}

	ngOnInit() {
		this.presentationGroup = this._fb.group({
			name: ['', [<any>Validators.required]],
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.presentationGroup.controls['name'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe(value => {
				this._presentationService.find({
					query: {
						name: { $regex: this.presentationGroup.controls['name'].value, '$options': 'i' },
					}
				}).then(payload => {
					const index = payload.data.filter(x => x.name.toLowerCase() === this.presentationGroup.controls['name'].value.toLowerCase());
					if (index.length > 0) {
						if (this.selectedItem.name === undefined) {
							this.isBtnEnable = false;
						}
					} else {
						this.isBtnEnable = true;
					}
				});
			});
		this.getPresentations();
	}

	onClickAdd(value: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if (this.selectedItem._id === undefined) {
				value.facilityId = this.selectedFacility._id;
				this._presentationService.create(value)
					.then(payload => {
						this.presentationGroup.reset();
						this.presentations.push(payload);
					})
					.catch(err => {
					});
			} else {
				value = this.selectedItem;
				value.name = this.presentationGroup.get('name').value;

				this._presentationService.update(value)
					.then(payload => {
						this.presentationGroup.reset();
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
		this.presentationGroup.controls['name'].setValue(value.name);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	onClickCancel() {
		this.selectedItem = {};
		this.presentationGroup.controls['name'].setValue('');
		this.btnLabel = 'Create';
	}

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._presentationService.update(value)
			.then(data => {
				// Do nothing for now
			})
			.catch(err => {
			});
	}

	getPresentations() {
		this._presentationService.find({})
			.then(data => {
				this.presentations = data.data;
				this.loading = false;
			});
	}

}
