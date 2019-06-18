
export interface InventoryTransferTransaction {
    _id: string;
    inventoryId: string;
    transactionId: string;
    productId: string;
    quantity: number;
    costPrice: number;
    lineCostPrice: number;
    transferStatusId: string;
    receivedBy: string;
    createdAt: Date;
    updatedAt: Date;
}
