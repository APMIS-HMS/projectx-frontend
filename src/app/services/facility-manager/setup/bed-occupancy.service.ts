import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class BedOccupancyService {
  public _socket;
  public _customSocket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('bed-occupancy');
    this._socket = _socketService.getService('bed-occupancy');
    this._customSocket = _socketService.getService('get-bed-occupancy');
    this._socket.timeout = 50000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

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

  customGet(data: any, query: any) {
    return this._customSocket.get(data, query);
  }

  create(wardAdmission: any) {
    return this._socket.create(wardAdmission);
  }
  update(wardAdmission: any) {
    return this._socket.update(wardAdmission._id, wardAdmission);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
