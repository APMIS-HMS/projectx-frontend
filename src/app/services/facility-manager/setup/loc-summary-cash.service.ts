import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class LocSummaryCashService {
   private _socket;
  constructor(private _socketService: SocketService) {
    this._socket = _socketService.getService('loc-summary-cashes');
  }

  get(id: string, query: any) {
    return this._socket.get(id, query);
  }
}

