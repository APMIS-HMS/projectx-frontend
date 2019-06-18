import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Observable } from 'rxjs/Observable';
import { convertCompileOnSaveOptionFromJson } from 'typescript';

@Component({
  selector: 'app-outbound-transfer',
  templateUrl: './outbound-transfer.component.html',
  styleUrls: ['./outbound-transfer.component.scss']
})
export class OutboundTransferComponent implements OnInit, OnDestroy {

  check: FormControl = new FormControl();
  storeLocation: FormControl = new FormControl();
  storeName: FormControl = new FormControl();
  productSearch: FormControl = new FormControl();
  productQtyRequestSearch: FormControl = new FormControl();
  productQtyBatch: FormControl = new FormControl();
  selectedFacility: any;
  minorLocations: any = [];
  locations: any = [];
  stores: any = [];
  transferObjs: any = [];
  existingStockTransfers: any = [];
  totalTransferredQties = 0;
  totalTransferredAmount = 0;
  inventorySearchResults: any = [];
  selectedProduct: any = {};
  hideSearchTool = true;
  hideSearchResultList = true;
  // storeId = '5c043868d585f38d1a730924';

  loginEmployee: Employee = <Employee>{};
  checkingStore: any = <any>{};
  workSpace: any;
  isRunningQuery = false;
  subscription: ISubscription;
  showDialog = false;
  transferItemState: any = <any>{};
  stockTransferItems: any = <any>{};
  totalCostPrice = 0;
  totalCount = 0;

