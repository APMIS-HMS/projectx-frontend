import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CompanyCoverCategoryService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('companycovercategories');
    this._socket = _socketService.getService('companycovercategories');
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

  create(corporatecacility: any) {
    return this._socket.create(corporatecacility);
  }
  update(corporatecacility: any) {
    return this._socket.update(corporatecacility._id, corporatecacility);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
