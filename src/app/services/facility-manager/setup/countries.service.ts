import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CountriesService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('countries');
    this._socket = _socketService.getService('countries');
    // this._socket.on('created', function (country) {
    // });
    this._socket.timeout = 10000;
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

  create(country: any) {
    return this._socket.create(country);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
