import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-product-config-popup',
  templateUrl: './product-config-popup.component.html',
  styleUrls: ['./product-config-popup.component.scss']
})
export class ProductConfigPopupComponent implements OnInit {


  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
