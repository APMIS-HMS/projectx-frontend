import { RouterModule, Routes } from '@angular/router';
import {ImmunizationComponent} from './immunization.component';
import { ImmunizationScheduleComponent } from './immunization-schedule/immunization-schedule.component';
import { NewImmunizationScheduleComponent } from './new-immunization-schedule/new-immunization-schedule.component';


const IMMUNIZATIONMODULES_ROUTES: Routes = [
    {
        path: '', component: ImmunizationComponent, children: [
            { path: '', redirectTo: 'immunization-schedule' },
            { path: 'immunization-schedule', component: ImmunizationScheduleComponent },
            { path: 'new', component: NewImmunizationScheduleComponent },
            { path: 'new/:id', component: NewImmunizationScheduleComponent },
        ]
    }
];

export const immunizationRoutes = RouterModule.forChild(IMMUNIZATIONMODULES_ROUTES);
