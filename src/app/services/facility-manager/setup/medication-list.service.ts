import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MedicationListService {
  public _socket;
  private _rest;
  public listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('medications');
    this._socket = _socketService.getService('medications');
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

  create(medications: any) {
    return this._socket.create(medications);
  }
  update(medication: any) {
    return this._socket.update(medication._id, medication);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}