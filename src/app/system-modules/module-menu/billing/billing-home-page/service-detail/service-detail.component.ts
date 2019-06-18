import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FacilityServicePrice } from '../../../../../models/index';
import { ServicePriceService, TagService } from '../../../../../services/facility-manager/setup/index';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacilityServicePrice: FacilityServicePrice = <FacilityServicePrice>{};
  constructor(private servicePriceService: ServicePriceService) { }

  ngOnInit() {
  }
  removeTag(modifier) {
    this.selectedFacilityServicePrice.modifiers.forEach((item, i) => {
      if (item.tagId == modifier.tagId) {
        this.selectedFacilityServicePrice.modifiers.splice(i);
      }
    });
    this.servicePriceService.update(this.selectedFacilityServicePrice).then(payload => {
    });
  }
  close_onClick(event) {
    this.closeModal.emit(true);
  }

}
