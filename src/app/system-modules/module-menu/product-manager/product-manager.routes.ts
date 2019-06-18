import { RouterModule, Routes } from '@angular/router';
import { ProductManagerComponent } from './product-manager.component';
import { SupplierManagerComponent } from './supplier-manager/supplier-manager.component';
import { ProductManagerLandingpageComponent } from './product-manager-landingpage/product-manager-landingpage.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { ManufacturerManagerComponent } from './manufacturer-manager/manufacturer-manager.component';
import { RouteManagerComponent } from './route-manager/route-manager.component';
import { GenericManagerComponent } from './generic-manager/generic-manager.component';
import { PresentationManagerComponent } from './presentation-manager/presentation-manager.component';
import { TransactionHistoryComponent } from './supplier-manager/transaction-history/transaction-history.component';
const PRODUCTMODULES_ROUTES: Routes = [
    {
        path: '', component: ProductManagerComponent, children: [
            { path: '', redirectTo: 'products' },
            { path: 'products', component: ProductManagerLandingpageComponent },
            { path: 'suppliers', component: SupplierManagerComponent },
            { path: 'supplier-detail/:id', component: TransactionHistoryComponent },
            { path: 'categories', component: CategoryManagerComponent },
            { path: 'manufacturers', component: ManufacturerManagerComponent },
            { path: 'routes', component: RouteManagerComponent },
            { path: 'generics', component: GenericManagerComponent },
            { path: 'presentations', component: PresentationManagerComponent },
        ]
    }
];

export const productManagerRoutes = RouterModule.forChild(PRODUCTMODULES_ROUTES);
