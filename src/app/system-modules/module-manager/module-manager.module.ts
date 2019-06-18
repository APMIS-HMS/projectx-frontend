import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared-module/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModuleManagerComponent } from './module-manager.component';
import { OptionsComponent } from './options/options.component';
import { moduleManagerRoutes } from './module-manager.routes';
import { OptionDocumentTypeComponent } from './option-document-type/option-document-type.component';
import { OptionScopeLevelComponent } from './option-scope-level/option-scope-level.component';


@NgModule({
    declarations: [
        ModuleManagerComponent,
        OptionDocumentTypeComponent,
        OptionScopeLevelComponent,
    ],
    exports: [
    ],
    imports: [
        SharedModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        moduleManagerRoutes
    ],
    providers: []
})
export class ModuleManager { }



