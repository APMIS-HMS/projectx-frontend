import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Facility, Prescription, PrescriptionItem, InvestigationModel } from '../../../../../../../models/index';
import {
	FacilitiesService,
	ProductService,
	FacilityPriceService,
	InventoryService,
	AssessmentDispenseService,
	InvestigationService
} from '../../../../../../../services/facility-manager/setup/index';

@Component({
	selector: 'app-bill-investigation',
	templateUrl: './bill-investigation.component.html',
	styleUrls: [ './bill-investigation.component.scss' ]
})
export class BillInvestigationComponent implements OnInit {
	@Input() investigationData: any = <any>{};
	@Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
	facility: Facility = <Facility>{};
	user: any = <any>{};
	addBillForm: FormGroup;
	investigations: any[] = [];
	bindInvestigations: InvestigationModel[] = [];
	// selectedDrug: string = '';
	itemCost: number = 0;
	title: string = '';
	cost: number = 0; // Unit price for each drug.
	totalCost: number = 0; // Total price for each drug selected.
	totalQuantity: number = 0;
	batchNumber: string = '';
	qtyInStores: number = 0;
	storeId: string = '';
	stores: any = [];
	editPrice = false;
	loading: boolean = true;
	serviceId: string = '';
	facilityServiceId: string = '';
	categoryId: string = '';
	mainErr: boolean = true;
	errMsg = 'You have unresolved errors';
	costForm = new FormControl();

	constructor(
		private _fb: FormBuilder,
		private _locker: CoolLocalStorage,
		private _productService: ProductService,
		private _facilityService: FacilitiesService,
		private _facilityPriceService: FacilityPriceService,
		private _inventoryService: InventoryService,
		private _investigationService: InvestigationService,
		private _assessmentDispenseService: AssessmentDispenseService
	) {}

	ngOnInit() {
		this.facility = <Facility>this._locker.getObject('selectedFacility');
		this.user = this._locker.getObject('auth');

		this.getInvestigationPrice();
	}

	onChangePrice(index) {
		this.investigations[index].changedPrice = this.costForm.value;
	}

	//
	onClickSaveCost() {
		this.onClickClose(true);
		// if (valid) {
		// 	if (this.cost > 0 && value.qty > 0 && (value.drug !== undefined || value.drug === '')) {
		// 		let index = this.investigationData.index;
		// 		this.investigationData.prescriptionItems[index].productId = value.drug;
		// 		this.investigationData.prescriptionItems[index].serviceId = this.serviceId;
		// 		this.investigationData.prescriptionItems[index].facilityServiceId = this.facilityServiceId;
		// 		this.investigationData.prescriptionItems[index].categoryId = this.categoryId;
		// 		// this.investigationData.prescriptionItems[index].productName = this.selectedDrug;
		// 		this.investigationData.prescriptionItems[index].quantity = value.qty;
		// 		this.investigationData.prescriptionItems[index].quantityDispensed = 0;
		// 		this.investigationData.prescriptionItems[index].cost = this.cost;
		// 		this.investigationData.prescriptionItems[index].totalCost = this.cost * value.qty;
		// 		this.investigationData.prescriptionItems[index].isBilled = true;
		// 		this.investigationData.prescriptionItems[index].facilityId = this.facility._id;
		// 		this.investigationData.totalCost += this.totalCost;
		// 		this.investigationData.totalQuantity += this.totalQuantity;

		// 		this.closeModal.emit(true);
		// 	} else {
		// 		this._notification('Error', 'Unit price or Quantity is less than 0!');
		// 	}
		// } else {
		// 	this.mainErr = false;
		// }
	}

