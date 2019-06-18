export interface ProductInitialize {
	configProduct: any;
	totalQuantity: number;
	basePackType: string;
	costPrice: number;
	totalCostPrice: number;
	margin: number;
	sellingPrice: number;
	batches: Batch[];
}

export interface Batch {
	batchNumber: string;
	quantity: number;
	expiryDate: Date;
}
