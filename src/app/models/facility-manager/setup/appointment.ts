import { ClinicInteraction } from './clinicinteraction';
export interface Appointment {
    _id: string;
    facilityId: string;
    clinicId: any;
    appointmentTypeId: string;
    doctorId: string;
    startDate: Date;
    locationId: string;
    endDate: Date;
    allDay: boolean;
    attendance: any;
    encounters: [any];
    patientId: string;
    scheduleId: string;
    appointmentReason: string;
    isActive: boolean;
    personDetails: any;
    checkIn: boolean;
    clinicInteractions: ClinicInteraction[];
    category: any;
    orderStatusId: any;
    zoom: any;
    isEngaged:any;
    isCheckedOut:any;
    patientDetails:any;
    providerDetails:any;
    hasDoneVital:any;
}
