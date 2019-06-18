import { Observable } from 'rxjs/Observable';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';
const request = require('superagent');


@Injectable()
export class DocumentUploadService {
  public listner;
  public _socket;
  private _rest;
  private duService;
  // private _restLogin;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('upload-doc');
    this._socket = _socketService.getService('upload-doc');
    this.duService = _socketService.getService('doc-upload');
    // this._restLogin = _restService.getService('auth/local');
    this.listner = Observable.fromEvent(this._socket, 'created');
  }
  find(query: any) {
    return this._rest.find(query);
  }

  socketFind(query:any){
    return this._socket.find(query);
  }

  findAll() {
    return this._rest.find();
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }
  create(doc: any, param) {
    return this._socket.create(doc, param);
  }
  update(facility: any) {
    return this._socket.update(facility._id, facility);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  docUploadFind(query: any){
    return this.duService.find(query);
  }

  post(body: any) {
    // const host = this._restService.getHost();
    // const path = host + '/upload-facade';
    // return request
    //     .post(path)
    //     .send(body);

    return this._socketService.getService('upload-facade').create(body);
  }

}
