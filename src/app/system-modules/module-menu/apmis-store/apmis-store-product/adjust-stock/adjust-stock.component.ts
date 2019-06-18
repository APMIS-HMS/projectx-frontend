import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-adjust-stock',
  templateUrl: './adjust-stock.component.html',
  styleUrls: ['./adjust-stock.component.scss']
})
export class AdjustStockComponent implements OnInit {

  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
}
