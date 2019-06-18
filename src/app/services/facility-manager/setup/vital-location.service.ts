import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class VitaLocationService {
  public _socket;
  public _socketBp;
  private _rest;
  private _restBp;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('vita-locations');
    this._restBp = _restService.getService('vital-bp-locations');
    this._socket = _socketService.getService('vita-locations');
    this._socketBp = _socketService.getService('vital-bp-locations');
    this._socket.timeout = 30000;
    this._socketBp.timeout = 30000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }

  find(query: any) {
    return this._socket.find(query);
  }
  
  findBp(query: any) {
    return this._socketBp.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  
  findAllBp() {
    return this._socketBp.find();
  }

  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(vitaLocation: any) {
    return this._socket.create(vitaLocation);
  }
  update(vitaLocation: any) {
    return this._socket.update(vitaLocation._id, vitaLocation);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
