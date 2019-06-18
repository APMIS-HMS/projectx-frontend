import { RouterModule, Routes } from '@angular/router';
import { InventoryManagerComponent } from './inventory-manager.component';
import { StockTakingComponent } from './stock-taking/stock-taking.component';
import { StockTransferComponent } from './stock-transfer/stock-transfer.component';
import { StockHistoryComponent } from './stock-history/stock-history.component';
import { ReceiveStockComponent } from './receive-stock/receive-stock.component';
import { RequisitionComponent } from './requisition/requisition.component';
import { ReorderLevelComponent } from './reorder-level/reorder-level.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
 import {InitializeStoreComponent} from './initialize-store/initialize-store.component'
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { ProductConfigComponent } from './product-config/product.config.component';


const INVENTORYMODULES_ROUTES: Routes = [
    {
        path: '', component: InventoryManagerComponent, children: [
            { path: '', redirectTo: 'inventory' },
            {
                path: 'inventory', component: LandingpageComponent,
                // resolve: { loginEmployee: LoginEmployeeResolverService }
            },
            { path: 'initialize-store', component: InitializeStoreComponent },
            { path: 'stock-taking', component: StockTakingComponent },
            { path: 'stock-transfer', component: StockTransferComponent },
            { path: 'stock-history', component: StockHistoryComponent },
            { path: 'receive-stock', component: ReceiveStockComponent, resolve: { loginEmployee: LoginEmployeeResolverService } },
            { path: 'requisition', component: RequisitionComponent },
            { path: 'reorder-level', component: ReorderLevelComponent },
            {path : 'product-config', component: ProductConfigComponent}
        ]
    }
];

export const inventoryManagerRoutes = RouterModule.forChild(INVENTORYMODULES_ROUTES);
