import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import {UserAccountsComponent } from './user-accounts.component';

const appRoutes: Routes = [
  {
    path: '', component: UserAccountsComponent
  }
];

export const Routing = RouterModule.forChild(appRoutes);
