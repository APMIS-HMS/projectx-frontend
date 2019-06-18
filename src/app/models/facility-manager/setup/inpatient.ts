import {WardTransfer} from './wardtransfer';
import {WardDischarge} from './warddischarge'
export interface InPatient {
  facilityId: any;
  patientId: any;
  statusId: any;
  transfers: WardTransfer[];
  admissionDate: Date;
  admitByEmployeeId: any;
  prevWard: any;
  discharge: WardDischarge;
}
