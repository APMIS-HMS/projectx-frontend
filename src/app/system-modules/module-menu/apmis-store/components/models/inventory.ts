export interface Inventory {
	_id: string;
	facilityId: string;
	storeId: string;
	serviceId: any;
	categoryId: string;
	facilityServiceId: string;
	productId: string;
	totalQuantity: number;
	reorderLevel: number;
	reorderQty: number;
	transactions: any[];
	createdAt: Date;
	updatedAt: Date;
	isOpen: boolean;
	availableQuantity: number;
}
