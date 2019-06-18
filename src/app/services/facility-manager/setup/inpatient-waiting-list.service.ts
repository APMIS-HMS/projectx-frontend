import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class InPatientListService {
  public _socket;
  public _customSocket;
  private _rest;
  public listenerCreate;
  public listenerUpdate;
  public listenerDelete;
  private inPatientItem;

  private missionAnnouncedSource = new Subject<any>();
  missionAnnounced$ = this.missionAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private sanitizer: DomSanitizer,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('inpatient-waiting-lists');
    this._socket = _socketService.getService('inpatient-waiting-lists');
    this._customSocket = _socketService.getService('admit-patients');
    this._socket.timeout = 50000;
    this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');

  }
  transform(url) {
    url = this._restService.getHost() + '/' + url + '?' + new Date().getTime();
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
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
  customGet(data: any, query: any) {
    return this._customSocket.get(data, query);
  }

  create(inpatientwaitinglist: any) {
    return this._socket.create(inpatientwaitinglist);
  }
  update(inpatientwaitinglist: any) {
    return this._socket.update(inpatientwaitinglist._id, inpatientwaitinglist);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  announceMission(mission: any) {
    this.missionAnnouncedSource.next(mission);
  }

  getAnnounceMission() {
    return this.inPatientItem;

  }
}
