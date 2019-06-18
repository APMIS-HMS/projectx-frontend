import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class TreatmentSheetService {
  public _socket;
  private _rest;
  public _socketTreatment;
  public listenerCreate;
  public listenerUpdate;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    // private sanitizer: DomSanitizer
  ) {
    this._rest = _restService.getService('treatment-sheets');
    this._socket = _socketService.getService('treatment-sheets');
    this._socketTreatment = _socketService.getService('set-treatment-sheet-bills');
    this._socket.timeout = 50000;
    this._socketTreatment.timeout = 50000;
    this._socket.on('created', function (treatment) {
    });
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
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

  create(treatment: any) {
    return this._socket.create(treatment);
  }

  setTreatmentSheet(object: any,query) {
    return this._socketTreatment.create(object,query);
  }

  updateTreatmentSheet(id, data: any, params: any) {
    return this._socketTreatment.patch(id, data, {});
  }

  patchTreatmentSheetMedication(id, data: any, params: any) {
    return this._socketTreatment.update(id, data, {});
  }

  update(treatment: any) {
    return this._socket.update(treatment._id, treatment, {});
  }

  patch(id, data, query: any) {
    return this._socket.patch(id, data, query);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
