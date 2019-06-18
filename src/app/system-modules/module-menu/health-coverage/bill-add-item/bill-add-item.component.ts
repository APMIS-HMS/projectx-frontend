import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-bill-add-item',
  templateUrl: './bill-add-item.component.html',
  styleUrls: ['./bill-add-item.component.scss']
})
export class BillAddItemComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  mainErr = true;
  errMsg = 'you have unresolved errors';
  successMsg = 'Operation completed successfully';

  services:any;
  public frmAddItem: FormGroup;
  success = false;
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.addNew();
  }

  addNew() {
    this.frmAddItem = this.formBuilder.group({
      itemName: ['', [<any>Validators.required, <any>Validators.minLength(1), <any>Validators.maxLength(50)]],
      itemDesc: ['', []],
      unitPrice: ['', [<any>Validators.required]],
      amount: ['', [<any>Validators.required]],
      qty: ['', [Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  addItem(val: any, valid: boolean) {
    const unitPrice = this.frmAddItem.controls['unitPrice'].value;
    const amount = this.frmAddItem.controls['amount'].value;
    val.unitPrice = unitPrice;
    val.amount = amount;
    // val.facilityServiceObject = this.selectedService;
    // this.items.push(val);
    this.frmAddItem.reset();
    this.success = true;
  }

}
