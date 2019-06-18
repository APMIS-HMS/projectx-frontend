import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'options-page',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  homeContentArea = true;
  pageInView = 'Home';

  constructor() { }
   navFpHome() {
    this.homeContentArea = true;
  }

  ngOnInit() {
  }

}
