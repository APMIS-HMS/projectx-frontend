import { PersonService } from './../../../../../services/facility-manager/setup/person.service';
import { ImageUploaderEnum } from './../../../../../shared-module/helpers/image-uploader-enum';
import { Person } from './../../../../../models/facility-manager/setup/person';
import { Employee } from './../../../../../models/facility-manager/setup/employee';
import { Component, OnInit, EventEmitter, Output, ViewChild, Input } from '@angular/core';
import { ImageCropperComponent, CropperSettings, Bounds } from 'ng2-img-cropper';
import { NgUploaderOptions } from 'ngx-uploader';

@Component({
  selector: 'app-image-update',
  templateUrl: './image-update.component.html',
  styleUrls: ['./image-update.component.scss']
})
export class ImageUpdateComponent implements OnInit {
  @Input() selectedEmployee: Employee;
  @Input() selectedPerson: Person;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  uploadEvents: EventEmitter<any> = new EventEmitter();

  // ***
  uploadFile: any;
  hasBaseDropZoneOver: boolean = false;
  options: NgUploaderOptions = {
    url: 'http://localhost:3030/image',
    autoUpload: false,
    data: { filename: '' }
  };
  sizeLimit = 2000000;

  // **

  modal_on = false;
  file: File;
  data: any;
  OperationType: ImageUploaderEnum = ImageUploaderEnum.PersonProfileImage;

  @ViewChild('cropper', undefined)
  cropper: ImageCropperComponent;
  cropperSettings: CropperSettings;

  croppedWidth: number;
  croppedHeight: number;

  constructor(private personService: PersonService) {
    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 100;
    this.cropperSettings.height = 100;
    this.cropperSettings.croppedWidth = 300;
    this.cropperSettings.croppedHeight = 300;
    this.cropperSettings.canvasWidth = 400;
    this.cropperSettings.canvasHeight = 300;
    this.cropperSettings.noFileInput = true;
    this.data = {};

    // mine
    this.cropperSettings.minWidth = 10;
    this.cropperSettings.minHeight = 10;

    this.cropperSettings.rounded = false;
    this.cropperSettings.keepAspect = false;

    this.cropperSettings.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
    this.cropperSettings.cropperDrawSettings.strokeWidth = 2;

  }

  ngOnInit() {
  }
  fileChangeListener($event) {
    let image: any = new Image();
    let file: File = $event.target.files[0];
    let myReader: FileReader = new FileReader();
    let that = this;
    myReader.onloadend = function (loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }
  updatePerson(person: Person) {
    this.personService.update(person).then(rpayload => {
      if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
        this.selectedPerson = rpayload;
      } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
        this.selectedEmployee.employeeDetails = rpayload;
      }
      this.close_onClick();
    });
  }
  // previewFile() {
  //   if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
  //     this.personService.get(this.selectedPerson._id, {}).then(payload => {
  //       if (payload != null) {
  //         payload.profileImage = this.data.image;
  //         this.updatePerson(payload);
  //       }
  //     });
  //   } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
  //     this.selectedPerson.profileImage = this.data.image;
  //     this.updatePerson(this.selectedPerson);
  //   }
  // }


  cropped(bounds: Bounds) {
    this.croppedHeight = bounds.bottom - bounds.top;
    this.croppedWidth = bounds.right - bounds.left;
  }
  uploadButton() {
    if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
      if (this.selectedPerson.profileImageObject !== undefined) {
        this.options.data.filename = this.selectedPerson.profileImageObject.filename;
      } else {
        this.options.data.filename = 0;
      }
    } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
      if (this.selectedEmployee.employeeDetails !== undefined) {
        this.options.data.filename = this.selectedEmployee.employeeDetails.filename;
      } else {
        this.options.data.filename = 0;
      }
    }
    this.uploadEvents.emit('startUpload');
  }
  handleUpload(data): void {
    if (data && data.response) {
      data = JSON.parse(data.response);
      let file = data[0].file;
      if (this.OperationType === ImageUploaderEnum.PersonProfileImage) {
        this.personService.get(this.selectedPerson._id, {}).then(payload => {
          if (payload != null) {
            payload.profileImageObject = file;
            this.updatePerson(payload);
          }
        });
      } else if (this.OperationType === ImageUploaderEnum.PatientProfileImage) {
        this.selectedPerson.profileImageObject = file;
        this.updatePerson(this.selectedPerson);
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
  imageChange(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
    }
  }
  close_onClick() {
    this.closeModal.emit(true);
  }

}
