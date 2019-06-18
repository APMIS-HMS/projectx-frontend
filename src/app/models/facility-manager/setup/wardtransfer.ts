import { proposedWardModel } from './proposed-ward';

export interface WardTransfer {
    _id:string;
    minorLocationId: string;
    proposedWard: proposedWardModel;
    roomId: string;
    bedId: string;
    description: string;
    checkInDate: Date;
    checkOutDate: Date;
}
