import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import { SharedService } from 'app/shared-module/shared.service';
import { FormTypeResolverService, ScopeLevelResolverService } from '../../../resolvers/module-manager/index';
import { SystemModulesResolverService } from '../../../resolvers/module-menu/index';
import { FormsService, OrderSetTemplateService } from '../../../services/facility-manager/setup/index';
import { FormTypeService, ScopeLevelService } from '../../../services/module-manager/setup/index';
import { SystemModuleService } from '../../../services/module-manager/setup/system-module.service';
import { SharedModule } from '../../../shared-module/shared.module';
import { DocumentationTemplateService } from './../../../services/facility-manager/setup/documentation-template.service';
import { FormsManagerComponent } from './forms-manager.component';
import { formsManagerRoutes } from './forms-manager.routes';
import { FormsComponent } from './forms/forms.component';
import { TreatementTemplateComponent } from './treatement-template/treatement-template.component';
import { PatientManagerModule} from 'app/system-modules/module-menu/patient-manager/patient-manager.module';
import { TemplateDrugComponent } from './treatement-template/template-drug/template-drug.component';
import { DrgsrchComponent } from './treatement-template/drgsrch/drgsrch.component';

@NgModule({
    declarations: [
        FormsManagerComponent,
        FormsComponent,
        TreatementTemplateComponent,
        TemplateDrugComponent,
        DrgsrchComponent,
      ],
    exports: [
    ],
    imports: [
       
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
      //PatientManagerModule,
        formsManagerRoutes,
        
    ],
    providers: [SystemModulesResolverService, ScopeLevelService, FormTypeService,
       OrderSetTemplateService,
        ScopeLevelResolverService, FormTypeResolverService, FormsService, SharedService, DocumentationTemplateService, SystemModuleService]
})
export class FormsManagerModule { }



