import { FacilityHealthCoverComponent } from './facility-health-cover/facility-health-cover.component';
import { FacilityCompanyCoverComponent } from './facility-health-cover/facility-company-cover/facility-company-cover.component';
import { FacilityFamilyCoverComponent } from './facility-health-cover/facility-family-cover/facility-family-cover.component';
import { HmoOfficerComponent } from './hmo-officer/hmo-officer.component';
import { FcListComponent } from './family-cover/fc-list/fc-list.component';
import { FcBeneficiaryListComponent } from './family-cover/fc-beneficiary-list/fc-beneficiary-list.component';
import { CompanyBeneficiaryListComponent } from './company-cover/company-beneficiary-list/company-beneficiary-list.component';
import { RouterModule, Routes } from '@angular/router';
import { CcListComponent } from './company-cover/cc-list/cc-list.component';
import { FamilyCoverComponent } from './family-cover/family-cover.component';
import { HmoCoverComponent } from './hmo-cover/hmo-cover.component';
import { CoverPaymentComponent } from './cover-payment/cover-payment.component';
import { HealthCoverageComponent } from './health-coverage.component';
import { RecievePaymentComponent } from './recieve-payment/recieve-payment.component';
import { BeneficiaryListComponent } from './hmo-cover/beneficiary-list/beneficiary-list.component';
import { HmoListComponent } from './hmo-cover/hmo-list/hmo-list.component';

const HEALTHCOVERMODULES_ROUTES: Routes = [
    {
        path: '', component: HealthCoverageComponent, children: [
            { path: '', redirectTo: 'hmo-list' },
            { path: 'hmo-cover-beneficiaries/:id', component: BeneficiaryListComponent },
            { path: 'hmo-list', component: HmoListComponent },
            { path: 'company-list', component: CcListComponent },
            { path: 'company-beneficiaries/:id', component: CompanyBeneficiaryListComponent },
            { path: 'family-list', component: FcListComponent },
            { path: 'family-beneficiaries/:id', component: FcBeneficiaryListComponent },
            { path: 'payment', component: CoverPaymentComponent },
            { path: 'recieve-payment', component: RecievePaymentComponent },
            {
                path: 'cover', component: FacilityHealthCoverComponent,
                children: [
                    { path: "", redirectTo: 'hmo', pathMatch: 'full' },
                    { path: "hmo", component: HmoOfficerComponent },
                    { path: "family-cover", component: FacilityFamilyCoverComponent },
                    { path: "company-cover", component: FacilityCompanyCoverComponent }
                ]
                // loadChildren: './facility-health-cover/facility-health-cover.module#FacilityHealthCoverModule'
            },
        ]
    }
];

export const healthCoverRoutes = RouterModule.forChild(HEALTHCOVERMODULES_ROUTES);