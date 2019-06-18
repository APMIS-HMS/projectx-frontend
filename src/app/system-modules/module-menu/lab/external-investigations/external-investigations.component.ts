import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	FacilitiesService,
	LaboratoryRequestService,
	InvestigationService
} from '../../../../services/facility-manager/setup/index';
import { Facility, PendingLaboratoryRequest, InvestigationModel } from '../../../../models/index';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';

@Component({
	selector: 'app-external-investigations',
	templateUrl: './external-investigations.component.html',
	styleUrls: [ './external-investigations.component.scss' ]
})
export class ExternalInvestigationsComponent implements OnInit {
	patientSearch = new FormControl();
	selectedInvestigation: any = <any>{};
	selectedLabRequest: any = <any>{};
	facility: Facility = <Facility>{};
	extRequests: any = [];
	investigations: any = [];
	allInvestigationWithExternal: any = [];
	loading: Boolean = true;
	showBilling: Boolean = false;
	searchOpen = false;
	mainErr: boolean = true;
	errMsg = 'You have unresolved errors';

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _investigationService: InvestigationService,
		private _systemModuleService: SystemModuleService,
		private _laboratoryRequestService: LaboratoryRequestService
	) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this._getAllRequests();

		this.patientSearch.valueChanges
			.debounceTime(400)
			.distinctUntilChanged()
			.do((val) => {
				this.extRequests = [];
				this.loading = true;
			})
			.switchMap((term) =>
				Observable.fromPromise(
					this._laboratoryRequestService.customFind({
						query: { search: term, facilityId: this.facility._id }
					})
				)
			)
			.subscribe((res: any) => {
				if (res.status === 'success') {
					const extlabRequests = [];
					res.data.forEach((element) => {
						element.investigations.forEach((item) => {
							if (item.isExternal) {
								// Check if the request id already exists in the array.
								const checkDuplicate = this.allInvestigationWithExternal.filter(
									(x) => x._id === element._id
								);
								if (checkDuplicate.length === 0) {
									this.allInvestigationWithExternal.push(element);
								}
								let pending: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
								pending.investigationId = item.investigation._id;
								pending.investigation = item.investigation;
								pending.labRequestId = element._id;
								pending.clinicalInformation = element.clinicalInformation;
								pending.facility = element.facilityId;
								pending.updatedAt = element.updatedAt;
								pending.diagnosis = element.diagnosis;
								pending.name = `${element.personDetails.firstName} ${element.personDetails.lastName}`;
								pending.createdBy = `${element.employeeDetails.firstName} ${element.employeeDetails
									.lastName}`;
								pending.service = item.investigation.serviceId;
								pending.isExternal = item.isExternal;
								pending.isUrgent = item.isUrgent;
								pending.specimen = item.investigation.specimen;
								pending.personId = element.personDetails._id;
								extlabRequests.push(pending);
							}
						});
					});
					this.extRequests = extlabRequests;
				}
			});

		// this.extRequestFormGroup.controls['date'].valueChanges.subscribe(value => {
		//   this._laboratoryRequestService.find({ query: { dateExternalInvestigation: true, date: value } }).then(payload => {
		//   })
		// });
	}

	onClickSaveCost() {
		if (!!this.selectedLabRequest._id) {
			this._laboratoryRequestService
				.patch(this.selectedLabRequest._id, this.selectedLabRequest, {})
				.then((res) => {
					const text =
						'You have successfully attended to an external request. You can now write report for the investigation';
					this._systemModuleService.announceSweetProxy(text, 'success');
					this.onClickClose(true);
				});
		}
	}

	attendToInvestigation(investigation) {
		// Check if the investigation is a valid investigation  by checking if the id exists.
		if (!!investigation.labRequestId) {
			this.showBilling = true;
			this.selectedInvestigation = investigation;
			this.getInvestigationPrice(investigation);
		}
	}

	locationChanged($event, investigation: InvestigationModel, location, LaboratoryWorkbenches) {
		// const ids: any[] = [];
		// if (investigation.investigation.isPanel) {
		//   const isInBind = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
		//   if (isInBind > -1) {
		//     this.bindInvestigations.splice(isInBind, 1);
		//   }
		//   investigation.investigation.panel.forEach((child, k) => {
		//     // child.isChecked = true;
		//     ids.push(child.investigation._id);
		//   });

		//   // i need prices for the two children investigation and their prices
		//   const labId = location.laboratoryId._id;
		//   this._investigationService.find({ query: { '_id': { $in: ids } } }).then(payload => {
		//     const tempList: any[] = [];
		//     payload.data.forEach((item, j) => {
		//       const index = item.LaboratoryWorkbenches.findIndex(x => x.laboratoryId._id === location.laboratoryId._id);
		//       if (index > -1) {
		//         const withId = item.LaboratoryWorkbenches[index];
		//         withId.investigationId = item._id
		//         tempList.push(withId);
		//       }
		//     })
		//     investigation.temporaryInvestigationList = tempList;
		//   })
		//   investigation.location = location;
		//   this.bindInvestigations.push(investigation);
		// } else {
		// const isInBind = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
		// if (isInBind > -1) {
		//   this.bindInvestigations.splice(isInBind, 1);
		// }
		// const copyBindInvestigation = JSON.parse(JSON.stringify(investigation));
		// copyBindInvestigation.location = location;
		// copyBindInvestigation.LaboratoryWorkbenches = [];
		// copyBindInvestigation.LaboratoryWorkbenches.push(location);
		// copyBindInvestigation.investigation.LaboratoryWorkbenches = copyBindInvestigation.LaboratoryWorkbenches;
		// copyBindInvestigation.isBilled = true;
		// const index = this.investigationData.index;
		// this.extRequests.investigationItems[index].investigation = copyBindInvestigation;
		// this.extRequests.investigationItems[index].isBilled = true;
		// this.selectedInvestigation.investigation.investigation = copyBindInvestigation;
		// this.selectedInvestigation.investigation.isBilled = true;
		// this.bindInvestigations.push(copyBindInvestigation);
		// }
		const addLocation = this.allInvestigationWithExternal.filter(
			(x) => x._id === this.selectedInvestigation.labRequestId
		);
		if (addLocation.length > 0) {
			// attach the laboratoryWorkbenches to the selected investigation
			const investigationToAttachLocation = addLocation[0].investigations.filter(
				(x) => x.investigation._id === this.selectedInvestigation.investigationId
			);
			investigationToAttachLocation[0].investigation.LaboratoryWorkbenches = LaboratoryWorkbenches;
			investigationToAttachLocation[0].investigation.updatedAt = new Date();
			investigationToAttachLocation[0].isExternal = false;
			this.selectedLabRequest = addLocation[0];
		}
	}

	// Get all drugs from generic
	private _getAllRequests() {
		// this._laboratoryRequestService.findAll().then(res => {
		this._laboratoryRequestService
			.customFind({
				query: {
					facilityId: this.facility._id,
					$sort: { createdAt: -1 }
				}
			})
			.then((res) => {
				const extlabRequests = [];
				this.loading = false;
				if (res.status === 'success') {
					res.data.forEach((element) => {
						element.investigations.forEach((item) => {
							if (item.isExternal) {
								// Check if the request id already exists in the array.
								const checkDuplicate = this.allInvestigationWithExternal.filter(
									(x) => x._id === element._id
								);
								if (checkDuplicate.length === 0) {
									this.allInvestigationWithExternal.push(element);
								}
								let pending: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};
								pending.investigationId = item.investigation._id;
								pending.investigation = item.investigation;
								pending.labRequestId = element._id;
								pending.clinicalInformation = element.clinicalInformation;
								pending.facility = element.facilityId;
								pending.updatedAt = element.updatedAt;
								pending.diagnosis = element.diagnosis;
								pending.name = `${element.personDetails.firstName} ${element.personDetails.lastName}`;
								pending.createdBy = `${element.employeeDetails.firstName} ${element.employeeDetails
									.lastName}`;
								pending.service = item.investigation.serviceId;
								pending.isExternal = item.isExternal;
								pending.isUrgent = item.isUrgent;
								pending.specimen = item.investigation.specimen;
								pending.personId = element.personDetails._id;
								extlabRequests.push(pending);
							}
						});
					});
					this.extRequests = extlabRequests;
				}
			})
			.catch((err) => {});
	}

	getInvestigationPrice(selectedInvestigation) {
		const index = selectedInvestigation.index;
		const title = selectedInvestigation.investigation.name;

		this._investigationService.find({ query: { facilityId: this.facility._id, name: title } }).then((res) => {
			this.investigations = [];
			this.loading = false;
			if (res.data.length > 0) {
				res.data.forEach((item) => {
					const investigation: InvestigationModel = <InvestigationModel>{};
					investigation.investigation = item;
					investigation.LaboratoryWorkbenches = item.LaboratoryWorkbenches;
					investigation.isExternal = false;
					investigation.isUrgent = false;
					investigation.isChecked = false;
					const listItems: any[] = [];
					this.investigations.push(investigation);
				});
			}
		});
	}

	getPrice(workbenches) {
		return workbenches[0].price;
	}

	openSearch() {
		this.searchOpen = !this.searchOpen;
	}

	onClickClose(event) {
		this.showBilling = false;
		this._getAllRequests();
	}
}
