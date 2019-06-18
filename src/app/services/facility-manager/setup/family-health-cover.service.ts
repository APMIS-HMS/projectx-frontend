import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FamilyHealthCover } from '../../../models/facility-manager/setup/familyhealthcover';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');

@Injectable()
export class FamilyHealthCoverService {
  public _socket;
  private _rest;
  private _familyRest;
  public _familySocket;
  public listner;
  public createlistner;
  public deletelistner;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('familyhealthcovereds');
    this._socket = _socketService.getService('familyhealthcovereds');
    this._familyRest = _restService.getService('families');
    this._familySocket = _socketService.getService('families');
    this.createlistner = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.deletelistner = Observable.fromEvent(this._socket, 'deleted');

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

  create(familyhealthcover: FamilyHealthCover) {
    return this._socket.create(familyhealthcover);
  }
  update(familyhealthcover: FamilyHealthCover) {
    return this._socket.update(familyhealthcover._id, familyhealthcover);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

  getFamilyDependant(principalNo, facilityId) {
    const host = this._restService.getHost();
    const path = host + '/family-dependant';
    return request
      .get(path)
      .query({ 'filNo': principalNo, 'facilityId': facilityId}); // query string 
  }

  findFamily(query){
    return this._familySocket.find(query);
  }
  findAllFamilies(){
    return this._familySocket.find();
  }

  getFamily(id: string, query: any) {
    return this._familySocket.get(id, query);
  }

  updateFamily(familyData){
    return this._socket.update(familyData._id, familyData);
  }

}