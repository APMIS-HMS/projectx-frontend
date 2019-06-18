import { OnlyMaterialModule } from './../../../shared-common-modules/only-material-module';
import { AccessManagerHomeComponent } from './facility-access-control/access-manager-home.component';
import { NewFacEmployeeComponent } from './employees/new-fac-employee/new-fac-employee.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ApmisCheckboxFeatureComponent } from './employees/employeemanager-detailpage/apmis-checkbox/apmis-checkbox-feature.component';
import { ApmisCheckboxComponent } from './employees/employeemanager-detailpage/apmis-checkbox/apmis-checkbox.component';
import { EditUserAccessControlComponent } from './employees/employeemanager-detailpage/edit-user/edit-user-access-control.component';
import { EditEmpBasicComponent } from './employees/employeemanager-detailpage/edit-emp-basic/edit-emp-basic.component';
import { EmpmanagerHomepageComponent } from './employees/empmanager-homepage/empmanager-homepage.component';
import { NgModule, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { facilityPageRoutes } from './facility-page.routes';
import { FacilityPageHomeComponent } from './facility-page-home.component';


import { FacilitypageHomepageComponent } from './facilitypage-homepage/facilitypage-homepage.component';
import { FacilitypageDepartmentspageComponent } from './facilitypage-departmentspage/facilitypage-departmentspage.component';
import { FacilitypageModulespageComponent } from './facilitypage-modulespage/facilitypage-modulespage.component';
import { FacilitypageLocationspageComponent } from './facilitypage-locationspage/facilitypage-locationspage.component';

import { NewDepartmentComponent } from './facilitypage-departmentspage/new-department/new-department.component';
import { NewUnitComponent } from './facilitypage-departmentspage/new-unit/new-unit.component';
import { NewSubLocationComponent } from './facilitypage-locationspage/new-sub-location/new-sub-location.component';
import { UnitComponentComponent } from './facilitypage-departmentspage/unit-component/unit-component.component';
import { SubLocationComponent } from './facilitypage-locationspage/sub-location/sub-location.component';
import { FacilityOptionsComponent } from './facility-options/facility-options.component';
import { FacilitypageWorkspaceComponent } from './facilitypage-workspace/facilitypage-workspace.component';
import { SharedModule } from '../../../shared-module/shared.module';
import {
    WorkspaceResolverService, SystemModulesResolverService, FacilityResolverService,
    LocationsResolverService,
    EmployeesResolverService
} from '../../../resolvers/module-menu/index';
import { ProfessionComponent } from './profession/profession.component';
import { AddProfessionComponent } from './profession/add-profession/add-profession.component';
import { FacilityPageComponent } from './facility-page.component';
import { MaterialModule } from '../../../shared-common-modules/material-module';
import { Ng4GeoautocompleteModule } from 'ng4-geoautocomplete';
import { FacilityBasicinfoEditComponent } from './facility-basicinfo-edit/facility-basicinfo-edit.component';
import { FacilitypageSidesectComponent } from './facilitypage-sidesect/facilitypage-sidesect.component';
import { EmpManagerComponent } from './employees/emp-manager.component';
import { EmpmanagerDetailpageComponent } from './employees/employeemanager-detailpage/empmanager-detailpage.component';
import { EmpAssignUnitComponent } from './employees/emp-assign-unit/emp-assign-unit.component';
import { EditUserComponent } from './employees/employeemanager-detailpage/edit-user/edit-user.component';
import { EmployeeLookupComponent } from './employees/employeemanager-detailpage/employee-lookup/employee-lookup.component';
import { EditUserFeaturesComponent } from './employees/employeemanager-detailpage/edit-user/edit-user-features.component';
import { GenerateUserComponent } from './employees/employeemanager-detailpage/generate-user/generate-user.component';
import { ApmisCheckboxChildComponent } from './employees/employeemanager-detailpage/apmis-checkbox/apmis-checkbox-child.component';
import { FacilityNetworkComponent } from './facility-network/facility-network.component';
import { AddMemberComponent } from './facility-network/add-member/add-member.component';
import { AddOtherComponent } from './facility-network/add-other/add-other.component';
import { EmployeeAccessRolesComponent } from './employees/employeemanager-detailpage/employee-access-roles/employee-access-roles.component';
import { AccessManagerComponent } from './facility-access-control/access-manager.component';
import { AccessRoleDetailsComponent } from './facility-access-control/access-role-details/access-role-details.component';
import { CreateAccessComponent } from './facility-access-control/create-access/create-access.component';
import { ViewAccessComponent } from './facility-access-control/view-access/view-access.component';

import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';

import { from } from 'rxjs/observable/from';
import { SubscribtionComponent } from './facilitypage-modulespage/subscribtion/subscribtion.component';


@NgModule({
    declarations: [
        FacilityPageHomeComponent,
        FacilitypageHomepageComponent,
        FacilitypageDepartmentspageComponent,
        FacilitypageModulespageComponent,
        FacilitypageLocationspageComponent,
        NewDepartmentComponent,
        NewUnitComponent,
        NewSubLocationComponent,
        UnitComponentComponent,
        SubLocationComponent,
        FacilityOptionsComponent,
        FacilitypageWorkspaceComponent,
        ProfessionComponent,
        AddProfessionComponent,
        FacilityPageComponent,
        FacilityBasicinfoEditComponent,
        FacilitypageSidesectComponent,
        EmpmanagerHomepageComponent,
        EmpManagerComponent,
        EmpmanagerDetailpageComponent,
        EmpAssignUnitComponent,
        EditEmpBasicComponent,
        EditUserComponent,
        EmployeeLookupComponent,
        EditUserAccessControlComponent,
        EditUserFeaturesComponent,
        GenerateUserComponent,
        ApmisCheckboxComponent,
        ApmisCheckboxFeatureComponent,
        ApmisCheckboxChildComponent,
        FacilityNetworkComponent,
        AddMemberComponent,
        AddOtherComponent,
        NewFacEmployeeComponent,
        EmployeeAccessRolesComponent,
        AccessManagerComponent, AccessRoleDetailsComponent, CreateAccessComponent, ViewAccessComponent,
        AccessManagerHomeComponent,
        BulkUploadComponent,
        SubscribtionComponent
    ],
    exports: [
    ],
    imports: [
        facilityPageRoutes,
        OnlyMaterialModule,
        MaterialModule,
        Ng4GeoautocompleteModule,
        SweetAlert2Module
    ],
    providers: [
        WorkspaceResolverService, LocationsResolverService,
        SystemModulesResolverService, FacilityResolverService, EmployeesResolverService
    ]
})
export class FacilityPageModule { }



