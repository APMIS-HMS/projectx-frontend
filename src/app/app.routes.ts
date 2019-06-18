import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import * as SetupService from './services/facility-manager/setup/index';

import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { UserAccountsComponent } from './system-modules/user-accounts/user-accounts.component';
import { SwitchUserResolverService } from './resolvers/module-menu/index';
import { CustomPreloading } from './custom-preloading';

const appRoutes: Routes = [
  // {
  //   path: 'modules',
  //   loadChildren: './system-modules/system-module#SystemModule',
  //   data: { preload: true },
  //   canActivate: [
  //     SetupService.CanActivateViaAuthGuardService
  //   ]
  // },
  {
    path: 'dashboard',
    loadChildren: './system-modules/dashboard/dashboard-module.ts#DashboardModule',
    data: { preload: true },
    canActivate: [
      SetupService.CanActivateViaAuthGuardService
    ]
  },
  {
    path: 'login', component: HomeComponent
  },
  {
    path: 'accounts', loadChildren: './system-modules/user-accounts/user-accounts-module.ts#UserAccountsModule',
    data: { preload: true }, resolve: { switchUsers: SwitchUserResolverService }
  },
  {
    path: 'home-page',
    loadChildren: './system-modules/home-page/home-page.module.ts#HomePageModule',
    data: { preload: false },
  },
  {
    path: 'signup', loadChildren: './signup/signup-module#SingUpModule',
    data: { preload: true },
  },
  {
    path: '', redirectTo: 'login', pathMatch: 'full'
  }
];

// export default RouterModule.forRoot(appRoutes);
// export const Routing = RouterModule.forRoot(appRoutes, { useHash: true, preloadingStrategy: CustomPreloading });
export const Routing = RouterModule.forRoot(appRoutes, { useHash: true });
