import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { RouteService } from '../../../../services/facility-manager/setup/index';
import { Facility, Route } from '../../../../models/index';

@Component({
	selector: 'app-route-manager',
	templateUrl: './route-manager.component.html',
	styleUrls: ['./route-manager.component.scss']
})
export class RouteManagerComponent implements OnInit {
	routeGroup: FormGroup;
	selectedFacility: Facility = <Facility>{};
	routes: any[] = [];
	selectedItem: any = <Route>{};
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
		private _routeService: RouteService
	) {
	}

	ngOnInit() {
		this.routeGroup = this._fb.group({
			name: ['', [<any>Validators.required]]
		});
		this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
		this.routeGroup.controls['name'].valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.subscribe(value => {
				this._routeService.find({
					query: {
						name: { $regex: this.routeGroup.controls['name'].value, '$options': 'i' },
					}
				}).then(payload => {
					const index = payload.data.filter(x => x.name.toLowerCase() === this.routeGroup.controls['name'].value.toLowerCase());
					if (index.length > 0) {
						if (this.selectedItem.name === undefined) {
							this.isBtnEnable = false;
						}
					} else {
						this.isBtnEnable = true;
					}
				});
			});
		this.getManufacturer();
	}

	onClickAdd(value: any, valid: boolean) {
		if (valid) {
			this.mainErr = true;
			// Check if you are editing an existing or creating a new record
			if (this.selectedItem._id === undefined) {
				// Creating new record
				value.facilityId = this.selectedFacility._id;
				this._routeService.create(value)
					.then(payload => {
						this.routeGroup.reset();
						this.routes.push(payload);
					})
					.catch(err => {
					});
			} else {
				// Updating existing record
				value = this.selectedItem;
				value.name = this.routeGroup.get('name').value;

				this._routeService.update(value)
					.then(payload => {
						this.routeGroup.reset();
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
		this.routeGroup.controls['name'].setValue(value.name);
		this.selectedItem = value;
		this.btnLabel = 'Update';
	}

	close_onClick() {
		this.closeModal.emit(true);
	  }

	onClickCancel() {
		this.selectedItem = {};
		this.routeGroup.reset();
		this.btnLabel = 'Create';
	}

	onClickIsActive(value) {
		// Updating existing record
		value.isActive = !value.isActive;

		this._routeService.update(value)
			.then(data => {
				// Do nothing for now
			})
			.catch(err => {
			});
	}

	getManufacturer() {
		this._routeService.find({ query: { facilityId: this.selectedFacility._id } })
			.then(data => {
				this.routes = data.data;
				this.loading = false;
			});
	}

}
