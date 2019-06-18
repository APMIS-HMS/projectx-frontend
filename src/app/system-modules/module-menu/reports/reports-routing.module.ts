import { Routes, RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';

const REPORTS_ROUTING: Routes = [
	{
		path: '',
		component: ReportsComponent,
		children: [
			{ path: '', redirectTo: 'report-dashboard' },
			{
				path: 'report-dashboard',
				loadChildren: './report-dashboard/report-dashboard.module#ReportDashboardModule'
			}
		]
	}
];

export const ReportsRoutingModule = RouterModule.forChild(REPORTS_ROUTING);
