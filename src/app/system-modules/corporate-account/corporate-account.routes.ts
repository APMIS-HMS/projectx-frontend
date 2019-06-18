import { RouterModule, Routes } from '@angular/router';
import { CoveringFacilityComponent } from './covering-facility/covering-facility.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { CorporateAccountLandingPageComponent } from './corporate-account-landing-page/corporate-account-landing-page.component';
import { CorporateAccountComponent } from './corporate-account.component';
import { DepartmentsComponent } from './departments/departments.component';

const HEALTHCOVERMODULES_ROUTES: Routes = [
    {
        path: '', component: CorporateAccountComponent, children: [
            { path: '', redirectTo: 'home' },
             { path: 'home', component: CorporateAccountLandingPageComponent },
            { path: 'covering-facility', component: CoveringFacilityComponent },
            { path: 'facility-listing', component: FacilityListingComponent },
            { path: 'department', component: DepartmentsComponent}
        ]
    }
];

export const corporateAccountRoutes = RouterModule.forChild(HEALTHCOVERMODULES_ROUTES);
