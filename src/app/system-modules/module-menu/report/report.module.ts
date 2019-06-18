import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared-module/shared.module';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { ChartsModule } from 'ng2-charts'
import { reportRoutes } from './report.routes';
import { ReportComponent } from './report.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentComponent } from './payment/payment.component';
import { PatientComponent } from './patient/patient.component';
import { ClinicComponent } from './clinic/clinic.component';
import { LabComponent } from './lab/lab.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { StoreComponent } from './store/store.component';



@NgModule({
    declarations: [
        ReportComponent,
        SummaryComponent,
        PaymentComponent,
        PatientComponent,
        ClinicComponent,
        LabComponent,
        PharmacyComponent,
        StoreComponent
    ],
    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        reportRoutes,
        ChartsModule
    ],
    providers: []
})
export class ReportModule { }



