import { DispenseItem } from './dispense-item';
export interface DispenseByPrescription {
    _id?: string,
    prescriptionId: string,
    employeeId: string,
    patientId: string,
    drugs: DispenseItem[],
    totalQuantity?: number,
    totalCost?: number
}