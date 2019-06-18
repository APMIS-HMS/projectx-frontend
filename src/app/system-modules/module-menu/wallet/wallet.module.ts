import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared-module/shared.module';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { walletRoutes } from './wallet.routes';
import { WalletComponent } from './wallet.component';
import { ChartsModule } from 'ng2-charts'


@NgModule({
    declarations: [
        WalletComponent
    ],
    exports: [
    ],
    imports: [
      SharedModule,
      OnlyMaterialModule,
        MaterialModule,
        walletRoutes,
        ChartsModule
    ],
    providers: []
})
export class WalletModule { }



