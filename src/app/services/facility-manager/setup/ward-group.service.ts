import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class RoomGroupService {
  public _socket;
  private _rest;
  public _wardSetupSocket;
  public _wardSetupRest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('wardroomgroups');
    this._socket = _socketService.getService('wardroomgroups');
    this._wardSetupSocket = _socketService.getService('ward-setup');
    this._wardSetupRest = _restService.getService('ward-setup');
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

  create(wardGroup: any) {
    return this._socket.create(wardGroup);
  }
  update(wardGroup: any) {
    return this._socket.update(wardGroup._id, wardGroup);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  wardSetup(payload: any) {
    return this._wardSetupSocket.create(payload);
  }
}
