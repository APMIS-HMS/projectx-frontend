import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class WorkSpaceService {
  public _socket;
  public _assignsocket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('workspaces');
    this._socket = _socketService.getService('workspaces');
    this._assignsocket = _socketService.getService('assign-workspace');
    this._socket.timeout = 30000;
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

  create(workspace: any) {
    return this._socket.create(workspace);
  }
  assignworkspace(body: any) {
    return this._assignsocket.create(body);
  }
  findworkspaces(query){
    return this._assignsocket.find(query);
  }
  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
  update(workspace: any) {
    return this._socket.update(workspace._id, workspace);
  }
  updateMany(workspace: any) {
    return this._socket.update(null, workspace);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
