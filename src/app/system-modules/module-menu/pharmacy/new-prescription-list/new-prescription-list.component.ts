import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FacilitiesService,
  PrescriptionService,
  DispenseService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Prescription, PrescriptionItem } from '../../../../models/index';
import { PharmacyEmitterService } from '../../../../services/facility-manager/pharmacy-emitter.service';


@Component({
  selector: 'app-new-prescription-list',
  templateUrl: './new-prescription-list.component.html',
  styleUrls: ['./new-prescription-list.component.scss']
})
export class NewPrescriptionListComponent implements OnInit {
  facility: Facility = <Facility>{};
  prescriptionFormGroup: FormGroup;
  walkinFormGroup: FormGroup;
  status: string[];
  prescriptionLists: any[] = [];
  noPrescriptionLists: any[] = [];
  tempPrescriptionLists: any[] = [];
  loading = true;
  noPresLoading = true;
  currentDate: Date = new Date();
  psearchOpen = false;
  wsearchOpen = false;

  constructor(
    private _fb: FormBuilder,
    private _locker: CoolLocalStorage,
    private _pharmacyEventEmitter: PharmacyEmitterService,
    private _prescriptionService: PrescriptionService,
    private _dispenseService: DispenseService
  ) { }

  ngOnInit() {
    this._pharmacyEventEmitter.setRouteUrl('Prescription List');
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.getAllPrescriptions();
    this.getDispenses();

    this.prescriptionFormGroup = this._fb.group({
      search: [''],
      category: [''],
      date: [this.currentDate]
    });

    this.prescriptionFormGroup.controls['search'].valueChanges.subscribe((val) => {
      const searchText = val;
      const tempArray = [];

      if (val.length > 2) {
        this.loading = true;
        this.prescriptionLists.forEach((element) => {
          if (element.patientName.toLowerCase().includes(searchText.toLowerCase())) {
            tempArray.push(element);
          }
        });

        this.loading = false;
        if (tempArray.length > 0) {
          this.prescriptionLists = tempArray;
        } else {
          this.prescriptionLists = [];
        }
      } else {
        this.prescriptionLists = this.tempPrescriptionLists;
      }
    });
  }


  // Get all drugs from generic
  getAllPrescriptions() {
    this._prescriptionService
      .find({ query: { facilityId: this.facility._id, $sort: { createdAt: -1 } } })
      .then((res) => {
        this.loading = false;
        if (!!res.data && res.data.length > 0) {
          res.data.forEach((element) => {
            if (!element.isDispensed) {
              let isBilledCount = 0;
              const preItemCount = element.prescriptionItems.length;
              element.prescriptionItems.forEach((preItem) => {
                if (preItem.isBilled) {
                  ++isBilledCount;
                }
              });

              if (isBilledCount === preItemCount) {
                element.status = 'Completely';
              } else if (isBilledCount === 0) {
                element.status = 'Not';
              } else {
                element.status = 'Partly';
              }

              this.tempPrescriptionLists.push(element); // temporary variable to search from.
              this.prescriptionLists.push(element);
            }
          });
        }
        //console.log(this.prescriptionLists);
      })
      .catch((err) => { });
  }

  getDispenses() {
    this._dispenseService
      .find({ query: { facilityId: this.facility._id, isPrescription: false } })
      .then((res) => {
        this.noPresLoading = false;
        if (!!res.data && res.data.length > 0) {
          if (res.data.length > 0) {
            this.noPrescriptionLists = res.data;
          } else {
            this.noPrescriptionLists = [];
          }
        }
      })
      .catch((err) => { });
  }

}
