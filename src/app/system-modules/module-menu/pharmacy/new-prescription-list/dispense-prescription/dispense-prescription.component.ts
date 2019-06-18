import { Component, OnInit, Output, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
	Facility,
	Prescription,
	PrescriptionItem,
	Dispense,
	Inventory,
	InventoryTransaction,
	User,
	DispensedArray,
	BatchTransaction,
	DispenseByPrescription,
	DispenseItem,
	BillItem
} from '../../../../../models/index';
import { PharmacyEmitterService } from '../../../../../services/facility-manager/pharmacy-emitter.service';
import {
	PrescriptionService,
	InventoryTransactionTypeService,
	InventoryService,
	BillingService,
	EmployeeService,
	AssessmentDispenseService,
	FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { ISubscription } from 'rxjs/Subscription';
import { SystemModuleService } from '../../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';


@Component({
  selector: 'app-dispense-prescription',
  templateUrl: './dispense-prescription.component.html',
  styleUrls: ['./dispense-prescription.component.scss']
})
export class DispensePrescriptionComponent implements OnInit, OnDestroy, AfterViewInit {

  clickItemIndex: number;
	expand_row = false;

  @Output() prescriptionItems: Prescription = <Prescription>{};
	@Output() isExternalPrescription = false;
	@Input() employeeDetails: any;
	facility: Facility = <Facility>{};
	user: User = <User>{};
	selectedPrescription: PrescriptionItem = <PrescriptionItem>{};
	unBilledArray: PrescriptionItem[] = [];
	billshow = false;
	prescriptionId = '';
	prescriptions: any[] = [];
	//patientPrescription: Prescription[]; // Joseph added this to get patient presicription for prescribe table
	transactions: Inventory = <Inventory>{};
	viewTransactions: InventoryTransaction[] = [];
	store: any = {};
	storeId: string;
	selectedIventoryId: string;
	selectedBatch: any;
	totalQuantity = 0;
	totalCost = 0;
	loading = true;
	batchLoading = true;
	disableDispenseBtn = false;
	disableDispenseAllBtn = true;
	qtyDispenseBtn = true;
	qtyDispensingBtn = false;
	inventoryTransactionTypeId: string;
	disablePaymentBtn = false;
	disableSaveBtn = false;
	paymentStatusText = true;
	paymentStatusTexting = false;
	dispenseAllBtnText = true;
	dispensingAllBtnText = false;
	saveBtn = true;
	savingBtn = false;
	subscription: ISubscription;

  constructor(
		// private _fb: FormBuilder,
		private _route: ActivatedRoute,
		private _router: Router,
		private _locker: CoolLocalStorage,
		private _facilityService: FacilitiesService,
		private _pharmacyEventEmitter: PharmacyEmitterService,
		private _prescriptionService: PrescriptionService,
		// private _dispenseService: DispenseService,
		private _assessmentDispense: AssessmentDispenseService,
		private _inventoryService: InventoryService,
		private _employeeService: EmployeeService,
		// private _medicationListService: MedicationListService,
		private _authFacadeService: AuthFacadeService,
		private _systemModuleService: SystemModuleService,
		private _billingService: BillingService,
		private _inventoryTransactionTypeService: InventoryTransactionTypeService // private _externalPrescriptionService: ExternalPrescriptionService*/
	) {
		const url: String = this._router.url;
		// let url = window.location.href;
		if (url.includes('pharmacy/external-prescriptions')) {
			this.isExternalPrescription = true;
		} else {
			this.isExternalPrescription = false;
		}

		this._authFacadeService
			.getLogingEmployee()
			.then((res: any) => {
				this.employeeDetails = res;
				if (!!res.storeCheckIn && res.storeCheckIn.length > 0) {
					const store = res.storeCheckIn.filter((x) => x.isOn);
					if (store.length > 0) {
						this.store = store[0];
						this.storeId = store[0].storeId;
					}
				}
			})
			.catch((err) => {});

		this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
			if (!!res && !!res.typeObject) {
				this.store = res.typeObject;
				this.storeId = res.typeObject.storeId;
			}
		});
	}

  ngOnInit() {
    this._pharmacyEventEmitter.setRouteUrl('Prescription Details');
		this.facility = <Facility>this._locker.getObject('selectedFacility'); 

		this._route.params.subscribe((params) => {
			this.prescriptionId = params['id'];			
		});
		
		this._getPrescriptionDetails();
		this._getInventoryTransactionTypes();
  }

  ngAfterViewInit(){
	  // send patient prescription
	  //console.log(this.patientPrescription +' prescription before sending')
	//this._pharmacyEventEmitter.sendPrescription(this.patientPrescription);
  }


  // Save prescription
	onClickSavePrescription() {
		const tempArray = [];
		// Get the billed items from the unbilled items
		this.unBilledArray.forEach((element, i) => {
			// Billed items
			if (element.isBilled || element.isExternal) {
				tempArray.push(element);
			}
		});

		if (tempArray.length > 0) {
			this.disableSaveBtn = true;
			this.saveBtn = false;
			this.savingBtn = true;

			if (!this.isExternalPrescription) {
				this._isPrescriptionLogic();
			} else {
				this._isExternalPrescriptonLogic();
			}
		} else {
			this._systemModuleService.announceSweetProxy('Please bill the prescribed drugs above.', 'error');
		}
	}

	// Dispense prescription
	onClickDispense() {
		if (this.prescriptions.length > 0) {
			this.disableDispenseAllBtn = true;
			this.dispenseAllBtnText = false;
			this.dispensingAllBtnText = true;
			const dispenseArray = [];
			const externalDrug = [];

			this.prescriptionItems.prescriptionItems.forEach((element) => {
				if (!element.isExternal && element.isBilled) {
					// Change the value of isDispensed to true;
					element.isDispensed = true;
					const dispenseItem = <DispenseItem>{
						product: element.isExternal === false ? element.productName : '',
						cost: element.cost,
						quantity: element.quantity === undefined ? 0 : element.quantity,
						refillCount: element.refillCount === undefined ? 0 : element.refillCount,
						isExternal: element.isExternal,
						instruction: element.patientInstruction
					};

					// Push all dispenseItem into dispenseArray
					dispenseArray.push(dispenseItem);
				}
			});

			const prescription = <DispenseByPrescription>{
				prescriptionId: this.prescriptionItems._id,
				employeeId: this.employeeDetails._id,
				patientId: this.prescriptionItems.patientId,
				drugs: dispenseArray,
				totalQuantity: this.totalQuantity,
				totalCost: this.totalCost
			};
			const dispense = <Dispense>{
        facilityId: this.facility._id,
				prescription: prescription,
				isPrescription: true,
				storeId: this.storeId
			};

			this._assessmentDispense
				.update(this.prescriptionItems._id, dispense)
				.then((res) => {
					if (res.status === 'success') {
						this.disableDispenseAllBtn = true;
						this.dispenseAllBtnText = true;
						this.dispensingAllBtnText = false;
						this._systemModuleService.announceSweetProxy(
							'Product(s) has been dispensed successfully!',
							'success'
						);
					} else {
						this.disableDispenseAllBtn = false;
						this.dispenseAllBtnText = true;
						this.dispensingAllBtnText = false;
						this._systemModuleService.announceSweetProxy(res.message, 'error');
					}
				})
				.catch((err) => {});
		} else {
			this._systemModuleService.announceSweetProxy(
				'Please Bill the drugs that has been prescribed above.',
				'error'
			);
		}
	}

	// Get all drugs from generic
	private _getPrescriptionDetails() {
		this._prescriptionService
			.get(this.prescriptionId, {})
			.then((res) => {
				this.loading = false;

				//added by joseph			
				
				// send patient prescription to prescribe table component
				setTimeout(()=>{
					this._pharmacyEventEmitter.sendPrescription(res);
					//console.log(this);
				}, 500);						
               //end addition
				
				// Check if the page is for prescription or external prescription
				if (!this.isExternalPrescription) {
					this.prescriptionItems = res;

					const notBilled = this.prescriptionItems.prescriptionItems.filter(
						(x) => (x.quantity !== x.quantityDispensed || !x.isDispensed) && !x.isDispensed && !x.isExternal
					);
					if (notBilled.length > 0) {
						this.disableDispenseAllBtn = true;
					} else {
						this.disableDispenseAllBtn = false;
					}

					if (this.prescriptionItems.isDispensed) {
						this.disableDispenseAllBtn = true;
						this.dispenseAllBtnText = true;
						this.dispensingAllBtnText = false;
					}

					// Reset all the prescriptionItem.transactions to an empty array.
					this.prescriptionItems.prescriptionItems.forEach((element) => {
						// Billed items
						if (element.isBilled || element.isExternal) {
							if (element.quantity !== undefined && element.totalCost !== undefined) {
								this.totalQuantity += element.quantity;
								this.totalCost += element.totalCost;
							}

							if (element.isExternal) {
								element.quantity = 0;
								element.quantityDispensed = 0;
							}
							// Add the payment status on the fly
							element.paymentCompleted = false;
							this.prescriptions.push(element);
						}

						// Unbilled items
						if (!element.isBilled) {
							this.unBilledArray.push(element);													
						}
						element.transactions = [];
					});

					// if (this.prescriptions.length > 0) {
					// 	this._getPaymentStatus();
					// }
				} else {
					console.log('external');
					// Filter the external prescriptions only
					const external = res.prescriptionItems.filter(
						(x) =>
							(!x.isDispensed && (!!x.facilityId && x.isBilled && x.facilityId === this.facility._id)) ||
							x.isExternal
					);
					res.prescriptionItems = external;
					this.prescriptionItems = res;										
              
					// Reset all the prescriptionItem.transactions to an empty array.
					this.prescriptionItems.prescriptionItems.forEach((element) => {
						// Billed items
						if (element.isBilled || element.isExternal) {
							if (element.quantity !== undefined && element.totalCost !== undefined) {
								this.totalQuantity += element.quantity;
								this.totalCost += element.totalCost;
							}

							if (element.isExternal) {
								element.quantity = 0;
								element.quantityDispensed = 0;
							}
							// Add the payment status on the fly
							element.paymentCompleted = false;
							this.prescriptions.push(element);
						}

						// Unbilled items
						if (!element.isBilled) {
							this.unBilledArray.push(element);
						}
						element.transactions = [];
					});
				}
			})
			.catch((err) => {});
	}

	onClickEachPrescription(index, prescription) {
		if (!!this.inventoryTransactionTypeId) {
			if (prescription.isBilled) {
				if (prescription.paymentCompleted) {
					if (!!this.storeId) {
						this.selectedPrescription = prescription;
						this.selectedPrescription.isOpen = !this.selectedPrescription.isOpen;
						const productId = prescription.productId;
						// Get the batches for the selected product
						this._inventoryService
							.find({
								query: {
									facilityId: this.facility._id,
									productId: productId,
									storeId: this.storeId
								}
							})
							.then((res) => {
								this.batchLoading = false;
								if (res.data.length > 0) {
									this.transactions = res.data[0];
									const tempArray = [];
									// Display only batches that have qty greater than 0.
									if (res.data[0].transactions.length !== 0) {
										res.data[0].transactions.forEach((element) => {
											if (element.quantity > 0) {
												tempArray.push(element);
											}
										});
									}
									if (tempArray.length !== 0) {
										this.viewTransactions = tempArray;
									} else {
										this.viewTransactions = [];
									}
								} else {
									this.viewTransactions = [];
								}
							})
							.catch((err) => {});
					} else {
						this._systemModuleService.announceSweetProxy('Please check into store!', 'error');
					}
				} else {
					this._systemModuleService.announceSweetProxy(
						'Patient has not paid for this item, so you can not dispense it!',
						'error'
					);
				}
			} else {
				this._systemModuleService.announceSweetProxy(
					'This item is marked external, you can not bill the patient!',
					'error'
				);
			}
		} else {
			const msg = 'Please contact your implementation specialist to include inventory transaction types.';
			this._systemModuleService.announceSweetProxy(msg, 'error');
		}
	}

	onClickBillProduct(parentIndex, index, batch, inputBatch) {
		const item = this.prescriptionItems.prescriptionItems.filter(
			(e) => e._id === this.prescriptions[parentIndex]._id
		);
		const itemId = item[0]._id;
		const selectedItem = item[0];
		// Input validation
		if (inputBatch[index] <= 0 || inputBatch[index] === '' || isNaN(inputBatch[index])) {
			this._systemModuleService.announceSweetProxy('Please enter a valid number greater than 0.', 'error');
		} else {
			// Check if the qty entered is less than or equal to the qty needed.
			if (inputBatch[index] <= selectedItem.quantity) {
				// Check if the qty entered plus the quantity dispensed already,
				// if it's less than or equal to the qty needed to dispense.
				const qtyPlusQtyToDispense = selectedItem.quantityDispensed + inputBatch[index];
				if (selectedItem.quantity - qtyPlusQtyToDispense >= 0) {
					if (!!this.storeId) {
						// disable the dispense button.
						this.disableDispenseBtn = true;
						this.qtyDispenseBtn = false;
						this.qtyDispensingBtn = true;
						// Update the quantityDispensed in the selected item.
						const itemIndex = this.prescriptionItems.prescriptionItems.findIndex((x) => x._id === itemId);
						this.prescriptionItems.prescriptionItems[itemIndex].quantityDispensed += inputBatch[index];
						this.prescriptionItems.prescriptionItems[itemIndex].storeId = this.storeId;
						// Build the dispense client model
						this._dispensedBatchTracking(itemIndex, inputBatch[index], batch.batchNumber);
						this._batchTransactionTracking(index, inputBatch[index], batch, itemIndex);
						const payload = {
							prescriptionId: this.prescriptionItems._id,
							inventoryTransactionTypeId: this.inventoryTransactionTypeId,
							qty: inputBatch[index],
							facilityId: this.facility._id,
							inventoryId: this.selectedIventoryId,
							batch: this.selectedBatch,
							prescriptionItem: selectedItem
						};
						// Make a call to update the prescription with the qty dispensed
						this._assessmentDispense
							.create(payload)
							.then((res) => {
								if (res.status === 'success') {
									const msg = `${inputBatch[
										index
									]} item(s) has been deducted from your inventory successfully.`;
									this._systemModuleService.announceSweetProxy(msg, 'success');
									this.prescriptionItems = res.data;
									this.prescriptions = [];
									this.totalCost = 0;
									this.totalQuantity = 0;
									this.disableDispenseBtn = false;
									this.qtyDispenseBtn = true;
									this.qtyDispensingBtn = false;
									this._getPrescriptionDetails();
								} else {
									this._systemModuleService.announceSweetProxy(res.message, 'error');
								}
							})
							.catch((err) => {});
					} else {
						this._systemModuleService.announceSweetProxy('Please check into store!', 'error');
					}
				} else {
					this._systemModuleService.announceSweetProxy(
						'The quantity entered is greater than the quantity requested!',
						'error'
					);
				}
			} else {
				this._systemModuleService.announceSweetProxy(
					'The quantity entered is greater than the quantity requested!',
					'error'
				);
			}
		}
	}

	billToggle() {
		this.billshow = !this.billshow;
	}

	onClickRefreshPaymentStatus() {
		this._getPaymentStatus();
	}

	// Dispense resolver
	private _dispensedBatchTracking(index: number, qty: number, bNumber: string): void {
		const dispensedKey = this.prescriptionItems.prescriptionItems[index];
		let orderIndex = 0;

		if (dispensedKey.dispensed.dispensedArray === undefined) {
			orderIndex = orderIndex;
		} else {
			orderIndex = dispensedKey.dispensed.dispensedArray.length;
		}

		dispensedKey.dispensed.totalQtyDispensed = dispensedKey.quantityDispensed;
		dispensedKey.dispensed.outstandingBalance = dispensedKey.quantity - dispensedKey.quantityDispensed;

		const { description, facilityId, minorLocationId, name } = this.store.storeObject;
		const store = { description, facilityId, minorLocationId, name };
		const employee = {
			name: `${this.prescriptionItems.employeeDetails.firstName} ${this.prescriptionItems.employeeDetails
				.lastName}`,
			employeeId: this.prescriptionItems.employeeId
		};

		const item: DispensedArray = {
			orderIndex: orderIndex, // unique
			dispensedDate: new Date(),
			batchNumber: bNumber,
			qty: qty,
			employee,
			store,
			unitBilledPrice: dispensedKey.cost,
			totalAmount: dispensedKey.cost * qty
		};

		dispensedKey.dispensed.dispensedArray.push(item);
	}

	private _batchTransactionTracking(index: number, qty: number, batch: any, item?) {
		// Deduct from the batches before updating the batches in the inventory.
		this.selectedIventoryId = this.transactions._id;
		this.transactions.transactions.forEach((element) => {
			if (element._id === batch._id) {
				this.selectedBatch = element;
				const batchTransaction: BatchTransaction = {
					batchNumber: <string>batch.batchNumber,
					employeeId: this.employeeDetails._id,
					price: item.cost,
					preQuantity: <number>element.quantity, // Before Operation.
					postQuantity: <number>batch.quantity - qty, // After Operation.
					quantity: <number>qty, // Operational qty.
					referenceId: <string>this.prescriptionItems._id, // Dispense id, Transfer id...
					referenceService: 'Prescription/Dispense Service', // Dispense, Transfer...
					inventorytransactionTypeId: <string>this.inventoryTransactionTypeId
				};
				element.batchTransactions.push(batchTransaction);
				element.quantity = element.quantity - qty;
				element.availableQuantity = element.availableQuantity - qty;
			}
		});
		this.transactions.totalQuantity = this.transactions.totalQuantity - qty;
	}

	// Get payment status
	private _getPaymentStatus() {
		this.disablePaymentBtn = true;
		this.paymentStatusText = false;
		this.paymentStatusTexting = true;
		let counter = 0;
		const prescriptionLength = this.prescriptionItems.prescriptionItems.length;
		this.prescriptionItems.prescriptionItems.forEach((prescription) => {
			counter++;
			if (!!prescription.billId && !!prescription.billItemId) {
				this._billingService
					.get(prescription.billId, {})
					.then((res) => {
						if (res._id !== undefined) {
							this.disablePaymentBtn = false;
							this.paymentStatusText = true;
							this.paymentStatusTexting = false;
							res.billItems.forEach((i) => {
								this.prescriptions.forEach((j) => {
									if (i._id === j.billItemId) {
										j.paymentCompleted = i.paymentCompleted;
									}
								});
							});

							if (counter === prescriptionLength) {
								const condition =
									this.prescriptionItems.prescriptionItems.length !== this.prescriptions.length;
								const notBilled = this.prescriptions.filter(
									(x) =>
										(x.quantity !== x.quantityDispensed || !x.paymentCompleted) &&
										!x.paymentCompleted &&
										!x.isExternal
								);
								if (notBilled.length > 0 || condition) {
									this.disableDispenseAllBtn = true;
								} else {
									this.disableDispenseAllBtn = false;
								}
							}
						}
					})
					.catch((err) => {});
			} else {
				this.disablePaymentBtn = true;
				this.paymentStatusText = true;
				this.paymentStatusTexting = false;
			}
		});
	}

	// Get all the inventory transaction types.
	private _getInventoryTransactionTypes() {
		this._inventoryTransactionTypeService
			.findAll()
			.then((res) => {
				if (res.data.length > 0) {
					const inventoryType = res.data.filter((x) => x.name.toLowerCase().includes('dispense'));
					if (inventoryType.length > 0) {
						this.inventoryTransactionTypeId = inventoryType[0]._id;
					}
				}
			})
			.catch((err) => {});
	}

	// Prescription logic.
	private _isPrescriptionLogic() {
		// if (!!this.prescriptionItems.billId && this.prescriptionItems.hasOwnProperty('billId')) {
		// check if there is any item that needs to be billed.
		const containsIsBilled = this.unBilledArray.filter((x) => x.isBilled);
		if (containsIsBilled.length > 0) {
			this._generateBill();
		} else {
			// Reset back the button.
			this.disableSaveBtn = false;
			this.saveBtn = true;
			this.savingBtn = false;
		}
	
	}

	// External Prescription logic.
	private _isExternalPrescriptonLogic() {
		this._isPrescriptionLogic();
	}

	private _generateBill() {
		const billItemArray = [];
		// let totalCost = 0;
		// let totalQuantity = 0;

		this.unBilledArray.forEach((element) => {
			if (element.isBilled) {
				const billItem = <BillItem>{
					facilityServiceId: element.facilityServiceId,
					serviceId: element.serviceId,
					facilityId: this.prescriptionItems.facilityId,
					patientId: this.prescriptionItems.patientId,
					description: element.genericName,
					quantity: element.quantity,
					totalPrice: element.totalCost,
					unitPrice: element.cost,
					unitDiscountedAmount: 0,
					totalDiscoutedAmount: 0
				};
				this.totalQuantity += element.quantity;
				this.totalCost += element.totalCost;

				billItemArray.push(billItem);
			}
		});
		if (billItemArray.length > 0) {
			const payload = {
				facilityId: this.facility._id,
				billItems: billItemArray,
				prescription: this.prescriptionItems
			};

			this._prescriptionService
				.billCreate(payload)
				.then((res) => {
					if (res.status === 'success') {
						this.disableSaveBtn = false;
						this.saveBtn = true;
						this.savingBtn = false;
						// clear prescriptions then call the getPrescriptionsDetails again.
						this.prescriptions = [];
						this.totalCost = 0;
						this.totalQuantity = 0;
						this.unBilledArray = [];
						this._getPrescriptionDetails();
					}
				})
				.catch((e) => {});
		} else {
			this.disableSaveBtn = false;
			this.saveBtn = true;
			this.savingBtn = false;
			this._systemModuleService.announceSweetProxy(
				'If you do not have any of these drugs, Please check each item as external.',
				'error'
			);
		}
	}

  item_to_show(i) {
		return this.clickItemIndex === i;
  }

  toggle_tr(itemIndex, direction) {
		if (direction === 'down' && itemIndex === this.clickItemIndex) {
			this.expand_row = false;
			this.clickItemIndex = -1;
		} else {
			this.clickItemIndex = itemIndex;
			this.expand_row = !this.expand_row;
		}
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}

}

