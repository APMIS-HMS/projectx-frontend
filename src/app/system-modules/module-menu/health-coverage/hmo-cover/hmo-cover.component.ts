import { Component, OnInit, EventEmitter, Output, Renderer, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-hmo-cover',
  templateUrl: './hmo-cover.component.html',
  styleUrls: ['./hmo-cover.component.scss']
})
export class HmoCoverComponent implements OnInit {

  @Output() pageInView: EventEmitter<string> = new EventEmitter<string>();
  
  pg_beneficiaries= false;
  pg_hmo= true;

  constructor() { }

  ngOnInit() {
    this.pageInView.emit('HMO');
  }

  hmo_onClick(e){
    this.pg_hmo = false;
    this.pg_beneficiaries = true;
  }

}
