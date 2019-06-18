import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-product-movement',
  templateUrl: './product-movement.component.html',
  styleUrls: ['./product-movement.component.scss']
})
export class ProductMovementComponent implements OnInit {

  tab_outbound = false;
  tab_inbound = false;
  tab_outbound_requisition = true;
  tab_inbound_requisition = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  tab_click(tab){
    if(tab==='outbound'){
      this.tab_outbound = true;
      this.tab_inbound = false;
      this.tab_outbound_requisition = false;
      this.tab_inbound_requisition = false;
    } else if(tab==='inbound'){
      this.tab_outbound = false;
      this.tab_inbound = true;
      this.tab_outbound_requisition = false;
      this.tab_inbound_requisition = false;
    } else if(tab==='outbound_requisition'){
      this.tab_outbound = false;
      this.tab_inbound = false;
      this.tab_outbound_requisition = true;
      this.tab_inbound_requisition = false;
    } else if(tab==='inbound_requisition'){
      this.tab_outbound = false;
      this.tab_inbound = false;
      this.tab_outbound_requisition = false;
      this.tab_inbound_requisition = true;
    }
  } 

  changeRoute(value: string) {
    this.router.navigate(['/dashboard/store/' + value]).then(
      payload => {
      }
    ).catch(error => { 
    });
  }

}
