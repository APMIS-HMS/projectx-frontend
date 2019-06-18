import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';
import { dhisReportRoutingModule } from './dhis-report-routing.module';
import { RegistersModule } from './registers/registers.module';
import { NhmisSummaryComponent } from './nhmis-summary/nhmis-summary.component';
import { DhisReportComponent } from './dhis-report.component';


@NgModule({
    imports:[
        CommonModule,
        MaterialModule,
        OnlyMaterialModule,
        SharedModule,
        dhisReportRoutingModule
        
    ],

    declarations: [
        DhisReportComponent,
        NhmisSummaryComponent
    ]
})

export class DhisReportModule{}