import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { SystemModuleService } from './../../../../services/module-manager/setup/system-module.service';
// tslint:disable-next-line:max-line-length
import { StoreService, ProductService, StrengthService, ProductRequisitionService, EmployeeService, InventoryService } from '../../../../services/facility-manager/setup/index';
import { Facility, Requisition, RequisitionProduct, Employee } from '../../../../models/index';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-requisition',
  templateUrl: './requisition.component.html',
  styleUrls: ['./requisition.component.scss']
})
export class RequisitionComponent implements OnInit {
  mainErr = true;
  errMsg = 'You have unresolved errors';

  flyout = false;

  public frm_purchaseOrder: FormGroup;

  suppliers: any[] = [];
  isProcessing = false;
  productTableForm: FormGroup;
  checkAll: FormControl = new FormControl();
  zeroQuantity: FormControl = new FormControl();
  reOrderLevelQuantity: FormControl = new FormControl();
  searchControl = new FormControl();
  productsControl = new FormControl();
  desc = new FormControl();
  checkBoxLabel = [];
  isChecked = false;
  indexChecked = 0;
  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;

  stores: any[] = [];
  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  strengths: any[] = [];
  removingRecord = false;

  selectedFacility: Facility = <Facility>{};
  checkingObject: any = <any>{};
  subscription: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  constructor(
    private formBuilder: FormBuilder,
    private _inventoryEventEmitter: InventoryEmitterService,
    private storeService: StoreService,
    private locker: CoolLocalStorage,
    private productService: ProductService,
    private strengthService: StrengthService,
    private employeeService: EmployeeService,
    private requisitionService: ProductRequisitionService,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private inventoryService: InventoryService
  ) {
    this._inventoryEventEmitter.setRouteUrl('Requisition');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    const auth: any = this.locker.getObject('auth');

    this.subscription = this.employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingObject = res.typeObject;
          if (!!this.checkingObject.storeId) {
            this.getStores();
          this.getAllProducts('', this.checkingObject.storeId);
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
              this.getAllProducts('', this.checkingObject.storeId);
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
                this.getAllProducts('', this.checkingObject.storeId);
              });
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    
    this.checkBoxLabel = [{ name: 'All', checked: true }, { name: 'Out of stock', checked: false },
    { name: 'Re-order Level', checked: false }];
    this.frm_purchaseOrder = this.formBuilder.group({
      product: ['', [<any>Validators.required]],
      supplier: ['', [<any>Validators.required]],
      deliveryDate: [this.now, [<any>Validators.required]],
      desc: ['', [<any>Validators.required]],
    });
    this.addNewProductTables();
    
