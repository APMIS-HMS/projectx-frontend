import { RouterModule, Routes } from '@angular/router';
import { FormsComponent } from './forms/forms.component';
import { TreatementTemplateComponent } from './treatement-template/treatement-template.component';

import { FormsManagerComponent } from './forms-manager.component';
import { SystemModulesResolverService } from '../../../resolvers/module-menu/index';
import { ScopeLevelResolverService, FormTypeResolverService } from '../../../resolvers/module-manager/index';

const FORMSMANAGERMODULES_ROUTES: Routes = [
    {
        path: '', component: FormsManagerComponent, children: [
            { path: '', redirectTo: 'treatement-template' },
            {
                path: 'forms', component: FormsComponent
            },
            {
                path: 'treatement-template', component: TreatementTemplateComponent
            }
        ]
    }
];

export const formsManagerRoutes = RouterModule.forChild(FORMSMANAGERMODULES_ROUTES);