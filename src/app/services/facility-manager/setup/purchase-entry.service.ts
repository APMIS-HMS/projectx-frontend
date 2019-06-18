import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PurchaseEntryService {
  public _socket;
  public _socket2;
  public _socketInvoice;
  private _rest;
  private _socketPurchaseEntry;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('purchase-entries');
    this._socket = _socketService.getService('purchase-entries');
    this._socketInvoice = _socketService.getService('purchase-invoices');
    this._socket2 = _socketService.getService('make-purchase-entries');
    this._socketPurchaseEntry = _socketService.getService('add-purchase-entries');
    this._socket.timeout = 30000;
    this._socket2.timeout = 30000;
    this._socketInvoice.timeout = 30000;
    this._socketPurchaseEntry.timeout = 30000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._socket.find(query);
  }

  findInvoices(query: any) {
    return this._socketInvoice.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  getInvoice(id: string, query: any) {
    return this._socketInvoice.get(id, query);
  }

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }

  create2(serviceprice: any) {
    return this._socket2.create(serviceprice);
  }

  createEntry(serviceprice: any) {
    return this._socketPurchaseEntry.create(serviceprice);
  }

  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }

  patch(id, obj) {
    return this._socket.patch(id, obj);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
