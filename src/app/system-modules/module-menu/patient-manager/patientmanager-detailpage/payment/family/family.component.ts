import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.scss']
})
export class FamilyComponent implements OnInit {

  search: FormControl;
  selectHmo: FormControl;

  constructor() { }

  ngOnInit() {
    this.search = new FormControl('', []);
    this.selectHmo = new FormControl('', []);
  }

}