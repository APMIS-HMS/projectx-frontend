import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-company-cover',
  templateUrl: './company-cover.component.html',
  styleUrls: ['./company-cover.component.scss']
})
export class CompanyCoverComponent implements OnInit { 

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  
  pg_beneficiaries= false;
  pg_company= true;

  constructor() { }

  ngOnInit() {
    this.pageInView.emit('Company Retainership');
  }

  company_onClick(e){
    this.pg_company = false;
    this.pg_beneficiaries = true;
  }

}
