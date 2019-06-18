import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
// tslint:disable-next-line:max-line-length
import {
  InventoryService, InventoryTransferService, InventoryTransferStatusService,
  InventoryTransactionTypeService, StoreService, FacilitiesService, ProductRequisitionService, EmployeeService
} from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import {
  Facility, InventoryTransferStatus, InventoryTransactionType, InventoryTransferTransaction,
  InventoryTransfer, Employee
} from '../../../../models/index';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { element } from 'protractor';
import * as parse from 'date-fns/parse';

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html',
  styleUrls: ['./stock-transfer.component.scss']
})
export class StockTransferComponent implements OnInit {
  flyout = false;
  preview = false;
  overlay = false;
  productConfigOpen = false;
  samples = [];
  searchOpen = false;
  toggleTransferOpen = false;
  requistionId: any = null;
  selectedFacility: Facility = <Facility>{};
  requisitions: any[] = <any>[];
  checkingStore: any = <any>{};
  subscription: any = <any>{};
  maxQty = 0;
  superGroups: any[] = [];
  products: any[] = [];
  productTables: any[] = [];
  stores: any[] = [];
  user: any = <any>{};
  isProcessing = false;
  searchControl = new FormControl();
  frmFilterStore = new FormControl();
  frmFilterRequisition = new FormControl();
  frmFilterDate = new FormControl();
  frmDestinationStore: FormControl = new FormControl();
  product: FormControl = new FormControl();
  productTableForm: FormGroup;
  selectedTransactionId = '';
  newTransfer: any = <any>{};
  selectedInventoryTransferStatus: InventoryTransferStatus = <InventoryTransferStatus>{};
  selectedInventoryTransactionType: InventoryTransactionType = <InventoryTransactionType>{};
  loginEmployee: Employee = <Employee>{};

  showPlusSign: boolean = true;

  loading: boolean = false;

