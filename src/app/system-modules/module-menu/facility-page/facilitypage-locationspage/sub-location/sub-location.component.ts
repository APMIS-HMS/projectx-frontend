import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FacilitiesService, FacilityModuleService } from '../../../../../services/facility-manager/setup/index';
import { LocationService } from '../../../../../services/module-manager/setup/index';
import { FacilityModule, Facility, Location, MinorLocation } from '../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-sub-location',
  templateUrl: './sub-location.component.html',
  styleUrls: ['./sub-location.component.scss']
})
export class SubLocationComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();

  @Input() minorLocation: MinorLocation;
  @Input() location: Location;
  @Input() facility: Facility;

  modal_on = false;
  newLocationModal_on = false;
  newSubLocModal_on = false;

  innerMenuShow = false;

  //Department icons nav switches
  locationHomeContentArea = true;
  locationDetailContentArea = false;

  //Department list fields edit icon states
  locationEditNameIcoShow = false;
  locationEditShortNameIcoShow = false;
  locationEditDescIcoShow = false;

  sublocEditNameIcoShow = false;
  sublocEditShortNameIcoShow = false;
  sublocEditDescIcoShow = false;

  locationNameEdit = new FormControl();
  locationshortNameEdit = new FormControl();
  locationDescEdit = new FormControl();

  sublocNameEdit = new FormControl();
  sublocshortNameEdit = new FormControl();
  sublocDescEdit = new FormControl();

  constructor(private locationService: LocationService,
    public facilityService: FacilitiesService,
    private locker: CoolLocalStorage) { }

  ngOnInit() {
    this.pageInView.emit('Locations');
    this.sublocshortNameEdit.setValue(this.minorLocation.shortName);
    this.sublocNameEdit.setValue(this.minorLocation.name);
    this.sublocDescEdit.setValue(this.minorLocation.description);
  }
  updateMinorLocationProperties(prop: any, value: any) {
    this.minorLocation[prop] = value;
    let minorLocation = this.minorLocation;
    let id = this.minorLocation._id;
    this.facility.minorLocations.forEach((item, i) => {
      if (item._id == id) {
        item = minorLocation;
      }
    })
    this.facilityService.update(this.facility).then(payload => {
      this.facility = payload;
      this.locker.setObject('facility', this.facility);
    })
  }

  locationDetailContentArea_show(model: Location) {
    this.locationHomeContentArea = false;
    this.locationDetailContentArea = true;
    this.innerMenuShow = false;
    this.location = model;
  }
  locationHomeContentArea_show() {
    this.locationHomeContentArea = true;
    this.locationDetailContentArea = false;
    this.innerMenuShow = false;
  }

  locationEditNameToggle() {
    this.locationEditNameIcoShow = !this.locationEditNameIcoShow;
  }
  locationEditShortNameToggle() {
    this.locationEditShortNameIcoShow = !this.locationEditShortNameIcoShow;
  }
  locationEditDescToggle() {
    this.locationEditDescIcoShow = !this.locationEditDescIcoShow;
  }

  sublocEditNameToggle() {
    this.sublocEditNameIcoShow = !this.sublocEditNameIcoShow;
  }

  sublocEditNameSubmit() {
    this.sublocEditNameIcoShow = !this.sublocEditNameIcoShow;
    this.updateMinorLocationProperties("name", this.sublocNameEdit.value);
  }
  sublocEditShortNameToggle() {
    this.sublocEditShortNameIcoShow = !this.sublocEditShortNameIcoShow;
  }
  sublocEditShortNameSubmit() {
    this.sublocEditShortNameIcoShow = !this.sublocEditShortNameIcoShow;
    this.updateMinorLocationProperties("shortName", this.sublocshortNameEdit.value);
  }
  sublocEditDescToggle() {
    this.sublocEditDescIcoShow = !this.sublocEditDescIcoShow;
  }
  sublocEditDescSubmit() {
    this.sublocEditDescIcoShow = !this.sublocEditDescIcoShow;
    this.updateMinorLocationProperties("description", this.sublocDescEdit.value);
  }
  newLocationModal_show() {
    this.modal_on = false;
    this.newLocationModal_on = true;
    this.newSubLocModal_on = false;
    this.innerMenuShow = false;
  }
  newSubLocationModal_show() {
    this.modal_on = false;
    this.newSubLocModal_on = true;
    this.newLocationModal_on = false;
    this.innerMenuShow = false;
  }
  close_onClick(message: boolean): void {
    this.modal_on = false;
    this.newSubLocModal_on = false;
    this.newLocationModal_on = false;
  }
  innerMenuToggle() {
    this.innerMenuShow = !this.innerMenuShow;
  }
  innerMenuHide(e) {
    if (e.srcElement.id != "submenu_ico") {
      this.innerMenuShow = false;
    }
  }

}
