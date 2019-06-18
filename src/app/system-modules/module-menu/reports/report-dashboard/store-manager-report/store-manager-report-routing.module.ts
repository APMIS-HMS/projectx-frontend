import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreManagerReportComponent } from './store-manager-report.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { StoreSalesReportComponent } from './store-sales-report/store-sales-report.component';

const STORE_MANAGER_REPORT_ROUTE: Routes = [


// {
//   path: '',
//   component: ReportsComponent,
//   children: [
//     { path: '', redirectTo: 'report-dashboard' },
//     {
//       path: 'report-dashboard',
//       loadChildren: './report-dashboard/report-dashboard.module#ReportDashboardModule'
//     }
//   ]
// }
// ];

{
  path: '',
  component: StoreManagerReportComponent,
  children: [
    // { path: '', redirectTo: 'clinic-report-page' },
    { path: 'salesReport', component: StoreSalesReportComponent },
    { path: 'stockReport', component: StockReportComponent },
  ]
}
];  


export const StoreManagerReportRoutingModule = RouterModule.forChild(STORE_MANAGER_REPORT_ROUTE);
