import { Routes, RouterModule } from '@angular/router';
import { PaymentReportComponent } from './payment-report.component';
import { PaymentSummaryPageComponent } from './payment-summary-page/payment-summary-page.component';
import { InvoiceListDetailsComponent } from './invoice-list-details/invoice-list-details.component';
import { InvoiceReportComponent } from './invoice-report/invoice-report.component';

const PAYMENT_REPORT_ROUTE: Routes = [
	{
		path: '',
		component: PaymentReportComponent,
		children: [
			{ path: 'paymentSummary', component: PaymentSummaryPageComponent },
			{ path: 'invoiceList', component: InvoiceListDetailsComponent },
			{ path: 'invoiceReport', component: InvoiceReportComponent }
		]
	}
];
export const PaymentReportRoutingModule = RouterModule.forChild(PAYMENT_REPORT_ROUTE);
