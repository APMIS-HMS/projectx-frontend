export interface ImmunizationSchedule {
    _id: string;
    facilityId: string;
    name?: string;
    immuneServiceId: string;
    vaccineName: string;
    vaccineNameCode: string;
    code: string;
    numberOfDosage: number;
    vaccinationSite: string;
    dosage: string;
    vaccineServiceId: string;
    intervals: any[];
}
