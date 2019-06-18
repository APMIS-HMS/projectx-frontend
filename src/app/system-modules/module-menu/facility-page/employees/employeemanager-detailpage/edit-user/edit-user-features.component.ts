import { Component, OnInit, Input } from '@angular/core';
import { FeatureModule } from '../../../../../../models/index';
import { FeatureModuleService } from '../../../../../../services/module-manager/setup/index';

@Component({
  selector: 'app-edit-user-features',
  templateUrl: './edit-user-features.component.html',
  styleUrls: ['./edit-user-features.component.scss']
})
export class EditUserFeaturesComponent implements OnInit {
  @Input() selectedFeature: any;
  selectedFeatureModule: FeatureModule;
  constructor(private featureModuleService: FeatureModuleService) { }

  ngOnInit() {
    this.getFeature(this.selectedFeature.feature.featureId);
  }
  getFeature(id: string) {
    this.featureModuleService.get(id, {}).then(payload => {
      this.selectedFeatureModule = payload;
    });
  }

  canAccess(value: any) {
    if (this.selectedFeature.feature.crud !== undefined) {
      let available = this.selectedFeature.feature.crud.filter(x => x === value);
      if (available.length > 0) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
}
