import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-antenatal',
  templateUrl: './daily-antenatal.component.html',
  styleUrls: ['./daily-antenatal.component.scss', '../../../nhmis-summary/nhmis-summary.component.scss', '../register-entry/register-entry.component.scss']
})
export class DailyAntenatalComponent implements OnInit {

  pg1 = true;
  pg2 = false;

  constructor(private _router: Router) { }

  ngOnInit() {
  }

  switch_pg(pg){
    if(pg==1){
      this.pg1 = true;
      this.pg2 = false;
    } else if(pg==2){
      this.pg1 = false;
      this.pg2 = true;
    }
  }
  
}
