import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class PolicyService {
  public _socket;
  private _rest;

  private policyAnnouncedSource = new Subject<Object>();
  policyAnnounced$ = this.policyAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('policies');
    this._socket = _socketService.getService('policies');
     this._socket.timeout = 50000;
    this._socket.on('created', function (policy) {

    });
  }
  announcePolicy(policy: Object) {
    this.policyAnnouncedSource.next(policy);
  }
  receivePolicy(): Observable<Object> {
    return this.policyAnnouncedSource.asObservable();
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

  create(policy: any) {
    return this._socket.create(policy);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  update(policy: any) {
    return this._socket.update(policy._id, policy);
  }

  Policies(facilityId, policyId?, search?) {
    const host = this._restService.getHost();
    const path = host + '/distinct-policy-plans';
    return request
      .get(path)
      .query({ facilityId: facilityId, policyId:policyId, search:search });
  }
}
