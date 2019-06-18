import{WardRoom} from './ward-room'

export interface WardDetail {
    _id: string;
    facilityId: string;
    locations?: WardRoom[];
}
