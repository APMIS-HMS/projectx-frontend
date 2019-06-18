import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';
import { ClinicManagementRoutingModule } from './clinic-management-report-routing.module';
import { ClinicAttendanceComponent } from './clinic-attendance/clinic-attendance.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';
import { ClinicManagementReportComponent } from './clinic-management-report.component';

@NgModule({
	imports: [ CommonModule,
		MaterialModule,
		OnlyMaterialModule,
		SharedModule,
		ClinicManagementRoutingModule ],

	declarations: [ ClinicAttendanceComponent,
		DiagnosisComponent,
		ClinicManagementReportComponent ]
})
export class ClinicReportModule {}
