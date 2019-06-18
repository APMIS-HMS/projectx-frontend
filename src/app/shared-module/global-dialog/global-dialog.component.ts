import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-global-dialog',
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss']
})
export class GlobalDialogComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() deleteRecord: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input('gdTitle') gdTitle: string = '';
  @Input('gdItem') gdItem: string = '';
  @Input('gdComponent') gdComponent: string = '';
  @Input('gdDesc') gdDesc: string = 'Are you sure you want to delete';


  constructor() { }

  ngOnInit() {
    this.gdDesc = this.gdDesc + ' ' + this.gdItem + ' from ' + this.gdComponent;
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  delete_onClick() {
    this.deleteRecord.emit(true);
  }

}
