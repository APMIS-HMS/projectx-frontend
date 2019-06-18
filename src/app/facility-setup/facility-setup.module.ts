import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { FacilitySetupComponent } from './facility-setup.component';
// import { VerifyTokenComponent } from './verify-token/verify-token.component';
// import { AddLogoComponent } from './add-logo/add-logo.component';
// import { AddFacilityModuleComponent } from './add-facility-module/add-facility-module.component';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  declarations: [
    // FacilitySetupComponent,
    // VerifyTokenComponent,
    // AddLogoComponent,
    // AddFacilityModuleComponent
  ],

  exports: [
    // FacilitySetupComponent,
    // VerifyTokenComponent,
    // AddLogoComponent,
    // AddFacilityModuleComponent
  ],
  imports: [
    // CommonModule,
    // ReactiveFormsModule,
    // FormsModule,
    SharedModule 
  ],
  providers: []
})
export class FacilitySetupModule { }
