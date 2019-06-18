import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { InventoryEmitterService } from '../../../../services/facility-manager/inventory-emitter.service';
import { Facility, Inventory } from '../../../../models/index';
import { ProductService, InventoryService } from '../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-stock-taking',
  templateUrl: './stock-taking.component.html',
  styleUrls: ['./stock-taking.component.scss']
})
export class StockTakingComponent implements OnInit {

  mainErr = true;
  errMsg = 'you have unresolved errors';

  flyout = false;

  public frm_purchaseOrder: FormGroup;

  suppliers: any[] = [];

  selectedFacility: Facility = <Facility>{};
  selectedStock: any = <any>{};

  productTableForm: FormGroup;
  checkAll: FormControl = new FormControl();
  zeroQuantity: FormControl = new FormControl();
  reOrderLevelQuantity: FormControl = new FormControl();
  searchControl = new FormControl();

  value: Date = new Date(1981, 3, 27);
  now: Date = new Date();
  min: Date = new Date(1900, 0, 1);
  dateClear = new Date(2015, 11, 1, 6);
  maxLength = null;

  products: any[] = [];
  productTables: any[] = [];
  superGroups: any[] = [];
  removingRecord = false;

  constructor(
    private formBuilder: FormBuilder, private productService: ProductService,
    private locker: CoolLocalStorage, private inventoryService: InventoryService,
    private _inventoryEventEmitter: InventoryEmitterService
  ) { }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Stock Taking');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.frm_purchaseOrder = this.formBuilder.group({
      product: ['', [<any>Validators.required]],
      supplier: ['', [<any>Validators.required]],
      deliveryDate: [this.now, [<any>Validators.required]],
      desc: ['', [<any>Validators.required]],
    });

    this.addNewProductTables();
    // this.getProducts();
    this.getInventories();
  }

  getProducts() {
    this.productService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
      this.products = payload.data;
      this.getProductTables(this.products);
    });
  }

  getInventories() {
    this.inventoryService.find({ query: { facilityId: this.selectedFacility._id } }).subscribe(payload => {
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
        let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
        obj = this.mergeTable(obj);
        group.push(obj);
        this.superGroups.push(group);
      } else {
        if (counter < 1) {
          let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
          obj = this.mergeTable(obj);
          this.superGroups[counter].push(obj);
          counter = counter + 1;
        } else {
          counter = 0;
          let obj = <any>{ checked: false, name: this.productTables[i].name, _id: this.productTables[i]._id };
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
  onProductCheckChange(event, value) {
    value.checked = event.checked;
    if (event.checked === true) {
      (<FormArray>this.productTableForm.controls['productTableArray'])
        .push(
        this.formBuilder.group({
          product: [value.name, [<any>Validators.required]],
          systemQuantity: [0, [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          readOnly: [false],
          id: [value._id]
        })
        );
    } else {
      let indexToRemove = 0;
      (<FormArray>this.productTableForm.controls['productTableArray']).controls.forEach((item, i) => {
        const productControlValue: any = (<any>item).controls['id'].value;
        if (productControlValue === value._id || productControlValue === value.id) {
          indexToRemove = i;
        }
      });
      const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
      if (count === 1) {
        this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
      } else {
        (<FormArray>this.productTableForm.controls['productTableArray']).controls.splice(indexToRemove, 1);
      }
    }

  }
  removeProduct(index, value) {
    this.superGroups.forEach((parent, i) => {
      parent.forEach((group, j) => {
        if (group._id === value.id) {
          group.checked = false;
          const event: any = { value: false };
          this.onProductCheckChange(event, value);
          const count = (<FormArray>this.productTableForm.controls['productTableArray']).controls.length;
          if (count === 0) {
            this.addNewProductTables();
          }
        }
      });
    });
  }
  addNewProductTables() {
    this.productTableForm = this.formBuilder.group({
      'productTableArray': this.formBuilder.array([
        this.formBuilder.group({
          product: ['', [<any>Validators.required]],
          systemQuantity: [0, [<any>Validators.required]],
          qty: [0, [<any>Validators.required]],
          readOnly: [false],
          id: ['']
        })
      ])
    });
    this.productTableForm.controls['productTableArray'] = this.formBuilder.array([]);
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
}
