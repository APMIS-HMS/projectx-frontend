import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Facility, Patient } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { PatientService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-unknown-patient-merge',
  templateUrl: './unknown-patient-merge.component.html',
  styleUrls: ['./unknown-patient-merge.component.scss']
})
export class UnknownPatientMergeComponent implements OnInit {
  @Input() selectedPatient: any;
  @Output() personValueChanged = new EventEmitter();
  formPatientSearch = new FormControl();
  selectedFacility: Facility = <Facility>{};
  incomingPatient: Patient = <Patient>{};
  apmisLookupUrl = 'patient-search';
  apmisLookupText = '';
  apmisLookupQuery: any = {};
  apmisLookupDisplayKey = 'personDetails.firstName';
  apmisLookupImgKey = 'personDetails.profileImageObject.thumbnail';
  apmisLookupOtherKeys = [
    'personDetails.lastName',
    'personDetails.firstName',
    'personDetails.apmisId',
    'personDetails.email'
  ];


  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private locker: CoolLocalStorage,
    private _systemModuleService: SystemModuleService,
    private router: Router,
    private patientService: PatientService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.formPatientSearch.valueChanges.subscribe((value) => {
      this.apmisLookupQuery = {
        facilityId: this.selectedFacility._id,
        searchText: value
      };
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  apmisLookupHandleSelectedItem(value) {
    this.apmisLookupText = `${value.personDetails.firstName} ${value.personDetails.lastName}` + ' (' + value.personDetails.apmisId + ')';
    this.incomingPatient = value;
  }

  navEpDetail(value) {
    this.locker.setObject('patient', value);
    this.router.navigate(['/dashboard/patient-manager/patient-manager-detail', value.personId]).then(() => {
      this.personValueChanged.emit(this.selectedPatient);
    }).catch(err => {
    });
}

  onMergePatient() {
    this._systemModuleService.on();
    this.patientService.mergeUnknowPatient(this.selectedPatient._id,{query:{
      unknownPersonId: this.selectedPatient.personId,
      verifiedPersonId: this.incomingPatient.personId,
      verifiedPatientId: this.incomingPatient._id,
      facilityId: this.selectedFacility._id
    }}).then(payload => {
      this.navEpDetail(payload.data)
      this._systemModuleService.off();
    }, err => {
      this._systemModuleService.off();
    });
  }
}
