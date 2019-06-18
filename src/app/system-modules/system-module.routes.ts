import { RouterModule, Routes } from '@angular/router';
import { SystemModuleComponent } from './system-module.component';

const SYSTEMMODULES_ROUTES: Routes = [
    {
        path: '', component: SystemModuleComponent, children: [
            // {
            //     path: '',
            //     loadChildren: './module-menu/module-menu.module.ts/#ModuleMenu',
            //      data: { preload: true },
            // },
            // {
            //     path: 'facility-manager',
            //     loadChildren: './module-menu/module-menu.module#ModuleMenu',
            //      data: { preload: true },
            // },
            {
                path: 'module-manager',
                loadChildren: './module-manager/module-manager.module#ModuleManager',
                 data: { preload: false },
            },
            {
                path: 'corporate',
                loadChildren: './corporate-account/corporate-account.module#CorporateAccountModule',
                 data: { preload: false },
            },
        ]
    }
];

export const systemModulesRoutes = RouterModule.forChild(SYSTEMMODULES_ROUTES);
