import { Component, OnInit, Input } from '@angular/core';
import { FacilitiesService, CorporateFacilityService } from '../../../services/facility-manager/setup/index';
import { Facility } from '../../../models/index';
@Component({
  selector: 'app-facility-listing',
  templateUrl: './facility-listing.component.html',
  styleUrls: ['./facility-listing.component.scss']
})
export class FacilityListingComponent implements OnInit {
  @Input() selectedFacility = <any>{};
  state = '';
  constructor(public facilityService: FacilitiesService) { }

  ngOnInit() {
    if (this.selectedFacility !== undefined) {
      this.state = this.selectedFacility.state;
    }
  }

}
