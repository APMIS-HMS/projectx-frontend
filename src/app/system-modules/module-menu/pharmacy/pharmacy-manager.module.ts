import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { pharmacyManagerRoutes } from './pharmacy-manager.routes';
import { PharmacyManagerComponent } from './pharmacy-manager.component';
import {
    StoreService, ManufacturerService, GenericService,
    RouteService, SupplierService, PresentationService, StrengthService, PurchaseEntryService
} from '../../../services/facility-manager/setup/index';

import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { PharmacyManagerLandingpageComponent } from './pharmacy-manager-landingpage/pharmacy-manager-landingpage.component';
import { PrescriptionListComponent } from './prescription-list/prescription-list.component';
import { DispenseComponent } from './dispense/dispense.component';
import { PrescriptionComponent } from './dispense/prescription/prescription.component';
import { NoprescriptionComponent } from './dispense/noprescription/noprescription.component';
import { LoginEmployeeResolverService } from '../../../resolvers/module-menu/index';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { WalkInDetailsComponent } from './prescription-list/walk-in-details/walk-in-details.component';
import { ExternalPrescriptionComponent } from './external-prescription/external-prescription.component';
import { NewPrescriptionListComponent } from './new-prescription-list/new-prescription-list.component';
import { DispensePrescriptionComponent } from './new-prescription-list/dispense-prescription/dispense-prescription.component';

import { DrugInteractionService } from '../patient-manager/patientmanager-detailpage/new-patient-prescription/services/drug-interaction.service';

@NgModule({
    declarations: [
        PharmacyManagerComponent,
        PharmacyManagerLandingpageComponent,
        PrescriptionListComponent,
        DispenseComponent,
        PrescriptionComponent,
        NoprescriptionComponent,
        WalkInDetailsComponent,
        ExternalPrescriptionComponent,
        NewPrescriptionListComponent,
        DispensePrescriptionComponent
    ],

    exports: [
    ],
    imports: [
        pharmacyManagerRoutes,
        OnlyMaterialModule,
        MaterialModule
    ],
    providers: [PharmacyEmitterService, StoreService, PresentationService,
        GenericService, ManufacturerService, RouteService, SupplierService, 
        StrengthService, PurchaseEntryService, LoginEmployeeResolverService,
        DrugInteractionService]
})
export class PharmacyManagerModule { }



