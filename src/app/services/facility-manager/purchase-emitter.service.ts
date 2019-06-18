import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PurchaseEmitterService {
    private _url: string;
    private _urlAnnounceSource = new Subject<string>();
    announcedUrl = this._urlAnnounceSource.asObservable();

    constructor() { }

    setRouteUrl(value: string) {
        this._urlAnnounceSource.next(value);
    }
}
