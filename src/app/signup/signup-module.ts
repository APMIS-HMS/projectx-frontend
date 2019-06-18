import { OnlyMaterialModule } from './../shared-common-modules/only-material-module';
import { SignupApmisid } from './../facility-setup/signup-apmisid/signup-apmisid.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FacilitySetupComponent } from '../facility-setup/facility-setup.component';
import { CorporateSignupComponent } from '../corporate-signup/corporate-signup.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';

import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { Routing } from './signup-routes';
import { SignupHomeComponent } from './signup-home.component';
import { SingUpAccountsSharedModule } from '../shared-common-modules/signup-accounts-shared-module';
import { MaterialModule } from '../shared-common-modules/material-module';

@NgModule({
    declarations: [
        SignupComponent,
        FacilitySetupComponent,
        CorporateSignupComponent,
        SignupHomeComponent,
        SignupApmisid
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Routing,
        SingUpAccountsSharedModule,
        OnlyMaterialModule,
         MaterialModule
    ],
    providers: [
    ]
})
export class SingUpModule { }



