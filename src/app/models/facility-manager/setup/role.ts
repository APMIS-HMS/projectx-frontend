import { Feature } from './feature';
export interface Role {
    _id: string;
    facilityId: string;
    feature: Feature;
}