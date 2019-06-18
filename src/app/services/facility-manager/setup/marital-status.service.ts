import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MaritalStatusService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('marital-statuses');
    this._socket = _socketService.getService('marital-statuses');
    this._socket.on('created', function (maritalstatus) {
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

  create(maritalstatus: any) {
    return this._socket.create(maritalstatus);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}