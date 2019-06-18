import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InvestigationReportTypeService {
  public _socket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('investigationreporttypes');
    this._socket = _socketService.getService('investigationreporttypes');
     this._socket.timeout = 90000;
    this._socket.on('created', function (investigationreporttypes) {

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

  create(investigationreporttype: any) {
    return this._socket.create(investigationreporttype);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(investigationreporttype: any) {
    return this._socket.update(investigationreporttype._id, investigationreporttype);
  }
}
