import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const request = require('superagent');

@Injectable()
export class EmployeeService {
  public _socket;
  public _assignSocket;
  private _rest;
  public listner;
  public createListener;

  private checkInAnnouncedSource = new Subject<any>();
  checkInAnnounced$ = this.checkInAnnouncedSource.asObservable();

  private employeeAnnouncedSource = new Subject<any>();
  employeeAnnounced$ = this.employeeAnnouncedSource.asObservable();

  private loginEmployeeAnnouncedSource = new Subject<any>();
  loginEmployeeAnnounced$ = this.loginEmployeeAnnouncedSource.asObservable();

  constructor(
    private _socketService: SocketService,
    private _restService: RestService
  ) {
    this._rest = _restService.getService('employees');
    this._socket = _socketService.getService('employees');
    this._assignSocket = _socketService.getService('assign-employee-unit');
    this._socket.timeout = 30000;
    this.createListener = Observable.fromEvent(this._socket, 'created');
    this.listner = Observable.fromEvent(this._socket, 'updated');
  }
  announceCheckIn(checkIn: any) {
    this.checkInAnnouncedSource.next(checkIn);
  }

  announceEmployee(employee: any) {
    this.employeeAnnouncedSource.next(employee);
  }
  announceLoginEmployee(employee: any) {
    this.loginEmployeeAnnouncedSource.next(employee);
  }
  InitializeEvent(event) {
    const observable = new Observable(observer => {
      this._socket.on(event, (data) => {
        observer.next(data);
      });
      return () => {
        this._socket.disconnect();
      };
    });
    return observable;
  }
  RxfromIO(io, eventName) {
    return Observable.create(observer => {
      io.on(eventName, (data) => {
        observer.onNext(data);
      });
      return {
        dispose: io.close
      };
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

  create(employee: any) {
    return this._socket.create(employee);
  }

  saveEmployee(employee: any) {
    return this._socketService.getService('save-employee').create(employee);
  }

  remove(id: string, query: any) {
    return this._socket.remove(id, query);
  }
  update(employee: any) {
    return this._socket.update(employee._id, employee);
  }
  assignUnit(body: any) {
    return this._assignSocket.update(body.unitId, body.employees);
  }
  updateMany(employees: any) {
    return this._socket.update('employees._id', employees);
  }
  patchMany(data: any, param: any) {
    return this._socket.patch(null, data, param);
  }
  patch(id, data: any) {
    return this._socket.patch(id, data);
  }
  searchEmployee(facilityId: string, searchText: string, showbasicinfo: boolean) {
    const host = this._restService.getHost();
    const path = host + '/employee';
    return request
      .get(path)
      .query({ facilityid: facilityId, searchtext: searchText, showbasicinfo }); // query string 
  }

}
