import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {RestService} from "../../feathers/feathers.service";
import {PaymentChartDataService, PaymentReportGenerator, ReportGeneratorService} from "./report-generator-service";
import {IApiResponse} from "./ReportGenContracts";
import {IPaymentReportModel, IPaymentReportOptions, IPaymentReportSummaryModel} from "./PaymentReportModel";
import {CoolLocalStorage} from "angular2-cool-storage";
import {Local} from "protractor/built/driverProviders";
@Injectable()
export class DummyReportDataService extends ReportGeneratorService //  implements ICustomReportService
{
    constructor(private restService : RestService, localStorage  : CoolLocalStorage)
    {
        super(restService, localStorage);
    }
    getLabReport(options: ILabReportOption): Promise<IApiResponse<ILabReportModel[]>> {
        
        /* return  a resolved promise with a collection of LabReportModel*/
        options.facilityId   = this.selectedFacility._id;
        const labRpt  :  ILabReportModel[]  = [
            {
                apmisId  : 'SO-2341',
                location : "CK-Lab Clinic",
                patientName : "Mr James Iburio",
                doctor : "Dr. C Madu",
                date : new Date(),
                request : "Blood Sampling",
                status  : "In Progress"
            },
            {
                apmisId  : 'MK-2801',
                location : "HMR-Lab Clinic",
                patientName : "Mr Peter Asuokwou",
                doctor : "Dr. C Madu",
                date : new Date(),
                request : "Urinary Analysis",
                status  : "Completed"
            },
            {
                apmisId  : 'CG-12003',
                location : "Bload-Lab Clinic",
                patientName : "Mr Bayo Akindele",
                doctor : "Dr. Dike Okoye",
                date : new Date(),
                request : "Blood Sampling Analysis",
                status  : "Completed"
            },
        ];
           /* window.setTimeout( ()=>{
            return Promise.resolve(labRpt);
            }, 4000);*/
            const  result  = {
                data : labRpt,
                success : true,
                message : "Lab Report Loaded successfully!",
                total : labRpt.length,
                skip :options.paginate ? options.paginationOptions.skip  : 0,
                limit : options.paginate ? options.paginationOptions.limit  : 0
            }
        const endPoint  = this.restService.getService("laboratory-report-summary");
            console.log("Facility Id :" , options.facilityId);
        endPoint.find({
            query : {
                facilityId  : options.facilityId,
                startDate  : options.startDate,
                endDate  : options.endDate
            }
        }).then(x => {

            console.log("TESTING Backend Service Call: " , x);

        });
      
       
            return Promise.resolve(result);
        
    }
    getLabReportInvestigation(options?: ILabReportOption): Promise<ILabReportModel[]> {
        return undefined;
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IApiResponse<IGroupableLabReportModel[]>> {
        const res : IGroupableLabReportModel[] = [
            {
                group  : "West Lab Clinic",
                data  : [
                    {
                        apmisId : "KO-00022",
                        patientName : "Chidi Ezidiegwu",
                        status : "Completed",
                        location : "West Lab Clinic",
                        doctor :"Dr Felicia Adanbel",
                        request : "Blood Glucose Test",
                        date  : new  Date()
                   
                    
                    },
                    {
                        apmisId : "XC-013292",
                        patientName : "Maryann Ikonah",
                        status : "Completed",
                        location : "West Lab Clinic",
                        doctor :"Dr Bello Ahmed",
                        request : "Urinary Analysis",
                        date  : new  Date()


                    },
                ]
                
            },
            {
                group  : "North Lab Clinic",
                data  : [
                    {
                        apmisId : "KO-00022",
                        patientName : "Hadiza Adamu",
                        status : "In Progress",
                        location : "North Lab Clinic",
                        doctor :"Dr Chima Okoye",
                        request : "Pregnancy Test",
                        date  : new  Date()


                    },
                    
                ]

            },
        ];
        const  result  = {
            data : res,
            success : true,
            message : "Grouped Lab Report Loaded successfully!",
            total : res.length,
            skip :options.paginate ? options.paginationOptions.skip  : 0,
            limit : options.paginate ? options.paginationOptions.limit  : 0
        }
        return Promise.resolve(result);
        
    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<IApiResponse<ILabReportSummaryModel[]>> {
        const res : ILabReportSummaryModel[] = [
            {
                location  : "West Lab Clinic",
                summary  : [
                    {
                       
                        
                        request : "Blood Glucose Test",
                        total  : 43


                    },
                    {
                       
                        request : "Urinary Analysis",
                        total  : 200


                    },
                ]

            },
            {
                location  : "North Lab Clinic",
                summary  : [
                    {
                       
                        request : "Pregnancy Test",
                        total  : 65


                    },

                ]

            },
        ];
        const  result  = {
            data : res,
            success : true,
            message : "Lab Summary Report Loaded successfully!",
            total : res.length,
            skip :options.paginate ? options.paginationOptions.skip  : 0,
            limit : options.paginate ? options.paginationOptions.limit  : 0
        }
        return Promise.resolve(result);
       
    }
    
}
@Injectable()
export class DummyPaymentReportService extends PaymentReportGenerator
{
    constructor(private restService :RestService, locker : CoolLocalStorage)
    {
        super(restService, locker);
    }
    getPaymentReportSummary( rptOptions : IPaymentReportOptions) : Promise<IApiResponse<IPaymentReportSummaryModel>>
    {
        rptOptions.facilityId  = this.selectedFacility._id;
        //console.log("Selected Facility",this.selectedFacility);
        const data  = { 
            totalSales : 4500000
        };
        const res  = { data , success : true , message : "Payment Summary REPORT"};
      
        return Promise.resolve(res);
    }
    getInvoicePaymentReport(rptOptions : IPaymentReportOptions): Promise<IApiResponse<IPaymentReportModel[]>>
    {
        const result  = {
            success  : true,
            message : "Report Loaded",
            "total": 59,
            "limit": 20,
            "skip": 0,
            "data": [
                {
                    "_id": "5b107fcb097e9d1a1cae8d2e",
                    "patientId": "5afd31975b9522384839843f",
                    "totalPrice": 2500,
                    "balance": 0,
                    "invoiceNo": "IV/315/8275",
                    "paymentCompleted": true,
                    "payments": [
                        {
                            "createdBy": "5afbe472dbffe92c90559101",
                            "waiverComment": "",
                            "isWaiver": false,
                            "isPaymentCompleted": true,
                            "balance": 0,
                            "totalPrice": 2500,
                            "amountPaid": 2500,
                            "facilityServiceObject": {
                                "serviceId": "5afc07da5b9522384839839c",
                                "service": "New Registrations",
                                "category": "Medical Records",
                                "categoryId": "5af54ca6dbffe92c9055904c"
                            },
                            "qty": 1,
                            "date": "2018-05-17T07:39:04.399Z",
                            "paymentDate": "2018-05-31T23:03:08.158Z"
                        }
                    ],
                    "person": "Nseobong Okoro"
                }
               
            ]
        };
        return Promise.resolve(result);
    }
}

@Injectable()
export class DummyPaymentChartDataService  extends  PaymentChartDataService
{
    constructor(private rest  : RestService , localStorage : CoolLocalStorage)
    {
        super(rest , localStorage);
    }
    
    async  getChartData() : Promise<any>
    {
        const dummyData  = {
            "lineChartData": [
                {
                    "label": "Appointment",
                    "data": [
                        20000
                    ]
                },
                {
                    "label": "Laboratory",
                    "data": [
                        9800
                    ]
                },
                {
                    "label": "Medical Records",
                    "data": [
                        1000
                    ]
                },
                {
                    "label": "Ward",
                    "data": [
                        300000
                    ]
                }
            ],
            
        };
        const result  =  await Promise.resolve(dummyData);
        return result;
    }
    
}