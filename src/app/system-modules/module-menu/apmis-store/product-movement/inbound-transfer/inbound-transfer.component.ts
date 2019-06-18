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

@Component({
  selector: 'app-inbound-transfer',
  templateUrl: './inbound-transfer.component.html',
  styleUrls: ['./inbound-transfer.component.scss']
})
export class InboundTransferComponent implements OnInit {

  check: FormControl = new FormControl();
  loginEmployee: Employee = <Employee>{};
  subscription: ISubscription;
  checkingStore: any = <any>{};
  existingStockTransfers: any = [];
  transferObjs: any = [];
  minorLocations: any = [];
  status: any = [];
  selectedFacility: any;
  totalQties = 0;
  totalCost = 0;

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
          if (!!this.checkingStore.storeId) {
            // this.getSelectedStoreSummations();
          }
        }
      }
    });
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find((x) => x.isOn === true);
      this.getSelectedStoreSummations();
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
    this.getInventoryTransferState();
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

  getSelectedStoreSummations() {
    console.log(this.checkingStore);
    this.existingStockTransfers = [];
    this.systemModuleService.on();
    this.inventoryTransferService.find({
      query: {
        facilityId: this.selectedFacility._id,
        destinationStoreId: this.checkingStore.storeId,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      console.log(payload);
      this.transferObjs = [];
      payload.data.forEach(element => {
        let unattendedTransfers = element.inventoryTransferTransactions.filter(x => x.transferStatusObject.name === 'Pending');
        if (unattendedTransfers.length!==0) {
          this.existingStockTransfers.push(element);
        }
      });
      this.existingStockTransfers.forEach(element => {
        element.totalQties = 0;
        element.totalCost = 0;
        const minorLocationObj = this.minorLocations.find(x => x._id.toString() === element.storeObject.minorLocationId.toString());
        element.storeObject.minorLocationObject = minorLocationObj;
        element.inventoryTransferTransactions.forEach(element2 => {
          element.totalQties += element2.quantity;
          element.totalCost += element2.lineCostPrice
        });
      });
      this.systemModuleService.off();
    }, err => {
      this.systemModuleService.off();
    });
    
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

  onCheckAll(event, i) {
    if (this.existingStockTransfers[i].inventoryTransferTransactions.length > 0) {
      if (event.target.checked) {
        this.existingStockTransfers[i].totalQties = 0;
        this.existingStockTransfers[i].totalCost = 0;
        this.existingStockTransfers[i].inventoryTransferTransactions.forEach(element2 => {
          element2.isSelected = true;
          this.existingStockTransfers[i].totalQties += element2.quantity;
          this.existingStockTransfers[i].totalCost += element2.lineCostPrice;
        });
      } else {
        this.existingStockTransfers[i].inventoryTransferTransactions.forEach(element2 => {
          element2.isSelected = false;
        });
      }
    } else {
      this.check.setValue(false);
    }
  }

  onCheckItem(event, index, index2) {
    if (event.target.checked) {
      this.existingStockTransfers[index].inventoryTransferTransactions[index2].isSelected = true;
    }
    else {
      this.existingStockTransfers[index].inventoryTransferTransactions[index2].isSelected = false;
    }
    this.existingStockTransfers[index].totalQties = 0;
    this.existingStockTransfers[index].totalCost = 0;
    this.existingStockTransfers[index].inventoryTransferTransactions.forEach(element2 => {
      if (element2.isSelected === true) {
        this.existingStockTransfers[index].totalQties += element2.quantity;
        this.existingStockTransfers[index].totalCost += element2.lineCostPrice;
      }
    });
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

  getInventoryTransferState() {
    this.inventoryTransferStatusService.find({}).then(payload => {
      this.status = payload.data;
    }, err => { });
  }

  onChangeStatue(value, index, index2) {
    this.existingStockTransfers[index].inventoryTransferTransactions[index2].transferStatusId = value._id;
  }
  isButtonDisabled = false;
  onAcceptItem(index) {
    this.isButtonDisabled = true;
    const completed = this.status.find(x => x.name === 'Completed');
    this.existingStockTransfers[index].inventoryTransferTransactions = JSON.parse(JSON.stringify(this.existingStockTransfers[index].inventoryTransferTransactions.filter(x => x.isSelected === true)));
    if (this.existingStockTransfers[index].inventoryTransferTransactions.length > 0) {
      const checkValueStocks = this.existingStockTransfers[index].inventoryTransferTransactions.filter(x => x.transferStatusId !== undefined);
      if (checkValueStocks.length > 0) {
        this.isButtonDisabled = true;
        this.systemModuleService.on();
        this.inventoryTransferService.patchTransferItem(this.existingStockTransfers[index]._id,
          { inventoryTransferTransactions: this.existingStockTransfers[index].inventoryTransferTransactions },
          {}).then(payload => {
            this.isButtonDisabled = false;
            this.systemModuleService.off();
            this.getSelectedStoreSummations();
            this.systemModuleService.announceSweetProxy('Stock transferred confirmed successfully', 'success',
              null,
              null,
              null,
              null,
              null,
              null,
              null);
          }, error => {
            this.isButtonDisabled = false;
            this.getSelectedStoreSummations();
            this.systemModuleService.off();
          });
      } else {
        this.systemModuleService.off();
        this.systemModuleService.announceSweetProxy('Stock transferred confirmation can not be completed without transfer status', 'error',
          null,
          null,
          null,
          null,
          null,
          null,
          null);
      }
    } else {
      this.getSelectedStoreSummations();
      this.systemModuleService.announceSweetProxy('You have not selected any item', 'error',
        null,
        null,
        null,
        null,
        null,
        null,
        null);

    }
  }

}
