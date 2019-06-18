import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SupplierService {
  public _socket;
  public _customSocket;
  public _searchSocket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('suppliers');
    this._socket = _socketService.getService('suppliers');
    this._customSocket = _socketService.getService('supplier-service');
    this._searchSocket = _socketService.getService('search-suppliers');
    this._socket.timeout = 80000;
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
  }

  create(serviceprice: any) {
    return this._socket.create(serviceprice);
  }

  customCreate(serviceprice: any) {
    return this._customSocket.create(serviceprice);
  }

  searchSuppliers(query){
    return this._searchSocket.find(query);
  }

  createExistingSupplier(data){
    return this._searchSocket.create(data);
  }

  update(serviceprice: any) {
    return this._socket.update(serviceprice._id, serviceprice);
  }
  patch(id: any, supplier) {
    return this._socket.patch(id, supplier);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
