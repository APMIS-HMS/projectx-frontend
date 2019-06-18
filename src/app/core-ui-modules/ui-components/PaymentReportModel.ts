
import {IDefaultReportOption} from "./ReportGenContracts";

export interface FacilityServiceObject {
    serviceId: string;
    service: string;
    category: string;
    categoryId: string;
}

export interface Payment {
    createdBy: string;
    waiverComment: string;
    isWaiver: boolean;
    isPaymentCompleted: boolean;
    balance: number;
    totalPrice: number;
    amountPaid: number;
    facilityServiceObject: FacilityServiceObject;
    qty: number;
    date: Date | string ;
    paymentDate: Date | string;
}

export interface IPaymentReportModel {
    isExpanded? : boolean;
    _id: string;
    patientId: string;
    totalPrice: number;
    balance: number;
    invoiceNo: string;
    paymentCompleted: boolean;
    payments: Payment[];
    person: string;
}
export interface IPaymentReportSummaryModel {
    totalSales : number;
}

export interface IPaymentReportOptions extends IDefaultReportOption{
    isSummary? : boolean;
   
}
export interface IPaymentGroups {
    key? : string;
    value? : number;
}

