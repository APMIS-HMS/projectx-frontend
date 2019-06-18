import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreHomeComponent } from './store-home/store-home.component';
import { StoreLandingComponent } from './store-landing.component';

const routes: Routes = [
  {
    path: "",
    component: StoreLandingComponent,
    children: [
      {
        path: "",
        component: StoreHomeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewStoreRoutingModule { }
