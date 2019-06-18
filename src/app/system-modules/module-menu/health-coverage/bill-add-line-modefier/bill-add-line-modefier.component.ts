import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bill-add-line-modefier',
  templateUrl: './bill-add-line-modefier.component.html',
  styleUrls: ['./bill-add-line-modefier.component.scss']
})
export class BillAddLineModefierComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  modifiers:any;
  mainErr = true;
  errMsg = 'you have unresolved errors';
  
  public frmAddModifier: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addNew();
  }
  addNew() {
    this.frmAddModifier = this.formBuilder.group({
      modifier: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  addModifier(value: any, valid: boolean) {
    // if (this.selectedModifier.modifierType === 'Percentage') {
    //   const percent = this.selectedModifier.modifierValue;
    //   const unitPrice = this.selectedServiceBill.unitPrice;
    //   const percentUnitPrice = (percent / 100) * unitPrice;
    //   this.selectedServiceBill.unitPrice = percentUnitPrice;
    //   this.selectedServiceBill.amount = this.selectedServiceBill.unitPrice * this.selectedServiceBill.qty;
    // } else {
    //   this.selectedServiceBill.unitPrice = this.selectedModifier.modifierValue;
    //   this.selectedServiceBill.amount = this.selectedServiceBill.unitPrice * this.selectedServiceBill.qty;
    // }
    // this.selectedServiceBill.isModified = true;
    // if (this.selectedServiceBill.modifiers === undefined) {
    //   this.selectedServiceBill.modifiers = [];
    // }
    // this.selectedServiceBill.modifiers.push(this.selectedModifier);
    // this.invoiceService.announceInvoice([this.selectedServiceBill]);
  }
}
