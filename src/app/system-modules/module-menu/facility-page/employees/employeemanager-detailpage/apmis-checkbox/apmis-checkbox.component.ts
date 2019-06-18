import { Component, OnInit, Input } from '@angular/core';
import { FeatureModuleViewModel, AccessControl, Facility } from '../../../../../../models/index';
import { FeatureModuleService } from '../../../../../../services/module-manager/setup/index';
import { AccessControlService } from '../../../../../../services/facility-manager/setup/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
@Component({
  selector: 'app-apmis-checkbox',
  templateUrl: './apmis-checkbox.component.html',
  styleUrls: ['./apmis-checkbox.component.scss']
})
export class ApmisCheckboxComponent implements OnInit {
  selectedFacility: Facility = <Facility>{};
  @Input() selectedFeature = <FeatureModuleViewModel>{};
  @Input() selectedAccessControl = <AccessControl>{};
  @Input() feature;
  accessControlList: AccessControl[] = [];
  expand = false;
  expandMain = false;
  @Input() cruds: any[] = [];
  constructor(private featureModuleService: FeatureModuleService,
    private locker: CoolLocalStorage,
    private accessControlService: AccessControlService) { }

  ngOnInit() {
    this.selectedFacility =  <Facility> this.locker.getObject('selectedFacility');
    // this.getAccessList();
  }
  getAccessList() {
    this.accessControlService.find({ query: { facilityId: this.selectedFacility._id } }).then(payload => {
      this.accessControlList = payload.data;
      if (this.accessControlList.length > 0) {
        this.selectedAccessControl = this.accessControlList[0];
      }
    });
  }
  clicMe(value: any) {
    this.selectedFeature = value;
  }
  checked(e, item: any) {
    if (e.target.checked && item._id === this.selectedFeature._id && this.selectedFeature.checked) {
      this.expand = true;
    } else {
      this.expand = false;
    }
  }
  checkedMain(e) {
    if (e.target.checked) {
      this.expandMain = true;
    } else {
      this.expandMain = false;
    }
  }
}
