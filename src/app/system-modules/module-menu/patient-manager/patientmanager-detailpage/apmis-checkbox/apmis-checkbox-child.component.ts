import { Component, OnInit, Input } from '@angular/core';
import { CrudModel } from '../../../../../models/index';

@Component({
  selector: 'app-apmis-checkbox-child',
  templateUrl: './apmis-checkbox-child.component.html',
  styleUrls: ['./apmis-checkbox-child.component.scss']
})
export class ApmisCheckboxChildComponent implements OnInit {
  @Input() crudItem: CrudModel = <CrudModel>{};
  constructor() { }

  ngOnInit() {
  }

}
