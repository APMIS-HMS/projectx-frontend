import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { Routes, RouterModule } from '@angular/router';
import { ReportDashboardComponent } from './report-dashboard.component';
import { ClinicManagementReportComponent } from './clinic-management-report/clinic-management-report.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';
import { StoreManagerReportComponent } from './store-manager-report/store-manager-report.component';
import { WardManagerReportComponent } from './ward-manager-report/ward-manager-report.component';
import { PharmacyReportComponent } from './pharmacy-report/pharmacy-report.component';



const REPORTS_DASHBOARD_ROUTE: Routes = [
	{
		path: '',
		component: ReportDashboardComponent,
		children: [
			{ path: '', redirectTo: 'report-landing-page' },
			{ path: 'report-landing-page', component: DashboardLandingpageComponent },
			{
				path: 'clinic-report',
				loadChildren: './clinic-management-report/clinic-management-report.module#ClinicReportModule'
			},
			// { path: 'clinic-report', component: ClinicManagementReportComponent },
			{
				path: 'dhisReport',
				loadChildren: './dhis-report/dhis-report.module#DhisReportModule'
			},
			{
				path: 'labReport',
				component: LaboratoryReportComponent
			},

			// { path: 'patientReport', component: PatientManagerReportComponent},

			{ path: 'pharmacyReport', component: PharmacyReportComponent },

			{
				path: 'paymentReport',
				loadChildren: './payment-report/payment-report.module#PaymentReportModule'
			},

			{
				path: 'patientManagerReport',
				loadChildren: './patient-manager-report/patient-manager-report.module#PatientManagerReportModule'
			},

			{
				path: 'pharmacyReport',
				component: PharmacyReportComponent
			},

			{
				//path: 'storeReport', component: StoreManagerReportComponent
				path: 'storeReport',
				loadChildren: './store-manager-report/store-manager-report.module#StoreManagerReportModule'
			},

			{
				path: 'wardReport',
				component: WardManagerReportComponent
			}
		]
	}
];

export const ReportDashboardRoutingModule = RouterModule.forChild(REPORTS_DASHBOARD_ROUTE);
