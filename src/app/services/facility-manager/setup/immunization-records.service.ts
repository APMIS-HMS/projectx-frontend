import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
// import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class ImmunizationRecordService {
    public _socket;
    public _customSocket;
    private _rest;
    public listenerCreate;
    public listenerUpdate;

    constructor(
        private _socketService: SocketService,
        private _restService: RestService,
    ) {
        this._rest = _restService.getService('immunization-records');
        this._socket = _socketService.getService('immunization-records');
        this._customSocket = _socketService.getService('crud-immunization-record');
        this._socket.timeout = 50000;
        this._socket.on('created', function (documentation) {
        });
        this.listenerCreate = Observable.fromEvent(this._socket, 'created');
        this.listenerUpdate = Observable.fromEvent(this._socket, 'updated');
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
    update(record: any) {
        return this._socket.update(record._id, record, {});
    }
    customUpdate(recordId: string, record: any) {
        return this._customSocket.update(recordId, record, {});
    }
    patch(record: any) {
        return this._socket.patch(record._id, record, {});
    }
    remove(id: string, query: any) {
        return this._socket.remove(id, query);
    }
}
