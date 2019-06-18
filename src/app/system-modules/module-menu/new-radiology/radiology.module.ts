import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { SharedModule } from '../../../shared-module/shared.module';
import { RadiologyRoutes } from './radiology.routes';
import { RadiologyComponent } from './radiology.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { InvestigationServiceComponent } from './investigation-service/investigation-service.component';
import { InvestigationPriceComponent } from './investigation-price/investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import {
	LaboratoryRequestService,
	WorkbenchService,
	HmoService,
	FacilityFamilyCoverService
} from '../../../services/facility-manager/setup';
import { ReportComponent } from './report/report.component';
import { ReportDetailComponent } from './report/report-detail/report-detail.component';
import { ExternalInvestigationsComponent } from './external-investigations/external-investigations.component';
import { TemplateComponent } from './template/template.component';
import { SelectTemplateComponent } from './template/select-template/select-template.component';
import { ScopeLevelService } from '../../../services/module-manager/setup';
import { FacilityCompanyCoverService } from '../../../services/facility-manager/setup/facility-company-cover.service';
import { LabEventEmitterService } from '../../../services/facility-manager/lab-event-emitter.service';
import { RadiologyRequestsComponent } from './radiology-requests/radiology-requests.component';
// tslint:disable-next-line:max-line-length
import { NewRadiologyRequestDetailComponent } from 'app/system-modules/module-menu/new-radiology/radiology-requests/request-detail/request-detail.component';
import { ViewRadiologyReportComponent } from './report/view-radiology-report/view-radiology-report.component';
import { NewRadiologyReportComponent } from './report/new-radiology-report/new-radiology-report.component';
import { ViewRadiologyImagesComponent } from './report/view-radiology-images/view-radiology-images.component';
@NgModule({
	imports: [
		// CommonModule,
		RadiologyRoutes,
		OnlyMaterialModule,
		// SharedModule,
		MaterialModule
	],
	declarations: [
		RadiologyComponent,
		// RadiologyRequestsComponent,
		WorkbenchComponent,
		InvestigationServiceComponent,
		InvestigationPriceComponent,
		PanelComponent,
		ReportComponent,
		ReportDetailComponent,
		ExternalInvestigationsComponent,
		TemplateComponent,
		SelectTemplateComponent,
		// NewRadiologyRequestDetailComponent,
		ViewRadiologyReportComponent,
		NewRadiologyReportComponent,
		ViewRadiologyImagesComponent
	],
	providers: [
		LaboratoryRequestService,
		WorkbenchService,
		ScopeLevelService,
		HmoService,
		FacilityFamilyCoverService,
		FacilityCompanyCoverService,
		LabEventEmitterService
	]
})
export class RadiologyModule {}
