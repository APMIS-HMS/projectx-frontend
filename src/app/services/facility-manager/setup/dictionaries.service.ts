import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DictionariesService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('dictioneries');
    this._socket = _socketService.getService('dictioneries');
    this._socket.timeout = 50000;
    this._socket.on('created', function (country) {
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

  create(country: any) {
    return this._socket.create(country);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
