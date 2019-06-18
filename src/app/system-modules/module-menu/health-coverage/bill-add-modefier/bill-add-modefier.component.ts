import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-bill-add-modefier',
  templateUrl: './bill-add-modefier.component.html',
  styleUrls: ['./bill-add-modefier.component.scss']
})
export class BillAddModefierComponent implements OnInit {

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
      valueCheck: ['Percentage', [<any>Validators.required]]
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }
  addModifier(model: any, valid: any) {
    this.close_onClick();
  }
}
