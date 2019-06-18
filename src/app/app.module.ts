import { OnlyMaterialModule } from './shared-common-modules/only-material-module';
import { CanActivateViaAuthGuardCompleteFacilityService } from './services/facility-manager/setup/can-activate-via-auth-guard-complete-facility.service';
import { AuthInterceptor } from './feathers/auth.interceptor';
import { AuthFacadeService } from './system-modules/service-facade/auth-facade.service';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { SecurityQuestionsService } from './services/facility-manager/setup/security-questions.service';
import { CountryServiceFacadeService } from './system-modules/service-facade/country-service-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { PayStackService } from './services/facility-manager/setup/paystack.service';
import { PolicyService } from './services/facility-manager/setup/policy.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule } from '@angular/http';
import { CoolStorageModule } from 'angular2-cool-storage';
import { CustomPreloading } from './custom-preloading';
import { Routing } from './app.routes';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {} from './facility-setup/facility-setup.module';
// import {            } from './facility-setup/facility-setup.module';
import { LoginComponent } from './login/login.component';
import { SocketService, RestService } from './feathers/feathers.service';
import * as SetupService from './services/facility-manager/setup/index';
import * as ReportService from './services/reports/index';
import * as ToolsService from './services/tools/index';

import * as ModuleManagerService from './services/module-manager/setup/index';
import { UserAccountsComponent } from './system-modules/user-accounts/user-accounts.component';
import { SharedModule } from './shared-module/shared.module';
// tslint:disable-next-line:max-line-length
import { UserAccountsInnerPopupComponent } from './system-modules/user-accounts/user-accounts-inner-popup/user-accounts-inner-popup.component';
import { CorporateSignupComponent } from './corporate-signup/corporate-signup.component';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { SignupComponent } from './signup/signup.component';
import { ClinicHelperService } from '../app/system-modules/module-menu/clinic/services/clinic-helper.service';
import { SwitchUserResolverService } from '../app/resolvers/module-menu/index';

import { ApmisErrorHandler } from './services/facility-manager/error-handler.service';
// import { PersonAccountComponent } from './person-account/person-account.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

// tslint:disable-next-line:max-line-length
import { ApmisCheckboxChildComponent } from './system-modules/module-menu/patient-manager/patientmanager-detailpage/apmis-checkbox/apmis-checkbox-child.component';
import { ApmisCheckboxComponent } from './system-modules/module-menu/patient-manager/patientmanager-detailpage/apmis-checkbox/apmis-checkbox.component';
import { VerifyTokenComponent } from './facility-setup/verify-token/verify-token.component';
import { LogoutConfirmComponent } from './system-modules/module-menu/logout-confirm/logout-confirm.component';
import { FacilitySetupComponent } from './facility-setup/facility-setup.component';
import { ContactInfoComponent } from './facility-setup/contact-info/contact-info.component';
import { AddLogoComponent } from './facility-setup/add-logo/add-logo.component';
import { FacilityInfoComponent } from './facility-setup/facility-info/facility-info.component';
// import { AddFacilityModuleComponent } from './facility-setup/add-facility-module/add-facility-module.component';
import { DashboardHomeComponent } from './system-modules/dashboard/dashboard-home.component';
import { SingUpAccountsSharedModule } from './shared-common-modules/signup-accounts-shared-module';
import { MaterialModule } from './shared-common-modules/material-module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarHttpModule } from '@ngx-loading-bar/http';
import { TitleGenderFacadeService } from 'app/system-modules/service-facade/title-gender-facade.service';
import { FacilityFacadeService } from 'app/system-modules/service-facade/facility-facade.service';
import { UserFacadeService } from 'app/system-modules/service-facade/user-facade.service';
import { FacilityTypeFacilityClassFacadeService } from 'app/system-modules/service-facade/facility-type-facility-class-facade.service';
import { JoinChannelService } from 'app/services/facility-manager/setup/join-channel.service';
import { ChannelService } from './services/communication-manager/channel-service';
import { NotificationService } from './services/communication-manager/notification.service';

//import { IkeComponent } from './ike/ike.component';
import { RadiologyInvestigationService } from 'app/services/facility-manager/setup/radiologyinvestigation.service';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { CanActivateViaAuthGuardAccessService } from 'app/services/facility-manager/setup/can-activate-via-auth-guard-access.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { MessagingComponent } from './messaging/messaging.component';

