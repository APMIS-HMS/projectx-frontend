import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, UserService } from '../../../../services/facility-manager/setup/index';
import { Facility, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router } from '@angular/router';


@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AccessManagerComponent implements OnInit {

  accessUsers = true;
  

  searchControl = new FormControl();


  innerMenuShow = false;
  selectedFacility: Facility = <Facility>{};
  users: any[] = [];
  patients: any[] = [];

  pageSize = 1;
  limit = 100;

  constructor(private locker: CoolLocalStorage, private router: Router,
    public facilityService: FacilitiesService,
    private userService: UserService) { }

  ngOnInit() {
    this.selectedFacility = <Facility> this.locker.getObject('selectedFacility');
    this.getUsers(this.limit);
  }
  getUsers(limit) {
    const facilityId = this.selectedFacility._id;
    this.userService.find({query: { 'facilitiesRole.facilityId': facilityId } }).then(payload => {
      this.users = payload.data;
    });
  }
  edit(item: any) {
    this.router.navigate(['/dashboard/employee-manager/generate-user', item.person._id]);
  }
  empDetail(val: any) {
    this.router.navigate(['/dashboard/employee-manager/employee-manager-detail', val.personId]);
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id !== 'submenu_ico') {
      this.innerMenuShow = false;
    }
  }
  styleUsers() {
    this.accessUsers = true;
  }
}
