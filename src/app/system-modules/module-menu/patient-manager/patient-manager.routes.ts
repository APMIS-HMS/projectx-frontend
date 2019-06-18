import { RouterModule, Routes } from '@angular/router';
import { PatientManagerComponent } from './patient-manager.component';
import { PatientManagerHomeComponent } from './patient-manager-home.component';
import { PatientmanagerDetailpageComponent } from './patientmanager-detailpage/patientmanager-detailpage.component';
import { PatientResolverService, AppointmentResolverService, LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';

const PATIENTMANAGER_ROUTES: Routes = [
    {
        path: '', component: PatientManagerHomeComponent, children: [
            { path: '', component: PatientManagerComponent },
            { path: 'patient-manager-detail', component: PatientmanagerDetailpageComponent },
            {
                path: 'patient-manager-detail/:id', component: PatientmanagerDetailpageComponent
                // resolve: { patient: PatientResolverService, appointment: AppointmentResolverService,
                // loginEmployee: LoginEmployeeResolverService }
            }
        ]
    }
];

export const patientManagerRoutes = RouterModule.forChild(PATIENTMANAGER_ROUTES);