import { APP_DATE_FORMATS, AppDateAdapter } from 'app/date-format';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ErrorsService } from './feathers/errors.service';
import { ArrayFunctionHelper } from './shared-module/helpers/array-function-helper';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		ApmisCheckboxChildComponent,
		ApmisCheckboxComponent
		// MessagingComponent
	],
	exports: [],
	imports: [
		BrowserModule,
		HttpModule,
		Routing,
		BrowserAnimationsModule,
		OnlyMaterialModule,
		MaterialModule,
		SingUpAccountsSharedModule,
		LoadingBarHttpModule,
		LoadingBarRouterModule,
		SweetAlert2Module.forRoot({
			buttonsStyling: false,
			customClass: 'modal-content',
			confirmButtonClass: 'btn btn-primary',
			cancelButtonClass: 'btn'
		})
	],
	providers: [
		{
			provide: DateAdapter,
			useClass: AppDateAdapter
		},
		{
			provide: MAT_DATE_FORMATS,
			useValue: APP_DATE_FORMATS
		},
		{ provide: MAT_DATE_LOCALE, useValue: 'en-in' },
		{ provide: ErrorHandler, useClass: ApmisErrorHandler },
		SocketService,
		RestService,
		SetupService.CountriesService,
		SetupService.FacilityTypesService,
		SetupService.FacilitiesService,
		SetupService.FacilityModuleService,
		SetupService.ConsultingRoomService,
		SetupService.FacilitiesService,
		SetupService.FacilityModuleService,
		SetupService.UserService,
		SetupService.GenderService,
		SetupService.TitleService,
		SetupService.ProfessionService,
		SetupService.PersonService,
		SetupService.CompanyHealthCoverService,
		SetupService.FamilyHealthCoverService,
		SetupService.AppointmentTypeService,
		SetupService.RelationshipService,
		SetupService.MaritalStatusService,
		SetupService.EmployeeService,
		ModuleManagerService.LocationService,
		ModuleManagerService.FacilityOwnershipService,
		SetupService.AppointmentService,
		SetupService.InvoiceService,
		SetupService.BillingService,
		SetupService.SchedulerService,
		SetupService.SchedulerTypeService,
		SetupService.PatientService,
		SetupService.CorporateFacilityService,
		SetupService.ImageUploadService,
		SetupService.TagDictionaryService,
		SetupService.ServiceDictionaryService,
		SetupService.CompanyCoverCategoryService,
		ModuleManagerService.FeatureModuleService,
		SetupService.AccessControlService,
		SetupService.ServicePriceService,
		SetupService.CanActivateViaAuthGuardService,
		SetupService.FacilitiesServiceCategoryService,
		SetupService.TagService,
		SetupService.InPatientListService,
		SetupService.RoomGroupService,
		SetupService.BedOccupancyService,
		SetupService.WorkSpaceService,
		SetupService.InPatientService,
		SetupService.WardDischargeTypesService,
		SetupService.DocumentationService,
		SetupService.InPatientTransferStatusService,
		ClinicHelperService,
		SwitchUserResolverService,
		SetupService.DictionariesService,
		SetupService.VitaLocationService,
		SetupService.VitalPositionService,
		SetupService.VitalRythmService,
		SetupService.PrescriptionService,
		SetupService.PrescriptionPriorityService,
		SetupService.RouteService,
		SetupService.FrequencyService,
		SetupService.DrugListApiService,
		SetupService.DrugDetailsService,
		CustomPreloading,
		SetupService.InventoryService,
		SetupService.InventoryTransferService,
		SetupService.InventoryTransactionTypeService,
		SetupService.InventoryTransferStatusService,
		SetupService.DispenseService,
		SetupService.FacilityPriceService,
		SetupService.ProductService,
		SetupService.ManufacturerService,
		SetupService.AssessmentDispenseService,
		SetupService.MedicationListService,
		SetupService.InventoryTransactionTypeService,
		SetupService.LaboratoryService,
		SetupService.ExternalPrescriptionService,
		SetupService.InvestigationService,
		SetupService.InvestigationSpecimenService,
		SetupService.InvestigationReportTypeService,
		SetupService.WorkbenchService,
		SetupService.ServerDateService,
		SetupService.LaboratoryReportService,
		SetupService.FormsService,
		SetupService.VitalService,
		SetupService.TemplateService,
		PolicyService,
		PayStackService,
		SetupService.InventoryInitialiserService,
		SetupService.SmsAlertService,
		SetupService.MakePaymentService,
		SystemModuleService,
		SetupService.SearchInvoicesService,
		SetupService.PendingBillService,
		SetupService.TodayInvoiceService,
		SetupService.LocSummaryCashService,
		CountryServiceFacadeService,
		TitleGenderFacadeService,
		FacilityFacadeService,
		UserFacadeService,
		SetupService.InventoryInitialiserService,
		SetupService.SmsAlertService,
		SetupService.MakePaymentService,
		SystemModuleService,
		SetupService.SearchInvoicesService,
		SetupService.PendingBillService,
		SetupService.TodayInvoiceService,
		SetupService.LocSummaryCashService,
		SetupService.TimeLineService,
		FacilityTypeFacilityClassFacadeService,
		JoinChannelService,
		NotificationService,
		SetupService.DocumentUploadService,
		RadiologyInvestigationService,
		SetupService.SearchInvoicesService,
		SetupService.PendingBillService,
		SetupService.TodayInvoiceService,
		SetupService.LocSummaryCashService,
		SetupService.TimeLineService,
		SetupService.DocumentUploadService,
		RadiologyInvestigationService,
		SetupService.FluidService,
		SecurityQuestionsService,
		TitleCasePipe,
		UpperCasePipe,
		AuthFacadeService,
		SetupService.DepartmentService,
		CanActivateViaAuthGuardAccessService,
		ToolsService.ApmisFilterBadgeService,
		ToolsService.EventStateService,
		ToolsService.ProductObserverService,
		ReportService.ClinicAttendanceReportService,
		ReportService.AppointmentReportService,
		ReportService.DiagnosisReportService,
		ReportService.DispenseReportService,
		ReportService.PrescriptionReportService,
		ChannelService,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: AuthInterceptor,
			multi: true
		},
		CanActivateViaAuthGuardCompleteFacilityService,
		UpperCasePipe,
		ErrorsService,
		ArrayFunctionHelper
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {
	constructor(private dateAdapter: DateAdapter<Date>) {
		dateAdapter.setLocale('en-in');
	}
}
