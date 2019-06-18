export interface PurchaseEntry {
    _id: string;
    facilityId: any;
    orderId: any;
    invoiceNumber: string;
    amountPaid: string;
    invoiceAmount: string;
    storeId: string;
    supplierId: string;
    createdBy: string;
    deliveryDate: Date;
    remark: string;
    products: any[];
    createdAt: Date;
    updatedAt: Date;
    supplierObject: any;
}
