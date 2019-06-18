import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import {SignupComponent } from './signup.component';

const appRoutes: Routes = [
  {
    path: '', component: SignupComponent
  },
//   {
//     path: '', redirectTo: 'login', pathMatch: 'full'
//   }
];

// export default RouterModule.forRoot(appRoutes);
export const Routing = RouterModule.forChild(appRoutes);
