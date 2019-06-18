import {IContactAddress, IDefaultReportOption} from "./ReportGenContracts";

export interface IPatientReportModel {
    patientName :string;
    apmisId : string;
    gender? :string;
    address? : IContactAddress | undefined;
    phone? : string;
    age? :string;
    dateCreated? : Date;
}
export interface IPatientReportOptions extends IDefaultReportOption{
   
    ageRange ?: string | 'all';  // "all"  all age range should be returned, 20-30 age range btw 20 and 30
    gender ?: 'all' | 'male' | 'female' ; // 'all' , male, or female
    startAge? : number ;
    endAge? : number;
    
}

export interface IPatientAnalyticsReport
{
    tag? : string ;  // Tag is used to identify the key field to return
    totalPatient? : number; 
    male? : number; 
    female? : number;
}