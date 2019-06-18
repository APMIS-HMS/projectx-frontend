import { Injectable } from '@angular/core';

export class doctRes{
    id:number;
    unitid:string;
    text:string;  
}
export class levels{
    id:string;
    datasrc:string}

export class clinicRes{
    id:string;
    unitid:string;
    text:string;
    cliniclocation:string;
}

export class consultRoomRes{
    id:string;
   roonname:string;
    cliniclocationid:string;
}

export class appointment{
    _appointmentid:string;
    patientname:string;
    doctorId:number;
    appointmenttype:string;
    startDate:Date;
    endDate:Date;
    reason:string;
    checkin:boolean;

    locationid:string;
    clinicId:string;
    unitid:string;
    consultingroom:string;

    // referral:string;
    // referralid:string;
    // referraldoc:string;
    // status:string;
    // priority:string;
    // slotid:string;
};

let clinicResData:clinicRes[]=
    [{
        id:"1",
        unitid:"1",
        text:"Orthopeadic",
        cliniclocation:"East Wing"
    },
    {
        id:"2",
        unitid:"2",
        text:"Dental Clinic",
        cliniclocation:"West Wing"
    },
    {
        id:"3",
        unitid:"3",
        text:"Optometry",
        cliniclocation:"South Wing"
    }
];
let doctResData:doctRes[]=
    [{
        id:1,
        unitid:"1" ,
        text:"Dr james"
    },
    {
        id:2,
        unitid:"2" ,
        text:"Dr Emma"
    },
    {
        id:3,
        unitid:"1" ,
        text:"Dr james ojo"
    }
];
let consultRoomResData:consultRoomRes[]=
    [{
        id:"1",
        roonname:"Consulting Room A" ,
        cliniclocationid:"5"
    },
    {
        id:"2",
        roonname:"Consulting Room B" ,
        cliniclocationid:"6"
    },
    {
        id:"1",
        roonname:"Consulting Room C" ,
        cliniclocationid:"7"
    }
];

let appointmentData:appointment[]=
[
    {
        _appointmentid:"1",
        patientname:"Psalm" ,
        doctorId:1,
        appointmenttype:"new",
        startDate: new Date(2015, 4, 24, 11, 30),
        endDate: new Date(2015, 4, 24, 13, 2),
        reason:"Heart Transplant",
        checkin:false,

        locationid:"1",
        clinicId:"1",
        unitid:"1",
        consultingroom:"Room 4"
    },
    {
        _appointmentid:"1",
        patientname:"Phil Andrew" ,
        doctorId:2,
        appointmenttype:"new",
        startDate: new Date(2015, 4, 24, 11, 10),
        endDate: new Date(2015, 4, 24, 13, 12),
        reason:"Heart Transplant",
        checkin:false,

        locationid:"1",
        clinicId:"1",
        unitid:"1",
        consultingroom:"Room 5"
    },
    {
        _appointmentid:"1",
        patientname:"Stephen Jonah" ,
        doctorId:3,
        appointmenttype:"new",
        startDate: new Date(2015, 4, 24, 9, 20),
        endDate: new Date(2015, 4, 24, 10, 5),
        reason:"Heart Transplant",
        checkin:false,

        locationid:"1",
        clinicId:"1",
        unitid:"1",
        consultingroom:"Room 4"
    },
    {
        _appointmentid:"1",
        patientname:"Longs Wood" ,
        doctorId:2,
        appointmenttype:"new",
        startDate: new Date(2015, 4, 24, 10, 0),
        endDate: new Date(2015, 4, 24, 10, 15),
        reason:"Heart Transplant",
        checkin:false,

        locationid:"1",
        clinicId:"1",
        unitid:"1",
        consultingroom:"Room 4"
    },
];

@Injectable()
export class Service {
	getAppointmentData() {
		return appointmentData;
	}
    getclinicResData(){
        return clinicResData;
    }
    getconsultRoomResData(){
        return consultRoomResData;
    }
    getdoctResData(){
        return doctResData;
    }
    
}