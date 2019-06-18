import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class OrderSetTemplateService {
  public _socket;
  private _rest;
  private listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('order-mgt-templates');
    this._socket = _socketService.getService('order-mgt-templates');
    this._socket.on('created', function (department) {
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

  create(department: any) {
    return this._socket.create(department);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
