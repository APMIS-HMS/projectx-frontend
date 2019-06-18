import { Component, OnInit, Input } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  Facility, User
} from '../../../../../models/index';
import {
  FacilitiesService, TimeLineService
} from './../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {
  @Input() patient;
  selectedFacility: Facility = <Facility>{};
  user: User = <User>{};
  timeLineLists = [];
  addProblem_view = false;
  addAllergy_view = false;
  addHistory_view = false;
  addVitals_view = false;
  docDetail_view = false;

  constructor(private _timeLineService: TimeLineService,
    private locker: CoolLocalStorage,
    private facilitiesService: FacilitiesService) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User>this.locker.getObject('auth');
    this.getTimeLines();
  }

  getTimeLines() {
    this._timeLineService.find({
      query: {
        patientId: this.patient._id,
        facilityId: this.selectedFacility._id
      }
    }).then((payload: any) => {
      this.timeLineLists = payload.data;
    }).catch(err => {
    })
  }

  addProblem_show(e) {
    this.addProblem_view = true;
  }
  addAllergy_show(e) {
    this.addAllergy_view = true;
  }
  addHistory_show(e) {
    this.addHistory_view = true;
  }
  addVitals_show(e) {
    this.addVitals_view = true;
  }

  close_onClick(message: boolean): void {
    this.addProblem_view = false;
    this.addAllergy_view = false;
    this.addHistory_view = false;
    this.addVitals_view = false;
  }

}
