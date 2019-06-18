import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';
import { PaymentReportRoutingModule } from './payment-report-routing.module';
import { PaymentReportComponent } from './payment-report.component';
import { PaymentSummaryPageComponent } from './payment-summary-page/payment-summary-page.component';
import { InvoiceListDetailsComponent } from './invoice-list-details/invoice-list-details.component';
import { ChartsModule } from 'ng2-charts';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';
import { InvoiceItemComponent } from './invoice-list-details/invoice-item.component';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule,
		OnlyMaterialModule,
		SharedModule,
		PaymentReportRoutingModule,
		ChartsModule
	],

	declarations: [
		PaymentReportComponent,
		PaymentSummaryPageComponent,
		InvoiceListDetailsComponent,
		InvoiceReportComponent,
		InvoiceItemComponent
	]
})
export class PaymentReportModule {}
