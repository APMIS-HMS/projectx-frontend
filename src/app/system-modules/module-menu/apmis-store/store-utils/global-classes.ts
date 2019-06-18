export interface StoreProducts {
    productName: string;
    availableQuantity: number;
    reOrderLevel: string;
    costPerUnit: number;
    totalCostPrice: number;
    unitSellingPrice: number;
    batches: [ProductBatch];
}

export interface ProductBatch {
    batchNumber: number;
    status: string;
}
