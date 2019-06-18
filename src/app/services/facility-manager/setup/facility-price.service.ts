import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class FacilityPriceService {
  public _socket;
  private _rest;
  private listner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('facility-prices');
    this._socket = _socketService.getService('facility-prices');
    this._socket.on('created', function (facilityprices) {
    });
    this.listner = Observable.fromEvent(this._socket, 'remove');
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

  create(facilityprice: any) {
    return this._socket.create(facilityprice);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
