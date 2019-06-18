import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService } from '../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../services/module-manager/setup/index';
import { Location } from '../../../../models/index'
import { Facility, MinorLocation, User } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { WorkbenchService } from '../../../../services/facility-manager/setup/index';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})
export class WorkbenchComponent implements OnInit {
  apmisLookupUrl = '';
  apmisLookupText = '';
  apmisLookupQuery = {};
  apmisLookupDisplayKey = '';
  selectedFacility: Facility = <Facility>{};
  selectedMajorLocation: Location = <Location>{};
  minorLocations: MinorLocation[] = [];
  workbenches: any[] = []
  selectedWorkBench: any = <any>{};
  workbench_view = false;
  Active = true;
  Inactive = false;
  mainErr = true;
  errMsg = 'You have unresolved errors';
  disableBtn = false;
  createWorkbenchBtn = true;
  creatingWorkbenchBtn = false;
  editWorkbenchBtn = false;
  editingWorkbenchBtn = false;
  reqDetail_view = false;
  personAcc_view = false;
  loading: Boolean = true;
  user: User = <User>{};
  public frmNewWorkbench: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private locker: CoolLocalStorage,
    private locationService: LocationService,
    private workBenchService: WorkbenchService,
    private _facilityService: FacilitiesService,
    private _systemModuleService: SystemModuleService
  ) { }

  ngOnInit() {
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
    this.user = <User> this.locker.getObject('auth');
    this.frmNewWorkbench = this.formBuilder.group({
      minorLocation: ['', [Validators.required]],
      benchName: ['', [Validators.required]],
      isActive: [true, [Validators.required]]
    });
    this.getLaboratoryMajorLocation();
    this.getWorkBenches();
  }

  getWorkBenches() {
    const payload = {
      facilityId: this.selectedFacility._id,
      query: { facilityId: this.selectedFacility._id, $limit: 100, $sort: { createdAt: -1 }}
    };
    this.workBenchService.customGet(payload, payload).then(res => {
      this.loading = false;
      if (res.status === 'success') {
        this.workbenches = res.data;
      }
    }).catch(err => {
    });
  }

  getLaboratoryMajorLocation() {
    this.locationService.find({ query: { name: 'Laboratory' } }).then(res => {
      if (res.data.length > 0) {
        this.selectedMajorLocation = res.data[0];
        this.minorLocations = this.selectedFacility.minorLocations.filter(x => x.locationId === this.selectedMajorLocation._id);
      }
    });
  }

  apmisLookupHandleSelectedItem(value) {

  }

  workbench_show() {
    this.workbench_view = !this.workbench_view;
  }

  minorLocationDisplayFn(minor: any) {
    return minor ? minor.name : minor;
  }

  close_onClick(message: boolean): void {

  }

  createWorkbench(valid, value) {
    if (valid) {
      this.disableBtn = true;

      if (this.selectedWorkBench._id === undefined) {
        this.createWorkbenchBtn = false;
        this.creatingWorkbenchBtn = true;

        const workBench = {
          name: value.benchName,
          facilityId: this.selectedFacility._id,
          laboratoryId: value.minorLocation.locationId,
          minorLocationId: value.minorLocation._id
        };

        this.workBenchService.create(workBench).then(payload => {
          this.disableBtn = false;
          this.createWorkbenchBtn = true;
          this.creatingWorkbenchBtn = false;
          this.editWorkbenchBtn = false;
          this.editingWorkbenchBtn = false;
          this._systemModuleService.announceSweetProxy('Workbench has been created successufully!', 'success');
          this.getWorkBenches();
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
          this.selectedWorkBench = <any>{};
        }).catch(err => {
          this.disableBtn = false;
          this.createWorkbenchBtn = true;
          this.creatingWorkbenchBtn = false;
          this.editWorkbenchBtn = false;
          this.editingWorkbenchBtn = false;
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
        });
      } else {
        this.editWorkbenchBtn = false;
        this.editingWorkbenchBtn = true;
        this.selectedWorkBench.name = value.benchName;
        this.selectedWorkBench.minorLocationId = value.minorLocation._id;
        this.selectedWorkBench.isActive = value.isActive;
        this.workBenchService.patch(this.selectedWorkBench._id, this.selectedWorkBench, {}).then(payload => {
          this._systemModuleService.announceSweetProxy('Workbench has been updated successufully!', 'success');
          this.workbench_view = false;
          this.disableBtn = false;
          this.createWorkbenchBtn = true;
          this.creatingWorkbenchBtn = false;
          this.editWorkbenchBtn = false;
          this.editingWorkbenchBtn = false;
          this.selectedWorkBench = <any>{};
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
          this.getWorkBenches();
        }).catch(err => {
          this.disableBtn = false;
          this.createWorkbenchBtn = false;
          this.creatingWorkbenchBtn = false;
          this.editWorkbenchBtn = true;
          this.editingWorkbenchBtn = false;
          this.frmNewWorkbench.reset();
          this.frmNewWorkbench.controls['isActive'].setValue(true);
        });
      }
    } else {
      this._systemModuleService.announceSweetProxy('Some fields are required!', 'error');
    }
  }

  editWorkBench(bench) {
    this.selectedWorkBench = bench;
    this.frmNewWorkbench.controls['benchName'].setValue(this.selectedWorkBench.name);
    this.frmNewWorkbench.controls['minorLocation'].setValue(this.selectedWorkBench.minorLocationId);
    this.frmNewWorkbench.controls['isActive'].setValue(this.selectedWorkBench.isActive);
    this.editWorkbenchBtn = true;
    this.createWorkbenchBtn = false;
    this.workbench_view = true;
  }

  toggleActivate(bench) {
    bench.isActive = !bench.isActive;
    this.selectedWorkBench = bench;
    this.frmNewWorkbench.controls['benchName'].setValue(bench.name);
    this.frmNewWorkbench.controls['minorLocation'].setValue({ _id : bench.minorLocationId });
    this.frmNewWorkbench.controls['isActive'].setValue(bench.isActive);
    this.createWorkbench(this.frmNewWorkbench.valid, this.frmNewWorkbench.value);
  }
}
