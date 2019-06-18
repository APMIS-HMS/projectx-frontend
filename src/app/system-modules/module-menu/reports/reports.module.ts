import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
//import { WardManagerReportComponent } from './report-dashboard/ward-manager-report/ward-manager-report.component';
//import { StoreManagerReportComponent } from './report-dashboard/store-manager-report/store-manager-report.component';

@NgModule({
	imports: [CommonModule, ReportsRoutingModule
		// MatFormFieldModule,
		// MatInputModule
	],
	declarations: [ReportsComponent,  //////WardManagerReportComponent
	]
})
export class ReportsModule {}
