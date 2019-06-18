import { PersonDependant } from './persondependant';
export interface PersonPrincipal {
    _id: string;
    personId: string;
    departmentId: string;
    dependants: PersonDependant[];
    personDetails: any;
}
