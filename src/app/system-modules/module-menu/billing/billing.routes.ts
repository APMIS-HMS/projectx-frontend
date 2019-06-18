import { RouterModule, Routes } from '@angular/router';
import {BillingHomeComponent } from './billing-home/billing-home.component';
import {BillingComponent } from './billing.component';
import { AddTagComponent } from '../add-tag/add-tag.component';

const BILLINGMODULES_ROUTES: Routes = [
    {
        path: '', component: BillingHomeComponent, children: [
            { path: '', redirectTo: 'billing' },
            { path: 'billing', component: BillingComponent },
            { path: 'tags', component: AddTagComponent },
        ]
    }
];

export const billingRoutes = RouterModule.forChild(BILLINGMODULES_ROUTES);
