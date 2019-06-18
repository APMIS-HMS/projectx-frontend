import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import {ReportGeneratorService} from "../../../../../../core-ui-modules/ui-components/report-generator-service";
import {
    IPatientAnalyticsReport,
    IPatientReportModel,
    IPatientReportOptions
} from "../../../../../../core-ui-modules/ui-components/PatientReportModel";
import {IDateRange} from "ng-pick-daterange";
import {IPagerSource} from "../../../../../../core-ui-modules/ui-components/PagerComponent";
import * as _ from 'lodash';
@Component({
  selector: 'app-patient-registration-report',
  templateUrl: './patient-registration-report.component.html',
  styleUrls: ['./patient-registration-report.component.scss']
})
export class PatientRegistrationReportComponent implements OnInit {

  searchControl = new FormControl();
  searchCriteria = new FormControl('Search');
  checked = false;

  pageInView = 'Patient Registration Analytics';
  
  /*Define required properties for this component, ReportOptions Manages the options selected on the view and will 
  * be send transparently to the server.
  * ApiReponse is an Interface (denoted with letter 'I') and store all reponses from the server, Ui view will consume the data
  * property in other to displace content for the view, other properties of this interface can be use to report critical 
  * information from the server to the client.
  * */
  loading : boolean  = false;
  reportOptions : IPatientReportOptions = { 
      startDate  : new Date(),
      endDate : new Date(),
      searchBy : "all", paginate  : true, paginationOptions : {skip : 0, limit : 20},
      ageRange : 'all',
      startAge : 0 ,
      endAge : 1500
  };
  // apiResponse : IApiResponse<IPatientReportModel[]>  = {data : [] } ;
  data:IPatientReportModel[]   =  [] ; 
  // Data Pager Component Setup
    pagerSource :  IPagerSource = {
        totalPages : 0 ,
        currentPage  : 0,
        pageSize : 20,
        totalRecord : 0
    }
     analyticData: IPatientAnalyticsReport[]  = [];
     allAnalyticSummary  : IPatientAnalyticsReport  =   {};
  constructor(private _router: Router, private reportService  :  ReportGeneratorService) { }

  ngOnInit() {
    this.getPatientReport();
    this.getPatientAnalyticReport();
  }

  getPatientReport()
  {
    // call the reportService function
      this.loading  = true;
      this.reportService.getPatientReport(this.reportOptions)
          .then( x => {
            this.loading  = false;
            //this.apiResponse  = x;
            this.data  = x.data; // for Intellisense, this field is not required (DRY)
            this.pagerSource.totalRecord  = x.total;
            console.log(x);
          }, x => {
            this.loading  = false;
            // Log Error Here;
              console.log(x);
          });
  }
  getPatientAnalyticReport(/* we could supply date ranges for certain analytics*/)
  {
      this.reportService.getPatientAnalyticReport({
          searchBy  : "planType",
          queryString :"all"  // All plan types eg: HMO, Family Cover, Company Cover and Private individual
      })
          .then(x => {
             this.analyticData =  x.data; 
             this.allAnalyticSummary   = {
                 female  : _.sumBy(x.data, x => x.female),
                 male  : _.sumBy(x.data, x => x.male),
                 totalPatient  : _.sumBy(x.data, x => x.totalPatient),
                 tag  : "All"
             }
          });
      
  }
    assignDate(date: IDateRange) {
        this.reportOptions.startDate = date.from;
        this.reportOptions.endDate = date.to;
        /* console.log("Parent Component Option: ", this.reportOptions);
         this.labRptComponentRef.getReportData();*/
    }

    search() {
        // this.labRptComponentRef.processing 
        this.reportOptions.queryString = this.searchControl.value;
        this.reportOptions.searchBy = this.searchCriteria.value;
        this.reportOptions.queryString  = _.isEmpty(this.reportOptions.queryString)  ? "all" : this.reportOptions.queryString;
        // Check if we are searching by Age Range and if a valid age range was supplied
        if(this.reportOptions.searchBy.toLowerCase() === 'age')
        {
            // check if we have a queryString
            if(!_.isEmpty(this.reportOptions.queryString) && this.reportOptions.queryString.toLowerCase() != 'all')
            {
                const qy = this.reportOptions.queryString.split("-");
              
                if(_.isArray(qy) && qy.length == 2)
                {
                    this.reportOptions.startAge  = parseInt(qy[0]);
                    this.reportOptions.endAge  = parseInt(qy[1]);
                    this.reportOptions.ageRange  = this.reportOptions.queryString;
                }
                
                console.log("Report Options : " , this.reportOptions);
            }
            else{
                // set to all age ranges
                this.reportOptions.queryString  = "all"; // may be server may be using this value for conditional branching
                this.reportOptions.ageRange = "all";
            }
        }
        
        this.getPatientReport();
    }
    gotoPage (index  : number)
    {
        this.pagerSource.currentPage   = index;
        this.reportOptions.paginationOptions.skip= index * this.pagerSource.pageSize;
        this.getPatientReport();
    }

}
