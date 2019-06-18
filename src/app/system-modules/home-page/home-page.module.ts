import { SystemModuleComponent } from './../system-module.component';
import { homePageRoutes } from './home-page.routes';
import { MaterialModule } from './../../shared-common-modules/material-module';
import { SharedModule } from '../../shared-module/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { HomePageComponent } from './home-page.component';
import { HomePageHomeComponent } from './home-page-home.component';
import { PersonLandingComponent } from './person-landing/person-landing.component';
import { PersonScheduleAppointmentComponent } from './person-landing/person-schedule-appointment/person-schedule-appointment.component';
import { BiodataPopupComponent } from './biodata-popup/biodata-popup.component';
import { OnlyMaterialModule } from '../../shared-common-modules/only-material-module';
import { MedRecordsComponent } from './med-records/med-records.component';
import { MedRecordHomeComponent } from './med-records/med-record-home/med-record-home.component';
import { MedRecordDocumentationComponent } from './med-records/med-record-documentation/med-record-documentation.component';
import { MedRecordPrescriptionComponent } from './med-records/med-record-prescription/med-record-prescription.component';
import { MedRecordDiagnosticsComponent } from './med-records/med-record-diagnostics/med-record-diagnostics.component';
import { MedRecordPaymentComponent } from './med-records/med-record-payment/med-record-payment.component';
import { BiodataUpdateComponent } from './biodata-update/biodata-update.component';
import { DateRangePickerModule } from "ng-pick-daterange";
import { DateTimePickerModule } from "ng-pick-datetime";
import { InavailabilityComponent } from './person-landing/person-schedule-appointment/inavailability/inavailability.component';
@NgModule({
  imports: [
    CommonModule,
    OnlyMaterialModule,
    MaterialModule,
    SharedModule,
    homePageRoutes,
    ChartsModule,
    DateRangePickerModule,
    DateTimePickerModule
  ],
  declarations: [
    HomePageComponent,
    HomePageHomeComponent,
    PersonLandingComponent,
    PersonScheduleAppointmentComponent,
    BiodataPopupComponent,
    MedRecordsComponent,
    MedRecordHomeComponent,
    MedRecordDocumentationComponent,
    MedRecordPrescriptionComponent,
    MedRecordDiagnosticsComponent,
    MedRecordPaymentComponent,
    BiodataUpdateComponent,
    InavailabilityComponent,
  ]
})
export class HomePageModule { }
