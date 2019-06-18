import { RouterModule, Routes } from '@angular/router';
import { PurchaseManagerComponent } from './purchase-manager.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { NewPurchaseOrderComponent } from './purchase-order/new-purchase-order/new-purchase-order.component';
import { PurchaseEntryComponent } from './purchase-entry/purchase-entry.component';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';


const PURCHASEMODULES_ROUTES: Routes = [
    {
        path: '', component: PurchaseManagerComponent, children: [
            { path: '', redirectTo: 'orders' },
            { path: 'orders', component: PurchaseOrderComponent },
            { path: 'order-details/:id', component: NewPurchaseOrderComponent, resolve: { loginEmployee: LoginEmployeeResolverService } },
            { path: 'invoices', component: InvoicesComponent },
            { path: 'new-order', component: NewPurchaseOrderComponent, resolve: { loginEmployee: LoginEmployeeResolverService } },
            {
                path: 'purchase-entry', component: PurchaseEntryComponent,
                // resolve: { loginEmployee: LoginEmployeeResolverService }
            },
            {
                path: 'purchase-entry/:id', component: PurchaseEntryComponent,
                // resolve: { loginEmployee: LoginEmployeeResolverService }
            },
            {
                path: 'purchase-entry-edit/:invoiceId', component: PurchaseEntryComponent,
                // resolve: { loginEmployee: LoginEmployeeResolverService }
            }

        ]
    }
];
export const purchaseManagerRoutes = RouterModule.forChild(PURCHASEMODULES_ROUTES);
