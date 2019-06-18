import { PersonPrincipal } from './personprincipal';
export interface CompanyHealthCover {
    _id: string;
    corporateFacilityId: string;
    facilityId: string;
    personFacilityPrincipals: PersonPrincipal[];
    isAccepted: boolean;
    corporateFacility: any;
    categoryId: string;
}
