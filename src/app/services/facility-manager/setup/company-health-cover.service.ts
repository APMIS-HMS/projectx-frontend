import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CompanyHealthCover } from '../../../models/facility-manager/setup/companyhealthcover';

@Injectable()
export class CompanyHealthCoverService {
  public _socket;
  private _rest;
  public createlistner;
  public updatelistner;
  public deletedlistner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('companyhealthcovereds');
    this._socket = _socketService.getService('companyhealthcovereds');
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.updatelistner = Observable.fromEvent(this._socket, 'updated');
    this.deletedlistner = Observable.fromEvent(this._socket, 'deleted');

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

  create(companyhealthcover: CompanyHealthCover) {
    return this._socket.create(companyhealthcover);
  }
  update(companyhealthcover: CompanyHealthCover) {
    return this._socket.update(companyhealthcover._id, companyhealthcover);
  }
  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
