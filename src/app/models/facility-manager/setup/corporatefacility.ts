export interface CorporateFacility {
    _id: string;
    name: string;
    email: string;
    contactPhoneNo: string;
    contactFullName: string;
    address: any;
    verificationToken: string;
    website: string;
    facilityItem?: any;
    countryItem?: any;
    departments: any[];
    logo: any;
    isTokenVerified: boolean;
    logoObject: any;
}
