import { DrugInteractionService } from './patientmanager-detailpage/new-patient-prescription/services/drug-interaction.service';
// import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { FacilityCompanyCoverService } from './../../../services/facility-manager/setup/facility-company-cover.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
// import { FacilityFamilyCoverService } from './../../../services/facility-manager/setup/facility-family-cover.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PatientManagerComponent } from './patient-manager.component';
import { patientManagerRoutes } from './patient-manager.routes';
import { PatientManagerHomeComponent } from './patient-manager-home.component';
import { PatientmanagerHomepageComponent } from './patientmanager-homepage/patientmanager-homepage.component';
import { PatientmanagerDetailpageComponent } from './patientmanager-detailpage/patientmanager-detailpage.component';
// import { NewPatientComponent } from "./new-patient/new-patient.component";
import { SharedModule } from '../../../shared-module/shared.module';
import {
	PatientResolverService,
	AppointmentResolverService,
	LoginEmployeeResolverService
} from '../../../resolvers/module-menu/index';
import { AddTagsComponent } from './add-tags/add-tags.component';
import { FormsService, ImmunizationRecordService } from '../../../services/facility-manager/setup/index';
import { PatientSummaryComponent } from './patientmanager-detailpage/patient-summary/patient-summary.component';
import { PatientPrescriptionComponent } from './patientmanager-detailpage/patient-prescription/patient-prescription.component';
import { MedicationHistoryComponent } from './patientmanager-detailpage/medication-history/medication-history.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { UpdateImgComponent } from './update-img/update-img.component';
import { ExternalPrescriptionComponent } from './patientmanager-detailpage/external-prescription/external-prescription.component';
import { DocumentationComponent } from './patientmanager-detailpage/documentation/documentation.component';
// tslint:disable-next-line:max-line-length
import { DocumentationDetailComponent } from './patientmanager-detailpage/documentation/documentation-detail/documentation-detail.component';
import { ClinicalNoteComponent } from './patientmanager-detailpage/documentation/clinical-note/clinical-note.component';
import { AddPatientProblemComponent } from './patientmanager-detailpage/documentation/add-patient-problem/add-patient-problem.component';
import { AddAllergyComponent } from './patientmanager-detailpage/documentation/add-allergy/add-allergy.component';
import { AddHistoryComponent } from './patientmanager-detailpage/documentation/add-history/add-history.component';
import { FormTypeService } from '../../../services/module-manager/setup/index';
import { SurveyComponent } from '../../../shared-module/form-generator/survey.component';
import { SurveyEditorComponent } from '../../../shared-module/form-generator/survey.editor.component';
import { SharedService } from '../../../shared-module/shared.service';
import { TimelineComponent } from './patientmanager-detailpage/timeline/timeline.component';
import { RightTabComponent } from './patientmanager-detailpage/documentation/right-tab/right-tab.component';
import { ChartsModule } from 'ng2-charts';
import {
	WorkbenchService,
	LaboratoryRequestService,
	OrderSetTemplateService,
	TreatmentSheetService
} from '../../../services/facility-manager/setup/index';
import { PaymentComponent } from './patientmanager-detailpage/payment/payment.component';
import { WalletComponent } from './patientmanager-detailpage/payment/wallet/wallet.component';
import { InsuranceComponent } from './patientmanager-detailpage/payment/insurance/insurance.component';
import { CompanyComponent } from './patientmanager-detailpage/payment/company/company.component';
import { FamilyComponent } from './patientmanager-detailpage/payment/family/family.component';
import { PatientPaymentPlanComponent } from './patient-payment-plan/patient-payment-plan.component';
import { OrderSetComponent } from './patientmanager-detailpage/order-set/order-set.component';
import { EditMedicationComponent } from './patientmanager-detailpage/order-set/edit-medication/edit-medication.component';
import { EditInvestigationComponent } from './patientmanager-detailpage/order-set/edit-investigation/edit-investigation.component';
import { BillInvestigationComponent } from './patientmanager-detailpage/order-set/edit-investigation/bill-investigation/bill-investigation.component';
import { EditProcedureComponent } from './patientmanager-detailpage/order-set/edit-procedure/edit-procedure.component';
import { EditNursingCareComponent } from './patientmanager-detailpage/order-set/edit-nursing-care/edit-nursing-care.component';
import { EditPhysicianOrderComponent } from './patientmanager-detailpage/order-set/edit-physician-order/edit-physician-order.component';
import { DocSymptomComponent } from './patientmanager-detailpage/documentation/doc-symptom/doc-symptom.component';
import { DocDiagnosisComponent } from './patientmanager-detailpage/documentation/doc-diagnosis/doc-diagnosis.component';
import { OrderBillItemComponent } from './patientmanager-detailpage/order-set/order-bill-item/order-bill-item.component';
import { TreatementPlanComponent } from './patientmanager-detailpage/treatement-plan/treatement-plan.component';
import { FluidComponent } from './patientmanager-detailpage/fluid/fluid.component';
import { DocumentationTemplateService } from 'app/services/facility-manager/setup/documentation-template.service';
import { DocUploadsComponent } from './patientmanager-detailpage/doc-uploads/doc-uploads.component';
import { DocUploadComponent } from './patientmanager-detailpage/doc-uploads/doc-upload/doc-upload.component';
import { DocUploadDetailComponent } from './patientmanager-detailpage/doc-uploads/doc-upload-detail/doc-upload-detail.component';
import { PatientVitalsComponent } from './patientmanager-detailpage/patient-vitals/patient-vitals.component';
import { FluidTypeComponent } from './patientmanager-detailpage/fluid/fluid-type/fluid-type.component';
import { ScopeLevelService } from '../../../services/module-manager/setup/scope-level.service';
import { PatientTagsComponent } from './patientmanager-detailpage/patient-tags/patient-tags.component';
import { PatientAddTagComponent } from './patientmanager-detailpage/patient-tags/patient-add-tag/patient-add-tag.component';
import { OnlyMaterialModule } from '../../../shared-common-modules/only-material-module';
import { AddPatientTagsComponent } from './patientmanager-detailpage/documentation/add-patient-tags/add-patient-tags.component';
import { PatientImmunizationComponent } from './patientmanager-detailpage/patient-immunization/patient-immunization.component';
import { LabEventEmitterService } from '../../../services/facility-manager/lab-event-emitter.service';
import { VaccineAdministrationComponent } from './patientmanager-detailpage/patient-immunization/vaccine-administration/vaccine-administration.component';
import { VaccineDocumentationComponent } from './patientmanager-detailpage/patient-immunization/vaccine-documentation/vaccine-documentation.component';
import { PregnancyManagerComponent } from './patientmanager-detailpage/pregnancy-manager/pregnancy-manager.component';
import { PatientRegistersComponent } from './patientmanager-detailpage/patient-registers/patient-registers.component';
import { PatientLandingBillingComponent } from './patientmanager-detailpage/patient-landing-billing/patient-landing-billing.component';
import { AddItemComponent } from '../payment/add-item/add-item.component';
import { AddLineModifierComponent } from '../payment/add-line-modifier/add-line-modifier.component';
import { ItemDetailComponent } from '../payment/item-detail/item-detail.component';
import { FundWalletComponent } from '../payment/bill-lookup/fund-wallet/fund-wallet.component';
import { BcrAssessmentComponent } from './patientmanager-detailpage/bcr-assessment/bcr-assessment.component';
import { PrintDocumentationComponent } from './patientmanager-detailpage/documentation/print-documentation/print-documentation.component';
import { DocUploadViewComponent } from './patientmanager-detailpage/documentation/doc-upload-view/doc-upload-view.component';
import { RightTabTooltipComponent } from './patientmanager-detailpage/documentation/right-tab/right-tab-tooltip/right-tab-tooltip.component';
import { UnknownPatientMergeComponent } from './patientmanager-detailpage/unknown-patient-merge/unknown-patient-merge.component';
import { NewPatientPrescriptionComponent } from './patientmanager-detailpage/new-patient-prescription/new-patient-prescription.component';
import { PrescribedTableComponent } from './patientmanager-detailpage/new-patient-prescription/prescribed-table/prescribed-table.component';
import { PrescriptionBillComponent } from './patientmanager-detailpage/new-patient-prescription/prescription-bill/prescription-bill.component';
import { PrescribeDrugComponent } from './patientmanager-detailpage/new-patient-prescription/prescribe-drug/prescribe-drug.component';
//import { PrescribeDrugNotableComponent } from './patientmanager-detailpage/new-patient-prescription/prescribe-drug-noTable/prescribe-drug-notable.component';
import { PrescriptionHistoryComponent } from './patientmanager-detailpage/new-patient-prescription/prescription-history/prescription-history.component';
import { DrugSearchComponent } from './patientmanager-detailpage/new-patient-prescription/drug-search/drug-search.component';
import { GenBillSearchComponent } from './patientmanager-detailpage/new-patient-prescription/prescription-bill/gen-bill-search/gen-bill-search.component';


