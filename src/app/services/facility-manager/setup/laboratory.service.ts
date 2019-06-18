import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LaboratoryService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('laboratories');
    this._socket = _socketService.getService('laboratories');
    this._socket.on('created', function (laboratories) {
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

  create(laboratory: any) {
    return this._socket.create(laboratory);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}