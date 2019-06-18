import {SharedModuleMaterialModule} from "./sharedmodule-materialsmodule";
import {LogOutConfirmModule} from "./log-out-module";
import {SystemModuleComponent} from "./../system-modules/system-module.component";
import {ImageUpdateComponent} from "./../system-modules/module-menu/facility-page/employees/image-update/image-update.component";
import {PasswordResetComponent} from "./../password-reset/password-reset.component";
import {NgModule} from "@angular/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CreateWorkspaceComponent} from "../system-modules/module-menu/facility-page/create-workspace/create-workspace.component";
import {GlobalDialogComponent} from '../shared-module/global-dialog/global-dialog.component';
import {NgUploaderModule} from 'ngx-uploader';
import {CurrencyMaskModule} from 'ng2-currency-mask';
import {AddVitalsComponent} from '../system-modules/module-menu/patient-manager/add-vitals/add-vitals.component';
import {AddPrescriptionComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/add-prescription/add-prescription.component';
import {BillPrescriptionComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/bill-prescription/bill-prescription.component';
import {PatientPrescriptionComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/patient-prescription/patient-prescription.component';


import {PrescribedTableComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescribed-table/prescribed-table.component';
import {PrescriptionBillComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescription-bill/prescription-bill.component';
import {GenBillSearchComponent} from '../system-modules/module-menu/patient-manager/patientmanager-detailpage/new-patient-prescription/prescription-bill/gen-bill-search/gen-bill-search.component';


import {GlobalPatientLookupComponent} from '../shared-module/global-patient-lookup/global-patient-lookup.component';
import {ApmisLookupComponent} from '../shared-module/apmis-lookup/apmis-lookup.component';
import {ApmisPaginatedLookupComponent} from '../shared-module/apmis-paginated-lookup/apmis-paginated-lookup.component';
import {ApmisLookupMultiselectComponent} from '../shared-module/apmis-lookup-multiselect/apmis-lookup-multiselect.component';
import {StoreCheckInComponent} from '../shared-module/store-check-in/store-check-in.component';
import {LabCheckInComponent} from '../shared-module/lab-check-in/lab-check-in.component';
import {MomentModule} from 'angular2-moment';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {CoolStorageModule} from 'angular2-cool-storage';
import {
    OrderStatusService,
    SeverityService
} from '../services/module-manager/setup/index';
import {HmoService, FacilityFamilyCoverService} from '../services/facility-manager/setup/index';
import {KeysPipe} from './keypipe';
import {ThousandDecimalPipe} from './thousand-pipe';
import {PersonAccountComponent} from '../person-account/person-account.component';
import {NewPatientComponent} from '../system-modules/module-menu/patient-manager/new-patient/new-patient.component';

import {LabRequestsComponent} from '../system-modules/module-menu/lab/lab-requests/lab-requests.component';
import {RequestDetailComponent} from '../system-modules/module-menu/lab/lab-requests/request-detail/request-detail.component';
import {DragulaModule} from 'ng2-dragula';
import {NgPipesModule} from 'ngx-pipes';
import {CheckoutPatientComponent} from 'app/shared-module/checkout-patient/checkout-patient.component';
import {OnlyMaterialModule} from './only-material-module';
import {ImageCropperModule} from 'ng2-img-cropper';
import {ImageViewerComponent} from '../shared-module/image-viewer/image-viewer.component';
import {CustomLogoComponent} from './CustomLogoComponent';
import {CoreUiModules} from '../core-ui-modules/CoreUiModules';
import { RmNewRequestComponent } from "app/system-modules/module-menu/radiology-module/rm-request/rm-new-request/rm-new-request.component";
import { RadiologyRequestsComponent } from "app/system-modules/module-menu/new-radiology/radiology-requests/radiology-requests.component";
import { NewRadiologyRequestDetailComponent } from "app/system-modules/module-menu/new-radiology/radiology-requests/request-detail/request-detail.component";


@NgModule({
    declarations: [
        CreateWorkspaceComponent,
        GlobalDialogComponent,
        AddVitalsComponent,
        AddPrescriptionComponent,
        BillPrescriptionComponent,
        PatientPrescriptionComponent,
        GlobalPatientLookupComponent,
        StoreCheckInComponent,
        LabCheckInComponent,
        ImageUpdateComponent,
        ApmisLookupComponent,
        ApmisLookupMultiselectComponent,
        ApmisPaginatedLookupComponent,
        KeysPipe,
        ThousandDecimalPipe,
        PersonAccountComponent,
        NewPatientComponent,
        LabRequestsComponent,
        RequestDetailComponent,
        CheckoutPatientComponent,
        PasswordResetComponent,
        ImageViewerComponent,
        CustomLogoComponent,
        PrescribedTableComponent,
        PrescriptionBillComponent,
        GenBillSearchComponent,
        RmNewRequestComponent,
        RadiologyRequestsComponent,
        NewRadiologyRequestDetailComponent
    ],
    exports: [
        NgbModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        CreateWorkspaceComponent,
        GlobalDialogComponent,
        ImageCropperModule,
        ImageUpdateComponent,
        NgUploaderModule,
        AddVitalsComponent,
        AddPrescriptionComponent,
        BillPrescriptionComponent,
        PatientPrescriptionComponent,
        CurrencyMaskModule,
        GlobalPatientLookupComponent,
        StoreCheckInComponent,
        LabCheckInComponent,
        MomentModule,
        ToastModule,
        CoolStorageModule,
        ApmisLookupComponent,
        ApmisLookupMultiselectComponent,
        ApmisPaginatedLookupComponent,
        KeysPipe,
        ThousandDecimalPipe,
        PersonAccountComponent,
        LabRequestsComponent,
        RequestDetailComponent,
        NewPatientComponent,
        DragulaModule,
        NgPipesModule,
        CheckoutPatientComponent,
        PasswordResetComponent,
        SharedModuleMaterialModule,
        ImageViewerComponent,
        CustomLogoComponent,
        CoreUiModules,
        PrescribedTableComponent,
        PrescriptionBillComponent,
        GenBillSearchComponent,
        RmNewRequestComponent,
        RadiologyRequestsComponent,
        NewRadiologyRequestDetailComponent
    ],
    imports: [
        OnlyMaterialModule,
        NgbModule.forRoot(),
        ToastModule.forRoot(),
        CoolStorageModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ImageCropperModule,
        NgUploaderModule,
        CurrencyMaskModule,
        DragulaModule,
        NgPipesModule,
        LogOutConfirmModule,
        SharedModuleMaterialModule,
        CoreUiModules // Import core ui module for global access of all newly created UI components
    ],
    providers: [OrderStatusService, SeverityService, HmoService, FacilityFamilyCoverService]
})
export class MaterialModule {}
