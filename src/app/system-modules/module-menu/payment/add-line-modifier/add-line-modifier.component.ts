import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServicePriceService, InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Facility, BillModel } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Component({
  selector: 'app-add-line-modifier',
  templateUrl: './add-line-modifier.component.html',
  styleUrls: ['./add-line-modifier.component.scss']
})
export class AddLineModifierComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() selectedServiceBill: BillModel = <BillModel>{};


  mainErr = true;
  errMsg = 'you have unresolved errors';
  facility: Facility = <Facility>{};
  selectedModifier: any = <any>{};
  modifiers: any[] = [];
  public frmAddModifier: FormGroup;

  constructor(private formBuilder: FormBuilder, private servicePriceService: ServicePriceService,
    private invoiceService: InvoiceService,
    private _locker: CoolLocalStorage) { }

  ngOnInit() {
    this.facility = <Facility> this._locker.getObject('selectedFacility');
    this.addNew();
    this.getPrice(this.selectedServiceBill.facilityServiceObject);
  }
  addNew() {
    this.frmAddModifier = this.formBuilder.group({
      modifier: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  onSelectModifier(modifier: any) {
    let name = '';
    if (modifier.modifierType === 'Percentage') {
      name = modifier.tagDetails.name + ' (' + modifier.modifierValue + '%)';
    } else {
      name = modifier.tagDetails.name + ' (' + modifier.modifierValue + 'Naira)';
    }

    this.frmAddModifier.controls['modifier'].setValue(name);
    this.selectedModifier = modifier;
  }

  addModifier(value: any, valid: boolean) {
    if (this.selectedModifier.modifierType === 'Percentage') {
      const percent = this.selectedModifier.modifierValue;
      const unitPrice = this.selectedServiceBill.unitPrice;
      const percentUnitPrice = (percent / 100) * unitPrice;
      this.selectedServiceBill.unitPrice = percentUnitPrice;
      this.selectedServiceBill.amount = this.selectedServiceBill.unitPrice * this.selectedServiceBill.qty;
    } else {
      this.selectedServiceBill.unitPrice = this.selectedModifier.modifierValue;
      this.selectedServiceBill.amount = this.selectedServiceBill.unitPrice * this.selectedServiceBill.qty;
    }
    this.selectedServiceBill.isModified = true;
    if (this.selectedServiceBill.modifiers === undefined) {
      this.selectedServiceBill.modifiers = [];
    }
    this.selectedServiceBill.modifiers.push(this.selectedModifier);
    this.invoiceService.announceInvoice([this.selectedServiceBill]);
  }

  getPrice(service: any) {
    this.servicePriceService.find({
      query: {
        facilityId: this.facility._id, facilityServiceId: service.facilityServiceId,
        serviceId: service.serviceId
      }
    })
      .then(payload => {
        if (payload.data.length > 0) {
          const price = payload.data[0];
          this.modifiers = price.modifiers;
        }
      });
  }

}
