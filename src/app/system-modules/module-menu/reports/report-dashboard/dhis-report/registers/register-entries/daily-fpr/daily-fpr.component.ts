import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-fpr',
  templateUrl: './daily-fpr.component.html',
  styleUrls: ['./daily-fpr.component.scss', '../../../nhmis-summary/nhmis-summary.component.scss',
  '../register-entry/register-entry.component.scss']
})
export class DailyFprComponent implements OnInit {

  constructor(private _router: Router) { }


  ngOnInit() {
  }

}
