import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import { Routing } from './dashboard-routes';
import { LogOutConfirmModule } from '../../shared-common-modules/log-out-module';
import {SingUpAccountsSharedModule } from '../../shared-common-modules/signup-accounts-shared-module'
import {SharedModule } from '../../shared-module/shared.module';
import { MaterialModule } from '../../shared-common-modules/material-module';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { OnlyMaterialModule } from '../../shared-common-modules/only-material-module';
import { MessagingComponent } from '../../messaging/messaging.component';
import { ImageEmitterService } from '../../services/facility-manager/image-emitter.service';

@NgModule({
    declarations: [
        DashboardComponent,
        DashboardHomeComponent,
        MessagingComponent
    ],
    exports: [
    ],
    imports: [
        LogOutConfirmModule,
        OnlyMaterialModule,
        MaterialModule,
        LoadingBarHttpModule,
        Routing
    ],
    providers: [ ImageEmitterService ]
})
export class DashboardModule { }