  previewObject: any = <any>{};
  constructor(private _inventoryEventEmitter: InventoryEmitterService,
    private inventoryService: InventoryService, private inventoryTransferService: InventoryTransferService,
    private inventoryTransactionTypeService: InventoryTransactionTypeService,
    private inventoryTransferStatusService: InventoryTransferStatusService,
    private route: ActivatedRoute, private storeService: StoreService,
    private _locker: CoolLocalStorage, private formBuilder: FormBuilder,
    private facilityService: FacilitiesService,
    private toastr: ToastsManager,
    private _authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService,
    private productRequisitionService: ProductRequisitionService,
    private employeeService: EmployeeService
  ) {
    this.user = this._locker.getObject('auth');
    this._inventoryEventEmitter.setRouteUrl('Stock Transfer');
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');

    this.subscription = this.employeeService.checkInAnnounced$.subscribe(res => {
      if (!!res) {
        if (!!res.typeObject) {
          this.checkingStore = res.typeObject;
          if (!!this.checkingStore.storeId) {
            this.getCurrentStoreDetails(this.checkingStore.storeId);
            this.newTransfer.transferBy = this.loginEmployee._id;
            this.newTransfer.facilityId = this.selectedFacility._id;
            this.newTransfer.storeId = this.checkingStore.storeId;
            this.newTransfer.inventoryTransferTransactions = [];
            this.getAllProducts('', this.checkingStore.storeId);
            this.primeComponent();
            this.getRequisitions(this.checkingStore.storeId);
            this.getStores();
          }
        }
      }
    });
    this.addNewProductTables();
    this._authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      // this.checkingStore = this.loginEmployee.storeCheckIn.find(x => x.isOn === true);
      if ((this.loginEmployee.storeCheckIn !== undefined
        || this.loginEmployee.storeCheckIn.length > 0)) {
        let isOn = false;
        this.loginEmployee.storeCheckIn.forEach((itemr, r) => {
          if (itemr.isDefault === true) {
            itemr.isOn = true;
            itemr.lastLogin = new Date();
            isOn = true;
            this.checkingStore = { typeObject: itemr, type: 'store' };
            this.employeeService.announceCheckIn(this.checkingStore);

            // tslint:disable-next-line:no-shadowed-variable
            this.employeeService.patch(this.loginEmployee._id, { storeCheckIn: this.loginEmployee.storeCheckIn }).then(payload => {
              this.loginEmployee = payload;
              this.checkingStore = { typeObject: itemr, type: 'store' };
              this.employeeService.announceCheckIn(this.checkingStore);
              this._locker.setObject('checkingObject', this.checkingStore);
              // this.checkingStore = this.checkingStore.typeObject;
              this.newTransfer.transferBy = this.loginEmployee._id;
              this.newTransfer.facilityId = this.selectedFacility._id;
              this.newTransfer.storeId = this.checkingStore.storeId;
              this.newTransfer.inventoryTransferTransactions = [];
              this.getAllProducts('', this.checkingStore.storeId)
              this.primeComponent();
              this.getRequisitions(this.checkingStore.storeId);
              this.getStores();
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
                this.checkingStore = { typeObject: itemr, type: 'store' };
                this.employeeService.announceCheckIn(this.checkingStore);
                this._locker.setObject('checkingObject', this.checkingStore);
                // this.checkingStore = this.checkingStore.typeObject;
                this.newTransfer.transferBy = this.loginEmployee._id;
                this.newTransfer.facilityId = this.selectedFacility._id;
                this.newTransfer.storeId = this.checkingStore.storeId;
                this.newTransfer.inventoryTransferTransactions = [];
                this.getAllProducts('', this.checkingStore.storeId);
                this.primeComponent();
                this.getRequisitions(this.checkingStore.storeId);
                this.getStores();
              });
            }
          });
        }
      }
    });
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((por: any) => {
        this.getAllProducts(por, this.checkingStore.storeId)
      });
    this.frmFilterStore.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((value: any) => {
        this.getRequisitions(value)
      });

    this.frmFilterRequisition.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((value: any) => {
        this.productRequisitionService.find({
          query: {
            facilityId: this.selectedFacility._id,
            destinationStoreId: this.checkingStore.storeId,
            storeRequisitionNumber: {
              $regex: value,
              $options: 'i'
            },
            $sort: { isSupplied: 1 }
          }
        }).then(payload => {
          this.requisitions = payload.data;
        });
      });

    this.frmFilterDate.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe((value: any) => {
        let dt = parse(value);
        let nowDt = new Date();
        this.productRequisitionService.find({
          query: {
            facilityId: this.selectedFacility._id,
            destinationStoreId: this.checkingStore.storeId,
            $and: [{
              updatedAt: {
                $gte: dt
              }
            },
            {
              updatedAt: {
                $lte: nowDt
              }
            }
            ],
            $sort: { isSupplied: 1 }
          }
        }).then(payload => {
          this.requisitions = payload.data;
        });
      });

  }

  getStores() {
    this.storeService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.stores = payload.data.filter(x => x._id !== this.checkingStore.storeId);
    });
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
          item.productObject.availableQuantity = item.availableQuantity;
          this.products.push(item.productObject);
        });
        this.getProductTables(this.products);
      } else {
        this.superGroups = [];
      }
    });
  }

  getRequisitions(storeId) {
    this.productRequisitionService.find({
      query: {
        facilityId: this.selectedFacility._id,
        destinationStoreId: storeId,
        $sort: { isSupplied: 1 }
      }
    }).then(payload => {
      this.requisitions = payload.data;
    });
  }



  getCurrentStoreDetails(id) {
    this.storeService.get(id, {}).then(payload => {
      this.checkingStore.storeObject = payload;
    });
  }

  primeComponent() {
    const status$ = Observable.fromPromise(this.inventoryTransferStatusService.find({ query: { name: 'Pending' } }));
    const type$ = Observable.fromPromise(this.inventoryTransactionTypeService.find({ query: { name: 'transfer', $limit: 20 } }));
    const store$ = Observable.fromPromise(this.storeService.find({ query: { facilityId: this.selectedFacility._id, $limit: 100 } }));

    Observable.forkJoin([status$, type$, store$]).subscribe(results => {
      const statusResult: any = results[0];
      const typeResult: any = results[1];
      const storeResult: any = results[2];

      if (statusResult.data.length > 0) {
        this.selectedInventoryTransferStatus = statusResult.data[0];
      }
      if (typeResult.data.length > 0) {
        this.selectedInventoryTransactionType = typeResult.data[0];
        this.newTransfer.inventorytransactionTypeId = this.selectedInventoryTransactionType._id;
      }
      storeResult.data.forEach((store) => {
        let _checkingStore: any = <any>{};
        if (!!this.checkingStore.typeObject) {
          _checkingStore = this.checkingStore.typeObject;
        } else {
          _checkingStore = this.checkingStore;
        }
        if (store._id.toString() !== _checkingStore.storeId.toString()) {
          this.stores.push(store);
        }
      })
      // this.stores = storeResult.data;
    });
  }
  getMyInventory() {
    this.inventoryService.find({
      query: {
        facilityId: this.selectedFacility._id,
        storeId: this.checkingStore.storeId
      }
    }).then(payload => {
      this.products = [];
      this.getProductTables(this.products);
      payload.data.forEach((item, i) => {
        this.products.push(item.productObject);
      });
      this.getProductTables(this.products);
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
          avQty: [''],
          batchNo: ['', [<any>Validators.required]],
          batchNumbers: [],
          costPrice: [0.00, [<any>Validators.required]],
          totalCostPrice: [0.00, [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          config: new FormArray([]),
          expiryDate: ['', [<any>Validators.required]],
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
  }

  getBaseProductConfig(form) {
    if (form.controls.config.controls[0].value.packsizes !== null) {
      let basePackName = form.controls.config.controls[0].value.packsizes.find(x => x.isBase === true).name;
      if (form.controls.productObject.value.availableQuantity < form.controls.qty.value) {
        try {
          form.controls.qty.setValue(0);
          form.controls.totalCostPrice.setValue(0);
          form.controls.config.controls.forEach(element => {
            element.controls.size.setValue(0);
          });
          this.systemModuleService.announceSweetProxy('You donot have sufficient quantity for this transaction', 'error');
        } catch (error) {
        }
      }
      return basePackName;
    }
  }

  onAddPackSize(pack, form) {
    form.controls.config.controls.push(new FormGroup({
      size: new FormControl(0),
      packsizes: new FormControl(pack),
      packItem: new FormControl()
    }));
  }

  onRemovePack(pack, form, k, index) {
    pack.controls.config.removeAt(k);
    this.onPackageSize(index, form);
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

  onPackageSize(i, packs) {
    try {
      packs[i].controls.totalCostPrice.setValue(0);
      packs[i].controls.qty.setValue(0);
      packs[i].controls.config.controls.forEach(element => {
        if (element.value.packItem !== null) {
          packs[i].controls.qty.setValue(packs[i].controls.qty.value + element.value.size * (element.value.packsizes.find(x => x._id.toString() === element.value.packItem.toString()).size));
        }
      });
      const subTotal = packs[i].controls.costPrice.value * packs[i].controls.qty.value;
      packs[i].controls.totalCostPrice.setValue(subTotal);
    } catch (err) {

    }
  }

  onStoreChanged() {
    this.unCheckedProducts();
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
    this.flyout = true;
  }

  existingProductConfig(config) {
    let frmArray = new FormArray([]);
    config.qtyDetails.forEach(element => {
      frmArray.push(new FormGroup({
        size: new FormControl(element.quantity),
        packsizes: new FormControl(config.productObject.productConfigObject),
        packItem: new FormControl(element.packId)
      }));
    });
    return frmArray;
  }

  onClickRequi(requistion) {
    this.requistionId = requistion._id;
    this.toggleTransferOpen = !this.toggleTransferOpen;
    if (this.toggleTransferOpen) {
      this.frmDestinationStore.setValue(requistion.storeId);
      // this.primeComponent();
      this.flyout = true;
      requistion.products.forEach(element => {
        this.superGroups.forEach((parent, i) => {
          parent.forEach((group, j) => {
            if (element.productId !== undefined) {
              if (group._id.toString() === element.productId.toString()) {
                group.checked = true;
                this.systemModuleService.on();
                this.inventoryService.find({ query: { productId: element.productId, facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId } }).then(payload => {
                  this.systemModuleService.off();
                  if (payload.data.length > 0) {
                    (<FormArray>this.productTableForm.controls['productTableArray']).push(
                      this.formBuilder.group({
                        product: [element.productObject.name, [<any>Validators.required]],
                        avQty: [payload.data[0].availableQuantity],
                        batchNo: [, [<any>Validators.required]],
                        batchNumbers: [payload.data[0].transactions],
                        costPrice: [0.00, [<any>Validators.required]],
                        totalCostPrice: [0.00, [<any>Validators.required]],
                        qty: [0, [<any>Validators.required]],
                        config: this.existingProductConfig(element),
                        readOnly: [false],
                        productObject: [group.product],
                        id: [group._id],
                        inventoryId: [payload.data[0]._id]
                      })
                    );
                  }
                });
              }
            }
          });
        });
      });

    }
  }


  onProductCheckChange(event, value, index?) {
    if (this.frmDestinationStore.value !== null) {
      value.checked = event.checked;
      this.maxQty = 0;
      let checker = false;
      if (value.product.availableQuantity !== undefined) {
        if (value.product.availableQuantity > 0) {
          checker = true;
        } else {
          checker = false;
        }
      } else {
        if (value.productObject.availableQuantity > 0) {
          checker = true;
        } else {
          checker = false;
        }
      }
      if (checker) {
        if (event.checked === true) {
          this.systemModuleService.on();
          this.inventoryService.find({ query: { productId: value._id, facilityId: this.selectedFacility._id, storeId: this.checkingStore.storeId } }).subscribe(payload => {
            this.systemModuleService.off();
            if (payload.data.length > 0) {
              (<FormArray>this.productTableForm.controls['productTableArray'])
                .push(
                  this.formBuilder.group({
                    product: [value.name, [<any>Validators.required]],
                    avQty: [payload.data[0].availableQuantity],
                    batchNo: [, [<any>Validators.required]],
                    batchNumbers: [payload.data[0].transactions],
                    costPrice: [0.00, [<any>Validators.required]],
                    totalCostPrice: [0.00, [<any>Validators.required]],
                    qty: [0, [<any>Validators.required]],
                    config: this.initProductConfig(value.product.productConfigObject),
                    readOnly: [false],
                    productObject: [value.product],
                    id: [value._id],
                    inventoryId: [payload.data[0]._id]
                  })
                );
            }
          });

        } else {
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 1) {
            this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
          } else {
            (<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(index, 1);
          }
          let indx = index;
          if (index > 0) {
            indx = index - 1;
          }
          this.onPackageSize(indx, (<FormArray>this.productTableForm.controls['productTableArray']).controls);
        }
      } else {
        this.systemModuleService.announceSweetProxy('This product is out of stock', 'error');
      }
    } else {
      this.systemModuleService.announceSweetProxy('Please select destination store', 'error');
      this.superGroups.forEach((parent, i) => {
        parent.forEach((group, j) => {
          if (group._id.toString() === value._id.toString()) {
            group.checked = false;
          }
        })
      });
      this.superGroups = JSON.parse(JSON.stringify(this.superGroups));
    }
  }

  compareItems(l1: any, l2: any) {
    return l1.includes(l2);
  }

  removeProduct(index, form) {
    const value = form[index];
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id.toString() === value.value.productObject.id.toString()) {
          group.checked = false;
          this.onProductCheckChange({ checked: false }, value.value, index);
          const count = form.length;
          if (count === 0) {
            this.addNewProductTables();
          }
        }
      });
    });
    // this.onPackageSize(index, form);
  }
  getProductQuantity($event, value, index) {
    this.selectedTransactionId = $event.value;
    const filterValue = value.filter(x => x._id === $event.value);
    if (filterValue.length > 0) {
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].setValue(filterValue[0].availableQuantity);
      this.maxQty = filterValue[0].quantity;
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['costPrice'].setValue(filterValue[0].costPrice);
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['batchNo'].setValue(filterValue[0].batchNumber);
      const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].value;
      const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['costPrice'].value;
      const totalCost = qty * costPrice;
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['totalCostPrice'].setValue(totalCost);

    }
  }
  checkProductQuantity($event, value, index, productId) {
    const filterValue = value.filter(x => x._id === this.selectedTransactionId);
    if (filterValue.length > 0) {
      if ($event.value > filterValue[0].quantity && $event.value > 0) {
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].setValue(filterValue[0].quantity);
        const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].value;
        const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['costPrice'].value;
        const totalCost = qty * costPrice;
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['totalCostPrice'].setValue(totalCost);
      } else {
        const qty = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['qty'].value;
        const costPrice = (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['costPrice'].value;
        const totalCost = qty * costPrice;
        (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
          .controls[index]).controls['totalCostPrice'].setValue(totalCost);
      }
    } else {
      (<FormGroup>(<FormArray>this.productTableForm.controls['productTableArray'])
        .controls[index]).controls['qty'].setValue(0);
    }
  }
  splitProduct($event, value, index, productId) {
    const product = (<FormArray>this.productTableForm.controls['productTableArray']).controls[index].value;
    if (this.productTableForm.controls['productTableArray'].value.length >= value.length) {
      this.showPlusSign = false;
      return;
    } else {
      this.showPlusSign = true;
      ((<FormArray>this.productTableForm.controls['productTableArray'])
        .insert(index,
          this.formBuilder.group({
            product: [product.product, [<any>Validators.required]],
            avQty: [product.avQty],
            batchNo: [, [<any>Validators.required]],
            batchNumbers: [product.batchNumbers],
            costPrice: [0.00, [<any>Validators.required]],
            totalCostPrice: [0.00, [<any>Validators.required]],
            qty: [0, [<any>Validators.required]],
            config: this.initProductConfig(product.productObject.productConfigObject),
            readOnly: [false],
            productObject: [product.productObject],
            id: [product.id],
            inventoryId: [product.inventoryId]
          })
        )
      );
    }

  }
  flyout_toggle(e) {
    this.flyout = !this.flyout;
    e.stopPropagation();
  }
  flyout_close(e) {
    if (this.flyout === true) {
      this.flyout = false;
    }
  }
  populateInventoryTransferTransactions() {
    this.newTransfer.inventoryTransferTransactions = [];
    this.newTransfer.destinationStoreId = this.frmDestinationStore.value;
    this.newTransfer.totalCostPrice = 0;
    (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
      const transferTransaction: any = <any>{};
      transferTransaction.inventoryId = item.value.inventoryId;
      transferTransaction.productId = item.value.id;
      transferTransaction.productObject = item.value.productObject;
      delete transferTransaction.productObject.productConfigObject;
      delete transferTransaction.productObject.availableQuantity;
      transferTransaction.qtyDetails = [];
      item.value.config.forEach(element => {
        transferTransaction.qtyDetails.push({
          packId: element.packItem,
          quantity: element.size
        });
      });
      transferTransaction.quantity = item.value.qty;
      if (item.value.qty === undefined || item.value.qty == null || isNaN(item.value.qty)) {
        transferTransaction.quantity = 0;
      }
      transferTransaction.costPrice = item.value.costPrice;
      if (isNaN(item.value.costPrice) || item.value.costPrice === undefined || item.value.costPrice === null) {
        transferTransaction.costPrice = 0;
      }
      transferTransaction.lineCostPrice = item.value.totalCostPrice;
      if (isNaN(item.value.totalCostPrice) || item.value.totalCostPrice === undefined || item.value.totalCostPrice === null) {
        transferTransaction.lineCostPrice = 0;
      }
      transferTransaction.transferStatusId = this.selectedInventoryTransferStatus._id;
      item.value.batchNumbers.forEach((itemm, m) => {
        if (itemm.batchNumber === item.value.batchNo) {
          transferTransaction.transactionId = itemm._id;
        }
      });
      this.newTransfer.totalCostPrice = this.newTransfer.totalCostPrice + transferTransaction.lineCostPrice;
      if (isNaN(this.newTransfer.totalCostPrice) || this.newTransfer.totalCostPrice === undefined
        || this.newTransfer.totalCostPrice === null) {
        this.newTransfer.totalCostPrice = 0;
      }

      this.newTransfer.inventoryTransferTransactions.push(transferTransaction);
    });

    this.previewObject = <any>{};
    this.previewObject.products = [];
    this.stores.forEach((itemi, i) => {
      if (itemi._id.toString() === this.newTransfer.storeId.toString()) {
        this.previewObject.store = itemi.name;
      }
      if (itemi._id === this.newTransfer.destinationStoreId) {
        this.previewObject.destinationStore = itemi.name;
      }
    });
    this.previewObject.dateTransfer = new Date();
    this.previewObject.stockValue = this.newTransfer.totalCostPrice;
    this.previewObject.dateAccepted = 'n/a';

    this.newTransfer.inventoryTransferTransactions.forEach((itemi, i) => {
      const filterProducts = this.products.filter(x => x._id === itemi.productId);
      if (filterProducts.length > 0) {
        this.previewObject.products.push({ product: filterProducts[0].name, cost: itemi.lineCostPrice, quantity: itemi.quantity });
      }
    });
  }
  previewShow() {
    this.populateInventoryTransferTransactions();
    this.preview = !this.preview;
  }
  unCheckedProducts() {
    this.superGroups.forEach((itemi, i) => {
      itemi.forEach((itemg, g) => {
        itemg.checked = false;
      });
    });
  }
  saveTransfer() {
    this.systemModuleService.on();
    this.isProcessing = true;
    this.populateInventoryTransferTransactions();
    this.newTransfer.requistionId = this.requistionId;
    this.inventoryTransferService.create2(this.newTransfer).then(payload => {
      (<FormArray>this.productTableForm.controls['productTableArray']).controls = [];
      this.flyout = false;
      this.unCheckedProducts();
      this.systemModuleService.off();
      this.loading = false;
      this.systemModuleService.announceSweetProxy('Your transfer was successful', 'success', null, null, null, null, null, null, null);
      this.frmDestinationStore.reset();
      this.isProcessing = false;
      this.requisitions = [];
      this.getRequisitions(this.checkingStore.storeId);
    }, err => {
      this.systemModuleService.off();
      const errMsg = 'There was an error while transfering product, please try again!';
      this.systemModuleService.announceSweetProxy(errMsg, 'error');
      this.isProcessing = false;
    });
  }

  showSplitProduct(i, data) {
    if (this.productTableForm.controls['productTableArray'].value.length >= data.length) {
      this.showPlusSign = false;
      return false;
    } else {
      this.showPlusSign = true;
      return true;
    }
  }

  toggleTransfer() {
    this.toggleTransferOpen = !this.toggleTransferOpen;
  }

  toggleProductConfig(index) {
    document.querySelector("#quan" + index).classList.toggle('no-display');
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
          }, err => {
          });
        }
      });
    }
    this.employeeService.announceCheckIn(undefined);
    this._locker.setObject('checkingObject', {});
    this.subscription.unsubscribe();
  }

  private _notification(type: String, text: String): void {
    this.facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
  openSearch() {
    this.searchOpen = !this.searchOpen;
  }
}
