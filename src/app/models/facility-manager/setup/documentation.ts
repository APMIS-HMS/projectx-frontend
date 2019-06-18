import {PatientDocumentation} from '../../../models/facility-manager/setup/patient-documentation';
export interface Documentation {
  _id: string;
  personId: any, documentations: PatientDocumentation[], createdAt: Date,
      updatedAt: Date
}

export enum AuthorizationType {
  Patient,
  Medical
}
