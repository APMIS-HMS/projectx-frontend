import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-pos-discount',
  templateUrl: './pos-discount.component.html',
  styleUrls: ['./pos-discount.component.scss']
})
export class PosDiscountComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'you have unresolved errors';

  public frmAddModifier: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

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
    this.close_onClick();
  }
}