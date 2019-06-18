import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-entries',
  templateUrl: './register-entries.component.html',
  styleUrls: ['./register-entries.component.scss', '../../nhmis-summary/nhmis-summary.component.scss', '../registers.component.scss']
})
export class RegisterEntriesComponent implements OnInit {

  constructor( private _router: Router) { }

  ngOnInit() {
  }

  back_registers() {
    this._router.navigate(['/dashboard/reports/register']);
  }
}
