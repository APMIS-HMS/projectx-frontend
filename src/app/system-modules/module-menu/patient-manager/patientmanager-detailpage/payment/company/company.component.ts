import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {

  search: FormControl;
  selectHmo: FormControl;

  childOpener = false;

  constructor() { }

  ngOnInit() {
    this.search = new FormControl('', []);
    this.selectHmo = new FormControl('', []);
  }

  childOpener_toggle(){
    this.childOpener = !this.childOpener;
  }

}