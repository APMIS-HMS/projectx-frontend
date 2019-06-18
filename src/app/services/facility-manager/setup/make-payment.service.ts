import { SocketService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MakePaymentService {
  public _socket;
  constructor(
    private _socketService: SocketService) {
    this._socket = _socketService.getService('make-payments');
    
  }

  create(obj: any) {
    return this._socket.create(obj);
  }

}
