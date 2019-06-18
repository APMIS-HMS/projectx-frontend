import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared-module/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms'


import { OptionsComponent } from './options.component';

import { optionsRoutes } from './options.routes';
import { QuestionsComponent } from './questions/questions.component';
import { DocumentationPageComponent } from './documentation-page/documentation-page.component';





@NgModule({
    declarations: [
        OptionsComponent,
        QuestionsComponent,
        DocumentationPageComponent,
    ],
    exports: [
    ],
    imports: [
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        SharedModule,
        optionsRoutes,

    ],
    providers: []
})
export class OptionsModule { }



