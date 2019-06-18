import { CoolLocalStorage } from 'angular2-cool-storage';
import { FacilitiesService } from './../../../../services/facility-manager/setup/facility.service';
import { Facility } from './../../../../models/facility-manager/setup/facility';
import { Component, OnInit, Input } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Component({
  selector: 'app-facilitypage-sidesect',
  templateUrl: './facilitypage-sidesect.component.html',
  styleUrls: ['./facilitypage-sidesect.component.scss']
})
export class FacilitypageSidesectComponent implements OnInit {
  @Input() selectedFacility: any = <any>{};
  editBasicInfo = false;
  membersOf = [];
  memberFacilities: any = [];

  empContentArea: boolean;
  loadIndicatorVisible = false;
  contentSecMenuShow = false;
  pageInView = 'Facility';
  homeContentArea = false;
  modulesContentArea = false;
  contentSecMenuToggle = false;
  optionsContentArea = false;
  departmentsContentArea = false;
  locationsContentArea = false;
  workspaceContentArea = false;
  professionContentArea = false;
  dashboardContentArea = false;
  networkContentArea = false;

  pgMenuToggle = false;

  constructor(private facilityService: FacilitiesService,
    private locker: CoolLocalStorage,
    private router: Router) {
    this.facilityService.patchListner.subscribe(payload => {
      this.selectedFacility = payload;
      this.locker.setObject('selectedFacility', payload);
      this.ngOnInit();
    });

this.facilityService.listner.subscribe(payload =>{
});

    this.facilityService.popUpEditFacility$.subscribe(payload => {
      this.editBasicInfo_onClick();
    })
  }

  ngOnInit() {
    this.getNetworkMembers(false);
    this.getNetworkMembers(true);
  }

  close_onClick(e) {
    this.editBasicInfo = false;
  }
  editBasicInfo_onClick() {
    this.editBasicInfo = true;
  }

  getNetworkMembers(isMemberOf) {
    this.facilityService.getNetwork(this.selectedFacility._id, isMemberOf).then((payload: any) => {
      if (isMemberOf) {
        this.membersOf = payload;
      } else {
        this.memberFacilities = payload;
      }
    }, error => {
    });
  }

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/facility/' + value]);
    this.pgMenuToggle = false;
    if (value === '') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'employees') {
      this.empContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.networkContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'departments') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = true;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'locations') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = true;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'workspaces') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = true;
      this.professionContentArea = false;
      this.empContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'options') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = true;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'profession') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = true;
      this.empContentArea = false;
      this.networkContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'modules') {
      this.modulesContentArea = true;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = false;
      // this.dashboardContentArea = false;
    } else if (value === 'network') {
      this.modulesContentArea = false;
      // this.contentSecMenuToggle = false;
      this.optionsContentArea = false;
      this.departmentsContentArea = false;
      this.locationsContentArea = false;
      this.workspaceContentArea = false;
      this.professionContentArea = false;
      this.empContentArea = false;
      this.networkContentArea = true;
      // this.dashboardContentArea = false;
    }
  }

}
