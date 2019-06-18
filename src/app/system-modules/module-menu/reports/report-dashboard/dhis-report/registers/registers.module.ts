import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistersRoutingModule } from './registers-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DailyAntenatalComponent } from './register-entries/daily-antenatal/daily-antenatal.component';
import { NewAntenatalEntryComponent } from './register-entries/daily-antenatal/new-antenatal-entry/new-antenatal-entry.component';
import { AntenatalPg1Component } from './register-entries/daily-antenatal/antenatal-pg1/antenatal-pg1.component';
import { AntenatalPg2Component } from './register-entries/daily-antenatal/antenatal-pg2/antenatal-pg2.component';
import { DailyOpdComponent } from './register-entries/daily-opd/daily-opd.component';
import { OpdPg1Component } from './register-entries/daily-opd/opd-pg1/opd-pg1.component';
import { OpdPg2Component } from './register-entries/daily-opd/opd-pg2/opd-pg2.component';
import { NewOpdEntryComponent } from './register-entries/daily-opd/new-opd-entry/new-opd-entry.component';
import { NewFprEntryComponent } from './register-entries/daily-fpr/new-fpr-entry/new-fpr-entry.component';
import { FprPg1Component } from './register-entries/daily-fpr/fpr-pg1/fpr-pg1.component';
import { immunizationTallyComponent } from './register-entries/daily-IRTS/ImmunizationTally/immunizationTally.component';
import { DailyFprComponent } from './register-entries/daily-fpr/daily-fpr.component';

import { DailyGmpComponent } from './register-entries/daily-gmp/daily-gmp.component';
import { NewGmpEntryComponent } from './register-entries/daily-gmp/new-gmp-entry/new-gmp-entry.component';
import { GmpListComponent } from './register-entries/daily-gmp/gmp-list/gmp-list.component';

import { DailyIrtsComponent } from './register-entries/daily-IRTS/daily-irts.component';
import { DailyLdrComponent } from './register-entries/daily-ldr/daily-ldr.component';
import { NewLdrEntryComponent } from './register-entries/daily-ldr/new-ldr-entry/new-ldr-entry.component';
import { LdrListComponent } from './register-entries/daily-ldr/ldr-list/ldr-list.component';
import { NewOpdEntry2Component } from './register-entries/daily-opd/new-opd-entry2/new-opd-entry2.component';
import { ChildImmunizationComponent } from './register-entries/daily-IRTS/child-immunization/child-immunization.component';
import { HfmrecordsComponent } from './register-entries/daily-IRTS/hfmrecords/hfmrecords.component';
import { NewChildEntryComponent } from './register-entries/daily-IRTS/child-immunization/new-child-entry/new-child-entry.component';
import { NewHfmrecordsEntryComponent } from './register-entries/daily-IRTS/hfmrecords/new-hfmrecords-entry/new-hfmrecords-entry.component';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedModule } from 'app/shared-module/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RegistersRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    OnlyMaterialModule,
    SharedModule
  ],
  declarations: [
    DailyAntenatalComponent,
    NewAntenatalEntryComponent,
    AntenatalPg1Component,
    AntenatalPg2Component,
    DailyOpdComponent,
    OpdPg1Component,
    OpdPg2Component,
    NewOpdEntryComponent,
    NewFprEntryComponent,
    FprPg1Component,
    immunizationTallyComponent,
    DailyFprComponent,
    DailyGmpComponent,
    NewGmpEntryComponent,
    GmpListComponent,
    DailyLdrComponent,
    NewLdrEntryComponent,
    LdrListComponent,
    NewOpdEntry2Component, 
    DailyIrtsComponent, 
    ChildImmunizationComponent, 
    HfmrecordsComponent, 
    NewChildEntryComponent, 
    NewHfmrecordsEntryComponent
  ]
})
export class RegistersModule { }
