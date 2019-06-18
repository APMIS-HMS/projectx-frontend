import { Injectable } from '@angular/core';
import { SocketService, RestService } from '../../../feathers/feathers.service';
import { ClinicAttendance } from 'app/models/reports/clinic-attendance';
import { Observable } from 'rxjs';

@Injectable()
export class ClinicAttendanceReportService {
private _socket;
private _rest;
visits: ClinicAttendance[] = [];
constructor(private socketService: SocketService,
    private restService: RestService) {
        this._socket = this.socketService.getService('clinic-attendance-summary');
        this._rest = this.restService.getService('clinic-attendance-summary');

        // this.visits = [{
        //     date: '11/7/2018 - current date',
        //     clinicName: 'Clinic 1',
        //     totalCheckedInPatients: 200,
        //     new: {
        //       total: 20,
        //       totalFemale: 10,
        //       totalMale: 15
        //     },
        //     followUp: {
        //       total: 200,
        //       totalFemale: 180,
        //       totalMale: 20
        //     }
        //   },
        //   {
        //     date: '11/7/2018 - current date',
        //     clinicName: 'Clinic 2',
        //     totalCheckedInPatients: 200,
        //     new: {
        //       total: 40,
        //       totalFemale: 5,
        //       totalMale: 55
        //     },
        //     followUp: {
        //       total: 200,
        //       totalFemale: 80,
        //       totalMale: 120
        //     }
        //   }];
    }

    find(query) {
        // const visitPromise = new Promise((resolve) => {
        //     setTimeout(() => {
        //         resolve(this.visits);
        //     }, 1000);
        // });
        // return visitPromise;
        return this._socket.find(query);
    }
    get(query) {
        return this._socket.find(query);
    }
}
