import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class LabEventEmitterService {
    private _url: string;
    private _urlAnnounceSource = new Subject<string>();
    private _announceLabSource = new Subject<string>();
    announcedUrl = this._urlAnnounceSource.asObservable();
    announceLab = this._announceLabSource.asObservable();

    constructor() {}

    setRouteUrl(value: string) {
        this._urlAnnounceSource.next(value);
    }

    // This is to change ward
    announceLabChange(value: any) {
        this._announceLabSource.next(value);
    }

}
