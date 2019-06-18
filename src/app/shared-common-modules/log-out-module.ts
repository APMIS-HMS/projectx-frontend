import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LogoutConfirmComponent } from '../system-modules/module-menu/logout-confirm/logout-confirm.component';

@NgModule({
    declarations: [
        LogoutConfirmComponent
    ],
    exports: [
        LogoutConfirmComponent
    ],
    imports: [
    ],
    providers: [
    ]
})
export class LogOutConfirmModule { }



