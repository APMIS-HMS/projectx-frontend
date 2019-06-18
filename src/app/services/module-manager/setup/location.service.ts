import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
@Injectable()
export class LocationService {
  public _socket;
  private _rest;
  public listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('locations');
    this._socket = _socketService.getService('locations');
    this._socket.timeout = 30000;
    this.listner = Observable.fromEvent(this._socket, 'remove');
    this._socket.on('created', function (location) {
    });
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

  create(location: any) {
    return this._socket.create(location);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}