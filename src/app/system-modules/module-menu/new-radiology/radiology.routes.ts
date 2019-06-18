import { RouterModule, Routes } from '@angular/router';
import { RadiologyComponent } from './radiology.component';
import { RadiologyRequestsComponent } from './radiology-requests/radiology-requests.component';
import { WorkbenchComponent } from './workbench/workbench.component';
import { InvestigationServiceComponent } from './investigation-service/investigation-service.component';
import { InvestigationPriceComponent } from './investigation-price/investigation-price.component';
import { PanelComponent } from './panel/panel.component';
import { ReportComponent } from './report/report.component';
import { ExternalInvestigationsComponent } from './external-investigations/external-investigations.component';
import { TemplateComponent } from './template/template.component';

const RADIOLOGYMODULES_ROUTES: Routes = [
    {
        path: '', component: RadiologyComponent, children: [
            { path: '', redirectTo: 'requests' },
            { path: 'requests', component: RadiologyRequestsComponent },
            { path: 'request/:id', component: RadiologyRequestsComponent },
            { path: 'workbenches', component: WorkbenchComponent },
            { path: 'investigations', component: InvestigationServiceComponent },
            { path: 'investigation-pricing', component: InvestigationPriceComponent },
            { path: 'panels', component: PanelComponent },
            { path: 'external-requests', component: ExternalInvestigationsComponent },
            { path: 'reports', component: ReportComponent },
            { path: 'report/:requestId/:investigationId', component: ReportComponent },
            { path: 'templates', component: TemplateComponent }
        ]
    }
];

export const RadiologyRoutes = RouterModule.forChild(RADIOLOGYMODULES_ROUTES);
