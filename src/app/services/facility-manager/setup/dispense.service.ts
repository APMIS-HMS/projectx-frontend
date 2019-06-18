import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DispenseService {
  public _socket;
  private _rest;
  public _walkinSocket;
  private _walkinRest;
  private listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('dispenses');
    this._socket = _socketService.getService('dispenses');
    this._walkinRest = _restService.getService('walkin-dispense-prescription');
    this._walkinSocket = _socketService.getService('walkin-dispense-prescription');
    this._socket.on('created', function (dispenses) {
    });
    this.listner = Observable.fromEvent(this._socket, 'remove');
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

  create(dispense: any) {
    return this._socket.create(dispense);
  }

  walkinCreate(dispense: any) {
    return this._walkinSocket.create(dispense);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}