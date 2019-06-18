import { Component, OnInit, Input } from '@angular/core';
import { AccessControl, User, Feature } from '../../../../../../models/index';
import { AccessControlService, UserService } from '../../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-edit-user-access-control',
  templateUrl: './edit-user-access-control.component.html',
  styleUrls: ['./edit-user-access-control.component.scss']
})
export class EditUserAccessControlComponent implements OnInit {
  @Input() selectedAccessControl: string;
  @Input() selectedUser: User;
  selectedAccessControlObject: AccessControl;
  selectedFeatures: Feature[];
  constructor(private accessControlService: AccessControlService,
    private userService: UserService) { }

  ngOnInit() {
    // if (this.selectedRole.feature !== undefined) {
    //   let feature = this.selectedRole.feature;
    //   this.getAccessControl(feature.accessControlId, feature.featureId);
    // }
    this.getUser(this.selectedAccessControl, this.selectedUser);
    this.getAccessControl(this.selectedAccessControl);
  }
  getUser(id: string, user: User) {
    this.userService.find({
      query: {
        'facilitiesRole.feature.accessControlId': id, _id: this.selectedUser._id,
        '$select': ['facilitiesRole.feature']
      }
    })
      .then((payload: any) => {
        this.selectedFeatures = payload.data[0].facilitiesRole.filter(x => x.feature.accessControlId === id);
      });
  }
  getAccessControl(id: string) {
    this.accessControlService.get(id, {}).then(payload => {
      this.selectedAccessControlObject = payload;
    });
  }

}
