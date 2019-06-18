import { RouterModule, Routes } from '@angular/router';
import { OptionsComponent } from './options.component';
import { QuestionsComponent } from './questions/questions.component';


const options_routes: Routes = [
    {
        path: '', component: OptionsComponent, children: [
            { path: '', redirectTo: "", pathMatch: 'full' },
            { path: 'questions', component: QuestionsComponent },
        ]
    }
];

export const optionsRoutes = RouterModule.forChild(options_routes);




/*import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {QuestionsComponent} from './questions/question.component'

const optionsRoutes: Routes = [
    {
        path:'options',
        component: QuestionsComponent
    },

];

export const optionsRoute: ModuleWithProviders = RouterModule.forChild(optionsRoutes)*/

