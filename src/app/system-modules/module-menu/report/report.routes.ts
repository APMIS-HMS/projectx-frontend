import { RouterModule, Routes } from '@angular/router';
import { ReportComponent } from './report.component';
import { SummaryComponent } from './summary/summary.component';
import { PaymentComponent } from './payment/payment.component';
import { PatientComponent } from './patient/patient.component';
import { ClinicComponent } from './clinic/clinic.component';
import { LabComponent } from './lab/lab.component';
import { PharmacyComponent } from './pharmacy/pharmacy.component';
import { StoreComponent } from './store/store.component';

const REPORTMODULES_ROUTES: Routes = [
    { path: '', component: ReportComponent,
        children : [
            {path : 'pharmacy', component : PharmacyComponent },            
            {path : 'summary',  component : SummaryComponent },
            {path : 'payment',  component : PaymentComponent },
            {path : 'patient',  component : PatientComponent },
            {path : 'clinic',  component : ClinicComponent },
            {path : 'store',  component : StoreComponent },
            {path : 'lab',  component : LabComponent },            
            {path : '', redirectTo : 'summary', pathMatch: 'full' }
        ]
    }
];

export const reportRoutes = RouterModule.forChild(REPORTMODULES_ROUTES);
