import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-bill-group',
  templateUrl: './bill-group.component.html',
  styleUrls: ['./bill-group.component.scss']
})
export class BillGroupComponent implements OnInit {
  txtSelectAll = new FormControl('', []);
  select1 = new FormControl('', []);
  select2 = new FormControl('', []);
  select3 = new FormControl('', []);

  addItem = false;
  addModefierPopup = false;
  addLineModefierPopup = false;
  priceItemDetailPopup = false;
  itemEditShow = false;
  itemEditShow2 = false;
  itemEditShow3 = false;
  selectAll = false;

  cat1 = false;
  cat2 = false;
  cat3 = false;
  constructor() { }

  ngOnInit() {
  }


  selectAll_change(e) {
    if (e.target.checked) {
      this.selectAll = true;
    } else {
      this.selectAll = false;
    }
  }
  toggleCat1() {
    this.cat1 = !this.cat1;
  }
  toggleCat2() {
    this.cat2 = !this.cat2;
  }
  toggleCat3() {
    this.cat3 = !this.cat3;
  }
  itemEditToggle() {
    this.itemEditShow = !this.itemEditShow;
  }
  itemEditToggle2() {
    this.itemEditShow2 = !this.itemEditShow2;
  }
  itemEditToggle3() {
    this.itemEditShow3 = !this.itemEditShow3;
  }
  addModefier() {
    this.addModefierPopup = true;
  }
  lineModifier_show() {
    this.addLineModefierPopup = true;
  }
  addItem_show() {
    this.addItem = true;
  }
  itemDetail() {
    this.priceItemDetailPopup = true;
  }
  close_onClick(e) {
    this.addModefierPopup = false;
    this.addLineModefierPopup = false;
    this.addItem = false;
    this.priceItemDetailPopup = false;
  }
}
