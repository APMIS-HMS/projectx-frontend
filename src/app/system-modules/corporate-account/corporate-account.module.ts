import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { DatePickerModule } from 'ng2-datepicker';
//import { SharedModule } from '../../shared-module/shared.module';
import { corporateAccountRoutes } from './corporate-account.routes';

import { CorporateAccountComponent } from './corporate-account.component';
import { CoveringFacilityComponent } from './covering-facility/covering-facility.component';
import { FacilityListingComponent } from './facility-listing/facility-listing.component';
import { CorporateAccountLandingPageComponent } from './corporate-account-landing-page/corporate-account-landing-page.component';
import { PersonDependantsComponent } from './person-dependants/person-dependants.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { DepartmentsComponent } from './departments/departments.component';
import { AddDepartmentComponent } from './departments/add-department/add-department.component';
import { CorporateEmitterService } from '../../services/facility-manager/corporate-emitter.service';
import {LogOutConfirmModule } from '../../shared-common-modules/log-out-module';
import { MaterialModule } from '../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../shared-common-modules/only-material-module';

@NgModule({
    declarations: [
        CorporateAccountComponent,
        CoveringFacilityComponent,
        FacilityListingComponent,
        CorporateAccountLandingPageComponent,
        PersonDependantsComponent,
        AddEmployeeComponent,
        DepartmentsComponent,
        AddDepartmentComponent,
    ],
    exports: [
    ],
    imports: [
        OnlyMaterialModule,
        MaterialModule,
        //SharedModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        //DatePickerModule,
        corporateAccountRoutes,
        LogOutConfirmModule
    ],
    providers: [CorporateEmitterService]
})
export class CorporateAccountModule { }



