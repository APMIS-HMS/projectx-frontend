import { DispenseReport } from './../../../models/reports/pharmacy-report';
import { Injectable } from '@angular/core';
import { SocketService, RestService } from 'app/feathers/feathers.service';

@Injectable()
export class DispenseReportService {
    _socket;
    _rest;
    dispenses: DispenseReport[] = [];
    constructor(private socketService: SocketService, private restService: RestService) {
        this._socket = this.socketService.getService('dispense-report');
        this._rest = this.restService.getService('dispense-report');
        // this.dispenses = [
        //     {
        //         dateTime : '12/Oct/2018',
        //         patientName: 'Kemi Awosile',
        //         product: 'Penicilin',
        //         batch: 'BC/0032',
        //         quantity: 2,
        //         unitPrice: 200,
        //         employeeName: 'Mr Olutayo Ojo'
        //     },
        //     {
        //         dateTime : '12/Oct/2018',
        //         patientName: 'Joke Silva',
        //         product: 'Panadol',
        //         batch: 'APC/0022',
        //         quantity: 5,
        //         unitPrice: 500,
        //         employeeName: 'Mr Oluwatosin Ojo'
        //     }
        // ];
    }

    find(query) {
        // const dispensePromise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(this.dispenses);
        //     }, 1000);
        // });
        // return dispensePromise;
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
