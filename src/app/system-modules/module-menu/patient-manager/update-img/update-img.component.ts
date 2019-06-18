import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper'; 
import { PersonService } from '../../../../services/facility-manager/setup/index';
import { Patient, Person } from '../../../../models/index';
import { ImageUploaderEnum } from '../../../../shared-module/helpers/image-uploader-enum';
import { NgUploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-update-img',
  templateUrl: './update-img.component.html',
  styleUrls: ['./update-img.component.scss']
})
export class UpdateImgComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  cropperSettings: any;
  data: any;
  uploadEvents: any;
  options:any;
  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  handleUpload(e) {

  }
  fileChangeListener(e) {

  }
  cropped($event) {

  }
  uploadButton() {

  }
  beforeUpload(e) {

  }
}
