import { Routes, RouterModule } from '@angular/router';
import { ClinicManagementReportComponent } from './clinic-management-report.component';
import { ClinicAttendanceComponent } from './clinic-attendance/clinic-attendance.component';
import { DiagnosisComponent } from './diagnosis/diagnosis.component';

const CLINIC_MANAGEMENT_REPORT_ROUTE: Routes = [
	{
		path: '',
		component: ClinicManagementReportComponent,
		children: [
			// { path: '', redirectTo: 'clinic-report-page' },
			// { path: 'clinic-report-page', component: ClinicManagementReportComponent },
			{ path: 'clinic-attendance', component: ClinicAttendanceComponent },
			{ path: 'diagnosis', component: DiagnosisComponent}
		]
	}
];

export const ClinicManagementRoutingModule = RouterModule.forChild(CLINIC_MANAGEMENT_REPORT_ROUTE);