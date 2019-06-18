import { RouterModule, Routes } from '@angular/router';
import { StoreComponent } from './store.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { StoreHomeComponent } from './store-home/store-home.component';
import { PosComponent } from './pos/pos.component';
import { PosRecieptComponent } from './pos/pos-reciept/pos-reciept.component';

const STOREMODULES_ROUTES: Routes = [
    { path: '', component: StoreComponent, children: [
            { path: '', redirectTo: 'home' },
            { path: 'home', component: StoreHomeComponent },
            { path: 'list', component: LandingPageComponent },
            { path: 'pos', component: PosComponent },
            { path: 'pos-reciept', component: PosRecieptComponent },
        ]
    }
];

export const storeRoutes = RouterModule.forChild(STOREMODULES_ROUTES);
