import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
@Injectable()
export class InventoryTransactionTypeService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('inventory-transaction-types');
    this._socket = _socketService.getService('inventory-transaction-types');
    this._socket.timeout = 30000;
  }

  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }
  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
