import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { purchaseManagerRoutes } from './purchase-manager.routes';
import { PurchaseManagerComponent } from './purchase-manager.component';
import { PurchaseEmitterService } from '../../../services/facility-manager/purchase-emitter.service';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewPurchaseOrderComponent } from './purchase-order/new-purchase-order/new-purchase-order.component';
import { PurchaseEntryComponent } from './purchase-entry/purchase-entry.component';
// tslint:disable-next-line:max-line-length
import { SupplierService, ProductService, StoreService, PurchaseOrderService, StrengthService, PurchaseEntryService, InventoryService } from '../../../services/facility-manager/setup/index';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { MaterialModule } from '../../../shared-common-modules/material-module';


@NgModule({
  declarations: [
    PurchaseManagerComponent,
    PurchaseHistoryComponent,
    PurchaseOrderComponent,
    InvoicesComponent, NewPurchaseOrderComponent, PurchaseEntryComponent
  ],
  exports: [],
  imports: [
    SharedModule,
    MaterialModule,
    OnlyMaterialModule,
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    purchaseManagerRoutes,
  ],
  providers: [PurchaseEmitterService, SupplierService, ProductService, PurchaseOrderService, StoreService, StrengthService,
    LoginEmployeeResolverService, InventoryService, PurchaseEntryService]
})
export class PurchaseManagerModule { }
