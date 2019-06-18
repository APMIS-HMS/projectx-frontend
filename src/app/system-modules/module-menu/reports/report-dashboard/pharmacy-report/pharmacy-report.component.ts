import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { IDateRange } from 'ng-pick-daterange';
import { PharmacyTabGroup } from 'app/models/reports/pharmacy-report';
import { Facility } from 'app/models';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DispenseReportService } from 'app/services/reports';
import { PrescriptionService } from 'app/services/facility-manager/setup';


@Component({
  selector: 'app-pharmacy-report',
  templateUrl: './pharmacy-report.component.html',
  styleUrls: ['./pharmacy-report.component.scss']
})
export class PharmacyReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');

  prescriberFilter = false;
  prescriberSearch = false;
  dispenseFilter = false;

  pageInView = 'Pharmacy Report';
  dateRange: any;
  activeTabIndex: number;
  currentFacility: Facility = <Facility>{};
  dispenses;
  prescriptions;
  isDispenseLoading = true;
  isPrescriptionLoading = true;

  constructor(private _router: Router, private locker: CoolLocalStorage, private dispenseService: DispenseReportService,
      private prescriptionService: PrescriptionService) { }

  ngOnInit() {
    this.dispenseFilter = true;
    this.activeTabIndex = 0;
    this.currentFacility = <Facility>this.locker.getObject('selectedFacility');
    this.initialiseDateRange();
    this.getFacilityDispenseList();
    this.getFacilityPrescriptionList();
  }

  pageInViewLoader(title) {
		this.pageInView = title;
  }
  back_dashboard() {
		this._router.navigate(['/dashboard/reports/report-dashboard']);
	  }

onclick_prescribe() {
  this.prescriberFilter = true;
  this.dispenseFilter = false;
}

onclick_dispense() {
  this.prescriberFilter = false;
  this.dispenseFilter = true;
  }

  initialiseDateRange() {
    if (this.dateRange === undefined) {
      this.dateRange = {
        from: new Date(),
        to: new Date()
        };
    }
  }
  setFilterByDateRange(dateRange: IDateRange): any {
    this.dateRange = dateRange;
		if (dateRange !== null) {
      if (this.activeTabIndex === PharmacyTabGroup.Prescription) {

      } else if (this.activeTabIndex === PharmacyTabGroup.Dispense) {

      }
    } else { }
  }
  onTabClick(tabIndex) {
    this.activeTabIndex = tabIndex;
    this.prescriberFilter = false;
    this.dispenseFilter = true;
  }

  getFacilityDispenseList() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== undefined) {
      this.isDispenseLoading = true;
        this.dispenseService.find({
          query: {
            facilityId: this.currentFacility._id
          }
        }).then(payload => {
          this.dispenses = payload;
          this.isDispenseLoading = false;
        });
    }
  }

  getFacilityPrescriptionList() {
    if (this.currentFacility !== undefined || this.currentFacility._id !== undefined) {
      this.isPrescriptionLoading = true;
      this.prescriptionService.find( {
        query: {
          facilityId: this.currentFacility._id
        }
      }).then(payload => {
        this.prescriptions = payload;
      });
    }
  }

}
