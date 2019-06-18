import { RouterModule, Routes } from '@angular/router';
import { WalletComponent } from './wallet.component';

const WALLETMODULES_ROUTES: Routes = [
    { path: '', component: WalletComponent}
];

export const walletRoutes = RouterModule.forChild(WALLETMODULES_ROUTES);
