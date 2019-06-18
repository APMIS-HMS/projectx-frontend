import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PresentationService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('presentations');
    this._socket = _socketService.getService('presentations');
    this._socket.on('created', function (gender) {
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

  create(presentation: any) {
    return this._socket.create(presentation);
  }

  update(presentation: any) {
    return this._socket.update(presentation._id, presentation);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}