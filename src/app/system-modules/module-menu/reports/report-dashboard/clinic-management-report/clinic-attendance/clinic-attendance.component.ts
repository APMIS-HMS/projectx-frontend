import { ClinicTabGroup, AppointmentReportStatus, AppointmentSearchCriteria,
    ClinicAttendance, AppointmentReport } from './../../../../../../models/reports/clinic-attendance';
import { AppointmentReportService } from './../../../../../../services/reports/clinic-manager/appointment-report.service';
import { Component, OnInit } from '@angular/core';
import { ClinicAttendanceReportService } from 'app/services/reports';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Facility } from 'app/models';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';
import { IDateRange } from 'ng-pick-daterange';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clinic-attendance',
  templateUrl: './clinic-attendance.component.html',
  styleUrls: ['./clinic-attendance.component.scss']
})
export class ClinicAttendanceComponent implements OnInit {

  isClinicAttendanceLoading = true;
  isAppointmentLoading = true;
  currentFacility: Facility = <Facility>{};
  fileteredAppointments: AppointmentReport[] = [];
  dateRange: any;
  filteredAttendance: ClinicAttendance[] = [];
  totalNewAppointment = 0;
  totalFollowUpAppointment = 0;
  searchCriteriaOptions = [];
  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  activeTabIndex: number;
  appointmentStatus = [];
  selectedSearchCriteria = '';
  searchedProvider = '';
  searchedPatient = '';
  selectedStatus = '';
  providerName: string;
  patientName: string;
  disabled: boolean;



  constructor(private clinicAttendance: ClinicAttendanceReportService,
    private locker: CoolLocalStorage, private systemModuleService: SystemModuleService,
    private appointmentService: AppointmentReportService) {
      this.activeTabIndex = 0;
    }
    ngOnInit() {
      this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
      this.appointmentStatus = this.getObjeckKeys(AppointmentReportStatus);
      this.searchCriteriaOptions = this.getObjeckKeys(AppointmentSearchCriteria);
      this.initialiseDateRange();
      this.loadActiveTabIndexData();

      // TODO:: disable searchControl on component init;
      //        enable only when search criteria is enabled

      // search filter is performed based on the search criteria selected by the user
      // searchCriterias = ['By Provider' | 'By Patient | 'By All']

      this.searchControl.valueChanges.debounceTime(200).distinctUntilChanged().subscribe(val => {
        switch (this.selectedSearchCriteria) {
          case AppointmentSearchCriteria.ByProvider:
            if (this.searchControl.value.length > 3) {
              this.providerName = val;
              this.patientName = '';
              this.getFacilityAppointmentsByParams();
            } else if (this.searchControl.value.length < 1) {
              this.getFacilityAppointmentsByParams();
            }
            break;
          case AppointmentSearchCriteria.ByPatient:
            if (this.searchControl.value.length > 3) {
              this.patientName = val;
              this.providerName = '';
              this.getFacilityAppointmentsByParams();
            } else if (this.searchControl.value.length < 1) {
              this.getFacilityAppointmentsByParams();
            }
            break;
          default:
            this.patientName = '';
            this.providerName = '';
            this.getFacilityAppointmentsByParams();
            break;
        }
      });
    }

    // we set default dateRange to current date for filter selection
    // without date selection
    initialiseDateRange() {
      if (this.dateRange === undefined) {
        this.dateRange = {
          from: new Date(),
          to: new Date()
          };
      }
    }
    setSearchFilter(data) {
      this.selectedSearchCriteria = data;
      this.searchControl.setValue('');
   }

   loadActiveTabIndexData() {
    if (this.activeTabIndex === ClinicTabGroup.AppointmentReport) {
        this.getFacilityAppointmentsByParams();
    } else if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
        this.getFacilityAttendanceByParams();
    }
   }
   getObjeckKeys(obj) {
     return Object.keys(obj).map(val => obj[val]);
   }
   setFilterByDateRange(dateRange: IDateRange): any {
    this.dateRange = dateRange;
		if (dateRange !== null) {
      if (this.activeTabIndex === ClinicTabGroup.ClinicAttendance) {
          this.getFacilityAttendanceByParams();
      } else if (this.activeTabIndex === ClinicTabGroup.AppointmentReport) {
        this.isAppointmentLoading = true;
        this.getFacilityAttendanceByParams();
      }
		}
  }
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
    this.loadActiveTabIndexData();
  }
  private getFacilityAttendanceByParams() {
    this.isClinicAttendanceLoading = true;
    this.clinicAttendance.find({
      query: {
        facilityId: this.currentFacility._id,
        startDate: this.dateRange.from,
        endDate: this.dateRange.to
      }
    }).then(payload => {
      this.filteredAttendance = payload.data;
      this.calculateGrandTotal(this.filteredAttendance);
      this.isClinicAttendanceLoading = false;
    });
  }
  private getFacilityAppointmentsByParams() {
    this.isAppointmentLoading = true;
    this.appointmentService.find({
      query: {
          facilityId: this.currentFacility._id,
          providerName: this.providerName,
          patientName: this.patientName,
          startDate: this.dateRange.from,
          endDate: this.dateRange.to,
          status: this.selectedStatus === 'All' ? '' : this.selectedStatus
      }
    }).then(payload => {
        this.fileteredAppointments = payload.data;
        this.isAppointmentLoading = false;
    });
  }
  onStatusChanged(selectedStatus) {
    this.selectedStatus = selectedStatus;
    this.isAppointmentLoading = true;
    this.getFacilityAppointmentsByParams();
  }

  calculateGrandTotal(data) {
    if (data !== undefined || data !== null) {
      const newAppointmentSum = [];
      const followUpAppointmentSum = [];
      data.forEach(item => {
        newAppointmentSum.push(item.new.totalMale + item.new.totalFemale);
        followUpAppointmentSum.push(item.followUp.totalMale + item.followUp.totalFemale);
      });
      this.totalNewAppointment = newAppointmentSum.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
      this.totalFollowUpAppointment = followUpAppointmentSum.reduce((totalSum, nextVal) => totalSum + nextVal, 0);
    }
  }
}
