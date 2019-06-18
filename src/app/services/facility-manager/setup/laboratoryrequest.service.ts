import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LaboratoryRequestService {
  public _socket;
  public _crudSocket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('laboratory-requests');
    this._socket = _socketService.getService('laboratory-requests');
    this._crudSocket = _socketService.getService('crud-lab-request');
    this._crudSocket.timeout = 150000;
    this._socket.timeout = 90000;
    this._socket.on('created', function (laboratoryrequests) {

    });
  }

  find(query: any) {
    return this._socket.find(query);
  }
  customFind(query: any) {
    return this._crudSocket.find(query);
  }

  findAll() {
    return this._socket.find();
  }
  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  create(laboratoryrequest: any) {
    return this._socket.create(laboratoryrequest);
  }

  customCreate(laboratoryrequest: any) {
    return this._crudSocket.create(laboratoryrequest);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(laboratoryrequest: any) {
    return this._rest.update(laboratoryrequest._id, laboratoryrequest);
  }

  patch(_id: any, data: any, param: any) {
    return this._socket.patch(_id, data, param);
  }
}
