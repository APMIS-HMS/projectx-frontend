import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class RadiologyInvestigationService {
  public _socket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('radiology-investigations');
    this._socket = _socketService.getService('radiology-investigations');
     this._socket.timeout = 10000;
    this._socket.on('created', function (radiologyInvestigations) {

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

  create(radiologyInvestigation: any) {
    return this._socket.create(radiologyInvestigation);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(radiologyInvestigation: any) {
    return this._socket.update(radiologyInvestigation._id, radiologyInvestigation);
  }
}
