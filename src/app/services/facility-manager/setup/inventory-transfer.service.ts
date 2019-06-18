import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class InventoryTransferService {
  public _socket;
  public _socket2;
  public _socket3;
  public _socketRequisition;
  public _socketInventoryRequisition;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('inventory-transfers');
    this._socket = _socketService.getService('inventory-transfers');
    this._socket3 = _socketService.getService('list-of-stock-transfers');
    this._socketRequisition = _socketService.getService('store-requisitions');
    this._socketInventoryRequisition = _socketService.getService('inventory-requisitions');
    this._socket2 = _socketService.getService('stock-transfers');
    this._socket.timeout = 50000;
    this._socket2.timeout = 50000;
    this._socket3.timeout = 50000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._socket.find(query);
  }

  findTransferHistories(query: any) {
    return this._socket3.find(query);
  }

  findRequisitions(query: any) {
    return this._socketRequisition.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  getItemDetails(id: string, query: any) {
    return this._socket3.get(id, query);
  }

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }

  create2(serviceprice: any) {
    return this._socket2.create(serviceprice);
  }

  createRequisition(serviceprice: any) {
    return this._socketRequisition.create(serviceprice);
  }

  createInventoryRequisition(serviceprice: any) {
    return this._socketInventoryRequisition.create(serviceprice);
  }

  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }
  patchTransferItem(_id: any, data: any, params) {
    return this._socket2.patch(_id, data, params);
  }

  patch(_id: any, data: any, params) {
    return this._socket.patch(_id, data, params);
  }

  patchRequisition(_id: any, data: any, params) {
    return this._socketRequisition.patch(_id, data, params);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
