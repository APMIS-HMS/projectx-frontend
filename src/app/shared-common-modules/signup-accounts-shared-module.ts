import { OnlyMaterialModule } from './only-material-module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyTokenComponent } from '../facility-setup/verify-token/verify-token.component';
import { AddLogoComponent } from '../facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from '../facility-setup/facility-info/facility-info.component';
import { ContactInfoComponent } from '../facility-setup/contact-info/contact-info.component';
import { AddFacilityModuleComponent } from '../facility-setup/add-facility-module/add-facility-module.component';
import { LoginComponent } from '../login/login.component';
import { MaterialModule } from './material-module';
@NgModule({
    declarations: [
        VerifyTokenComponent,
        AddLogoComponent,
        ContactInfoComponent,
        FacilityInfoComponent,
        AddFacilityModuleComponent,
        LoginComponent
    ],
    exports: [
        VerifyTokenComponent,
        AddLogoComponent,
        ContactInfoComponent,
        FacilityInfoComponent,
        AddFacilityModuleComponent,
        LoginComponent
    ],
    imports: [
        OnlyMaterialModule,
        MaterialModule,
        Ng4GeoautocompleteModule.forRoot()
    ],
    providers: []
})
export class SingUpAccountsSharedModule { }



