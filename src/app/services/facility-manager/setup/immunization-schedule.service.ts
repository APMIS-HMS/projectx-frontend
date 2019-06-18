import { SocketService, RestService } from "../../../feathers/feathers.service";
import { Injectable } from "@angular/core";

@Injectable()
export class ImmunizationScheduleService {
  public _customSocket;
  private _customRest;
  public _socket;
  private _rest;
  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService("immunization-schedule");
    this._socket = _socketService.getService("immunization-schedule");
    this._customRest = _restService.getService("crud-immunization-schedule");
    this._customSocket = _socketService.getService(
      "crud-immunization-schedule"
    );
    this._socket.timeout = 50000;
    this._socket.on("created", function(immuneSchedule) {});
    // this.listenerCreate = Observable.fromEvent(this._socket, 'created');
    // this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
    // this.listenerDelete = Observable.fromEvent(this._socket, 'deleted');
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

  customCreate(immuneSchedule: any) {
    return this._customSocket.create(immuneSchedule);
  }
  
  customUpdate(immuneSchedule: any) {
    return this._customSocket.update(immuneSchedule._id, immuneSchedule);
  }

  update(immuneSchedule: any) {
    return this._socket.update(immuneSchedule._id, immuneSchedule);
  }

  create(immuneSchedule: any) {
    return this._socket.create(immuneSchedule);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
}
