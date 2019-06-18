import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FacilitiesService, BillingService, PatientService, InvoiceService } from '../../../../services/facility-manager/setup/index';
import { Patient, Facility, BillItem, Invoice } from '../../../../models/index';

@Component({
  selector: 'app-add-modefier',
  templateUrl: './add-modefier.component.html',
  styleUrls: ['./add-modefier.component.scss']
})
export class AddModefierComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmAddModifier: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private invoiceService: InvoiceService) { }

  ngOnInit() {
    this.addNew();
  }
  addNew() {
    this.frmAddModifier = this.formBuilder.group({
      modifier: ['', [<any>Validators.required]],
      valueCheck: ['', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  addModifier(model: any, valid: any) {
    this.invoiceService.announceDiscount(model);
    this.close_onClick();
  }
}
