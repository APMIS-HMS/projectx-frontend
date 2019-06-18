import { CanActivateViaAuthGuardCompleteFacilityService } from './../../../services/facility-manager/setup/can-activate-via-auth-guard-complete-facility.service';
import { GenerateUserComponent } from "./employees/employeemanager-detailpage/generate-user/generate-user.component";
import { EmpmanagerDetailpageComponent } from "./employees/employeemanager-detailpage/empmanager-detailpage.component";
import { EmployeesResolverService } from "./../../../resolvers/module-menu/employees-resolver.service";
import { RouterModule, Routes } from "@angular/router";
import { FacilityPageHomeComponent } from "./facility-page-home.component";
import { FacilitypageModulespageComponent } from "./facilitypage-modulespage/facilitypage-modulespage.component";
import { FacilitypageDepartmentspageComponent } from "./facilitypage-departmentspage/facilitypage-departmentspage.component";
import { FacilitypageLocationspageComponent } from "./facilitypage-locationspage/facilitypage-locationspage.component";
import { FacilitypageWorkspaceComponent } from "./facilitypage-workspace/facilitypage-workspace.component";
import { FacilityOptionsComponent } from "./facility-options/facility-options.component";
import { ProfessionComponent } from "./profession/profession.component";
import { FacilityNetworkComponent } from "./facility-network/facility-network.component";
import { AccessRoleDetailsComponent } from "./facility-access-control/access-role-details/access-role-details.component";
import {
  WorkspaceResolverService,
  FacilityResolverService,
  SystemModulesResolverService,
  LocationsResolverService
} from "../../../resolvers/module-menu/index";
import { FacilitypageHomepageComponent } from "./facilitypage-homepage/facilitypage-homepage.component";
import { EmpManagerComponent } from "./employees/emp-manager.component";
import { EditUserComponent } from "./employees/employeemanager-detailpage/edit-user/edit-user.component";
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

const FACLITYPAGE_ROUTES: Routes = [
  {
    path: "",
    component: FacilityPageHomeComponent,
    children: [
      {
        path: "",
        component: FacilitypageLocationspageComponent,
        resolve: { locations: LocationsResolverService }
      },
      // { path: 'facility', component: FacilitypageHomepageComponent },
      // {
      //     path: 'modules', component: FacilitypageModulespageComponent, resolve: {
      //         systemModules: SystemModulesResolverService,
      //         facility: FacilityResolverService
      //     }
      // },
      {
        path: "employees",
        component: EmpManagerComponent,
        resolve: { employees: EmployeesResolverService },
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "employees/:id",
        component: EmpmanagerDetailpageComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "edit-user",
        component: EditUserComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "edit-user/:id/:personId/:empId",
        component: EditUserComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      { path: "generate-user", component: GenerateUserComponent },
      { path: "generate-user/:id/:empId", component: GenerateUserComponent },
      {
        path: "locations",
        component: FacilitypageLocationspageComponent,
        resolve: { locations: LocationsResolverService },
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "workspaces",
        component: FacilitypageWorkspaceComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "departments",
        component: FacilitypageDepartmentspageComponent,
        resolve: { facility: FacilityResolverService },
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      { path: "options", component: FacilityOptionsComponent },
      { path: "profession", component: ProfessionComponent },
      {
        path: "subsribtion",
        component: FacilitypageModulespageComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "network",
        component: FacilityNetworkComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "access",
        component: AccessRoleDetailsComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      },
      {
        path: "patient-bulk-upload",
        component: BulkUploadComponent,
        canActivate: [CanActivateViaAuthGuardCompleteFacilityService]
      }
    ]
  }
]; 

export const facilityPageRoutes = RouterModule.forChild(FACLITYPAGE_ROUTES);
