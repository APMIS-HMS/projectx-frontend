import { Injectable } from '@angular/core';

export class doctRes {
    id: string;
    unitid: string;
    text: string;
}
export class levels {
    id: string;
    datasrc: string
}

export class clinicRes {
    id: string;
    unitid: string;
    text: string;
    cliniclocation: string;
    schedules: any
}

export class locationRes {
    id: string;
    text: string;
}

export class consultRoomRes {
    id: string;
    roonname: string;
    cliniclocationid: string;
}

export class appointment {
    _appointmentid: string;
    patientname: string;
    doctorId: string;
    appointmenttype: string;
    startDate: Date;
    endDate: Date;
    reason: string;
    checkin: boolean;

    locationId: string;
    clinicId: string;
    unitid: string;
    consultingroom: string;
    scheduleId: string;

    // referral:string;
    // referralid:string;
    // referraldoc:string;
    // status:string;
    // priority:string;
    // slotid:string;
};

let clinicResData: clinicRes[] =
    [{
        id: '1',
        unitid: '1',
        text: 'Orthopeadic',
        cliniclocation: 'East Wing',
        schedules: []
    },
    {
        id: '2',
        unitid: '2',
        text: 'Dental Clinic',
        cliniclocation: 'West Wing',
        schedules: []
    },
    {
        id: '3',
        unitid: '3',
        text: 'Optometry',
        cliniclocation: 'South Wing',
        schedules: []
    }
    ];
let doctResData: doctRes[] =
    [{
        id: '1',
        unitid: '1',
        text: 'Dr james'
    },
    {
        id: '2',
        unitid: '2',
        text: 'Dr Emma'
    },
    {
        id: '3',
        unitid: '1',
        text: 'Dr james ojo'
    }
    ];
let consultRoomResData: consultRoomRes[] =
    [{
        id: '1',
        roonname: 'Consulting Room A',
        cliniclocationid: '5'
    },
    {
        id: '2',
        roonname: 'Consulting Room B',
        cliniclocationid: '6'
    },
    {
        id: '1',
        roonname: 'Consulting Room C',
        cliniclocationid: '7'
    }
    ];

let appointmentData: appointment[] =
    [
        {
            _appointmentid: '1',
            patientname: 'Psalm',
            doctorId: '586cb56e4cb2260f00b581b1',
            appointmenttype: 'new',
            startDate: new Date(2015, 4, 24, 11, 30),
            endDate: new Date(2015, 4, 24, 13, 2),
            reason: 'Heart Transplant',
            checkin: false,

            locationId: '58af65af4e9d55292c4d6080',
            clinicId: '58b700cb636560168c61568d',
            unitid: '1',
            consultingroom: 'Room 4',
            scheduleId: '58c9445f06ed861db848ccc4'
        },
        {
            _appointmentid: '1',
            patientname: 'Phil Andrew',
            doctorId: '586f88e212d13a1654dcdf9b',
            appointmenttype: 'new',
            startDate: new Date(2015, 4, 24, 11, 10),
            endDate: new Date(2015, 4, 24, 13, 12),
            reason: 'Heart Transplant',
            checkin: false,

            locationId: '58c8f1d9e7e23f2c5c6fc114',
            clinicId: '58b700cb636560168c61569d',
            unitid: '1',
            consultingroom: 'Room 5',
            scheduleId: '58c9513038b8710c648203df'
        },
        {
            _appointmentid: '1',
            patientname: 'Stephen Jonah',
            doctorId: '58779b57442ffe2bbc3c87cb',
            appointmenttype: 'new',
            startDate: new Date(2015, 4, 24, 9, 20),
            endDate: new Date(2015, 4, 24, 10, 5),
            reason: 'Heart Transplant',
            checkin: false,

            locationId: '58c8f1d9e7e23f2c5c6fc114',
            clinicId: '58b700cb636560168c61568d',
            unitid: '1',
            consultingroom: 'Room 4',
            scheduleId: '58c9445f06ed861db848ccc3'
        },
        {
            _appointmentid: '1',
            patientname: 'Longs Wood',
            doctorId: '586f88e212d13a1654dcdf9b',
            appointmenttype: 'new',
            startDate: new Date(2015, 4, 24, 10, 0),
            endDate: new Date(2015, 4, 24, 10, 15),
            reason: 'Heart Transplant',
            checkin: false,

            locationId: '58c8f1d9e7e23f2c5c6fc114',
            clinicId: '58b700cb636560168c61569d',
            unitid: '1',
            consultingroom: 'Room 4',
            scheduleId: '58c9513038b8710c648203df'
        },
    ];

@Injectable()
export class Service {
    getAppointmentData() {
        return appointmentData;
    }
    getclinicResData() {
        return clinicResData;
    }
    getconsultRoomResData() {
        return consultRoomResData;
    }
    getdoctResData() {
        return doctResData;
    }

}