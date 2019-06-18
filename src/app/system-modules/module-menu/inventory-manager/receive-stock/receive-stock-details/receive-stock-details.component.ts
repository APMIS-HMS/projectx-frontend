import { Component, OnInit } from '@angular/core';
import { InventoryEmitterService } from '../../../../../services/facility-manager/inventory-emitter.service';

@Component({
  selector: 'app-receive-stock-details',
  templateUrl: './receive-stock-details.component.html',
  styleUrls: ['./receive-stock-details.component.scss']
})
export class ReceiveStockDetailsComponent implements OnInit {

  constructor(private _inventoryEventEmitter: InventoryEmitterService) { }

  ngOnInit() {
    this._inventoryEventEmitter.setRouteUrl('Receive Stock Details');
  }

}
