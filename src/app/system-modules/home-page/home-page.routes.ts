import { SwitchUserResolverService } from './../../resolvers/module-menu/swith-user-resolver.service';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';
// import { PatientPortalComponent } from './patient-portal.component';
// import { PatientPortalHomeComponent } from './patient-portal-home.component';
// import { PatientmanagerDetailpageComponent } from './patientmanager-detailpage/patientmanager-detailpage.component';
// import { PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';

const HOMEPAGE_ROUTES: Routes = [
    {
        path: '', component: HomePageHomeComponent, children: [
            { path: '', component: HomePageComponent },
            { path: 'home-page', component: HomePageComponent, resolve: { multipleUsers: SwitchUserResolverService } },
            {
                // path: 'patient-manager-detail/:id', component: PatientmanagerDetailpageComponent
                // resolve: { patient: PatientResolverService, appointment: AppointmentResolverService,
                // loginEmployee: LoginEmployeeResolverService }
            }
        ],
        resolve: { multipleUsers: SwitchUserResolverService }
    }
];

export const homePageRoutes = RouterModule.forChild(HOMEPAGE_ROUTES);
