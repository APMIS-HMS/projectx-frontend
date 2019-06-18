import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RadiologyModuleComponent } from './radiology-module.component';
import { RmRequestComponent } from './rm-request/rm-request.component';

const routes: Routes = [
  {
      path: '', component: RadiologyModuleComponent, children: [
          { path: '', redirectTo: 'requests' },
          { path: 'requests', component: RmRequestComponent },
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RadiologyModuleRoutingModule { }
