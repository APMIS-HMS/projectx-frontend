export interface InvoiceEntry {
	_id?: string;
	facilityId: string;
	orderId?: string;
	invoiceNumber: string;
	invoiceAmount: number;
	amountPaid: number;
	storeId: string;
	supplierId?: string;
	createdBy: string;
	deliveryDate: Date;
	remark: string;
	products: any[];
	paymentCompleted: boolean;
	transactions: any[];
	createdAt?: Date;
	updatedAt?: Date;
}

export interface InvoicedItem {
	batchNo: string;
	quantity: number;
	costPrice: number;
	expiryDate: Date;
	createdAt?: Date;
	updatedAt?: Date;
	productId: string;
	productName: string;
	productPackType: string;
}
