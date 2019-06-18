import { Component, OnInit } from '@angular/core';
import { PurchaseEmitterService } from '../../../../services/facility-manager/purchase-emitter.service';


@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent implements OnInit {

  histories: any[] = [];
  constructor(
    private _purchaseEventEmitter: PurchaseEmitterService
  ) { }

  ngOnInit() {
    this._purchaseEventEmitter.setRouteUrl('Purchase Manager');

  }

}
