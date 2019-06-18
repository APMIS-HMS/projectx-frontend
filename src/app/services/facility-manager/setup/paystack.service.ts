import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class PayStackService {
  public _socket;
  private _rest;

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('paystacks');
    this._socket = _socketService.getService('paystacks');
    this._socket.on('created', function (gender) {
    });
  }


  paystack(payload) {
    const host = this._restService.getHost();
    const path = host + '/paystack';
    return request
      .post(path)
      .send(payload);
  }

  verifyTransaction(payload) {
    const host = this._restService.getHost();
    const path = host + '/paystack';
    return request
      .post(path)
      .send(payload);
  }

}
 
  
































































































































