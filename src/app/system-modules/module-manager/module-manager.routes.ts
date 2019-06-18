import { RouterModule, Routes } from '@angular/router';
import { ModuleManagerComponent } from './module-manager.component';
import { OptionScopeLevelComponent} from './option-scope-level/option-scope-level.component';
import { OptionDocumentTypeComponent } from './option-document-type/option-document-type.component';


const MODULEMANAGER_ROUTES: Routes = [
      {
        path: '', component: ModuleManagerComponent, children: [
            { path: '', component: ModuleManagerComponent },
            { path: 'scope', component: OptionScopeLevelComponent },
            { path: 'type', component: OptionDocumentTypeComponent }
  
        ]
    }

];

export const moduleManagerRoutes = RouterModule.forChild(MODULEMANAGER_ROUTES);