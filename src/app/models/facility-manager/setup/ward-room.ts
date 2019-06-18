import { Room } from './room';
export interface WardRoom {
    _id: string;
    minorLocationId: string;
    rooms?: Room[];
    name: string;
}
