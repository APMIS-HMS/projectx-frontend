import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';

@Injectable()
export class SecurityQuestionsService {
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('security-questions');
    this._socket = _socketService.getService('security-questions');
    this._socket.timeout = 30000;
    this._socket.on('created', function (securityQuestions) {
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

  create(securityQuestions: any) {
    return this._socket.create(securityQuestions);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}