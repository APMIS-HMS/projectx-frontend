import { RouterModule, Routes } from '@angular/router';
import { PaymentHomeComponent } from './payment-home/payment-home.component';
import { PaymentComponent } from './payment.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { BillLookupComponent } from './bill-lookup/bill-lookup.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentHistoryDetailsComponent } from './payment-history/payment-history-details/payment-history-details.component';

const PAYMENTMODULES_ROUTES: Routes = [
    {
        path: '', component: PaymentHomeComponent, children: [
            { path: '', redirectTo: 'home' },
            { path: 'home', component: PaymentComponent },
            { path: 'invoice/:id', component: InvoiceComponent },
            { path: 'invoice', component: InvoiceComponent },
            { path: 'bill', component: BillLookupComponent },
            { path: 'bill/:id', component: BillLookupComponent },
            { path: 'history', component: PaymentHistoryComponent },
            { path: 'history/:id', component: PaymentHistoryDetailsComponent },
        ]
    }
];

export const paymentRoutes = RouterModule.forChild(PAYMENTMODULES_ROUTES);
