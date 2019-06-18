import { ReportDashboardComponent } from './report-dashboard.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDashboardRoutingModule } from './report-dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared-module/shared.module';
import { OnlyMaterialModule } from '../../../../shared-common-modules/only-material-module';
import { MaterialModule } from '../../../../shared-common-modules/material-module';
import { DashboardLandingpageComponent } from './dashboard-landingpage/dashboard-landingpage.component';
import { DhisReportComponent } from './dhis-report/dhis-report.component';
import { ClinicReportModule } from './clinic-management-report/clinic-management-report.module';
import { PatientManagerReportComponent } from './patient-manager-report/patient-manager-report.component';
import { LaboratoryReportComponent } from './laboratory-report/laboratory-report.component';
import { PharmacyReportComponent } from './pharmacy-report/pharmacy-report.component';
import { PaymentReportComponent } from './payment-report/payment-report.component';
import { StoreManagerReportComponent } from './store-manager-report/store-manager-report.component';
import { WardManagerReportComponent } from './ward-manager-report/ward-manager-report.component';


@NgModule({
	imports: [
		CommonModule,
		ReportDashboardRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		// MatFormFieldModule,
		// MatInputModule,
		OnlyMaterialModule,
		SharedModule
	],
	declarations: [
		ReportDashboardComponent,
		DashboardLandingpageComponent,
		LaboratoryReportComponent,
		PharmacyReportComponent,
		//StoreManagerReportComponent,
		WardManagerReportComponent
	]
})
export class ReportDashboardModule {}
