import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ProfessionService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('professions');
    this._socket = _socketService.getService('professions');
    this._socket.timeout = 30000;
    this._socket.on('created', function (profession) {
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

  create(profession: any) {
    return this._socket.create(profession);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}