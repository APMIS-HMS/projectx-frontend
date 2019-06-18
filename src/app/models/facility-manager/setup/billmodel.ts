export interface BillModel {
    _id: string;
    facilityServiceObject: any;
    billObject: any;
    amount: number;
    isChecked: boolean;
    isModified: boolean;
    itemDesc: string;
    itemName: string;
    qty: number;
    service: any;
    unitPrice: number;
    modifiers: any[];
    covered:any;
    billModelId:any;
}
