export interface PurchaseOrder {
    _id: string;
    facilityId: string;
    name: string;
    isActive: boolean;
    purchaseOrderNumber: string;
    supplierId: string;
    storeId: string;
    createdBy: string;
    expectedDate: Date;
    remark: string;
    orderedProducts: any[];
    isSupplied: boolean;
    createdAt: Date;
    updatedAt: Date;
}
