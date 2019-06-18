export interface Requisition {
    _id: string;
    facilityId: string;
    employeeId: string;
    storeId: string;
    products: any[];
    comment: string;
    createdAt: Date;
    updatedAt: Date;
}
