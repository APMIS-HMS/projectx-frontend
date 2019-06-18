import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-family-cover',
  templateUrl: './family-cover.component.html',
  styleUrls: ['./family-cover.component.scss']
})
export class FamilyCoverComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  
  pg_beneficiaries= false;
  pg_family= true;

  constructor() { }

  ngOnInit() {
    this.pageInView.emit('Family Cover');
  }

  family_onClick(e){
    this.pg_family = false;
    this.pg_beneficiaries = true;
  }

}
