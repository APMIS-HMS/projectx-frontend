export interface Patient {
    _id: string;
    facilityId: any;
    personId: any;
    isActive: boolean;
    facilityDetails: any;
    personDetails: any;
    nextOfKin?: any;
    tags?:any;
    clientsNo:any;
    age?:any;
}
