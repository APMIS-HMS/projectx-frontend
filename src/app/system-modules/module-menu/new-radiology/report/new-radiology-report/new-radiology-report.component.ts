import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-new-radiology-report',
  templateUrl: './new-radiology-report.component.html',
  styleUrls: ['../view-radiology-report/view-radiology-report.component.scss']
})
export class NewRadiologyReportComponent implements OnInit {

  selectTemplate = new FormControl();
  @Output() closeModal: EventEmitter<number> = new EventEmitter<number>();
  @Output() viewImgs: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(1);
  }
  imgs_show(){
    this.viewImgs.emit(true);
  }

}
