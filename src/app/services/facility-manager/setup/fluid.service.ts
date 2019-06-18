import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class FluidService {
  public listner;
  public _socket;
  private _rest;
  private _patientRest;
  public _patientSocket;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('fluid');
    this._socket = _socketService.getService('fluid');
    this._patientRest = _restService.getService('patientfluids');
    this._patientSocket = _socketService.getService('patientfluids');
    this._socket.timeout = 50000;
    this._patientSocket.timeout = 500;
    this._socket.on('created', function (fluid) {
    });
    this._patientSocket.on('created', function (patientfluid) {
    });
  }

  find(query: any) {
    return this._socket.find(query);
  }

  findPatientFluid(query: any) {
    return this._patientSocket.find(query);
  }

  findAll() {
    return this._socket.find();
  }

  findAllPatientFluids() {
    return this._patientSocket.find();
  }

  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

  getPatientFluids(id: string, query: any) {
    return this._patientSocket.get(id, query);
  }

  create(fluid: any) {
    return this._socket.create(fluid);
  }

  createPatientFluid(fluid: any) {
    return this._patientSocket.create(fluid);
  }

  update(fluid: any) {
    return this._socket.update(fluid._id, fluid);
  }

  updatePatientFluid(fluid: any) {
    return this._patientSocket.update(fluid._id, fluid);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  removePatientFluid(id: string, query: any) {
    return this._patientSocket.remove(id, query);
  }
}
