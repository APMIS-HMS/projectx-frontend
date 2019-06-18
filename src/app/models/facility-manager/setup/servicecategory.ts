import { ServiceItem } from './serviceitem';
export interface ServiceCategory {
    _id: string;
    name: string;
    services: ServiceItem[];
}