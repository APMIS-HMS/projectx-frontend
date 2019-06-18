import { DispenseByPrescription } from './dispense-by-prescription';
import { DispenseByNoprescription } from './dispense-by-noprescription';
export interface Dispense {
    facilityId: string,
    prescription?: DispenseByPrescription,
    isPrescription: boolean,
    nonPrescription?: DispenseByNoprescription,
    storeId: string,
}