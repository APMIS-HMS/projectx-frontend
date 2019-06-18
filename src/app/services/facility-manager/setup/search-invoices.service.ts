import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SearchInvoicesService {
  private _rest;
  constructor(
    private _restService: RestService
  ) {
    this._rest = _restService.getService('search-invoices');
  }

  create(obj: any) {
    return this._rest.create(obj);
  }

}
