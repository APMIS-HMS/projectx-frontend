import { DispenseItem } from './dispense-item';
export interface DispenseByNoprescription {
    patientId?: string,
    client?: string,
    employeeId?: string,
    unitId?: string,
    locationId?: string,
    drugs: [DispenseItem],
    firstName?: string,
    lastName?: string,
    phoneNumber?: string,
    companyName?: string,
    companyPhone?:string,
    totalQuantity?: number,
    totalCost?: number
}