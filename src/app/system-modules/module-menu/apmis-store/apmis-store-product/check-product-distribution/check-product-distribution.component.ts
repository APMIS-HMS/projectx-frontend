import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-check-product-distribution',
  templateUrl: './check-product-distribution.component.html',
  styleUrls: ['./check-product-distribution.component.scss']
})
export class CheckProductDistributionComponent implements OnInit {

  
  @Output() closeModal:EventEmitter<boolean> = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
  }


  close_onClick() {
    this.closeModal.emit(true);
  }

}
