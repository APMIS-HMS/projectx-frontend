import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FacilityModuleService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('facility-modules');
    this._socket = _socketService.getService('facility-modules');
    this._socket.timeout = 30000;
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

  create(facility: any) {
    return this._socket.create(facility);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}