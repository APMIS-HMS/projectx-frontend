import { Component, OnInit, Renderer, ElementRef, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import {
  FacilitiesService
} from '../../../../../services/facility-manager/setup/index';
import { Facility, User, PendingLaboratoryRequest } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.scss']
})
export class ReportDetailComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedInvestigationData: PendingLaboratoryRequest = <PendingLaboratoryRequest>{};

  constructor(
    public facilityService: FacilitiesService,
  ) { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  showImageBrowseDlg(){

  }
  onChange(event){

  }
}