    this.searchControl.valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(value => {
        this.checkBoxLabel[0].checked = false;
        let storeId = this.checkingObject.storeId;
        if (storeId === undefined) {
          storeId = this.checkingObject.typeObject.storeId
        }
        this.getAllProducts(value, storeId);
      });
  }



  getStores() {
    this.stores = JSON.parse(JSON.stringify([]));
    this.storeService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload =>
      payload.data.forEach((item, i) => {
        if (item._id !== this.checkingObject.storeId) {
          this.stores.push(item);
        }
      }))
  }

  getAllProducts(name, storeId) {
    this.systemModuleService.on();
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        'productObject.name': {
          $regex: name,
          $options: 'i'
        },
        storeId: storeId,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      this.systemModuleService.off();
      if (payload.data.length > 0) {
        this.products = [];
        this.getProductTables(this.products);
        payload.data.forEach((item, i) => {
          this.products.push(item.productObject);
        });
        this.getProductTables(this.products);
      } else {
        this.superGroups = [];
      }
    });
  }

  getProductTables(products: any[]) {
    this.productTables = products;
    this.superGroups = [];
    let group: any[] = [];

    let counter = 0;
    for (let i = 0; i < this.productTables.length; i++) {
      if (this.superGroups.length < 1) {
        group = [];
        let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i].id, product: this.productTables[i] };
        obj = this.mergeTable(obj);
        group.push(obj);
        this.superGroups.push(group);
      } else {
        if (counter < 1) {
          let obj = <any>{
            checked: false, name: this.productTables[i].name, _id: this.productTables[i].id,
            product: this.productTables[i]
          };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        } else {
          counter = 0;
          let obj = <any>{
            checked: false, name: this.productTables[i].name, _id: this.productTables[i].id,
            product: this.productTables[i]
          };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        }

      }
    }
  }

  mergeTable(obj) {
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      const productControlValue: any = (<any>item).controls['id'].value;
      if (productControlValue === obj._id) {
        obj.checked = true;
      }
    });
    return obj;
  }
  addNewProductTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: ['', [<any>Validators.required]],
          qty: ['', [<any>Validators.required]],
          config: new FormArray([]),
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }
  getStrengths() {
    this.strengthService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.strengths = payload.data;
    });
  }
  onProductCheckChange(event, value,index?) {
    value.checked = event.checked;
    if (event.checked === true) {
      if (this.productsControl.value !== null && this.productsControl.value !== undefined) {
        (<FormArray>this.productTableForm.controls['productTableArray'])
          .push(
            this.formBuilder.group({
              product: [value.name, [<any>Validators.required]],
              qty: [0, [<any>Validators.required]],
              config: this.initProductConfig(value.product.productConfigObject),
              readOnly: [false],
              productObject: [value.product],
              id: [value._id]
            })
          );
      } else {
        value.checked = false;
        value = JSON.parse(JSON.stringify(value));
        this.errMsg = 'Please select the destination store';
        this.mainErr = false;
        this.systemModuleService.announceSweetProxy(this.errMsg, 'error');
        this.removeProduct(index,value)
      }
    } else {
      let indexToRemove = 0;
      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
        const productControlValue: any = (<any>item).controls['id'].value;
        if (productControlValue === value._id) {
          indexToRemove = i;
        }
      });
      const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
      if (count === 1) {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(indexToRemove, 1);
      }
      let indx = indexToRemove;
      if (indexToRemove > 0) {
        indx = indexToRemove - 1;
      }

      this.onPackageSize(indx, (<FormArray>this.productTableForm.controls['productTableArray']).controls)
    }
  }

  initProductConfig(config) {
    let frmArray = new FormArray([]);
    frmArray.push(new FormGroup({
      size: new FormControl(0),
      packsizes: new FormControl(config),
      packItem: new FormControl()
    }));
    return frmArray;
  }

  getProductConfig(form) {
    return form.controls.config.controls;
  }

  getBaseProductConfig(form) {
    return form.controls.config.controls[0].value.packsizes.find(x => x.isBase === true).name;
  }

  onPackageSize(i, packs) {
    try {
      packs[i].controls.qty.setValue(0);
      packs[i].controls.config.controls.forEach(element => {
        packs[i].controls.qty.setValue(packs[i].controls.qty.value + element.value.size * (element.value.packsizes.find(x => x._id.toString() === element.value.packItem.toString()).size));
      });
    } catch (err) {

    }

  }

  compareItems(l1: any, l2: any) {
    return l1.includes(l2);
  }

  onAddPackSize(pack, form) {
    form.controls.config.push(new FormGroup({
      size: new FormControl(0),
      packsizes: new FormControl(pack),
      packItem: new FormControl()
    }));
  }

  onRemovePack(pack, form, k, index) {
    pack.controls.config.removeAt(k);
    this.onPackageSize(index, form);
  }

  removeProduct(index, value) {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id === value.id) {
          group.checked = false;
          this.onProductCheckChange({ checked: false }, value);
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 1) {
            // this.addNewProductTables();
          }
        }
      });
    });
    this.superGroups = JSON.parse(JSON.stringify(this.superGroups));
  }
  resetGroups() {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        group.checked = false;
      });
    });
  }

  save() {
    this.systemModuleService.on();
    this.isProcessing = true;
    let storeId = this.checkingObject.storeId;
    if (storeId === undefined) {
      storeId = this.checkingObject.typeObject.storeId
    }
    const requisition: any = <any>{};
    requisition.employeeId = this.loginEmployee._id;
    requisition.facilityId = this.selectedFacility._id;
    requisition.storeId = storeId;
    requisition.destinationStoreId = this.productsControl.value;
    requisition.comment = this.desc.value;
    requisition.products = [];
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item: any, i) => {
      let requisitionProduct: any = <any>{};
      requisitionProduct.productId = item.value.productObject.id;
      requisitionProduct.productObject = item.value.productObject;
      requisitionProduct.qty = item.value.qty;
      requisitionProduct.qtyDetails = [];
        item.value.config.forEach(element => {
          requisitionProduct.qtyDetails.push({
            packId: element.packItem,
            quantity: element.size
          });
        });
      requisition.products.push(requisitionProduct);
    });
    this.requisitionService.create(requisition).then(payload => {
      this.systemModuleService.announceSweetProxy('Requisition successfull', 'success', null, null, null, null, null, null, null);
      this.addNewProductTables();
      this.desc.reset();
      this.resetGroups();
      this.isProcessing = false;
      this.systemModuleService.off();
    }, err => {
      this.systemModuleService.announceSweetProxy('Requisition failed', 'error');
      this.isProcessing = false;
      this.systemModuleService.off();
    });
  }

  flyout_toggle(e) {
    this.flyout = !this.flyout;
    // e.stopPropagation();
  }
  flyout_close(e) {
    if (this.flyout === true) {
      this.flyout = false;
    }
  }

  getInventories() {
    this.systemModuleService.on();
    this.products = [];
    if (this.checkingObject !== null) {
      this.inventoryService.findList({
        query:
          { facilityId: this.selectedFacility._id, name: '', storeId: this.checkingObject.storeId }// , $limit: 200 }
      })
        .then(payload => {
          const products = payload.data.filter(x => x.availableQuantity === 0);
          products.forEach(element => {
            this.products.push(element.productObject);
            this.getProductTables(this.products);
          });
          this.systemModuleService.off();
        });
    }

  }

  getProductsOutofStockInventory(storeId) {
    this.systemModuleService.on();
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: storeId,
        availableQuantity: 0,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      this.systemModuleService.off();
      if (payload.data.length > 0) {
        this.products = [];
        this.getProductTables(this.products);
        payload.data.forEach((item, i) => {
          if (item.productObject !== undefined) {
            this.products.push(item.productObject);
          }
        });
        this.getProductTables(this.products);
      } else {
        this.superGroups = [];
      }
    });
  }

  getProductsReorderInventory(storeId) {
    this.systemModuleService.on();
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: storeId,
        $sort: { createdAt: -1 }
      }
    }).then(payload => {
      this.systemModuleService.off();
      if (payload.data.length > 0) {
        let reOrderProducts = payload.data.filter(x => x.reorder !== undefined && x.availableQuantity <= x.reorder);
        this.products = [];
        this.getProductTables(this.products);
        reOrderProducts.forEach((item, i) => {
          if (item.productObject !== undefined) {
            this.products.push(item.productObject);
          }
        });
        this.getProductTables(this.products);
      } else {
        this.superGroups = [];
      }
    });
  }

  onChecked(e, item, checkBoxLabel, i) {
    item.checked = e.checked;
    this.products = [];

    this.getProductTables(this.products);
    if (e.checked) {
      let storeId = this.checkingObject.storeId;
      if (storeId === undefined) {
        storeId = this.checkingObject.typeObject.storeId
      }
      if (i === 0) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[2].checked = false;
        this.getAllProducts('', storeId);
      } else if (i === 1) {
        checkBoxLabel[0].checked = false;
        checkBoxLabel[2].checked = false;
        this.getProductsOutofStockInventory(storeId);
      } else if (i === 2) {
        checkBoxLabel[1].checked = false;
        checkBoxLabel[0].checked = false;
        this.products = [];
        this.getProductsReorderInventory(storeId);
      }
    } else {
      checkBoxLabel[0].checked = false;
      checkBoxLabel[1].checked = false;
      checkBoxLabel[2].checked = false;
      this.products = [];
      this.getProductTables(this.products);
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

  // toggleProductConfig(index){
  //   document.querySelector("#quan"+index).classList.toggle('no-display');
  // }
}
