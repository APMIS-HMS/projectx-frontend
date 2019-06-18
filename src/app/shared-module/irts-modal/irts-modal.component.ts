import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-irts-modal',
  templateUrl: './irts-modal.component.html',
  styleUrls: ['./irts-modal.component.scss']
})
export class IrtsModalComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
 
  constructor() { }

  ngOnInit() {
  }

  close_onClick(){
    this.closeModal.emit(true);
  }
}
