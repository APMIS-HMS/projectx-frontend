import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { moduleMenuRoutes } from './module-menu.routes';
import { ModuleMenuComponent } from './module-menu.component';
import { SharedModule } from '../../shared-module/shared.module';
import { LogOutConfirmModule } from '../../shared-common-modules/log-out-module';

@NgModule({
    declarations: [
        ModuleMenuComponent
    ],
exports: [
    ],
    imports: [
        SharedModule,
        LogOutConfirmModule,
        moduleMenuRoutes,
    ],
    providers: [
    ]
})
export class ModuleMenu { }



