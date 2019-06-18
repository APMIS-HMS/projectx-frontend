import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility, MinorLocation, StoreModel } from '../../../../models/index';
import { ProductTypeService, StoreService } from '../../../../services/facility-manager/setup/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { AuthFacadeService } from '../../../service-facade/auth-facade.service';


@Component({
  selector: 'app-new-store',
  templateUrl: './new-store.component.html',
  styleUrls: ['./new-store.component.scss']
})
export class NewStoreComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() refreshStore: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedStore: any = <any>{};
  selectedFacility: Facility = <Facility>{};
  selectedMinorLocation: MinorLocation = <MinorLocation>{};
  minorLocations: MinorLocation[] = [];
  productTypes: any[] = [];
  stores: any[] = [];
  mainErr = true;
  errMsg = 'You have unresolved errors';
  frm_newStore: FormGroup;
  addBtnText = true;
  addingBtnText = false;
  updateBtnText = false;
  updatingBtnText = false;
  disableBtn = false;

  constructor(private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private productTypeService: ProductTypeService,
    private systemModuleService: SystemModuleService,
    private storeService: StoreService,
    private _authFacadeService: AuthFacadeService
  )
    {
      this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
      this._authFacadeService.getLogingEmployee().then((res: any) => {
        const workSpaces = res.workSpaces;
        if (this.selectedFacility.minorLocations.length > 0) {
          if (!!workSpaces && workSpaces.length > 0) {
            this.selectedFacility.minorLocations.forEach(minorLocation => {
              workSpaces.forEach(workspace => {
                if (workspace.isActive && workspace.locations.length > 0) {
                  workspace.locations.forEach(x => {
                    if (x.isActive && (x.minorLocationId === minorLocation._id)) {
                      this.minorLocations.push(x.minorLocationObject);
                    }
                  });
                }
              });
            });
          }
        }
      }).catch(err => { });
    }

  ngOnInit() {
    this.frm_newStore = this.formBuilder.group({
      name: ['', [<any>Validators.required]],
      minorLocationId: ['', [<any>Validators.required]],
      description: [''],
      canDespense: [false, [<any>Validators.required]],
      canReceivePurchaseOrder: [false, [<any>Validators.required]],
      facilityId: [this.selectedFacility._id, [<any>Validators.required]],
    });

    this.getProductTypes();
    this.populateStore();
  }

  getProductTypes() {
    this.productTypeService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      payload.data.forEach((item, i) => {
        let newItem: StoreModel = <StoreModel>{};
        newItem._id = item._id;
        newItem.name = item.name;
        newItem.facilityId = item.facilityId;
        newItem.isChecked = false;
        this.productTypes.push(newItem);
      });
      if (this.selectedStore._id !== undefined) {
        this.productTypes.forEach((item, i) => {
          this.selectedStore.productTypeId.forEach((item2, j) => {
            if (item._id === item2.productTypeId) {
              item.isChecked = true;
            }
          });
        });
      }

    });
  }

  populateStore() {
    if (this.selectedStore._id !== undefined) {
      this.addBtnText = false;
      this.addingBtnText = false;
      this.updateBtnText = true;
      this.updatingBtnText = false;
      this.frm_newStore.controls['name'].setValue(this.selectedStore.name);
      this.frm_newStore.controls['minorLocationId'].setValue(this.selectedStore.minorLocationId);
      this.frm_newStore.controls['description'].setValue(this.selectedStore.description);
      this.frm_newStore.controls['canDespense'].setValue(this.selectedStore.canDespense);
      this.frm_newStore.controls['canReceivePurchaseOrder'].setValue(this.selectedStore.canReceivePurchaseOrder);
    } else {
      this.addBtnText = true;
      this.addingBtnText = false;
      this.updateBtnText = false;
      this.updatingBtnText = false;
      this.frm_newStore.reset();
      this.frm_newStore.controls['canDespense'].setValue(false);
      this.frm_newStore.controls['canReceivePurchaseOrder'].setValue(false);
      this.frm_newStore.controls['facilityId'].setValue(this.selectedFacility._id);
    }
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  onValueChanged(e, productType) {
    productType.isChecked = e.checked;
  }

  create(valid, value) {
    if (valid) {
      this.systemModuleService.on();
      this.mainErr = true;
      if (this.selectedStore._id === undefined) {
        value.facilityId = this.selectedFacility._id;
        value.productTypeId = [];
        this.productTypes.forEach((item, i) => {
          if (item.isChecked === true) {
            value.productTypeId.push({ productTypeId: item._id });
          }
        });
        this.storeService.create(value).then(payload => {
          this.frm_newStore.reset();
          this.productTypes.forEach((item, i) => {
            item.isChecked = false;
          });
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Store has been created successfully.', 'success');
          this.refreshStore.emit(true);
          this.closeModal.emit(true);
        }, error => {
          this.systemModuleService.off();
        });
      } else {
        this.selectedStore.name = value.name;
        this.selectedStore.minorLocationId = value.minorLocationId;
        this.selectedStore.description = value.description;
        this.selectedStore.canDespense = value.canDespense;
        this.selectedStore.canReceivePurchaseOrder = value.canReceivePurchaseOrder;
        this.selectedStore.productTypeId = [];
        this.productTypes.forEach((item, i) => {
          if (item.isChecked === true) {
            this.selectedStore.productTypeId.push({ productTypeId: item._id });
          }
        });
        this.storeService.patch(this.selectedStore._id,{
          name: this.selectedStore.name,
          minorLocationId: this.selectedStore.minorLocationId,
          description: this.selectedStore.description,
          canDespense: this.selectedStore.canDespense,
          canReceivePurchaseOrder: this.selectedStore.canReceivePurchaseOrder,
          productTypeId: this.selectedStore.productTypeId
        }).then(payload => {
          this.systemModuleService.off();
          this.systemModuleService.announceSweetProxy('Store has been updated successfully.', 'success');
          this.refreshStore.emit(true);
          this.close_onClick();
        }, error => {
          this.systemModuleService.off();
        });
      }

    } else {
      this.mainErr = false;
    }
  }
}
