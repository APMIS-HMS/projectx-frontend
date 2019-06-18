import { RouterModule, Routes } from '@angular/router';
import { ClinicComponent } from './clinic.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { ClinicScheduleComponent } from './clinic-schedule/clinic-schedule.component';
import { ConsultingRoomComponent } from './consulting-room/consulting-room.component';
import { CheckInPatientComponent } from './check-in-patient/check-in-patient.component';
import { NewAppointmentComponent } from './new-appointment/new-appointment.component';
import { ClinicHomepageComponent } from './clinic-homepage/clinic-homepage.component';
import {
    AppointmentsResolverService, AppointmentTypeResolverService, ProfessionsResolverService,
    LoginEmployeeResolverService, LoginEmployeeWorkspaceResolverService
} from '../../../resolvers/module-menu/index';

const CLINICMODULES_ROUTES: Routes = [
    {
        path: '', component: ClinicComponent, children: [
            { path: '', redirectTo: 'home' },
            {
                path: 'home', component: ClinicHomepageComponent
            },
            {
                path: 'appointment', component: AppointmentComponent
            },
            {
                path: 'schedule-appointment', component: NewAppointmentComponent
            },
            {
                path: 'schedule-appointment/:id', component: NewAppointmentComponent
            },
            {
                path: 'schedule-appointment/:patientId/:doctorId', component: NewAppointmentComponent
            },
            { path: 'clinic-schedule', component: ClinicScheduleComponent },
            { path: 'consulting-room', component: ConsultingRoomComponent },
            {
                path: 'check-in', component: CheckInPatientComponent
                // resolve: {
                //     // checkInPatients: AppointmentsResolverService,
                //     // loginEmployee: LoginEmployeeResolverService
                // }
            },
        ]
    }
];

export const clinicRoutes = RouterModule.forChild(CLINICMODULES_ROUTES);
