import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CorporateEmitterService } from '../../../services/facility-manager/corporate-emitter.service';

@Component({
  selector: 'app-person-dependants',
  templateUrl: './person-dependants.component.html',
  styleUrls: ['./person-dependants.component.scss']
})
export class PersonDependantsComponent implements OnInit {

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  mainErr = true;
  errMsg = 'You have unresolved errors';
  showFrmDependant = false;

  public frmAddDepd: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _corporateEventEmitter: CorporateEmitterService
  ) { }

  ngOnInit() {
    this._corporateEventEmitter.setRouteUrl('Dependants');
    this.addNew();
  }

  addNew() {
    this.frmAddDepd = this.formBuilder.group({
      dependant: ['', [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.maxLength(50)]],
      relationship: ['', [<any>Validators.required]]
    });
  }
  newDepd(valid, val) {
      if (valid) {
          if (val.dependant === '' || val.dependant === ' ' || val.relationship === '' || val.relationship === ' ') {
              this.mainErr = false;
              this.errMsg = 'you left out a required field';
          } else {
              this.showFrmDependant= false;
              this.mainErr = true;
              this.errMsg = '';
          }
      } else {
          this.mainErr = false;
      }

  }
  frmDependantToggle(){
    this.showFrmDependant=!this.showFrmDependant;
  }
  close_onClick() {
      this.closeModal.emit(true);
  }

}
