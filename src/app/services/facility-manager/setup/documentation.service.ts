import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class DocumentationService {
  public _socket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;

  private announceDocumentationSource = new Subject<any>();
  announceDocumentation$ = this.announceDocumentationSource.asObservable();

  // private returnAnnounceSource = new Subject<any>();
  // returnAnnounce$ = this.returnAnnounceSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService,
    // private sanitizer: DomSanitizer
  ) {
    this._rest = _restService.getService('documentations');
    this._socket = _socketService.getService('documentations');
    this._socket.timeout = 50000;
    this._socket.on('created', function (documentation) {
    });
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?' + new Date().getTime();
    // return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  announceDocumentation(documentation: any) {
    this.announceDocumentationSource.next(documentation);
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

  create(vital: any) {
    return this._socket.create(vital);
  }
  update(document: any) {
    return this._socket.update(document._id, document,{});
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  addAddendum(addendum: any, query) {
    return this._socketService.getService('add-addendum').create(addendum, query);
  }
}
