import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PrescriptionPriorityService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('prescription-priorities');
    this._socket = _socketService.getService('prescription-priorities');
    this._socket.on('created', function (prescriptionpriorities) {
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

  create(prescriptionpriority: any) {
    return this._socket.create(prescriptionpriority);
  }

  update(prescriptionpriority: any) {
    return this._socket.update(prescriptionpriority._id, prescriptionpriority);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}