import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { PaymentComponent } from './payment.component';
import { paymentRoutes } from './payment.routes';
import { PaymentHomeComponent } from './payment-home/payment-home.component';
import { AddModefierComponent } from './add-modefier/add-modefier.component';
// import { AddItemComponent } from './add-item/add-item.component';
import { AddLineModifierComponent } from './add-line-modifier/add-line-modifier.component';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { BillLookupComponent } from './bill-lookup/bill-lookup.component';
import { BillGroupComponent } from './bill-lookup/bill-group/bill-group.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { MakePaymentComponent } from './make-payment/make-payment.component';
import { ChartsModule } from 'ng2-charts';
import { FundWalletComponent } from './bill-lookup/fund-wallet/fund-wallet.component';
import { PaymentChartComponent } from './payment-chart/payment-chart.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { PaymentHistoryDetailsComponent } from './payment-history/payment-history-details/payment-history-details.component';


@NgModule({
    declarations: [
        PaymentHomeComponent,
        PaymentComponent,
        PaymentHomeComponent,
        AddModefierComponent,
        // AddItemComponent,
        // AddLineModifierComponent,
        // ItemDetailComponent,
        // FundWalletComponent,
        InvoiceComponent,
        BillLookupComponent,
        BillGroupComponent,
        MakePaymentComponent,
        PaymentChartComponent,
        PaymentHistoryComponent,
        PaymentHistoryDetailsComponent
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        paymentRoutes,
        ChartsModule
    ],
    providers: []
})
export class PaymentModule { }



