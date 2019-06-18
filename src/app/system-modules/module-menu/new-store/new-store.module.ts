import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewStoreRoutingModule } from './new-store-routing.module';
import { StoreHomeComponent } from './store-home/store-home.component';
import { StoreLandingComponent } from './store-landing.component';

@NgModule({
  imports: [
    CommonModule,
    NewStoreRoutingModule
  ],
  declarations: [StoreHomeComponent, StoreLandingComponent]
})
export class NewStoreModule { }