  constructor(private facilitiesService: FacilitiesService,
    private locationService: LocationService,
    private _locker: CoolLocalStorage,
    private storeService: StoreService,
    private inventoryTransferService: InventoryTransferService,
    private systemModuleService: SystemModuleService,
    private _employeeService: EmployeeService,
    private authFacadeService: AuthFacadeService,
    private inventoryService: InventoryService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService) {
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
          this.systemModuleService.announceSweetProxy('Can not add transfer item with an empty destination store', 'error', null,
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

    this.GetInventoryTransferState();
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

  getLocationService() {
    this.locationService.find({}).then(payload => {
      this.locations = payload.data;
    }, err => { })
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


  getSelectedStoreSummations() {
    this.existingStockTransfers = [];
    this.systemModuleService.on();
    this.inventoryTransferService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.checkingStore.storeId,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      console.log(payload);
      this.transferObjs = [];
      payload.data.forEach(element => {
        let unattendedTransfers = element.inventoryTransferTransactions.filter(x => x.transferStatusObject.name === 'Pending');
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

  onAddNewTransItem() {
    this.hideSearchTool = !this.hideSearchTool;
  }

  onSelectProduct(item) {
    if (this.storeName.value !== null) {
      this.selectedProduct = item;
      this.hideSearchResultList = true;
      this.stockTransferItems.transferBy = this.loginEmployee._id;
      this.stockTransferItems.facilityId = this.selectedFacility._id;
      this.stockTransferItems.storeId = this.checkingStore.storeId;
      this.stockTransferItems.inventorytransactionTypeId = this.transferItemState.transferStatus._id;
      this.stockTransferItems.destinationStoreId = this.storeName.value;
      this.stockTransferItems.inventoryTransferTransactions = (this.stockTransferItems.inventoryTransferTransactions === undefined || this.stockTransferItems.inventoryTransferTransactions === NaN) ? [] : this.stockTransferItems.inventoryTransferTransactions;
      this.stockTransferItems.inventoryTransferTransactions.push({
        transactionId: this.productQtyBatch.value,
        transferStatusId: this.transferItemState.transferStatus._id,
        lineCostPrice: (this.productQtyRequestSearch.value * this.selectedProduct.price),
        costPrice: this.selectedProduct.price,
        quantity: this.productQtyRequestSearch.value,
        productObject: {
          name: item.productName,
          code: item.productCode
        },
        productId: item.productId,
        selectedItem: this.selectedProduct,
        inventoryId: this.selectedProduct._id
      });
    } else {
      this.systemModuleService.announceSweetProxy('Can not add transfer item with an empty destination store', 'error', null,
        null,
        null,
        null,
        null,
        null,
        null);
      this.systemModuleService.off();
    }
  }

  onBatchChange(item) {
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

  focusOutQties() {
    this.systemModuleService.on();
    this.stockTransferItems.inventoryTransferTransactions[this.stockTransferItems.inventoryTransferTransactions.length - 1].transactionId = this.productQtyBatch.value;
    this.stockTransferItems.inventoryTransferTransactions[this.stockTransferItems.inventoryTransferTransactions.length - 1].quantity = +this.productQtyRequestSearch.value;
    this.stockTransferItems.inventoryTransferTransactions[this.stockTransferItems.inventoryTransferTransactions.length - 1].lineCostPrice = (+this.productQtyRequestSearch.value) * this.selectedProduct.price;
    this.systemModuleService.off();
    this.transferObjs = JSON.parse(JSON.stringify(this.stockTransferItems.inventoryTransferTransactions));
    this.hideSearchTool = true;
    this.hideSearchResultList = true;
    this.selectedProduct = {};
    this.productSearch.reset();
    this.productQtyBatch.reset();
    this.productQtyRequestSearch.reset();
  }

  onRemoveNewtem() {
    this.hideSearchTool = true;
    this.hideSearchResultList = true;
    this.selectedProduct = {};
    this.productSearch.reset();
    this.productQtyBatch.reset();
    this.productQtyRequestSearch.reset();
  }

  GetInventoryTransferState() {
    let selectedInventoryTransferStatus = {};
    let selectedInventoryTransactionType = {};
    const status$ = Observable.fromPromise(this.inventoryTransferStatusService.find({ query: { name: 'Pending' } }));
    const type$ = Observable.fromPromise(this.inventoryTransactionTypeService.find({ query: { name: 'transfer', $limit: 20 } }));

    Observable.forkJoin([status$, type$]).subscribe((results: any) => {
      const statusResult: any = results[0];
      const typeResult: any = results[1];

      if (statusResult.data.length > 0) {
        selectedInventoryTransferStatus = statusResult.data[0];
      }
      if (typeResult.data.length > 0) {
        selectedInventoryTransactionType = typeResult.data[0];
      }
      this.transferItemState = {
        transferStatus: selectedInventoryTransferStatus,
        transactionType: selectedInventoryTransactionType
      };
    }, err => {
    });
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

  sendRequest() {
    this.stockTransferItems.inventoryTransferTransactions = [];
    const checkedItems = this.transferObjs.filter(x => x.isSelected === true);
    this.stockTransferItems.inventoryTransferTransactions = JSON.parse(JSON.stringify(checkedItems));
    if (this.stockTransferItems.inventoryTransferTransactions.length > 0) {
      this.systemModuleService.announceSweetProxy('You are about to transfer', 'question', this);
    } else {
      this.systemModuleService.announceSweetProxy('Please kindly select the item(s) for the transfer', 'error', null,
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
      this.inventoryTransferService.create2(this.stockTransferItems).then(payload => {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Stock transfer created successfully', 'success',
          null,
          null,
          null,
          null,
          null,
          null,
          null);
        this.transferObjs = JSON.parse(JSON.stringify(this.stockTransferItems.inventoryTransferTransactions.filter(x => x.isSelected === false)));
      }, err => {
        this.systemModuleService.off();
      });
    }
  }

  onEditItem(index) {
    this.transferObjs[index].isEdit = (this.transferObjs[index].isEdit === undefined) ? false : this.transferObjs[index].isEdit;
    this.transferObjs[index].isEdit = !this.transferObjs[index].isEdit;
  }

  onRemoveItem(index) {
    this.transferObjs = this.transferObjs.filter((x, i) => {
      if (i !== index) {
        return x;
      }
    });
    this.stockTransferItems.inventoryTransferTransactions = JSON.parse(JSON.stringify(this.transferObjs));
    this.totalCostPrice = 0;
    this.totalCount = 0;
  }

  onFocusChangeItemValue(event, index) {
    this.transferObjs[index].quantity = event.srcElement.value;
    this.transferObjs[index].lineCostPrice = this.transferObjs[index].costPrice * this.transferObjs[index].quantity;
    this.transferObjs[index].isEdit = false;
  }
  onFocusChangeExistingItemValue(event, index, index2) {
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].quantity = event.srcElement.value;
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].lineCostPrice = this.existingStockTransfers[index].inventoryTransferTransactions[index2].quantity * this.existingStockTransfers[index].inventoryTransferTransactions[index2].costPrice;
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].isEdit = false;
    this.systemModuleService.on();
    this.inventoryTransferService.patch(this.existingStockTransfers[index]._id, { inventoryTransferTransactions: this.existingStockTransfers[index].inventoryTransferTransactions }, {}).then(payload => {
      this.systemModuleService.off();
    }, err => {
      this.systemModuleService.off();
    });
  }

  onEditExistingItem(index, index2) {
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].isEdit = (this.existingStockTransfers[index].inventoryTransferTransactions[index2].isEdit === undefined) ?
      false : this.existingStockTransfers[index].inventoryTransferTransactions[index2].isEdit;
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].isEdit = true;
  }

  onRemoveExistingItem(index, index2) {

  }
}
