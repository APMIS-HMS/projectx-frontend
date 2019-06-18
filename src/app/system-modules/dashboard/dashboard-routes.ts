import { CanActivateViaAuthGuardAccessService } from './../../services/facility-manager/setup/can-activate-via-auth-guard-access.service';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardHomeComponent } from './dashboard-home.component';
import * as SetupService from '../../services/facility-manager/setup/index';

const appRoutes: Routes = [
	{
		path: '',
		component: DashboardHomeComponent,
		children: [
			{
				path: '',
				component: DashboardComponent,
			},
			{
				path: 'facility',
				loadChildren: '../module-menu/facility-page/facility-page.module.ts#FacilityPageModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},

			{
				path: 'patient-manager',
				loadChildren: '../module-menu/patient-manager/patient-manager.module#PatientManagerModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'patient-manager/:id',
				loadChildren: '../module-menu/patient-manager/patient-manager.module#PatientManagerModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'ward-manager',
				loadChildren: '../module-menu/ward-manager/ward-manager.module#WardManagerModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'health-coverage',
				loadChildren: '../module-menu/health-coverage/health-coverage.module#HealthCoverageModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'billing',
				loadChildren: '../module-menu/billing/billing.module#BillingModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'payment',
				loadChildren: '../module-menu/payment/payment.module#PaymentModule',
				// canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			{
				path: 'wallet',
				loadChildren: '../module-menu/wallet/wallet.module#WalletModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'clinic',
				loadChildren: '../module-menu/clinic/clinic.module#ClinicModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'clinical-documentation',
				loadChildren: '../module-menu/forms-manager/forms-manager.module#FormsManagerModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
			{
				path: 'store',
				loadChildren: '../module-menu/apmis-store/apmis-store.module#ApmisStoreModule',
				// canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			{
				path: 'product-manager',
				loadChildren: '../module-menu/product-manager/product-manager.module#ProductManagerModule',
			},
			{
				path: 'purchase-manager',
				loadChildren:
					'../module-menu/purchase-manager/purchase-manager.module#PurchaseManagerModule',
				/* canActivate: [
                    CanActivateViaAuthGuardAccessService
                ] */
			},
			{
				path: 'inventory-manager',
				loadChildren:
					'../module-menu/inventory-manager/inventory-manager.module#InventoryManagerModule',
				// canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			{
				path: 'pharmacy',
				loadChildren: '../module-menu/pharmacy/pharmacy-manager.module#PharmacyManagerModule',
				// canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			// {
			//     path: 'laboratory',
			//     loadChildren: '../module-menu/laboratory/laboratory.module#LaboratoryModule'
			// },
			{
				path: 'laboratory',
				loadChildren: '../module-menu/lab/lab.module#LabModule',
				// canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			{
				path: 'radiology',
				loadChildren: '../module-menu/new-radiology/radiology.module#RadiologyModule',
				//  loadChildren: '../module-menu/radiology-module/radiology-module.module#RadiologyModuleModule',
				//  canActivate: [
				//     CanActivateViaAuthGuardAccessService
				// ]
			},
			{
				path: 'reports',
				loadChildren: '../module-menu/reports/reports.module#ReportsModule',
			},
			{
				path: 'immunization',
				loadChildren: '../module-menu/immunization/immunization.module#ImmunizationModule',
			},
			{
				path: 'corporate',
				loadChildren: '../corporate-account/corporate-account.module#CorporateAccountModule',
				canActivate: [CanActivateViaAuthGuardAccessService],
			},
		],
	},
];

// export default RouterModule.forRoot(appRoutes);
export const Routing = RouterModule.forChild(appRoutes);
