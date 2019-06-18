import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-daily-irts',
  templateUrl: './daily-irts.component.html',
  styleUrls: ['./daily-irts.component.scss', '../../../nhmis-summary/nhmis-summary.component.scss', '../register-entry/register-entry.component.scss']
})
export class DailyIrtsComponent implements OnInit {
  immunizationTallyMenu = true;
  modal_on = false;
  pg2 = false;

  constructor(private _router: Router) { }


  ngOnInit() {
  }

  close_onClick(message: boolean): void {
    this.modal_on = false;
  }
}