import { PharmacyEmitterService } from '../../../services/facility-manager/pharmacy-emitter.service';
import { DrugOrdersetComponent } from './patientmanager-detailpage/new-patient-prescription/drug-orderset/drug-orderset.component';

@NgModule({
	declarations: [
		PatientManagerComponent,
		PatientManagerHomeComponent,
		PatientmanagerHomepageComponent,
		PatientmanagerDetailpageComponent,
		// NewPatientComponent,
		AddTagsComponent,
		PatientSummaryComponent,
		MedicationHistoryComponent,
		UpdateImgComponent,
		ExternalPrescriptionComponent,
		DocumentationComponent,
		DocumentationDetailComponent,
		ClinicalNoteComponent,
		AddPatientProblemComponent,
		AddAllergyComponent,
		AddHistoryComponent,
		TimelineComponent,
		RightTabComponent,
		PaymentComponent,
		WalletComponent,
		InsuranceComponent,
		CompanyComponent,
		FamilyComponent,
		PatientPaymentPlanComponent,
		OrderSetComponent,
		EditMedicationComponent,
		EditInvestigationComponent,
		BillInvestigationComponent,
		EditProcedureComponent,
		EditNursingCareComponent,
		EditPhysicianOrderComponent,
		DocSymptomComponent,
		DocDiagnosisComponent,
		OrderBillItemComponent,
		TreatementPlanComponent,
		FluidComponent,
		DocUploadsComponent,
		DocUploadComponent,
		DocUploadDetailComponent,
		PatientVitalsComponent,
		FluidTypeComponent,
		PatientTagsComponent,
		PatientAddTagComponent,
		AddPatientTagsComponent,
		PatientImmunizationComponent,
		VaccineAdministrationComponent,
		VaccineDocumentationComponent,
		PregnancyManagerComponent,
		PatientRegistersComponent,
		PatientLandingBillingComponent,
		BcrAssessmentComponent,
		PrintDocumentationComponent,
		DocUploadViewComponent,
		RightTabTooltipComponent,
		UnknownPatientMergeComponent,
		NewPatientPrescriptionComponent,
		PrescribeDrugComponent,
		//PrescribeDrugNotableComponent,
		PrescriptionHistoryComponent,
		DrugSearchComponent,
		DrugOrdersetComponent
	],
	exports: [
		DrugOrdersetComponent
	],
	imports: [ SharedModule, patientManagerRoutes, OnlyMaterialModule, MaterialModule, ChartsModule, PdfViewerModule ],
	providers: [
		PatientResolverService,
		AppointmentResolverService,
		LoginEmployeeResolverService,
		OrderSetTemplateService,
		TreatmentSheetService,
		FormsService,
		FormTypeService,
		SharedService,
		WorkbenchService,
		LaboratoryRequestService,
		DocumentationTemplateService,
		ScopeLevelService,
		FacilityCompanyCoverService,
		LabEventEmitterService,
		ImmunizationRecordService,
		DrugInteractionService,
		PharmacyEmitterService
	]
})
export class PatientManagerModule {}

