import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ServerDateService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService) {
    this._rest = _restService.getService('serverdatetimes');
    this._socket = _socketService.getService('serverdatetimes');
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

  create(dateTime: any) {
    return this._socket.create(dateTime);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}