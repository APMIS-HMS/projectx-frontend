import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { inventoryManagerRoutes } from './inventory-manager.routes';
import { InventoryEmitterService } from '../../../services/facility-manager/inventory-emitter.service';
import { InventoryManagerComponent } from './inventory-manager.component';
import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ReceiveStockDetailsComponent } from './receive-stock/receive-stock-details/receive-stock-details.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { InitializeStoreComponent } from './initialize-store/initialize-store.component';
import { ProductConfigComponent } from './product-config/product.config.component';
import {
    ProductService, InventoryService, InventoryTransferService, InventoryTransferStatusService,
    InventoryTransactionTypeService, StrengthService, ProductRequisitionService,StoreService
} from '../../../services/facility-manager/setup/index';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { ReorderLevelComponent } from './reorder-level/reorder-level.component';
import { PurchaseEmitterService } from '../../../services/facility-manager/purchase-emitter.service';
import { ConfiguredProductsComponent } from './product-config/configured-products/configured-products.component';

@NgModule({
    declarations: [
        InventoryManagerComponent,
        StockTakingComponent,
        StockTransferComponent,
        ReceiveStockComponent,
        RequisitionComponent,
        LandingpageComponent,
        ReceiveStockDetailsComponent,
        StockHistoryComponent,
        InitializeStoreComponent,
        ReorderLevelComponent,
        ProductConfigComponent,
        ConfiguredProductsComponent
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        inventoryManagerRoutes
    ],
    providers: [
        InventoryEmitterService, ProductService, InventoryService, LoginEmployeeResolverService, ProductRequisitionService,
        InventoryTransferService, InventoryTransferStatusService, InventoryTransactionTypeService, StrengthService, StoreService]
})
export class InventoryManagerModule { }
