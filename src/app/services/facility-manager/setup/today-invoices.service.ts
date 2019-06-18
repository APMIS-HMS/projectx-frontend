import { SocketService} from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TodayInvoiceService {
  private _socket;
  constructor(private _socketService: SocketService) {
    this._socket = _socketService.getService('today-invoices');
  }

  get(id: string, query: any) {
    return this._socket.get(id, query);
  }

}