	getInvestigationPrice() {
		const index = this.investigationData.index;
		this.title = this.investigationData.investigationItems[index].name;

		this._investigationService.find({ query: { facilityId: this.facility._id, name: this.title } }).then((res) => {
			this.loading = false;
			res.data.forEach((item) => {
				const investigation: InvestigationModel = <InvestigationModel>{};
				investigation.investigation = item;
				investigation.LaboratoryWorkbenches = item.LaboratoryWorkbenches;
				investigation.isExternal = false;
				investigation.isUrgent = false;
				investigation.isChecked = false;
				const listItems: any[] = [];
				this.investigations.push(investigation);
				// if (item.isPanel) {
				//   item.panel.forEach(inItem => {
				//     const innerChild = <InvestigationModel>{};
				//     innerChild.investigation = inItem;
				//     innerChild.isExternal = false;
				//     innerChild.isUrgent = false;
				//     innerChild.isChecked = false;
				//     listItems.push(innerChild);
				//   });
				//   investigation.investigation.panel = listItems;
				//   this.investigations.push(investigation);
				// } else {
				//   this.investigations.push(investigation);
				// }
			});
		});
	}

	investigationChanged(
		$event,
		investigation: InvestigationModel,
		childInvestigation?: InvestigationModel,
		isChild = false
	) {
		if ($event.checked || childInvestigation !== undefined) {
			if (investigation.investigation.isPanel) {
				// isPanel
				if (childInvestigation !== undefined) {
					// also send child investigation
					childInvestigation.isChecked = true;
					const found = false;
					const childIndex = investigation.investigation.panel.findIndex(
						(x) => x.investigation._id === childInvestigation.investigation._id
					);
					if (childIndex > -1) {
						const copyInvestigation = JSON.parse(JSON.stringify(investigation));
						investigation.investigation.panel.forEach((item, i) => {
							if (i !== childIndex) {
								copyInvestigation.investigation.panel.splice(i, 1);
							}
						});
						const isInBind = this.bindInvestigations.findIndex(
							(x) => x.investigation._id === copyInvestigation.investigation._id
						);
						if (isInBind > -1) {
							if ($event.checked) {
								if (
									this.bindInvestigations[isInBind].investigation.panel.findIndex(
										(x) => x._id === copyInvestigation.investigation.panel[0]._id
									) >= 0
								) {
									this.bindInvestigations[isInBind].investigation.panel.push(
										copyInvestigation.investigation.panel[0]
									);
									if (
										this.bindInvestigations[isInBind].investigation.panel.length ===
										investigation.investigation.panel.length
									) {
										investigation.isChecked = true;
									} else {
										investigation.isChecked = false;
									}
								}
							} else {
								const indexToRemove = this.bindInvestigations[isInBind].investigation.panel.findIndex(
									(x) => x.investigation._id === childInvestigation.investigation._id
								);
								this.bindInvestigations[isInBind].investigation.panel.splice(indexToRemove, 1);
								childInvestigation.isChecked = false;

								if (
									this.bindInvestigations[isInBind].investigation.panel.length === 0 ||
									investigation.isChecked
								) {
									if (!investigation.isChecked) {
										this.bindInvestigations.splice(0, 1);
									}

									investigation.isChecked = false;
								}
							}
						} else {
							this.bindInvestigations.push(copyInvestigation);
						}
					}
				} else {
					// without child investigation
					const copyInvestigation = JSON.parse(JSON.stringify(investigation));
					const isInBind = this.bindInvestigations.findIndex(
						(x) => x.investigation._id === copyInvestigation.investigation._id
					);
					if (isInBind > -1) {
						if ($event.checked) {
							// investigation.isChecked = true;
							investigation.investigation.panel.forEach((child, k) => {
								if (
									this.bindInvestigations[isInBind].investigation.panel.findIndex(
										(x) => x.investigation._id === child.investigation._id
									) < 0
								) {
									// child.isChecked = true;
									if (
										this.bindInvestigations[isInBind].investigation.panel.length ===
										investigation.investigation.panel.length
									) {
										investigation.isChecked = true;
									} else {
										investigation.isChecked = false;
									}
								}
							});
						}
					} else {
						investigation.isChecked = true;
						// copyInvestigation = JSON.parse(JSON.stringify(investigation));
						// this.bindInvestigations.push(copyInvestigation);
						// check all children

						if (investigation.investigation.isPanel) {
							investigation.investigation.panel.forEach((child, k) => {
								// child.isChecked = true;
							});
						}
					}
					// investigation.LaboratoryWorkbenches = pay.LaboratoryWorkbenches;
				}
			} else {
				// checked without panel
				if ($event.checked) {
					// this.bindInvestigations.push(investigation);
					investigation.isChecked = true;
					investigation.LaboratoryWorkbenches = investigation.LaboratoryWorkbenches;
				} else {
					const indexToRemove = this.bindInvestigations.findIndex(
						(x) => x.investigation._id === investigation.investigation._id
					);
					this.bindInvestigations.splice(indexToRemove, 1);
				}
			}
		} else {
			const indexToRemove = this.bindInvestigations.findIndex(
				(x) => x.investigation._id === investigation.investigation._id
			);
			this.bindInvestigations.splice(indexToRemove, 1);
			// unchecked panel and uncheched all children
			if (investigation.investigation.isPanel) {
				investigation.investigation.panel.forEach((child, k) => {
					child.isChecked = false;
				});
				investigation.isChecked = false;
				investigation.isExternal = false;
				investigation.isUrgent = false;
			} else {
				investigation.isChecked = false;
				investigation.isExternal = false;
				investigation.isUrgent = false;
			}
		}
	}

