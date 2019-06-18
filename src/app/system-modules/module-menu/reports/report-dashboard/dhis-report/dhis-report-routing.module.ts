import { Routes, RouterModule } from '@angular/router';
import { DhisReportComponent } from  './dhis-report.component';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';



const DHIS_REPORT_ROUTE: Routes = [
    {
        path: '',
        component: DhisReportComponent,
        children:[
            { path: 'nhmis', component: NhmisSummaryComponent },
            {
				path: 'registers',
				loadChildren: './registers/registers.module#RegistersModule'
			},
        ]
    }
];

export const dhisReportRoutingModule = RouterModule.forChild(DHIS_REPORT_ROUTE)