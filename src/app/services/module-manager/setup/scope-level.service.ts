import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ScopeLevelService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('form-scope-levels');
    this._socket = _socketService.getService('form-scope-levels');
    this._socket.on('created', function (facilityownership) {
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

  create(facilityOwnership: any) {
    return this._socket.create(facilityOwnership);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}