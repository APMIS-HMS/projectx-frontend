import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared-module/shared.module';
import { productManagerRoutes } from './product-manager.routes';
import { ProductManagerComponent } from './product-manager.component';
import { SupplierManagerComponent } from './supplier-manager/supplier-manager.component';
import {
    ProductTypeService, StoreService, ProductService, ManufacturerService, GenericService,
    RouteService, SupplierService, PresentationService, StrengthService, PurchaseEntryService
} from '../../../services/facility-manager/setup/index';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { ProductEmitterService } from '../../../services/facility-manager/product-emitter.service';
import { ProductManagerLandingpageComponent } from './product-manager-landingpage/product-manager-landingpage.component';
import { CategoryManagerComponent } from './category-manager/category-manager.component';
import { ManufacturerManagerComponent } from './manufacturer-manager/manufacturer-manager.component';
import { RouteManagerComponent } from './route-manager/route-manager.component';
import { GenericManagerComponent } from './generic-manager/generic-manager.component';
import { PresentationManagerComponent } from './presentation-manager/presentation-manager.component';
import { NewProductComponent } from './product-manager-landingpage/new-product/new-product.component';
import { NewSupplierComponent } from './supplier-manager/new-supplier/new-supplier.component';
import { MakePaymentComponent } from './supplier-manager/make-payment/make-payment.component';
import { PaymentHistoryComponent } from './supplier-manager/payment-history/payment-history.component';
import { TransactionHistoryComponent } from './supplier-manager/transaction-history/transaction-history.component';
import { StrengthManagerComponent } from './strength-manager/strength-manager.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';

@NgModule({
    declarations: [
        ProductManagerComponent,
        SupplierManagerComponent,
        ProductManagerLandingpageComponent,
        CategoryManagerComponent,
        ManufacturerManagerComponent,
        RouteManagerComponent,
        GenericManagerComponent,
        PresentationManagerComponent,
        NewProductComponent,
        NewSupplierComponent,
        MakePaymentComponent,
        PaymentHistoryComponent,
        TransactionHistoryComponent,
        StrengthManagerComponent
    ],

    exports: [
    ],
    imports: [
        SharedModule,
        OnlyMaterialModule,
        MaterialModule,
        // CommonModule,
        // ReactiveFormsModule,
        // FormsModule,
        productManagerRoutes,
        Ng4GeoautocompleteModule.forRoot()
    ],
    providers: [ProductEmitterService, ProductTypeService, StoreService, ProductService, PresentationService,
        GenericService, ManufacturerService, RouteService, SupplierService, StrengthService, PurchaseEntryService]
})
export class ProductManagerModule { }



