import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
	FacilitiesService,
	InvestigationService,
	WorkbenchService,
	ServicePriceService,
	TagService
} from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Facility, Employee, Tag, FacilityServicePrice, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { ISubscription } from '../../../../../../node_modules/rxjs/Subscription';
import { LabEventEmitterService } from '../../../../services/facility-manager/lab-event-emitter.service';

@Component({
	selector: 'app-investigation-price',
	templateUrl: './investigation-price.component.html',
	styleUrls: [ './investigation-price.component.scss' ]
})
export class InvestigationPriceComponent implements OnInit, OnDestroy {
	user: User = <User>{};
	apmisLookupUrl = 'workbenches';
	apmisLookupText = '';
	apmisLookupQuery = {};
	apmisLookupDisplayKey = 'name';
	apmisLookupOtherKeys = [ 'name' ];
	apmisInvestigationLookupUrl = 'investigations';
	apmisInvestigationLookupText = '';
	apmisInvestigationLookupQuery: any = {};
	apmisInvestigationLookupDisplayKey = 'name';
	apmisInvestigationLookupImgKey = '';
	pricing_view = false;
	Inactive = false;
	Active = false;
	mainErr = true;
	errMsg = 'You have unresolved errors';
	searchOpen = false;
	public frmNewPrice: FormGroup;
	selelctedFacility: Facility = <Facility>{};
	workBenches: any[] = [];
	locationIds: any[] = [];
	investigations: any[] = [];
	loginEmployee: Employee;
	selectedTag: Tag = <Tag>{};
	selectedInvestigation: any = <any>{};
	selectedWorkBench: any = <any>{};
	checkingObject: any;
	selectedModifierIndex = -1;
	selectedFacilityServicePrice: FacilityServicePrice = <FacilityServicePrice>{};
	selectedModifier: any = <any>{};
	loading: Boolean = true;
	disableBtn: Boolean = false;
	foundPrice: Boolean = false;
	selectedMajorLocation: any;
	searchControl = new FormControl('');
	updatePrice = true;
	updatingPrice = false;
	labSubscription: ISubscription;

