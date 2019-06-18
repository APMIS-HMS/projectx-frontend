import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { AppointmentReport } from 'app/models/reports/clinic-attendance';

@Injectable()
export class AppointmentReportService {
public _socket;
public _rest;
appointments: AppointmentReport[] = [];
constructor(private socketService: SocketService, private restService: RestService) {
    this._socket = this.socketService.getService('appointments-summary-report');
    this._rest = this.restService.getService('appointments-summary-report');

    // this.appointments = [
    //     {
    //       provider: 'Dr. Kemi Awosile',
    //       dateTime: '12:20 PM',
    //       patientName: 'Oyelola Ola',
    //       apmisId: '***89J',
    //       phone: '080807487585',
    //       appointmentType: 'new',
    //       status: 'Checked In'
    //     },
    //     {
    //       provider: 'Dr. Kemi Awosile',
    //       dateTime: '12:20 PM',
    //       patientName: 'Oyelola Ola',
    //       apmisId: '***0LB',
    //       phone: '080807487585',
    //       appointmentType: 'registration',
    //       status: 'Checked Out'
    //     }
    //   ];
    }

    find(query) {
        // const appointmentPromise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(this.appointments);
        //     }, 1000);
        // });
        // return appointmentPromise;
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
