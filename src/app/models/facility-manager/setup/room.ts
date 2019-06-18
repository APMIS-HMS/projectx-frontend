import{Bed} from './bed'
export interface Room {
    _id: string;
    name: string;
    groupId: string;
    serviceId:string;
    beds?: Bed[];
}