import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingUpAccountsSharedModule } from '../../shared-common-modules/signup-accounts-shared-module';
import { Routing } from './user-accounts-routes';
import { UserAccountsHomeComponent } from './user-accounts-home.component';
import { UserAccountsInnerPopupComponent } from '../user-accounts/user-accounts-inner-popup/user-accounts-inner-popup.component';
import { UserAccountsComponent } from './user-accounts.component';
import { LogoutConfirmComponent } from '../../system-modules/module-menu/logout-confirm/logout-confirm.component';
import { LogOutConfirmModule} from '../../shared-common-modules/log-out-module';

@NgModule({
    declarations: [
        UserAccountsHomeComponent,
        UserAccountsComponent,
        UserAccountsInnerPopupComponent,
    ],
    exports: [
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        Routing,
        SingUpAccountsSharedModule,
        LogOutConfirmModule
    ],
    providers: [
    ]
})
export class UserAccountsModule { }



