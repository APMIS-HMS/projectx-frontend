import { RouterModule, Routes } from '@angular/router';
import { AccessManagerComponent } from './access-manager.component';
import { AccessManagerHomeComponent } from './access-manager-home.component';
import { CreateAccessComponent } from './create-access/create-access.component';
import { AccessRoleDetailsComponent } from './access-role-details/access-role-details.component';
import { ViewAccessComponent } from './view-access/view-access.component';
import { from } from 'rxjs/observable/from';

const EMPLOYEEMANAGER_ROUTES: Routes = [
    {
        path: '', component: AccessManagerHomeComponent, children: [
            { path: '', component: AccessManagerComponent },
            { path: 'access-manager', component: AccessManagerComponent },
            { path: 'access', component: ViewAccessComponent },
            { path: 'new-access', component: CreateAccessComponent },
            { path: 'new-access/:id', component: CreateAccessComponent },
            { path: 'access-role-details', component: AccessRoleDetailsComponent }
        ]
    }
];

export const accessManagerRoutes = RouterModule.forChild(EMPLOYEEMANAGER_ROUTES);