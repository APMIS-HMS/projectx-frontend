import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InvestigationSpecimenService {
  public _socket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('investigation-specimens');
    this._socket = _socketService.getService('investigation-specimens');
     this._socket.timeout = 90000;
    this._socket.on('created', function (investigationspecimens) {

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

  create(investigationSpecimen: any) {
    return this._socket.create(investigationSpecimen);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(investigationSpecimen: any) {
    return this._socket.update(investigationSpecimen._id, investigationSpecimen);
  }
}
