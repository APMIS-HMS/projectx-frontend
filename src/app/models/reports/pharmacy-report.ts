export interface DispenseReport {
    dateTime: string;
    patientName: string;
    product: string;
    batch: string;
    quantity: number;
    unitPrice: number;
    totalPrice?: number;
    employeeName: string;
}

export interface PrescriptionReport {
    dateWritten: string;
    patientName: string;
    prescription: string;
    pharmacy: string;
    refillStatus: string;
}

export enum PharmacyTabGroup {
    Dispense = 0,
    Prescription
}

export const PharmacySearchCriteria = {
    ByProvider: 'By User',
    ByPatient: 'By Product'
};
