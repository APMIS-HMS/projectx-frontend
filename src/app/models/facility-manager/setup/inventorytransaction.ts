export interface InventoryTransaction {
    _id?: string,
    batchNumber: string;
    productionDate: Date;
    expiryDate: Date;
    costPrice: number;
    quantity: number;
    availableQuantity: number;
    purchaseEntryId: string;
    purchaseEntryDetailId: string;
    batchTransactions?: BatchTransaction[],
    transactionTypeId: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface BatchTransaction {
    batchNumber: string,
    employeeId: string,
    price?: Number,
    preQuantity: number, // Before Operation.
    postQuantity: number, // After Operation.
    quantity: number, // Operational qty.
    availableQuantity?: number;
    comment?: string,
    referenceId?: string, // Dispense id, Transfer id...
    referenceService?: string, // Dispense, Transfer...
    inventorytransactionTypeId?: string,
}
