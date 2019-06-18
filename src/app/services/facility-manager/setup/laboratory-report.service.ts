import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LaboratoryReportService {
  public _socket;
  public _customSocket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('laboratoryreports');
    this._socket = _socketService.getService('laboratoryreports');
    this._customSocket = _socketService.getService('crud-lab-report');
    this._customSocket.timeout = 90000;
    // this._socket.timeout = 90000;
    this._socket.on('created', function (laboratoryreports) {

    });
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

  create(laboratoryreport: any) {
    return this._socket.create(laboratoryreport);
  }

  customCreate(laboratoryreport: any) {
    return this._customSocket.create(laboratoryreport);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(laboratoryreport: any) {
    return this._socket.update(laboratoryreport._id, laboratoryreport);
  }
}
