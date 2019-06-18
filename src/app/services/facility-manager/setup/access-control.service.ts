import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AccessControlService {
  public _socket;
  private _rest;
  public listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('facility-access-control');
    this._socket = _socketService.getService('facility-access-control');
    this._socket.timeout = 30000;
    this.listner = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.listner = Observable.fromEvent(this._socket, 'deleted');

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

  create(accesscontrol: any) {
    let that = this;
    return new Promise(function (resolve, reject) {
      resolve(that._socket.create(accesscontrol))
    });
  }
  update(accesscontrol: any) {
    return this._socket.update(accesscontrol._id, accesscontrol);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
