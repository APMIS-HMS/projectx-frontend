export interface ProductGridModel
{
    availableQuantity? : number  ; 
    price? : number ; 
    unitOfMeasure? : string ; 
    productId? : string  ; 
    productName? : string;
    totalQuantity? : number;
    qtyOnHold? : any;  // totalQuantity - availableQuantity
    reorderLevel? : number;
    size? : number
    _id? : string;
     qtyToSend? : number;
     isNew? :boolean;
     isAccepted ?:boolean ;
     productCode? : string;
     productConfiguration? : any;
}

export interface StoreOutboundModel {
    facilityId? : string;
    storeId?  : string;
    destinationStoreId? : string;
    employeeId? : string;
    isSupplied?:boolean;
    comment?: string;  // am using this field to differenciate between outbound and inbound requistory
    storeRequisitionNumber?: string;
    products?  : ProductRequisitoryModel[];
    employeeObject? : any;
}
export interface ProductRequisitoryModel
{
    productId?: string;
    productObject?: any;
    qtyDetails?:any;
    qty?: number; 
    createdAt?: Date;  
    updatedAt?: Date ;
    isAccepted? : boolean;  // if accepted this field should be true
}