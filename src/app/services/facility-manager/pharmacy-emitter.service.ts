import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs'//Subject';
import { Prescription } from '../../models/index';

@Injectable()
export class PharmacyEmitterService {
    private _url: string;
    private _urlAnnounceSource = new Subject<string>();
    announcedUrl = this._urlAnnounceSource.asObservable();

    // Code to get prescribed drugs
    private subject = new Subject<any>();

    constructor() { }

    setRouteUrl(value: string) {
        this._urlAnnounceSource.next(value);
    }

    sendPrescription(prescription: any) {
        this.subject.next(prescription);
    }

    getPrescription(): Observable<any> {
        return this.subject.asObservable();
    }

}