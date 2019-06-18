import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import { RadiologyModuleRoutingModule } from './radiology-module-routing.module';
import { RadiologyModuleComponent } from './radiology-module.component';
import { RmNewRequestComponent } from './rm-request/rm-new-request/rm-new-request.component';
import { RmRequestComponent } from './rm-request/rm-request.component';
import { RmRequestListComponent } from './rm-request/rm-request-list/rm-request-list.component';
import { RmModalityComponent } from './rm-request/rm-request-list/rm-modality/rm-modality.component';
import { RmInvestigationComponent } from './rm-request/rm-request-list/rm-investigation/rm-investigation.component';
import { RmAppointmentComponent } from './rm-request/rm-request-list/rm-appointment/rm-appointment.component';
import { RmAppntAppointmentsComponent } from './rm-request/rm-request-list/rm-appointment/rm-appnt-appointments/rm-appnt-appointments.component';
import { RmAppntCheckinsComponent } from './rm-request/rm-request-list/rm-appointment/rm-appnt-checkins/rm-appnt-checkins.component';
import { RmAppntHistoryComponent } from './rm-request/rm-request-list/rm-appointment/rm-appnt-history/rm-appnt-history.component';

@NgModule({
  imports: [
    CommonModule,
    RadiologyModuleRoutingModule,
    MaterialModule, OnlyMaterialModule
  ],
  declarations: [RadiologyModuleComponent, RmRequestComponent, RmRequestListComponent, RmModalityComponent, RmInvestigationComponent, RmAppointmentComponent, RmAppntAppointmentsComponent, RmAppntCheckinsComponent, RmAppntHistoryComponent]
})
export class RadiologyModuleModule { }
