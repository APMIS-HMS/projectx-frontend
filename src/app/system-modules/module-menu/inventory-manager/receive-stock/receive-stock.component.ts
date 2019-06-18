import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
// tslint:disable-next-line:max-line-length
import {
  InventoryService, InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService,
  StoreService, FacilitiesService, EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import {
  Facility, InventoryTransferStatus, InventoryTransactionType, InventoryTransferTransaction,
  InventoryTransfer, Employee
} from '../../../../models/index';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receive-stock',
  templateUrl: './receive-stock.component.html',
  styleUrls: ['./receive-stock.component.scss']
})
export class ReceiveStockComponent implements OnInit {
  searchOpen = false;
  slideDetails = false;
  clickslide = false;
  user: any = <any>{};
  loading = false;
  subscription: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  selectedInventoryTransfer: any = <any>{};
  checkingStore: any = <any>{};
  searchControl = new FormControl();
  loginEmployee: Employee = <Employee>{};
  receivedTransfers: InventoryTransfer[] = [];
  transferStatuses: InventoryTransferStatus[] = [];
  completedInventoryStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  rejectedInventoryStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  constructor(
    private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService, private route: ActivatedRoute,
    private locker: CoolLocalStorage, private facilityService: FacilitiesService, private employeeService: EmployeeService,
    private systemModuleService: SystemModuleService,
    private _locker: CoolLocalStorage,
    private authFacadeService: AuthFacadeService
  ) {
    this.user = this.locker.getObject('auth');
    this._inventoryEventEmitter.setRouteUrl('Receive Stock');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    
    this.subscription = this.employeeService.checkInAnnounced$.subscribe(payload => {
      if (payload !== undefined) {
        if (payload.typeObject !== undefined) {
          this.checkingStore = payload.typeObject;
          if(this.checkingStore.storeId !== undefined){
            this.getTransfers();
          }
        }
      }
    });

    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      this.route.data.subscribe(data => {
        // tslint:disable-next-line:no-shadowed-variable
        data['loginEmployee'].subscribe((payload) => {
          this.loginEmployee = payload.loginEmployee;
        });
      });
      this.getTransfers();
      this.getTransferStatus();
    });
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        if (this.checkingStore.storeId === undefined) {
          this.checkingStore = this.checkingStore.typeObject;
        }
        this.loading = true;
        this.systemModuleService.on();
        this.inventoryTransferService.find({
          query: {
            facilityId: this.selectedFacility._id,
            storeId: this.checkingStore.storeId,
            isDestination: true,
            'inventoryTransferTransactions.productObject.name': {
              $regex: value,
              $options: 'i'
            },
          }
        }).then(payload => {
          this.loading = false;
          this.systemModuleService.off();
          this.receivedTransfers = payload.data;
        }, error => {
          this.loading = false;
          this.systemModuleService.off();
        });
      });

  }



  openSearch() {
    this.searchOpen = !this.searchOpen;
  }

  getTransfers() {
    if (this.checkingStore.storeId === undefined) {
      if (!!this.checkingStore.typeObject) {
        this.checkingStore = this.checkingStore.typeObject;
      }
    }
    if (this.checkingStore !== undefined) {
      this.loading = true;
      this.systemModuleService.on();
      this.inventoryTransferService.find({
        query: {
          facilityId: this.selectedFacility._id,
          destinationStoreId: this.checkingStore.storeId,
          $sort: { createdAt: -1 }
        }
      }).then(payload => {
        this.loading = false;
        this.systemModuleService.off();
        this.receivedTransfers = payload.data;
      }, error => {
        this.loading = false;
        this.systemModuleService.off();
      });
    }

  }
  getTransferStatus() {
    this.inventoryTransferStatusService.findAll().subscribe(payload => {
      this.transferStatuses = payload.data;
      this.transferStatuses.forEach((item, i) => {
        if (item.name === 'Completed') {
          this.completedInventoryStatus = item;
        }
        if (item.name === 'Rejected') {
          this.rejectedInventoryStatus = item;
        }
      });
    });
  }
  clicked() {
    this.slideDetails = false;
    this.clickslide = false;
  }
  slideDetailsShow(receive, reload = true) {
    this.systemModuleService.on();
    if (reload === true) {
      this.inventoryTransferService.get(receive._id, {}).then(payload => {
        if (payload.storeId !== undefined) {
          const that = this;
          this.selectedInventoryTransfer = payload;
          this.selectedInventoryTransfer.inventoryTransferTransactions.forEach(function (itemi: any) {
            itemi.checked = false;
            if (itemi.transferStatusId === that.completedInventoryStatus._id) {
              itemi.checked = true;
            } else if (itemi.transferStatusId === that.rejectedInventoryStatus._id) {
              itemi.checked = undefined;
            }
          });
          this.slideDetails = !this.slideDetails;
          this.systemModuleService.off();
        }
      });
    } else {
      this.selectedInventoryTransfer = receive;
      const that = this;
      this.selectedInventoryTransfer.inventoryTransferTransactions.forEach(function (itemi: any) {
        itemi.checked = false;
        if (itemi.transferStatusId === that.completedInventoryStatus._id) {
          itemi.checked = true;
        } else if (itemi.transferStatusId === that.rejectedInventoryStatus._id) {
          itemi.checked = undefined;
        }
      });
      this.slideDetails = !this.slideDetails;
      this.systemModuleService.off();
    }


  }
  onValueChanged(event, transaction) {
    transaction.checked = event.checked;
  }
  shouldDisabled(transaction) {
    return transaction.transferStatusId === this.completedInventoryStatus._id ||
      transaction.transferStatusId === this.rejectedInventoryStatus._id;
  }
  accept() {
    this.selectedInventoryTransfer.inventoryTransferTransactions.forEach((item: any, i) => {
      if (item.checked !== undefined && item.checked === true && !(item.transferStatusId === this.completedInventoryStatus._id) ||
        (item.transferStatusId === this.rejectedInventoryStatus._id)) {
        item.transferStatusId = this.completedInventoryStatus._id;
      }
    });
    this.inventoryTransferService.patchTransferItem(this.selectedInventoryTransfer._id,
      { inventoryTransferTransactions: this.selectedInventoryTransfer.inventoryTransferTransactions },{}).then(payload => {
        this.slideDetailsShow(payload, false);
        this.getTransfers();
        this.systemModuleService.announceSweetProxy('Stock tran successfully', 'success', null, null, null, null, null, null, null);
      }, error => {
        this._notification('Error', 'Failed to accept stock, please try again');
      });

  }

  reject() {
    this.selectedInventoryTransfer.inventoryTransferTransactions.forEach((item: any, i) => {
      if (item.checked !== undefined && item.checked === true && !(item.transferStatusId === this.completedInventoryStatus._id) ||
        (item.transferStatusId === this.rejectedInventoryStatus._id)) {
        item.transferStatusId = this.rejectedInventoryStatus._id;
      }
    });
    this.inventoryTransferService.patchTransferItem(this.selectedInventoryTransfer._id,
      { inventoryTransferTransactions: this.selectedInventoryTransfer.inventoryTransferTransactions },{}).then(payload => {
        this.slideDetailsShow(payload.inventoryTransfers, false);
      });
  }
  getStatus(transaction) {
    const receivedTransactions = transaction.inventoryTransferTransactions
      .filter(item => item.transferStatusId === this.completedInventoryStatus._id);
    if (receivedTransactions.length === transaction.inventoryTransferTransactions.length) {
      return this.completedInventoryStatus.name;
    }

    const rejectedTransactions = transaction.inventoryTransferTransactions
      .filter(item => item.transferStatusId === this.rejectedInventoryStatus._id);
    if (rejectedTransactions.length === transaction.inventoryTransferTransactions.length) {
      return this.rejectedInventoryStatus.name;
    }
    return 'Pending';
  }

  ngOnDestroy() {
    if (this.loginEmployee.storeCheckIn !== undefined) {
      this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
        if (itemr.storeObject === undefined) {
          const store_ = this.loginEmployee.storeCheckIn.find(x => x.storeId.toString() === itemr.storeId.toString());
          itemr.storeObject = store_.storeObject;
        }
        if (itemr.isDefault === true && itemr.isOn === true) {
          itemr.isOn = false;
          this.employeeService.update(this.loginEmployee).then(payload => {
            this.loginEmployee = payload;
          },err=>{
          });
        }
      });
    }
    this.employeeService.announceCheckIn(undefined);
    this.locker.setObject('checkingObject', {});
    this.subscription.unsubscribe();
  }

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
