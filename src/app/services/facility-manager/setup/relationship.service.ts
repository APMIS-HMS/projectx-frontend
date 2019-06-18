import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class RelationshipService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('relationships');
    this._socket = _socketService.getService('relationships');
    this._socket.on('created', function (relationship) {
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

  create(relationship: any) {
    return this._socket.create(relationship);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}