export interface Employee {
    _id: string;
    facilityId: any;
    personId: any;
    departmentId: any;
    minorLocationId: any;
    officialContactNumber: string;
    officialEmailAddress: string;
    professionId: string;
    employeeFacilityDetails: any;
    employeeDetails: any;
    cadre: string;
    homeAddress: any;
    units: any[];
    isActive: boolean;
    isChecked: boolean;
    professionObject: any;
    consultingRoomCheckIn: any[];
    storeCheckIn: any[];
    wardCheckIn: any[];
    workbenchCheckIn: any[];
    workSpaces: any[];
    unitDetails: any[];
    personDetails?:any;
}
