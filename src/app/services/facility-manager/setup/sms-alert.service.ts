import { SocketService, RestService } from '../../../feathers/feathers.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
const request = require('superagent');
@Injectable()
export class SmsAlertService {
    
    private missionAnnouncedSource = new Subject<string>();
    missionAnnounced$ = this.missionAnnouncedSource.asObservable();
    constructor(
        private _socketService: SocketService,
        private _restService: RestService) {}

    announceMission(mission: string) {
        this.missionAnnouncedSource.next(mission);
    }

    async post(body: any, params:any) {
        const host = this._restService.getHost();
        const path = host + '/send-sms?content=' + params.content +'&sender='+params.sender+'&receiver='+params.receiver;
        return request
            .post(path)
            .send(body);
    }
}
