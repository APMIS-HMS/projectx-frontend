import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-fc-beneficiary-list',
  templateUrl: './fc-beneficiary-list.component.html',
  styleUrls: ['./fc-beneficiary-list.component.scss']
})
export class FcBeneficiaryListComponent implements OnInit {

  @ViewChild('fileInput') fileInput: ElementRef;
  public frmNewHmo: FormGroup;
  hmo = new FormControl('', []);
  newHmo = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.frmNewHmo = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [<any>Validators.required, <any>Validators.pattern('^([a-z0-9_\.-]+)@([\da-z\.-]+)(com|org|CO.UK|co.uk|net|mil|edu|ng|COM|ORG|NET|MIL|EDU|NG)$')]],
      phone: ['', [<any>Validators.required]],
      plans: ['', [<any>Validators.required]]
    });
  }

  newHmo_show(){
    this.newHmo = !this.newHmo;
  }

  showImageBrowseDlg() {
    this.fileInput.nativeElement.click()
  }

}
