import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CoolLocalStorage } from 'angular2-cool-storage';

@Injectable()
export class TagService {
  public listner;
  public createListener;
  public _socket;
  public _socketSearch;
  public _suggestPatientTags;
  private _rest;
  private _restLogin;
  constructor(
    private _socketService: SocketService,
    private _socketSearchService: SocketService,
    private _restService: RestService,
    private locker: CoolLocalStorage
  ) {
    this._rest = _restService.getService('service-tags');
    this._socket = _socketService.getService('service-tags');
    this._socketSearch = _socketSearchService.getService('search-tags');
    this._suggestPatientTags = _socketService.getService('suggest-patient-tags');
    this._restLogin = _restService.getService('auth/local');
    this.listner = Observable.fromEvent(this._socket, 'updated');
    this.createListener = Observable.fromEvent(this._socket, 'created');
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
  getSelectedFacilityId() {
    const facility =  <any> this.locker.getObject('selectedFacility');
    return facility;
  }
  create(tag: any) {
    return this._socket.create(tag);
  }
  serach(query) {
    return this._socketSearch.find(query);
  }
  suggestPatientTags(query){
    return this._suggestPatientTags.find(query);
  }
  createSuggestedPatientTags(data){
    return this._suggestPatientTags.create(data);
  }
  update(tag: any) {
    return this._socket.update(tag._id, tag);
  }
  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }

}
