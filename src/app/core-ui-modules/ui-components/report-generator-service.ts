import {Injectable} from '@angular/core';
import {
    IGroupableLabReportModel,
    ILabReportModel,
    ILabReportOption, ILabReportSummaryModel
} from "./LabReportModel";
import {RestService} from "../../feathers/feathers.service";
import {IApiResponse, ICustomReportService, IPaymentReportServiceEndPoint} from "./ReportGenContracts";
import {IPatientAnalyticsReport, IPatientReportModel, IPatientReportOptions} from "./PatientReportModel";
import {
    IPaymentGroups,
    IPaymentReportModel,
    IPaymentReportOptions,
    IPaymentReportSummaryModel
} from "./PaymentReportModel";
import {CoolLocalStorage} from "angular2-cool-storage";


@Injectable()
export class ReportGeneratorService implements ICustomReportService {
    protected selectedFacility: any;
    protected patientReportServiceRef: any;
    public facilityId : string  ="";
    constructor(private restEndpoint: RestService, localStorage: CoolLocalStorage) {
        //super();
        this.selectedFacility = localStorage.getObject("selectedFacility");
        this.facilityId  = this.selectedFacility._id;
        this.patientReportServiceRef = this.restEndpoint.getService("patient-reg-report");
    }
    
    getLabReport(options: ILabReportOption): Promise<IApiResponse<ILabReportModel[]>> {
        options.facilityId = this.selectedFacility._id;
        const newOption: any = {...options};
        if (options.paginate) {
            // set the appropriate fields
            newOption.$limit = options.paginationOptions.limit;
            newOption.$skip = options.paginationOptions.limit * options.paginationOptions.skip;
        }

        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: newOption});
    }

    getGroupedLabReport(options: ILabReportOption): Promise<IApiResponse<IGroupableLabReportModel[]>> {

        options.facilityId = this.selectedFacility._id;
        options.useGrouping = true;
        options.groupBy = options.groupBy || 'location';

        // Check for pagination and fix the request appropriately
        const newOption: any = {...options};
        if (options.paginate) {
            // set the appropriate fields
            newOption.$limit = options.paginationOptions.limit;
            newOption.$skip = options.paginationOptions.limit * options.paginationOptions.skip;
        }
        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: newOption});

    }

    getLabReportInvestigationSummary(options?: ILabReportOption): Promise<IApiResponse<ILabReportSummaryModel[]>> {
        options = options || {};
        options.facilityId = this.selectedFacility._id;
        options.isSummary = true;
        return this.restEndpoint.getService("laboratory-report-summary")
            .find({query: options});
    }

    getPatientReport(options: IPatientReportOptions): Promise<IApiResponse<IPatientReportModel[]>> {
        options.facilityId = this.selectedFacility._id;
        const newOption: any = {facilityId: options.facilityId};//...options
        if (options.paginate) {
            newOption.$skip = options.paginationOptions.skip;
            newOption.$limit = options.paginationOptions.limit;
        }
        return this.patientReportServiceRef
            .find({query: newOption});
    }

    getPatientAnalyticReport(options: IPatientReportOptions): Promise<IApiResponse<IPatientAnalyticsReport[]>> {
        options = options || {};
        options.facilityId = this.selectedFacility._id;
        //TODO : uncomment if backend service is fixed!
         return this.patientReportServiceRef
             .find(  {query :  options});

        //  return  a sample dummy data for now until the backend is complete;
        //return this.restEndpoint
       /* const searchBy = options.searchBy.toLowerCase();
        const queryString = options.queryString ? options.queryString.toLowerCase()  : "";
        const result = {data: []};
        let data: IPatientAnalyticsReport[] = [];
        if (options.searchBy.toLowerCase() === "plantype") {
            data = [
                {
                    tag: "HMO",
                    totalPatient: 200,
                    male: 80,
                    female: 120
                },
                {
                    tag: "Company Cover",
                    totalPatient: 100,
                    male: 60,
                    female: 40
                },
                {
                    tag: "Family Cover",
                    totalPatient: 300,
                    male: 20,
                    female: 280
                },
                {
                    tag: "Cash Payment",
                    totalPatient: 100,
                    male: 92,
                    female: 8
                },
            ];
        }
        else if (searchBy === "age") {
            data = [
                {
                    tag: "0-5",
                    totalPatient: 34,
                    male: 20,
                    female: 14

                },
                {
                    tag: "6-10",
                    totalPatient: 65,
                    male: 32,
                    female: 33

                },
                {
                    tag: "11-20",
                    totalPatient: 50,
                    male: 10,
                    female: 40

                },
                {
                    tag: "21-35",
                    totalPatient: 70,
                    male: 60,
                    female: 10

                }, 
                {
                    tag: "36-50",
                    totalPatient: 170,
                    male: 50,
                    female: 120

                },
                {
                    tag: "51-above",
                    totalPatient: 78,
                    male: 30,
                    female: 48

                },
            ]
        }
        else if(searchBy ==="hmo")
        {
            data = [
                {
                    tag: "HMO A",
                    totalPatient: 70,
                    male: 50,
                    female: 20

                },
                {
                    tag: "HMO B",
                    totalPatient: 120,
                    male: 60,
                    female: 60

                },
                {
                    tag: "HMO C",
                    totalPatient: 50,
                    male: 10,
                    female: 40

                },
                {
                    tag: "HMO D",
                    totalPatient: 75,
                    male: 25,
                    female: 50

                },
               
            ]
        }
        else if(searchBy ==="company")
        {
            data = [
                {
                    tag: "Company A",
                    totalPatient: 40,
                    male: 10,
                    female: 30

                },
                {
                    tag: "Sidmach Tech",
                    totalPatient: 60,
                    male: 25,
                    female: 35

                },
                {
                    tag: "Apmis Health",
                    totalPatient: 20,
                    male: 12,
                    female: 8

                },
                {
                    tag: "Company B",
                    totalPatient: 75,
                    male: 25,
                    female: 50

                },

            ]
        }
        else if(searchBy =="family")
        {
            data = [
                {
                    tag: "Mr Udor",
                    totalPatient: 3,
                    male: 1,
                    female: 2

                },
                {
                    tag: "Mr & Mrs Okoye",
                    totalPatient: 10,
                    male: 4,
                    female: 6

                },
                {
                    tag: "Mrs Lilian O.",
                    totalPatient: 5,
                    male: 2,
                    female: 3

                },
               
            ]
        }
        result.data = data;
        return Promise.resolve(result);*/
    }

    getWorkBenches(): any {
        // get the Service end point;
        //console.log(this.selectedFacility);
        return this.restEndpoint.getService("workbenches").find({
            query: {
                facilityId: this.selectedFacility._id
            }
        });
    }

    getLocations() {
        return this.selectedFacility.minorLocations.map(x => {
          return {
                id: x._id,
                location: x.name,
                locationId: x.locationId
            }
        });
    }

    /*  
    *   Reports for Patients
    * */

}

