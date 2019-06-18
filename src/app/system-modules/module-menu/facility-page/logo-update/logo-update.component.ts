import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FacilitiesService, CorporateFacilityService } from '../../../../services/facility-manager/setup/index';
import { Facility, CorporateFacility } from '../../../../models/index';
import { NgUploaderOptions } from 'ngx-uploader';


@Component({
  selector: 'app-logo-update',
  templateUrl: './logo-update.component.html',
  styleUrls: ['./logo-update.component.scss']
})
export class LogoUpdateComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedFacility: Facility;
  @Input() selectedCorporateFacility: CorporateFacility;
  uploadEvents: EventEmitter<any> = new EventEmitter();
  file: any;
  modal_on = false;


  // ***
  uploadFile: any;
  hasBaseDropZoneOver = false;
  options: NgUploaderOptions = {
    url: 'http://localhost:3030/image',
    autoUpload: false,
    data: { filename: '' }
  };
  sizeLimit = 2000000;

  // **

  constructor(public facilityService: FacilitiesService,
    private corporateFacilityService: CorporateFacilityService) { }

  ngOnInit() {
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

  uploadButton() {
    if (this.selectedFacility != null) {
      const facility = this.selectedFacility;
      if (facility.logoObject !== undefined) {
        this.options.data.filename = facility.logoObject.filename;
      } else {
        this.options.data.filename = 0;
      }
    } else if (this.selectedCorporateFacility != null) {
      const facility = this.selectedCorporateFacility;
      if (facility.logoObject !== undefined) {
        this.options.data.filename = facility.logoObject.filename;
      } else {
        this.options.data.filename = 0;
      }
    }

    this.uploadEvents.emit('startUpload');
  }
  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      const file = data[0].file;
      if (this.selectedFacility != null) {
        let facility = this.selectedFacility;
        this.facilityService.get(facility._id, {}).then(payload => {
          if (payload != null) {
            payload.logoObject = file;
            this.facilityService.update(payload).then(rpayload => {
              facility = rpayload;
              this.close_onClick();
            });
          }
        });
      } else if (this.selectedCorporateFacility != null) {
        let facility = this.selectedCorporateFacility;
        this.corporateFacilityService.get(facility._id, {}).then(payload => {
          if (payload != null) {
            payload.logoObject = file;
            this.corporateFacilityService.update(payload).then(rpayload => {
              facility = rpayload;
              this.close_onClick();
            });
          }
        });
      }

    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  beforeUpload(uploadingFile): void {
    if (uploadingFile.size > this.sizeLimit) {
      uploadingFile.setAbort();
      alert('File is too large');
    }
  }

}
