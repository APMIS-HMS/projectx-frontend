import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-radiology-images',
  templateUrl: './view-radiology-images.component.html',
  styleUrls: ['./view-radiology-images.component.scss', '../view-radiology-report/view-radiology-report.component.scss']
})
export class ViewRadiologyImagesComponent implements OnInit {

  @Output() closeModal: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(0);
  }

}
