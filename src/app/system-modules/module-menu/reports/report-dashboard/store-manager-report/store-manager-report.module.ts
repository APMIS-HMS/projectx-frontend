import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';
import { StoreManagerReportComponent } from './store-manager-report.component';
import { StoreManagerReportRoutingModule } from './store-manager-report-routing.module';
import { StockReportComponent } from './stock-report/stock-report.component';
import { StoreSalesReportComponent } from './store-sales-report/store-sales-report.component';

@NgModule({
  imports: [
    CommonModule,
    StoreManagerReportRoutingModule,
    MaterialModule,
		OnlyMaterialModule,
    SharedModule
  ],
  declarations: [
    StoreManagerReportComponent,
    StockReportComponent,
    StoreSalesReportComponent ]
})
export class StoreManagerReportModule { }
