import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class FrequencyService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('frequencies');
    this._socket = _socketService.getService('frequencies');
    this._socket.on('created', function (frequency) {
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

  create(frequency: any) {
    return this._socket.create(frequency);
  }

  update(frequency: any) {
    return this._socket.update(frequency._id, frequency);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}