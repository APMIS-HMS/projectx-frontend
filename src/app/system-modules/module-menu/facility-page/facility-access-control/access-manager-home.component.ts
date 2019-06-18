import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-access-manager-home',
  templateUrl: './access-manager-home.component.html',
  styleUrls: ['./access-manager-home.component.scss']
})
export class AccessManagerHomeComponent implements OnInit {

  usersContentArea = false;
  accessContentArea = false;
  createAccessContentArea = false;

  constructor() { }

  ngOnInit() {
  }

  styleUsers() {
    this.usersContentArea = true;
    this.accessContentArea = false;
    this.createAccessContentArea = false;
  }
  access(){
    this.accessContentArea = true;
    this.usersContentArea = false;
    this.createAccessContentArea = false;
  }
  createAccess(){
    this.createAccessContentArea = true;
    this.usersContentArea = false;
    this.accessContentArea = false; 
  }

}
