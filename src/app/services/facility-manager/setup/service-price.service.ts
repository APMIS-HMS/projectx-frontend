import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ServicePriceService {
  public _socket;
  public _socketModifier;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('facility-prices');
    this._socket = _socketService.getService('facility-prices');
    this._socketModifier = _socketService.getService('price-modifiers');
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._socket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }// price-modifiers

  createModifier(obj: any) {
    return this._socketModifier.create(obj);
  }// price-modifiers

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }
  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }
  patch(id, serviceprice: any) {
    return this._socket.patch(id, serviceprice);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