@Injectable()
export class PaymentReportGenerator implements IPaymentReportServiceEndPoint {
    protected paymentReportServiceRef;
    protected selectedFacility: any;

    constructor(private restEndpoint: RestService, locker: CoolLocalStorage) {
        //super();

        this.paymentReportServiceRef = this.restEndpoint.getService("payment-reports");
        this.selectedFacility = locker.getObject("selectedFacility");
    }

    getInvoicePaymentReport(options: IPaymentReportOptions): Promise<IApiResponse<IPaymentReportModel[]>> {
        options.facilityId = this.selectedFacility._id;
        const newOption: any = {...options};
        if (options.paginate) {
            // set the appropriate fields
            newOption.$limit = options.paginationOptions.limit;
            newOption.$skip = options.paginationOptions.skip;
        }
        return this.paymentReportServiceRef.get(options.facilityId,
            {
                // query: options
                $limit: options.paginationOptions.limit,
                $skip: options.paginationOptions.skip
            }
        );

    }

    getPaymentGroups(rptOption: IPaymentReportOptions): Promise<IApiResponse<IPaymentGroups[]>> {
        rptOption.facilityId = this.selectedFacility._id;
        return undefined;
    }

    getPaymentReportSummary(rptOption: IPaymentReportOptions = {}): Promise<IApiResponse<IPaymentReportSummaryModel>> {
        //console.log(this.paymentReportServiceRef);
        rptOption.facilityId = this.selectedFacility._id;

        /* So to get  all report summary we simply send a 'isSummary' variable to the server, Date range might be checked on server*/
        // we also expect the facility id to be set
        rptOption.isSummary = true;
        return this.paymentReportServiceRef.get(rptOption.facilityId,
            {
                query: rptOption
            }
        );

    }

}

@Injectable()
export class PaymentChartDataService {
    selectedFacility: any;
    paymentChartDataServiceRef: any;

    constructor(private restEndPoint: RestService, localStorage: CoolLocalStorage) {
        this.selectedFacility = localStorage.getObject("SelectedFacility");
        this.paymentChartDataServiceRef = this.restEndPoint.getService("payment-chart-data");
    }

    async getChartData(): Promise<any> {
        return await this.paymentChartDataServiceRef.get(this.selectedFacility._id, {});
    }
}
