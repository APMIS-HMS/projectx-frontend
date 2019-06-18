import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
@Injectable()
export class VitalService {
    public _vitalRest;

    private missionAnnouncedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    constructor(
        private _socketService: SocketService,
        private _restService: RestService) { }

    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }

    post(body: any, params: any) {
        const host = this._restService.getHost();
        const path = host + '/vitals?patientId=' + params.patientId + '&personId=' + params.personId;
        return request
            .post(path)
            .send(body);
    }
    create(vital: any, params: any) {
        return this._socketService.getService('vitals').create(vital, { query: params });
    }
}
