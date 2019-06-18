import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-radiology-report',
  templateUrl: './view-radiology-report.component.html',
  styleUrls: ['./view-radiology-report.component.scss']
})
export class ViewRadiologyReportComponent implements OnInit {


  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() viewImgs: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  imgs_show(){
    this.viewImgs.emit(true);
  }

}
