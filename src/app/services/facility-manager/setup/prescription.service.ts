import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PrescriptionService {
  public _socket;
  public _customSocket;
  public _autorizeSocket;
  public _billSocket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('prescriptions');
    this._socket = _socketService.getService('prescriptions');
    this._customSocket = _socketService.getService('get-prescription');
    this._autorizeSocket = _socketService.getService('authorize-prescription');
    this._billSocket = _socketService.getService('bill-prescription');
    this._socket.timeout = 150000;
    this._autorizeSocket.timeout = 150000;
    this._socket.on('created', function (gender) {
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

  create(prescription: any) {
    // return this._rest.create(prescription);
    return this._socket.create(prescription);
  }

  billCreate(prescription: any) {
    return this._billSocket.create(prescription);
  }

  customGet(prescription: any) {
    return this._customSocket.create(prescription);
  }

  update(prescription: any) {
    return this._socket.update(prescription._id, prescription);
  }

  billUpdate(prescription: any) {
    return this._billSocket.update(prescription._id, prescription);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  authorizePresciption(prescription) {
    return this._autorizeSocket.create(prescription);
  }

}
