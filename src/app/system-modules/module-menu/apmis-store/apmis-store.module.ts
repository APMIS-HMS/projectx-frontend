import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApmisStoreRoutingModule } from './apmis-store-routing.module';
import { ApmisStoreLandingpageComponent } from './apmis-store-landingpage.component';
import { ApmisStoreHomeComponent } from './apmis-store-home/apmis-store-home.component';
import { StoreHomeAnalyticsComponent } from './apmis-store-home/store-home-analytics/store-home-analytics.component';
import { StoreHomeMainComponent } from './apmis-store-home/store-home-main/store-home-main.component';
import { AllProductsComponent } from './apmis-store-home/store-home-main/all-products/all-products.component';
import { ApmisStoreProductComponent } from './apmis-store-product/apmis-store-product.component';
import { AdjustStockComponent } from './apmis-store-product/adjust-stock/adjust-stock.component';
import { CheckProductDistributionComponent } from './apmis-store-product/check-product-distribution/check-product-distribution.component';
import { ExpiringProductsComponent } from './apmis-store-home/store-home-main/expiring-products/expiring-products.component';
import { ExpiredProductsComponent } from './apmis-store-home/store-home-main/expired-products/expired-products.component';
import { ProductRequisitionComponent } from './apmis-store-home/store-home-main/product-requisition/product-requisition.component';
import { ProductRestockComponent } from './apmis-store-home/store-home-main/product-restock/product-restock.component';
import { StoreStoresComponent } from './store-stores/store-stores.component';
import { StoreTabComponent } from './store-stores/store-tab/store-tab.component';
import { OnlyMaterialModule } from 'app/shared-common-modules/only-material-module';
import {
	StoreService,
	InventoryService,
	ProductTypeService,
	SupplierService,
	PurchaseOrderService,
	PurchaseEntryService
} from 'app/services/facility-manager/setup';
import { ApmisPaginationComponent } from './components/apmis-pagination/apmis-pagination.component';
import { StoreGlobalUtilService } from './store-utils/global-service';
import { ApmisNewStoreComponent } from './store-stores/apmis-new-store/apmis-new-store.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApmisSearchComponent } from './components/apmis-search/apmis-search.component';
import { ProductCongurationComponent } from './apmis-store-product/product-conguration/product-conguration.component';
import { ProductMovementComponent } from './product-movement/product-movement.component';
import { OutboundTransferComponent } from './product-movement/outbound-transfer/outbound-transfer.component';
import { InboundTransferComponent } from './product-movement/inbound-transfer/inbound-transfer.component';
import { ApmisSearchResultComponent } from './components/apmis-search/apmis-search-result/apmis-search-result.component';
import { ProductEntryComponent } from './product-entry/product-entry.component';
import { InitializeStoreComponent } from './product-entry/initialize-store/initialize-store.component';
import { InvoiceEntryComponent } from './product-entry/invoice-entry/invoice-entry.component';
import { PurchaseListComponent } from './product-entry/purchase-list/purchase-list.component';
import { PurchaseOrderComponent } from './product-entry/purchase-order/purchase-order.component';
import { SuppliersComponent } from './product-entry/suppliers/suppliers.component';
import { ProductConfigPopupComponent } from './product-entry/initialize-store/product-config-popup/product-config-popup.component';
import { ConfigProductComponent } from './apmis-store-product/product-conguration/config-product/config-product.component';
import { NewPurchaseListComponent } from './product-entry/purchase-list/new-purchase-list/new-purchase-list.component';
import { PurchaseListDetailsComponent } from './product-entry/purchase-list/purchase-list-details/purchase-list-details.component';
import { NewPurchaseOrderListComponent } from './product-entry/purchase-order/new-purchase-order-list/new-purchase-order-list.component';
// tslint:disable-next-line:max-line-length
import { PurchaseOrderListDetailsComponent } from './product-entry/purchase-order/purchase-order-list-details/purchase-order-list-details.component';
import { ViewInvoiceComponent } from './product-entry/invoice-entry/view-invoice/view-invoice.component';
import { NewSupplierComponent } from './product-entry/suppliers/new-supplier/new-supplier.component';
import { InboundRequisitionComponent } from './product-movement/inbound-requisition/inbound-requisition.component';
import { OutboundRequisitionComponent } from './product-movement/outbound-requisition/outbound-requisition.component';
import { CoreUiModules } from '../../../core-ui-modules/CoreUiModules';
import { ProductGridComponent } from './product-movement/helper-components/products/product-grid-component';
import { ProductGridItemComponent } from './product-movement/helper-components/products/product-grid-item-component';
import { ApmisStoreSupplierSearchComponent } from './components/apmis-store-supplier-search/apmis-store-supplier-search.component';
import { ProductExitComponent } from './product-exit/product-exit.component';
import { SalesComponent } from './product-exit/sales/sales.component';
import { RefundComponent } from './product-exit/refund/refund.component';
import { ProductToggleComponent } from './apmis-store-product/product-conguration/config-product/product-toggle/product-toggle.component';
// tslint:disable-next-line:max-line-length
import { ConsumableEntryComponent } from './apmis-store-product/product-conguration/config-product/consumable-entry/consumable-entry.component';
import { DrugEntryComponent } from './apmis-store-product/product-conguration/config-product/drug-entry/drug-entry.component';
import { BaseUnitComponent } from './apmis-store-product/product-conguration/config-product/base-unit/base-unit.component';
// tslint:disable-next-line:max-line-length
import { ConfigContainerComponent } from './apmis-store-product/product-conguration/config-product/config-container/config-container.component';
import { FromPurchaseOrderComponent } from './product-entry/invoice-entry/new-invoice-entry/from-purchase-order/from-purchase-order.component';
import { NoPurchaseOrderComponent } from './product-entry/invoice-entry/new-invoice-entry/no-purchase-order/no-purchase-order.component';
import { StoreOutboundService } from '../../../services/facility-manager/setup/store-outbound-requisitory-service';
import { CustomerComponent } from './product-exit/customer/customer.component';
import { CustomerPrescriptionComponent } from './product-exit/customer/customer-prescription/customer-prescription.component';
import { MaterialModule } from 'app/shared-common-modules/material-module';
import { ApmisCustomerComponent } from './product-exit/sales/apmis-customer/apmis-customer.component';
import { FocusDirective } from './components/directives/apmis-focus-directive';
// tslint:disable-next-line:max-line-length
import { InvoiceEntryLineItemComponent } from './product-entry/invoice-entry/new-invoice-entry/invoice-entry-line-item/invoice-entry-line-item.component';
import { ApmisNairaComponent } from './components/apmis-naira/apmis-naira.component';
import { NewInvoiceEntryComponent } from './product-entry/invoice-entry/new-invoice-entry/new-invoice-entry.component';
// tslint:disable-next-line:max-line-length
import { SearchSuggestionComponent } from './apmis-store-product/product-conguration/config-product/search-suggestion/search-suggestion.component';
import { ApmisStoreCheckInComponent } from './components/store-check-in/apmis-store-check-in.component';
@NgModule({
	imports: [
		CommonModule,
		ApmisStoreRoutingModule,
		OnlyMaterialModule,
		FormsModule,
		ReactiveFormsModule,
		CoreUiModules,
		MaterialModule
	],
	declarations: [
		ApmisStoreLandingpageComponent,
		ApmisStoreHomeComponent,
		StoreHomeAnalyticsComponent,
		StoreHomeMainComponent,
		AllProductsComponent,
		ExpiringProductsComponent,
		ExpiredProductsComponent,
		ProductRequisitionComponent,
		ProductRestockComponent,
		StoreStoresComponent,
		StoreTabComponent,
		ApmisStoreProductComponent,
		ApmisPaginationComponent,
		AdjustStockComponent,
		CheckProductDistributionComponent,
		ApmisNewStoreComponent,
		ProductCongurationComponent,
		ApmisSearchComponent,
		ProductMovementComponent,
		OutboundTransferComponent,
		InboundTransferComponent,
		ApmisSearchResultComponent,
		ProductEntryComponent,
		InitializeStoreComponent,
		InvoiceEntryComponent,
		PurchaseListComponent,
		PurchaseOrderComponent,
		SuppliersComponent,
		ProductConfigPopupComponent,
		ConfigProductComponent,
		NewPurchaseListComponent,
		PurchaseListDetailsComponent,
		NewPurchaseOrderListComponent,
		PurchaseOrderListDetailsComponent,
		ViewInvoiceComponent,
		NewSupplierComponent,
		InboundRequisitionComponent,
		OutboundRequisitionComponent,
		ProductGridComponent,
		ProductGridItemComponent,
		ApmisStoreCheckInComponent,
		ApmisStoreSupplierSearchComponent,
		ProductExitComponent,
		SalesComponent,
		RefundComponent,
		CustomerComponent,
		CustomerPrescriptionComponent,
		NewInvoiceEntryComponent,
		ProductToggleComponent,
		ConsumableEntryComponent,
		DrugEntryComponent,
		BaseUnitComponent,
		ConfigContainerComponent,
		ApmisCustomerComponent,
		FromPurchaseOrderComponent,
		NoPurchaseOrderComponent,
		FocusDirective,
		InvoiceEntryLineItemComponent,
		ApmisNairaComponent,
		SearchSuggestionComponent
	],
	providers: [
		StoreService,
		InventoryService,
		StoreGlobalUtilService,
		ProductTypeService,
		SupplierService,
		PurchaseOrderService,
		StoreOutboundService,
		PurchaseEntryService
	]
})
export class ApmisStoreModule {}
