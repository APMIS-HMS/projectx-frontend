import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-company-bill-history-detail',
  templateUrl: './company-bill-history-detail.component.html',
  styleUrls: ['./company-bill-history-detail.component.scss']
})
export class CompanyBillHistoryDetailComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

}
