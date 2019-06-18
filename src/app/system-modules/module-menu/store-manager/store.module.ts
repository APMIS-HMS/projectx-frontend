import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { storeRoutes } from './store.routes';
import { StoreComponent } from './store.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { NewStoreComponent } from './new-store/new-store.component';
import {
    ProductTypeService, StoreService, ProductService, ManufacturerService, GenericService,
    RouteService, SupplierService, PurchaseOrderService,InventoryTransferService, InventoryTransferStatusService,ProductRequisitionService
} from '../../../services/facility-manager/setup/index';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { StoreEmitterService } from '../../../services/facility-manager/store-emitter.service';
import { StoreHomeComponent } from './store-home/store-home.component';
// import { QuickLinksComponent } from './quick-links/quick-links.component';
import { PosComponent } from './pos/pos.component';
import { PosDiscountComponent } from './pos/pos-discount/pos-discount.component';
import { PosRecieptComponent } from './pos/pos-reciept/pos-reciept.component';
import {StoreSummaryComponent} from './store-home/new-store-manager-components/store-summary-component';
import {StoreSummaryItemComponent} from './store-home/new-store-manager-components/store-summary-item-component';
import { StoreChartComponentComponent } from './store-home/store-chart-component/store-chart-component.component';
import { ChartsModule } from 'ng2-charts';
import {StoreSummaryDialogComponent} from './store-home/new-store-manager-components/store-summary-dialog-content-component';
import {DialogHostComponent} from './store-home/new-store-manager-components/dialog-host-component';

@NgModule({
    declarations: [
        StoreComponent,
        LandingPageComponent,
        NewStoreComponent,
        StoreHomeComponent,
        // QuickLinksComponent,
        PosComponent,
        PosDiscountComponent,
        PosRecieptComponent,
        StoreSummaryComponent,
        StoreSummaryItemComponent,
        StoreChartComponentComponent,
        StoreSummaryDialogComponent,
        DialogHostComponent
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        ChartsModule,
        storeRoutes
    ],
    providers: [StoreEmitterService, ProductTypeService, StoreService, ProductService,
        GenericService, ManufacturerService, RouteService, SupplierService, PurchaseOrderService,
        InventoryTransferService, InventoryTransferStatusService, ProductRequisitionService]
})
export class StoreModule { }



