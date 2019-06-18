import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { SharedModule } from '../../../shared-module/shared.module';
import { labRoutes } from './lab.routes';
import { LabComponent } from './lab.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { InvestigationServiceComponent } from './investigation-service/investigation-service.component';
import { InvestigationPriceComponent } from './investigation-price/investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import {
  LaboratoryRequestService, WorkbenchService, HmoService, FacilityFamilyCoverService
} from '../../../services/facility-manager/setup/index';
import { ReportComponent } from './report/report.component';
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { ExternalInvestigationsComponent } from './external-investigations/external-investigations.component';
import { TemplateComponent } from './template/template.component';
import { SelectTemplateComponent } from './template/select-template/select-template.component';
import { ScopeLevelService } from '../../../services/module-manager/setup/index';
import { FacilityCompanyCoverService } from '../../../services/facility-manager/setup/facility-company-cover.service';
import { LabEventEmitterService } from '../../../services/facility-manager/lab-event-emitter.service';

@NgModule({
  imports: [
    // CommonModule,
    labRoutes,
    OnlyMaterialModule,
    // SharedModule,
    MaterialModule
  ],
  declarations: [LabComponent, WorkbenchComponent, InvestigationServiceComponent,
    InvestigationPriceComponent, PanelComponent, ReportComponent, ReportDetailComponent,
    ExternalInvestigationsComponent, TemplateComponent, SelectTemplateComponent],
  providers: [
    LaboratoryRequestService, WorkbenchService, ScopeLevelService, HmoService,
    FacilityFamilyCoverService, FacilityCompanyCoverService, LabEventEmitterService ]
})
export class LabModule { }
