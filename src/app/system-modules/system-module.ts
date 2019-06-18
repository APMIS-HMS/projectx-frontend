import { RouterModule } from '@angular/router';
import { LogoutConfirmComponent } from './module-menu/logout-confirm/logout-confirm.component';
import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { systemModulesRoutes } from './system-module.routes';
import { SystemModuleComponent } from './system-module.component';
import { SharedModule } from '../shared-module/shared.module';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { LogOutConfirmModule } from '../shared-common-modules/log-out-module';
import { ChangePasswordComponent } from './module-menu/change-password/change-password.component';
// import { NotificationService } from './../services/communication-manager/notification.service';
// import { ImageViewerComponent } from '../shared-module/image-viewer/image-viewer.component';
@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [],
  providers: []
})
export class SystemModule { }



