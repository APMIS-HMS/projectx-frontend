import {IGroupableLabReportModel, ILabReportModel, ILabReportOption, ILabReportSummaryModel} from "./LabReportModel";
import {DummyReportDataService} from "./DummyReportDataService";
import {ReportGeneratorService} from "./report-generator-service";

import {IPatientReportModel, IPatientReportOptions} from "./PatientReportModel";
import {
    IPaymentGroups,
    IPaymentReportModel,
    IPaymentReportOptions,
    IPaymentReportSummaryModel
} from "./PaymentReportModel";
export interface IApiResponse<T>
{
    data : T;
    total? : number;
    skip? : number;
    limit? : number;
    message? : string;
    success? : boolean;
    
}
export interface IContactAddress
{
   
    city?: string,
    country?: string ; 
    lga?: string ; 
    state?: string ;  
    street?: string ;

}
export interface IDefaultReportOption {
    facilityId?: string;
    filterByDate?  :boolean;
    startDate? : Date;
    endDate? : Date;
    queryString? : string;
    searchBy? : string | 'all';  // could be 'employee' then  queryString should contain the name of employee
   
    /*If Pagination is turned on the backend api should assign pagination
     * to feathers pagination settings eg: $limit : opt.paginate ? opt.paginationOptions.limit : 0 etc */
    paginate? : boolean ;
    paginationOptions? : IPaginationOptions;
    // Groupings
    groupBy? : string;
    useGrouping? : boolean;
}
export interface IPaginationOptions{

    limit : number;
    skip : number;
}
export interface ICustomReportService {
    // Lab report
    getLabReport(options: ILabReportOption): Promise<IApiResponse<ILabReportModel[]>>;

    getGroupedLabReport(options: ILabReportOption): Promise<IApiResponse<IGroupableLabReportModel[]>>;

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<IApiResponse<ILabReportSummaryModel[]>>

    //getLabReportInvestigation(options? : ILabReportOption) : Promise<any[]>;
    // patient investigation
    getPatientReport(options? : IPatientReportOptions) : Promise<IApiResponse<IPatientReportModel[]>>

}

export interface IPaymentReportServiceEndPoint
{
    getPaymentReportSummary(rptOption : IPaymentReportOptions) : Promise<IApiResponse<IPaymentReportSummaryModel>>;
    getInvoicePaymentReport(rptOption : IPaymentReportOptions) : Promise<IApiResponse<IPaymentReportModel[]>>;
    getPaymentGroups(rptOption : IPaymentReportOptions) : Promise<IApiResponse<IPaymentGroups[]>>;
}

export function reportServiceFactory() {
    const useDummyData = true;
    return useDummyData ? DummyReportDataService : ReportGeneratorService;
}

