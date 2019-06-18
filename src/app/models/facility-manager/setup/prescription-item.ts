export interface PrescriptionItem {
	billId?: string;
	billItemId?: string;
	_id?: string;
	facilityId?: string;
	productName?: any;
	productId?: string;
	genericName: string;
	ingredients?: any[];
	regimen: any[];
	form?: string;
	frequency?: string;
	duration?: string;
	dosage?: string;
	cost?: number;
	totalCost?: number;
	routeName: String;
	quantity?: number;
	quantityDispensed?: number;
	dispensedBalance?: number;
	dispensed?: Dispensed;
	paymentCompleted?: boolean;
	patientInstruction: string;
	isRefill?: Boolean;
	isExternal: Boolean;
	refillCount: number;
	initiateBill: boolean;
	isBilled: boolean;
	isDispensed: boolean;
	isOpen?: boolean;
	transactions?: any[];
	serviceId?: string;
	storeId?: String;
	facilityServiceId?: string;
	categoryId?: string;
	code?: string;
	startDate?: Date;
	endDate?: Date;
}

export interface Dispensed {
	totalQtyDispensed: number;
	outstandingBalance: number;
	dispensedArray?: DispensedArray[];
}

export interface DispensedArray {
	orderIndex: number; // unique
	dispensedDate: Date; // Date time
	batchNumber: String;
	qty: number;
	employee: any;
	store: any;
	unitBilledPrice: number;
	totalAmount: number;
}
