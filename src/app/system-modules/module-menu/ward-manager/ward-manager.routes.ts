import { RouterModule, Routes } from '@angular/router';

import { WardManagerComponent } from './ward-manager.component';
import { WardManagerListpageComponent } from './ward-manager-listpage/ward-manager-listpage.component';
import { WardManagerAdmissionpageComponent } from './ward-manager-admissionpage/ward-manager-admissionpage.component';
import { WardManagerSetuppageComponent } from './ward-manager-setuppage/ward-manager-setuppage.component';
import { BedComponent } from './ward-manager-setuppage/bed/bed.component';
import { RoomComponent } from './ward-manager-setuppage/room/room.component';
import { WardManagerAdmittedpageComponent } from './ward-manager-admittedpage/ward-manager-admittedpage.component';
import { WardManagerAdmittedDetailspageComponent } from './ward-manager-admitted-detailspage/ward-manager-admitted-detailspage.component';
import { BillDetailsComponent } from './ward-manager-admitted-detailspage/bill-details/bill-details.component';

const WARDMANAGER_ROUTES: Routes = [
    {
        path: '', component: WardManagerComponent, children: [
            { path: '', redirectTo: 'admission', pathMatch: 'full' },
            { path: 'wards', component: WardManagerListpageComponent },
            { path: 'admitted', component: WardManagerAdmittedpageComponent },
            { path: 'admitted/:id', component: WardManagerAdmittedDetailspageComponent },
            { path: 'admitted/:id/bill-details', component: BillDetailsComponent },
            { path: 'admission', component: WardManagerAdmissionpageComponent },
            { path: 'setup', component: WardManagerSetuppageComponent },
            { path: 'setup/ward/:wardId', component: RoomComponent },
            { path: 'setup/ward/:wardId/room/:roomId', component: BedComponent }
        ]
    }
];

export const wardManagerRoutes = RouterModule.forChild(WARDMANAGER_ROUTES);