	// markExternal(event, investigation: InvestigationModel) {
	//   if (event.checked) {
	//     delete investigation.location;
	//     const indexToRemove = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
	//     if (indexToRemove > -1) {
	//       this.bindInvestigations.splice(indexToRemove, 1)
	//     }

	//     investigation.isExternal = true;
	//     const copyBindInvestigation = JSON.parse(JSON.stringify(investigation));
	//     delete copyBindInvestigation.LaboratoryWorkbenches;
	//     delete copyBindInvestigation.investigation.LaboratoryWorkbenches;
	//     this.bindInvestigations.push(copyBindInvestigation);
	//   } else {
	//     const indexToRemove = this.bindInvestigations.findIndex(x => x.investigation._id === investigation.investigation._id);
	//     if (indexToRemove > -1) {
	//       this.bindInvestigations.splice(indexToRemove, 1)
	//     }
	//     investigation.isExternal = false;
	//     this.investigationChanged({ checked: true }, investigation);
	//   }
	// }

	locationChanged($event, investigation: InvestigationModel, location, LaboratoryWorkbenches) {
		const ids: any[] = [];
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
		const isInBind = this.bindInvestigations.findIndex(
			(x) => x.investigation._id === investigation.investigation._id
		);
		if (isInBind > -1) {
			this.bindInvestigations.splice(isInBind, 1);
		}
		const copyBindInvestigation = JSON.parse(JSON.stringify(investigation));
		copyBindInvestigation.location = location;
		copyBindInvestigation.LaboratoryWorkbenches = [];
		copyBindInvestigation.LaboratoryWorkbenches.push(location);
		copyBindInvestigation.investigation.LaboratoryWorkbenches = copyBindInvestigation.LaboratoryWorkbenches;
		copyBindInvestigation.isBilled = true;
		const index = this.investigationData.index;
		this.investigationData.investigationItems[index].investigation = copyBindInvestigation;
		this.investigationData.investigationItems[index].isBilled = true;
		this.bindInvestigations.push(copyBindInvestigation);
		// }
	}

	onEditPrice() {
		this.editPrice = !this.editPrice;
	}

	getPrice(workbenches) {
		return workbenches[0].price;
	}

	onClickCustomSearchItem(event, drugId) {
		// this.selectedDrug = drugId.viewValue;
		// const pId = drugId._element.nativeElement.getAttribute('data-p-id');
		// this.serviceId = drugId._element.nativeElement.getAttribute('data-p-sId');
		// this.facilityServiceId = drugId._element.nativeElement.getAttribute('data-p-fsid');
		// this.categoryId = drugId._element.nativeElement.getAttribute('data-p-cid');
		// this.cost = parseInt(drugId._element.nativeElement.getAttribute('data-p-price'));
		// this.qtyInStores = parseInt(drugId._element.nativeElement.getAttribute('data-p-tqty'));
		// const pAqty = drugId._element.nativeElement.getAttribute('data-p-aqty');
	}

	onClickClose(e) {
		this.closeModal.emit(true);
	}

	private _notification(type: string, text: string) {
		this._facilityService.announceNotification({
			users: [ this.user._id ],
			type: type,
			text: text
		});
	}
}
