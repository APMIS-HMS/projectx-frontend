import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';

@Injectable()
export class JoinChannelService {

  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('join-facility-channel');
    this._socket = _socketService.getService('join-facility-channel');
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

  create(join: any) {
    return this._socket.create(join);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
