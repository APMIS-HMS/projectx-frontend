import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService } from './../../../../../services/facility-manager/setup/facility.service';
import { LocationService } from './../../../../../services/module-manager/setup/location.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { StoreService } from './../../../../../services/facility-manager/setup/store.service';
import { InventoryTransferService } from './../../../../../services/facility-manager/setup/inventory-transfer.service';
import { InventoryTransferStatusService } from './../../../../../services/facility-manager/setup/inventory-transaction-status.service';
import { InventoryTransactionTypeService } from './../../../../../services/facility-manager/setup/inventory-transaction-type.service';
import { InventoryService } from './../../../../../services/facility-manager/setup/inventory.service';
import { EmployeeService } from './../../../../../services/facility-manager/setup/employee.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { Facility, Employee } from 'app/models';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';

@Component({
    selector: 'app-outbound-requisition',
    templateUrl: './outbound-requisition.component.html',
    styleUrls: ['./outbound-requisition.component.scss']
})
export class OutboundRequisitionComponent implements OnInit {

    check: FormControl = new FormControl();
    storeLocation: FormControl = new FormControl();
    storeName: FormControl = new FormControl();
    productSearch: FormControl = new FormControl();
    productQtyRequestSearch: FormControl = new FormControl();
    productQtyBatch: FormControl = new FormControl();
    subscription: ISubscription;
    checkingStore: any = <any>{};
    loginEmployee: Employee = <Employee>{};
    selectedFacility: any;
    minorLocations: any = [];
    transferObjs: any = [];
    stores: any = [];
    selectedProduct: any = {};
    hideSearchTool = true;
    hideSearchResultList = true;
    inventorySearchResults: any = [];
    isRunningQuery = false;
    showDialog = false;
    transferItemState: any = <any>{};
    stockTransferItems: any = <any>{};
    totalCostPrice = 0;
    totalCount = 0;
    existingStockTransfers: any = [];

