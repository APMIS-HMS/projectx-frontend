import { Injectable } from '@angular/core';
import { SocketService, RestService } from 'app/feathers/feathers.service';
import { PrescriptionReport } from 'app/models/reports/pharmacy-report';

@Injectable()
export class PrescriptionReportService {
_socket;
_rest;
prescriptions: PrescriptionReport[] = [];
    constructor(private socketService: SocketService, private restService: RestService) {
        this._socket = this.socketService.getService('prescription-report');
        this._rest = this.socketService.getService('prescription-report');
        // this.prescriptions = [
        //     {
        //         dateWritten: '22/Oct/2018',
        //         patientName: 'Joke Silva',
        //         prescription: 'Panadol',
        //         pharmacy: 'POG',
        //         refillStatus: 'fulfilld'
        //     },
        //     {
        //         dateWritten: '21/Nov/2018',
        //         patientName: 'Olu Jacobs Silva',
        //         prescription: 'Paracetamol',
        //         pharmacy: 'Ward 2',
        //         refillStatus: 'Partial'
        //     }
        // ];
    }

    find(query) {
        // const prescriptionPromise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(this.prescriptions);
        //     }, 1000);
        // });
        // return prescriptionPromise;
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
