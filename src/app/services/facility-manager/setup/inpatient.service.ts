import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class InPatientService {
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
    private _restService: RestService,
    private _http: Http
  ) {
    this._rest = _restService.getService('in-patients');
    this._socket = _socketService.getService('in-patients');
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

  customCreate(inpatient: any) {
    return this._customSocket.create(inpatient);
  }

  create(inpatient: any) {
    return this._socket.create(inpatient);
  }

  update(inpatient: any) {
    return this._socket.update(inpatient._id, inpatient);
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

  // public admit(transfer): Promise<any> {
  //   const host = this._restService.getHost() + '/admit-patient';
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json');

  //   return this._http.post(host, transfer, { headers: headers }).toPromise()
  //     .then((res) => this.extractData(res)).catch(error => this.handleErrorPromise(error));
  // }

  // public discharge(discharge): Promise<any> {
  //   const host = this._restService.getHost() + '/discharge-patient';
  //   const headers = new Headers();
  //   headers.append('Content-Type', 'application/json');

  //   return this._http.post(host, discharge, { headers: headers }).toPromise()
  //     .then((res) => this.extractData(res)).catch(error => this.handleErrorPromise(error));
  // }

  // private extractData(res: Response) {
	//   let body = res.json();
  //   return body || {};
  // }

  // private handleErrorObservable (error: Response | any) {
	//   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   return Observable.throw(errMsg);
  // }

  // private handleErrorPromise (error: Response | any) {
  //   let errMsg: string;
  //   if (error instanceof Response) {
  //     const body = error.json() || '';
  //     const err = body.error || JSON.stringify(body);
  //     errMsg = `${error.status} ${error.statusText || ''} - ${err}`;
  //   } else {
  //     errMsg = error.message ? error.message : error.toString();
  //   }
  //   return Promise.reject(errMsg);
  // }

  // discharge(discharge) {
  //   const host = this._restService.getHost() + '/discharge-patient';
  //   return new Promise((resolve, reject) => {
  //     resolve(request.get(path).query(dischage));
  //   });
  // }
}