    constructor(private facilitiesService: FacilitiesService,
        private locationService: LocationService,
        private _locker: CoolLocalStorage,
        private storeService: StoreService,
        private inventoryTransferService: InventoryTransferService,
        private systemModuleService: SystemModuleService,
        private inventoryService: InventoryService,
        private _employeeService: EmployeeService,
        private authFacadeService: AuthFacadeService) {
        this.subscription = this._employeeService.checkInAnnounced$.subscribe((res) => {
            if (!!res) {
                if (!!res.typeObject) {
                    this.checkingStore = res.typeObject;
                    if (this.checkingStore !== undefined && !!this.checkingStore.storeId) {
                        // this.getSelectedStoreSummations();
                    }
                }
            }
        });
        this.authFacadeService.getLogingEmployee().then((payload: any) => {
            this.loginEmployee = payload;
            this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
            console.log(this.checkingStore);
            if (this.checkingStore !== undefined) {
                this.getSelectedStoreSummations();
            }
            if (this.loginEmployee.storeCheckIn === undefined || this.loginEmployee.storeCheckIn.length === 0) {
                // this.modal_on = true;
            } else {
                let isOn = false;
                this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
                    if (itemr.isDefault === true) {
                        itemr.isOn = true;
                        itemr.lastLogin = new Date();
                        isOn = true;
                        let checkingObject = { typeObject: itemr, type: 'store' };
                        this._employeeService
                            .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
                            .then((payload) => {
                                this.loginEmployee = payload;
                                checkingObject = { typeObject: itemr, type: 'store' };
                                this._employeeService.announceCheckIn(checkingObject);
                                this._locker.setObject('checkingObject', checkingObject);
                            });
                    }
                });
                if (isOn === false) {
                    this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
                        if (r === 0) {
                            itemr.isOn = true;
                            itemr.lastLogin = new Date();
                            this._employeeService
                                .patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn })
                                .then((payload) => {
                                    this.loginEmployee = payload;
                                    const checkingObject = { typeObject: itemr, type: 'store' };
                                    this._employeeService.announceCheckIn(checkingObject);
                                    this._locker.setObject('checkingObject', checkingObject);
                                });
                        }
                    });
                }
            }
        });
    }

    ngOnInit() {
        this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
        this.getFacilityService();
        this.storeLocation.valueChanges.subscribe(value => {
            this.getStores();
        });
        this.storeName.valueChanges.subscribe(value => {
        });

        this.productSearch.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(value => {
                this.selectedProduct = {};
                this.hideSearchResultList = true;
                if (this.storeName.value !== null) {
                    this.inventoryService.findFacilityProductList({
                        query: {
                            facilityId: this.selectedFacility._id,
                            storeId: this.storeName.value,
                            limit: 10,
                            skip: 0,
                            searchText: value

                        }
                    }).then(payload => {
                        this.inventorySearchResults = payload.data;
                        this.hideSearchResultList = false;
                    }, err => {
                    });
                } else {
                    this.systemModuleService.announceSweetProxy('Can not add requisition item with an empty destination store', 'error', null,
                        null,
                        null,
                        null,
                        null,
                        null,
                        null);
                }
            });

        this.productQtyBatch.valueChanges.subscribe(value => {
            if (this.selectedProduct.availableQuantity !== undefined) {
                this.selectedProduct.batchAvailableQuantity = value.availableQuantity;
                this.selectedProduct.batchQuantity = value.quantity;
            }
        });
    }

    getStores() {
        this.systemModuleService.on();
        this.storeService.find({ query: { facilityId: this.selectedFacility._id, minorLocationId: this.storeLocation.value } }).then(payload => {
            this.stores = payload.data.filter(x => x._id.toString() !== this.checkingStore.storeId.toString());
            this.systemModuleService.off();
        }, er => {
            this.systemModuleService.off();
        });
    }

    getFacilityService() {
        this.systemModuleService.on();
        this.facilitiesService.get(this.selectedFacility._id, { query: { $select: ['minorLocations'] } }).then(payload => {
            this.minorLocations = payload.minorLocations;
            this.systemModuleService.off();
        }, err => {
            this.systemModuleService.off();
        })
    }

    ngOnDestroy() {
        if (this.loginEmployee.storeCheckIn !== undefined) {
            this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
                if (itemr.isDefault === true && itemr.isOn === true) {
                    itemr.isOn = false;
                    this._employeeService.update(this.loginEmployee).then((payload) => {
                        this.loginEmployee = payload;
                    });
                }
            });
        }
        this._employeeService.announceCheckIn(undefined);
        this._locker.setObject('checkingObject', {});
        this.subscription.unsubscribe();
    }

    onAddNewTransItem() {
        this.hideSearchTool = !this.hideSearchTool;
    }

    onRemoveNewtem() {
        this.hideSearchTool = true;
        this.hideSearchResultList = true;
        this.selectedProduct = {};
        this.productSearch.reset();
        this.productQtyBatch.reset();
        this.productQtyRequestSearch.reset();
    }

    onSelectProduct(item) {
        console.log(item);
        if (this.storeName.value !== null) {
            this.selectedProduct = item;
            this.hideSearchResultList = true;
            this.stockTransferItems.employeeId = this.loginEmployee._id;
            this.stockTransferItems.facilityId = this.selectedFacility._id;
            this.stockTransferItems.storeId = this.checkingStore.storeId;
            this.stockTransferItems.destinationStoreId = this.storeName.value;
            this.stockTransferItems.products = (this.stockTransferItems.products === undefined || this.stockTransferItems.products === NaN) ? [] : this.stockTransferItems.products;
            this.stockTransferItems.products.push({
                quantityRequested: this.productQtyRequestSearch.value,
                productObject: {
                    name: item.productName,
                    code: item.productCode
                },
                lineCostPrice: (this.productQtyRequestSearch.value * this.selectedProduct.price),
                costPrice: this.selectedProduct.price,
                productId: item.productId,
                availableQuantity: this.selectedProduct.availableQuantity,
                totalQuantity: this.selectedProduct.totalQuantity,
                quantityOnHold: (this.selectedProduct.totalQuantity - this.selectedProduct.availableQuantity),
                baseUnit: this.selectedProduct.productConfiguration.name,
                inventoryId: this.selectedProduct._id,
                serviceId: this.selectedProduct.serviceId,
                categoryId: this.selectedProduct.categoryId,
                facilityServiceId: this.selectedProduct.facilityServiceId
            });
        } else {
            this.systemModuleService.announceSweetProxy('Can not add requisition item with an empty destination store', 'error', null,
                null,
                null,
                null,
                null,
                null,
                null);
            this.systemModuleService.off();
        }
    }

    focusOutQties() {
        console.log(this.stockTransferItems);
        this.stockTransferItems.products[this.stockTransferItems.products.length - 1].quantityRequested = +this.productQtyRequestSearch.value;
        this.stockTransferItems.products[this.stockTransferItems.products.length - 1].transactionId = this.productQtyBatch.value;
        this.stockTransferItems.products[this.stockTransferItems.products.length - 1].lineCostPrice = (+this.productQtyRequestSearch.value) * this.selectedProduct.price;
        this.transferObjs = JSON.parse(JSON.stringify(this.stockTransferItems.products));
        this.hideSearchTool = true;
        this.hideSearchResultList = true;
        this.selectedProduct = {};
        this.productSearch.reset();
        this.productQtyBatch.reset();
        this.productQtyRequestSearch.reset();
    }

    getTotalItemCost() {
        this.totalCostPrice = 0;
        this.totalCount = 0;
        const selectedStocks = this.transferObjs.filter(x => x.isSelected === true);
        selectedStocks.forEach(x => {
            if (x.lineCostPrice !== undefined) {
                this.totalCostPrice += x.lineCostPrice;
            }
        });
        this.totalCount = selectedStocks.length;
    }

    onCheckItem(event, value) {
        if (event.target.checked) {
            value.isSelected = true;
        }
        else {
            value.isSelected = false;
        }
        this.getTotalItemCost();
    }

    onCheckAll(event) {
        if (this.transferObjs.length > 0) {
            if (event.target.checked) {
                this.transferObjs.map(x => {
                    x.isSelected = true;
                });
            } else {
                this.transferObjs.map(x => {
                    x.isSelected = false;
                });
            }
        } else {
            this.check.setValue(false);
        }
        this.getTotalItemCost();
    }

    onEditItem(index) {
        this.transferObjs[index].isEdit = (this.transferObjs[index].isEdit === undefined) ? false : this.transferObjs[index].isEdit;
        this.transferObjs[index].isEdit = !this.transferObjs[index].isEdit;
    }

    onFocusChangeItemValue(event, index) {
        this.transferObjs[index].quantityRequested = event.srcElement.value;
        this.transferObjs[index].lineCostPrice = this.transferObjs[index].costPrice * this.transferObjs[index].quantityRequested;
        this.transferObjs[index].isEdit = false;
    }

    onRemoveItem(index) {
        this.transferObjs = this.transferObjs.filter((x, i) => {
            if (i !== index) {
                return x;
            }
        });
        this.stockTransferItems.products = JSON.parse(JSON.stringify(this.transferObjs));
        this.totalCostPrice = 0;
        this.totalCount = 0;
    }

    sendRequest() {
        this.stockTransferItems.products = [];
        const checkedItems = this.transferObjs.filter(x => x.isSelected === true);
        this.stockTransferItems.products = JSON.parse(JSON.stringify(checkedItems));
        if (this.stockTransferItems.products.length > 0) {
            this.systemModuleService.announceSweetProxy('You are about to requisition', 'question', this);
        } else {
            this.systemModuleService.announceSweetProxy('Please kindly select the item(s) for the requisition', 'error', null,
                null,
                null,
                null,
                null,
                null,
                null);
        }

    }

    sweetAlertCallback(result) {
        if (result.value) {
            this.systemModuleService.on();
            this.inventoryTransferService.createRequisition(this.stockTransferItems).then(payload => {
                this.systemModuleService.off();
                this.systemModuleService.announceSweetProxy('Stock requisition created successfully', 'success',
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null);
                this.transferObjs = JSON.parse(JSON.stringify(this.stockTransferItems.products.filter(x => x.isSelected === false)));
            }, err => {
                console.log(err);
                this.systemModuleService.off();
            });
        }
    }

    getSelectedStoreSummations() {
        this.existingStockTransfers = [];
        this.systemModuleService.on();
        this.inventoryTransferService.findRequisitions({
            query: {
                facilityId: this.selectedFacility._id,
                storeId: this.checkingStore.storeId,
                $sort: { createdAt: -1 }
            }
        }).then(payload => {
            console.log(payload, this.checkingStore.storeId);
            this.transferObjs = [];
            payload.data.forEach(element => {
                let unattendedTransfers = element.products.filter(x => x.iscompleted === false);
                if (unattendedTransfers.length !== 0) {
                    this.existingStockTransfers.push(element);
                }
            });
            console.log(this.existingStockTransfers);
            this.systemModuleService.off();
        }, err => {
            this.systemModuleService.off();
        });
    }

    onEditExistingItem(index, index2) {
        this.existingStockTransfers[index].products[index2].isEdit = (this.existingStockTransfers[index].products[index2].isEdit === undefined) ?
            false : this.existingStockTransfers[index].products[index2].isEdit;
        this.existingStockTransfers[index].products[index2].isEdit = true;
    }

    onFocusChangeExistingItemValue(event, index, index2) {
        this.existingStockTransfers[index].products[index2].quantityRequested = event.srcElement.value;
        this.existingStockTransfers[index].products[index2].isEdit = false;
        this.systemModuleService.on();
        this.inventoryTransferService.patchRequisition(this.existingStockTransfers[index]._id, { products: this.existingStockTransfers[index].products }, {}).then(payload => {
            this.systemModuleService.off();
        }, err => {
            this.systemModuleService.off();
        });
    }

}