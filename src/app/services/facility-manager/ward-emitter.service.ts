import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class WardEmitterService {
    private _url: string;
    private _urlAnnounceSource = new Subject<string>();
    private _announceWardSource = new Subject<string>();
    announcedUrl = this._urlAnnounceSource.asObservable();
    announceWard = this._announceWardSource.asObservable();

    constructor() {}

    setRouteUrl(value: string) {
        this._urlAnnounceSource.next(value);
    }

    // This is to change ward
    announceWardChange(value: any) {
        this._announceWardSource.next(value);
    }

}
