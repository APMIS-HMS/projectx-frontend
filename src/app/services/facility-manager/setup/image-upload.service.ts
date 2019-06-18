import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';


@Injectable()
export class ImageUploadService {
  public listner;
  public _socket;
  public _imageSocket;
  private _rest;
  // private _restLogin;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    private sanitizer: DomSanitizer,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('image');
    this._socket = _socketService.getService('image');
    this._imageSocket = _socketService.getService('file-upload-facade');
    this._imageSocket.timeout = 60000;
    // this._restLogin = _restService.getService('auth/local');
    // this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  find(query: any) {
    return this._rest.find(query);
  }

  findAll() {
    return this._rest.find();
  }
  get(id: string, query: any) {
    return this._rest.get(id, query);
  }
  create(facility: any) {
    return this._rest.create(facility);
  }
  createImageFacade(payload: any) {
    return this._imageSocket.create(payload);
  }
  update(facility: any) {
    return this._socket.update(facility._id, facility);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
