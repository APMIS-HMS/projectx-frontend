import { Component, OnInit, EventEmitter } from '@angular/core';
import {
  SupplierService, ProductService, PurchaseOrderService,
  StoreService, EmployeeService, PurchaseEntryService
} from '../../../../services/facility-manager/setup/index';
import { Facility } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from '../../../../services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { PurchaseOrder } from '../../../../models/index';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss']
})
export class PurchaseOrderComponent implements OnInit {
  slidePurchaseDetails = false;
  frmSupplier: FormControl = new FormControl();

  orders: any[] = [];
  suppliers: any[] = [];
  checkingObject: any = <any>{};
  loginEmployee: any = <any>{};
  subscription: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  selectedOrder: any = <any>{};
  constructor(
    private supplierService: SupplierService, private router: Router,
    private storeService: StoreService, private locker: CoolLocalStorage, private productService: ProductService,
    private purchaseOrderService: PurchaseOrderService,
    private _purchaseEventEmitter: PurchaseEmitterService,
    private systemModuleService: SystemModuleService,
    private authFacadeService: AuthFacadeService,
    private employeeService: EmployeeService,
    private purchaseEntryService: PurchaseEntryService) {
    this._purchaseEventEmitter.setRouteUrl('Purchase Orders');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.subscription = this.employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingObject = res.typeObject;
          if (!!this.checkingObject.storeId) {
            this.getPurchaseOrders();
          }
        }
      }
    });
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      // this.checkingObject = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      if ((this.loginEmployee.storeCheckIn !== undefined
        || this.loginEmployee.storeCheckIn.length > 0)) {
        let isOn = false;
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (itemr.isDefault === true) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            isOn = true;
            this.checkingObject = { typeObject: itemr, type: 'store' };
            this.employeeService.announceCheckIn(this.checkingObject);

            // tslint:disable-next-line:no-shadowed-variable
            this.employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
              this.loginEmployee = payload;
              this.checkingObject = { typeObject: itemr, type: 'store' };
              this.employeeService.announceCheckIn(this.checkingObject);
              this.locker.setObject('checkingObject', this.checkingObject);
              // this.checkingObject = this.checkingObject.typeObject;
              this.getPurchaseOrders();
            });
          }
        });
        if (isOn === false) {
          this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
            if (r === 0) {
              itemr.isOn = true;
              itemr.lastLogin = new Date();
              // tslint:disable-next-line:no-shadowed-variable
              this.employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
                this.loginEmployee = payload;
                this.checkingObject = { typeObject: itemr, type: 'store' };
                this.employeeService.announceCheckIn(this.checkingObject);
                this.locker.setObject('checkingObject', this.checkingObject);
                // this.checkingObject = this.checkingObject.typeObject;
                this.getPurchaseOrders();
              });
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.frmSupplier.valueChanges.subscribe(value => {
      if (value !== null) {
        this.systemModuleService.on();
        this.purchaseOrderService.find({ query: { supplierId: value, isActive: true } }).subscribe(payload => {
          if (payload.data != undefined) {
            this.orders = payload.data;
            this.systemModuleService.off();
          } else {
            this.orders = [];
          }
        }, error => {
          this.systemModuleService.off();
        });
      } else {
        this.getPurchaseOrders();
      }
    });
  }
  getSuppliers() {
    this.systemModuleService.on();
    this.supplierService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.suppliers = payload.data;
      this.systemModuleService.off();
    }, error => {
      this.systemModuleService.off();
    });
  }
  getPurchaseOrders() {
    this.systemModuleService.on();
    this.purchaseOrderService.find({
      query:
        {
          facilityId: this.selectedFacility._id,
          isActive: true
        }
    }).subscribe(payload => {
      if (payload.data != undefined) {
        this.orders = payload.data;
        this.systemModuleService.off();
      } else {
        this.orders = [];
      }
    }, error => {
      this.systemModuleService.off();
    });
  }
  selectedOrderToDelete;
  entryDone;
  onRemoveOrder(order) {
    this.selectedOrderToDelete = order;

    order.isActive = false;

    this.purchaseOrderService.patch(order._id, order).then(payload => {
    });

  }

  sweetAlertCallback(result) {
    if (result.value) {
      this.systemModuleService.on();
      if (this.selectedOrderToDelete._id !== undefined) {
        if (this.entryDone === true) {
          this.purchaseOrderService.remove(this.selectedOrderToDelete._id, {}).then(callback_remove => {
            this.systemModuleService.announceSweetProxy(this.selectedOrderToDelete.purchaseOrderNumber + " is deleted", 'success');
            this.systemModuleService.off();
            this.selectedOrderToDelete = {};
            this.getPurchaseOrders();
          }, error => {
            this.systemModuleService.off();
          });
        } else {
          this.selectedOrderToDelete.isActive = false
          this.purchaseOrderService.patch(this.selectedOrderToDelete._id, this.selectedOrderToDelete).then(callback_remove => {
            this.systemModuleService.announceSweetProxy(this.selectedOrderToDelete.purchaseOrderNumber + " has been deactivated", 'success');
            this.systemModuleService.off();
            this.selectedOrderToDelete = {};
            this.getPurchaseOrders();
          }, error => {
            this.systemModuleService.off();
          });
        }
      }
    }
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

  getPackItemNames(product) {
    product.qtyDetails.forEach(element => {
      const packName = product.productObject.productConfigObject.filter(x => x._id.toString() === element.packId.toString());
      if (packName.length > 0) {
        element.packName = packName[0].name;
      }
    });
    return product.qtyDetails;
  }

  slidePurchaseDetailsToggle(value, event) {
    this.selectedOrder = value;
    this.slidePurchaseDetails = !this.slidePurchaseDetails;
  }

  onNavigateToDetail(value) {
    this.router.navigate(['/dashboard/purchase-manager/order-details', value._id]);
  }
  onNavigateToAddStore(value) {
    this.router.navigate(['/dashboard/purchase-manager/purchase-entry', value._id]);
  }
}
