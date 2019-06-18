export interface FacilityServicePrice {
    _id: string;
    facilityId: string;
    categoryId: string;
    facilityServiceId: string;
    serviceId: string;
    price: number;
    modifiers: [any];
    category: any;
    service: any;
}
