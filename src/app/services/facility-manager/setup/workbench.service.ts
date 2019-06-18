import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WorkbenchService {
  public _socket;
  public _customSocket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('workbenches');
    this._socket = _socketService.getService('workbenches');
    this._customSocket = _socketService.getService('get-workbenches');
    this._socket.timeout = 30000;
    this._socket.on('created', function (workbenches) {
    });
  }
  find(query: any) {
    return this._socket.find(query);
  }

  customGet(payload: any, query: any) {
    return this._customSocket.get(payload, query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(workbench: any) {
    return this._socket.create(workbench);
  }
  update(workbench: any) {
    return this._socket.update(workbench._id, workbench);
  }
  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
