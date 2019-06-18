import { ServiceCategory } from './servicecategory';
export interface FacilityService {
    _id: string;
    facilityId: string;
    categories: ServiceCategory[];
    facilityServiceId: '';
    name:string;
}
