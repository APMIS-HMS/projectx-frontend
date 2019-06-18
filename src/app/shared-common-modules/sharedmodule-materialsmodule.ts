import { ChangePasswordComponent } from './../system-modules/module-menu/change-password/change-password.component';
import { LogOutConfirmModule } from './log-out-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { SingUpAccountsSharedModule} from './signup-accounts-shared-module';
import { SystemModuleComponent } from '../system-modules/system-module.component';
import { LogoUpdateComponent } from '../system-modules/module-menu/facility-page/logo-update/logo-update.component';
import { OnlyMaterialModule } from './only-material-module';
@NgModule({
    declarations: [
        ChangePasswordComponent,
        SystemModuleComponent,
        LogoUpdateComponent
    ],
    imports: [  
        CommonModule,
        ReactiveFormsModule,
        FormsModule, 
        LogOutConfirmModule,
        OnlyMaterialModule
    ],
    exports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        SystemModuleComponent,
        LogoUpdateComponent,
        LogOutConfirmModule
    ],
   
    providers: []
})
export class SharedModuleMaterialModule { }



