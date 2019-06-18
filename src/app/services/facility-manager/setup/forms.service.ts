import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FormsService {
  public _socket;
  private _rest;
  private announceSource = new Subject<any>();
  announce$ = this.announceSource.asObservable();

  private returnAnnounceSource = new Subject<any>();
  returnAnnounce$ = this.returnAnnounceSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('forms');
    this._socket = _socketService.getService('forms');
    this._socket.timeout = 30000;
    this._socket.on('created', function (gender) {
    });
  }
  announceFormCreation(form: any) {
    this.announceSource.next(form);
  }

  announceFormEdit(form: any) {
    this.returnAnnounceSource.next(form);
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

  create(form: any) {
    return this._socket.create(form);
  }
  update(form: any) {
    return this._socket.update(form._id, form);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
