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

export interface PurchaseList {
	_id: string;
	facilityId: string;
	isActive: boolean;
	purchaseListNumber: string;
	suppliersId: string[];
	storeId: string;
	createdBy: string;
	remark: string;
	listedProducts: ListedItem[];
	createdAt: Date;
	updatedAt: Date;
}

export interface ListedItem {
	productId: string;
	quantity: number;
	costPrice: number;
	createdAt: Date;
	updatedAt: Date;
	productName: string;
	productConfiguration: any;
}

export interface OrderedItem {
	productId: string;
	productObject: any;
	quantity: number;
	qtyDetails: [any];
	costPrice: number;
	createdAt: Date;
	updatedAt: Date;
	productName: string;
	productPackType: string;
	productConfiguration: any;
}
