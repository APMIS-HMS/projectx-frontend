import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApmisFilterBadgeService } from './../../../../../services/tools/apmis-filter-badge.service';

@Component({
  selector: 'app-apmis-search',
  templateUrl: './apmis-search.component.html',
  styleUrls: ['./apmis-search.component.scss']
})
export class ApmisSearchComponent implements OnInit {

  apmisSearch: FormControl = new FormControl();
  showSearch = false;
  @Input() data: any = <any>[];
  selectedItems: any = <any>[];
  @Input() placeholder: any;
  @Output() onSelectedItems = new EventEmitter();
  @Output() onCreateItem = new EventEmitter();
  @Output() onCloseEvent = new EventEmitter();

  constructor(private apmisFilterBadgeService: ApmisFilterBadgeService) { }

  ngOnInit() {
    this.apmisFilterBadgeService.item$.subscribe(status => {
      if (status) {
        this.selectedItems = [];
        this.apmisFilterBadgeService.clearItemsStorage(true);
      }
    });
  }

  toggler_click() {
    this.showSearch = !this.showSearch;
  }

  onSearchSelectedItems(value) {
    this.selectedItems = value;
    this.onSelectedItems.emit(value);
  }

  onCreateNewItem(value) {
    this.onCreateItem.emit(value);
    this.showSearch = false;
  }

  onClickClose(event) {
    this.showSearch = event;
  }
}
