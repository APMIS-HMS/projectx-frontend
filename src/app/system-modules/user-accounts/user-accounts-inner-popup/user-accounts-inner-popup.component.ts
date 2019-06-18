import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { UserService, EmployeeService, PatientService } from '../../../services/facility-manager/setup/index';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-user-accounts-inner-popup',
  templateUrl: './user-accounts-inner-popup.component.html',
  styleUrls: ['./user-accounts-inner-popup.component.scss']
})
export class UserAccountsInnerPopupComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacility: any;
  @Input() loginEmployee: any;

  selectedPatient: any = <any>{};
  isPatient = false;
  hasReturned = false;

  constructor(private router: Router, private locker: CoolLocalStorage,
    private employeeService: EmployeeService, private patientService: PatientService,
    private userService: UserService) { }

  ngOnInit() {
    const auth: any = this.locker.getObject('auth');
    this.patientService.find({ query: { personId: auth.data.personId, facilityId: this.selectedFacility._id } }).then(payload => {
      if (payload.data.length > 0) {
        this.selectedPatient = payload.data[0];
        this.isPatient = true;
      }
      this.hasReturned = true;
    });
  }

  close_onClick(event) {
    this.closeModal.emit(true);
  }
  isEmployeeInFacility() {
    if (this.loginEmployee === undefined) {
      return false;
    } else {
      return true;
    }
  }
  isPatientInFacility() {
    return this.isPatient;
  }
  loadEmployeeRecord() {
    this.locker.setObject('selectedFacility', this.selectedFacility);
    this.router.navigate(['dashboard']).then(() => {
      this.userService.announceMission('in');
    });
  }
  loadPatientRecord() {
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', this.selectedPatient.personId]).then(() => {
      this.patientService.announcePatient(this.selectedPatient);
    })
  }
}