	constructor(
		private formBuilder: FormBuilder,
		private locker: CoolLocalStorage,
		private investigationService: InvestigationService,
		private workbenchService: WorkbenchService,
		private facilityPriceService: ServicePriceService,
		private tagService: TagService,
		private _facilityService: FacilitiesService,
		private _locationService: LocationService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
		private _labEventEmitter: LabEventEmitterService
	) {
		this.selelctedFacility = <Facility>this.locker.getObject('selectedFacility');
		// this.user = <User>this.locker.getObject('auth');
		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.loginEmployee = res;
				const checkingObject = res.workbenchCheckIn.filter((x) => x.isOn);
				this.checkingObject = checkingObject.length > 0 ? checkingObject[0] : undefined;
				this.getLaboratoryMajorLocation(this.loginEmployee);
				this.getWorkBenches();
				this.getTags();
				this.getInvestigations(this.checkingObject);
			})
			.catch((err) => {});

		// Subscribe to the event when ward changes.
		this.labSubscription = this._labEventEmitter.announceLab.subscribe((val: any) => {
			this.checkingObject = val.typeObject;
			this.getLaboratoryMajorLocation(this.loginEmployee);
			this.getInvestigations(this.checkingObject);
			this.getTags();
			this.getWorkBenches();
		});
	}

	ngOnInit() {
		this.frmNewPrice = this.formBuilder.group({
			price: [ '', [ Validators.required ] ],
			investigation: [ '', [ Validators.required ] ],
			workbench: [ '', [ Validators.required ] ]
		});

		this.frmNewPrice.controls['investigation'].valueChanges.subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.apmisInvestigationLookupQuery = {
					facilityId: this.selelctedFacility._id,
					name: { $regex: -1, $options: 'i' }
				};
			} else {
				this.apmisInvestigationLookupQuery = {
					facilityId: this.selelctedFacility._id,
					name: { $regex: value, $options: 'i' }
				};
			}
		});

		this.frmNewPrice.controls['workbench'].valueChanges.subscribe((value) => {
			if (value !== null && value.length === 0) {
				this.apmisLookupQuery = {
					facilityId: this.selelctedFacility._id,
					name: { $regex: -1, $options: 'i' }
				};
			} else {
				this.apmisLookupQuery = {
					facilityId: this.selelctedFacility._id,
					minorLocationId: { $in: this.locationIds },
					name: { $regex: value, $options: 'i' }
				};
			}
		});

		this.searchControl.valueChanges.debounceTime(400).distinctUntilChanged().subscribe((payload) => {
			this.investigations = [];
			this.loading = true;
			if (!!this.checkingObject.minorLocationObject && !!this.checkingObject.minorLocationObject._id) {
				this.investigationService
					.find({
						query: {
							facilityId: this.selelctedFacility._id,
							'LaboratoryWorkbenches.laboratoryId._id': this.checkingObject.minorLocationObject._id,
							name: { $regex: payload, $options: 'i' },
							$sort: { createdAt: -1 }
							// "LaboratoryWorkbenches": { $elemMatch: { 'laboratoryId._id': this.checkingObject.minorLocationObject._id } }
						}
					})
					.then((res) => {
						this.loading = false;
						if (res.data.length > 0) {
							this.investigations = res.data;
						}
					})
					.catch((err) => {});
			} else {
				this.loading = false;
			}
		});
	}

	private _getLoginEmployee(loginEmployee, majorLocationId) {
		if (loginEmployee.workSpaces !== undefined) {
			loginEmployee.workSpaces.forEach((work) => {
				work.locations.forEach((loc) => {
					if (loc.majorLocationId === majorLocationId) {
						this.locationIds.push(loc.minorLocationId);
					}
				});
			});
		}
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}

	getInvestigations(checkingObject) {
		// if (this.checkingObject !== undefined && this.checkingObject.type !== undefined && this.checkingObject.type.length > 0) {
		if (!!checkingObject.minorLocationObject && !!checkingObject.minorLocationObject._id) {
			this.investigationService
				.find({
					query: {
						facilityId: this.selelctedFacility._id,
						'LaboratoryWorkbenches.laboratoryId._id': checkingObject.minorLocationObject._id,
						$sort: { createdAt: -1 }
						// "LaboratoryWorkbenches": { $elemMatch: { 'laboratoryId._id': this.checkingObject.minorLocationObject._id } }
					}
				})
				.then((res) => {
					this.loading = false;
					if (res.data.length > 0) {
						this.investigations = res.data;
					}
				})
				.catch((err) => {});
		} else {
			this.loading = false;
		}
	}

	getWorkBenches() {
		this.workbenchService.find({ query: { laboratoryId: { $in: this.locationIds } } }).then((res) => {
			if (res.data.length > 0) {
				this.workBenches = res.data;
			}
		});
	}

	getTags() {
		if (!!this.loginEmployee.workbenchCheckIn && this.loginEmployee.workbenchCheckIn.length > 0) {
			const checkinObj = this.loginEmployee.workbenchCheckIn.filter((x) => x.isOn === true);
			if (checkinObj.length > 0) {
				this.checkingObject = checkinObj[0];
				this.tagService
					.find({
						query: {
							tagType: 'Laboratory Location',
							name: this.checkingObject.minorLocationObject.name
						}
					})
					.then((res) => {
						if (res.data.length > 0) {
							this.selectedTag = res.data[0];
						}
					});
			}
		}
		/* this.checkingObject = this.locker.getObject('workbenchCheckingObject');
    if (this.checkingObject.typeObject !== undefined) {
      this.tagService.find({ query: {
        tagType: 'Laboratory Location', name: this.checkingObject.minorLocationObject.name }
      }).then(res => {
        if (res.data.length > 0) {
          this.selectedTag = res.data[0];
        }
      });
    } */
	}

	getLaboratoryFromInvestigation(labworkBenches) {
		let retVal = '';
		labworkBenches.forEach((item) => {
			if (item.laboratoryId._id === this.checkingObject.minorLocationObject._id) {
				retVal = item.laboratoryId.name;
			}
		});
		return retVal;
	}
	getWorkbenchFromInvestigation(labworkBenches) {
		// let retVal = '';
		// const labIndex = labworkBenches.forEach(item => {
		//   const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
		//   retVal = item.workbenches[0].workBench.name
		// });
		// return retVal;
		let retVal = '';
		const labIndex = labworkBenches.forEach((item) => {
			if (this.selectedWorkBench !== undefined) {
				const workBenchIndex = item.workbenches.findIndex(
					(x) => x.workBench !== undefined && x.workBench._id === this.selectedWorkBench._id
				);
				if (item.workbenches[0].workBench !== undefined) {
					retVal = item.workbenches[0].workBench.name;
				}
			}
		});
		return retVal;
	}
	gePriceFromInvestigation(labworkBenches) {
		// let retVal = '';
		// const labIndex = labworkBenches.forEach(item => {
		//   const workBenchIndex = item.workbenches.findIndex(x => x.workBench._id === this.selectedWorkBench._id);
		//   retVal = item.workbenches[0].price;
		// });
		// return retVal;
		let retVal = '';
		const labIndex = labworkBenches.forEach((item) => {
			const workBenchIndex = item.workbenches.findIndex((x) => (x) =>
				x.workBench !== undefined && x.workBench._id === this.selectedWorkBench._id
			);
			if (item.workbenches[0] !== undefined) {
				retVal = item.workbenches[0].price;
			}
		});
		return retVal;
	}
	reqDetail(investigationPrice) {
		this.pricing_view = true;
		let retVal;
		const labIndex = investigationPrice.LaboratoryWorkbenches.forEach((item) => {
			const workBenchIndex = item.workbenches.findIndex(
				(x) => x.workBench !== undefined && x.workBench._id === this.selectedWorkBench._id
			);
			retVal = item.workbenches[0].workBench;
			this.selectedWorkBench = item.workbenches[0].workBench;
		});
		// this.selectedWorkBench = retVal;
		// this.frmNewPrice.controls['workbench'].setValue(retVal.name);
		// this.frmNewPrice.controls['investigation'].setValue(investigationPrice.name);
		// const price = this.gePriceFromInvestigation(investigationPrice.LaboratoryWorkbenches);
		// this.frmNewPrice.controls['price'].setValue(price);
		if (retVal !== undefined) {
			this.apmisLookupText = retVal.name;
			this.apmisInvestigationLookupHandleSelectedItem(investigationPrice);
		}
	}
	apmisLookupHandleSelectedItem(value) {
		this.apmisLookupText = value.name;
		this.selectedWorkBench = value;
	}

	apmisInvestigationLookupHandleSelectedItem(value) {
		this.selectedModifier = undefined;
		this.selectedModifierIndex = -1;
		this.foundPrice = false;
		this.apmisInvestigationLookupText = value.name;
		this.selectedInvestigation = value;
		if (this.selectedInvestigation.LaboratoryWorkbenches === undefined) {
			this.selectedInvestigation.LaboratoryWorkbenches = [];
			this.frmNewPrice.controls['price'].setValue(0);
		}
		this.facilityPriceService
			.find({ query: { serviceId: this.selectedInvestigation.serviceId } })
			.then((payload) => {
				this.selectedFacilityServicePrice = payload.data.length > 0 ? payload.data[0] : undefined;
				this.frmNewPrice.controls['price'].setValue(this.selectedFacilityServicePrice.price);

				if (!!this.selectedFacilityServicePrice && !!this.selectedFacilityServicePrice.modifiers) {
					this.selectedFacilityServicePrice.modifiers.forEach((item, i) => {
						if (item.tagDetails !== undefined) {
							delete item.tagDetails;
						}

						if (!!this.selectedTag._id) {
							if (
								item.tagId === this.selectedTag._id &&
								this.selectedTag.tagType === 'Laboratory Location' &&
								this.selectedTag.name === this.checkingObject.minorLocationObject.name
							) {
								this.foundPrice = true;
								this.selectedModifier = item;
								this.selectedModifierIndex = i;
								this.frmNewPrice.controls['price'].setValue(item.modifierValue);
							}
						}
					});

					if (!this.foundPrice) {
						this.frmNewPrice.controls['price'].setValue(0);
					}
				}
			});
	}

	pricing_show() {
		this.pricing_view = !this.pricing_view;
	}

	close_onClick(message: boolean): void {}

	setPrice(valid, value) {
		if (valid) {
			this.disableBtn = true;
			this.updatePrice = false;
			this.updatingPrice = true;

			if (this.selectedTag.tagDetails !== undefined) {
				delete this.selectedTag.tagDetails;
			}

			if (this.foundPrice) {
				this.selectedModifier.modifierValue = value.price;
				this.selectedFacilityServicePrice.modifiers[this.selectedModifierIndex] = this.selectedModifier;
			} else {
				const modifier: any = <any>{};
				modifier.tagId = this.selectedTag;
				modifier.modifierType = 'Amount';
				modifier.modifierValue = value.price;
				this.selectedFacilityServicePrice.modifiers.push(modifier);
			}

			const isLabExisting = false;
			let labCollectionObject: any;
			const labIndex = this.selectedInvestigation.LaboratoryWorkbenches.findIndex(
				(x) => x.laboratoryId._id === this.checkingObject.minorLocationObject._id
			);

			if (labIndex === -1) {
				// is not existing
				// create a new collection object;
				labCollectionObject = {
					laboratoryId: this.checkingObject.minorLocationObject,
					workbenches: [ { workBench: this.selectedWorkBench, price: value.price } ]
				};
				this.selectedInvestigation.LaboratoryWorkbenches.push(labCollectionObject);
			} else {
				// is existing
				labCollectionObject = this.selectedInvestigation.LaboratoryWorkbenches[labIndex];
				const index = labCollectionObject.workbenches.findIndex(
					(x) => x.workBench._id === this.selectedWorkBench._id
				);
				if (index === -1) {
					labCollectionObject.workbenches.push({ workBench: this.selectedWorkBench, price: value.price });
					this.selectedInvestigation.LaboratoryWorkbenches[labIndex] = labCollectionObject;
				} else {
					labCollectionObject.workbenches[index].price = value.price;
					this.selectedInvestigation.LaboratoryWorkbenches[labIndex] = labCollectionObject;
				}

				// labCollectionObject.workbenches[index].price = this.frmNewPrice.controls['price'].value;
				// labCollectionObject.price = this.frmNewPrice.controls['price'].value;
			}

			const payload = {
				facilityId: this.selelctedFacility._id,
				investigation: this.selectedInvestigation,
				facilityServicePrice: this.selectedFacilityServicePrice
			};

			this.investigationService
				.crudCreate(payload)
				.then((res) => {
					if (res.status === 'success') {
						this.selectedInvestigation = res.data.investigation;
						this.selectedFacilityServicePrice = res.data.facilityPrice;
						this.frmNewPrice.reset();
						this.disableBtn = false;
						this.updatePrice = true;
						this.updatingPrice = false;
						this.getInvestigations(this.checkingObject);
						this.pricing_view = false;
						this._systemModuleService.announceSweetProxy(
							'Price has been set/updated successfully!',
							'success'
						);
					} else {
						this.disableBtn = false;
						this.updatePrice = true;
						this.updatingPrice = false;
						this._systemModuleService.announceSweetProxy(res.message, 'error');
					}
				})
				.catch((err) => {});
			// const updateInvestigation$ = Observable.fromPromise(this.investigationService.update(this.selectedInvestigation));
			// const updatePrice$ = Observable.fromPromise(this.facilityPriceService.update(this.selectedFacilityServicePrice));

			// Observable.forkJoin([updateInvestigation$, updatePrice$]).subscribe((result: any) => {
			//   this.selectedInvestigation = result[0];
			//   this.selectedFacilityServicePrice = result[1];
			//   this.frmNewPrice.reset();
			//   this.frmNewPrice.controls['investigation'].reset();
			//   this.frmNewPrice.controls['workbench'].reset();
			//   this.getInvestigations();
			//   this.pricing_view = false;
			//   this._systemModuleService.announceSweetProxy('Price has been set/updated successfully!', 'success');
			// });
		} else {
			this._systemModuleService.announceSweetProxy('Please fill in all required fields!', 'error');
			this.disableBtn = false;
		}
	}

	getLaboratoryMajorLocation(loginEmployee) {
		this._locationService.find({ query: { name: 'Laboratory' } }).then((res) => {
			if (res.data.length > 0) {
				this.selectedMajorLocation = res.data[0];
				this._getLoginEmployee(loginEmployee, this.selectedMajorLocation._id);
			}
		});
	}

	ngOnDestroy() {
		this.labSubscription.unsubscribe();
	}
}
