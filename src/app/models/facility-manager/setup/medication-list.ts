export interface MedicationList {
    facilityId: string,
    dispenseById: string,
    dispenseId: string,
    storeId: string,
    prescriptionId: string,
    statusId?: string,
    patientId: string,
    medicationEndDate: Date
}