import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { UserService } from '../../../services/facility-manager/setup/index';
@Component({
  selector: 'app-logout-confirm',
  templateUrl: './logout-confirm.component.html',
  styleUrls: ['./logout-confirm.component.scss']
})
export class LogoutConfirmComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  modal_on = false; 

  constructor(private userService: UserService, private authFacadeService:AuthFacadeService) { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  logout() {
    this.userService.logOut();
    this.authFacadeService.setLogingEmployee(undefined);
    this.authFacadeService.setLoginUser(undefined);
    this.authFacadeService.setSelectedFacility(undefined);
    this.authFacadeService.access = undefined;
    this.userService.announceMission('out');
    this.userService.isLoggedIn = false;
  }

}
