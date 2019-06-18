import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RouterModule, Routes} from '@angular/router';
import {ReportGeneratorService} from "../../../../../../core-ui-modules/ui-components/report-generator-service";
import * as _ from "lodash";
import {IPatientAnalyticsReport} from "../../../../../../core-ui-modules/ui-components/PatientReportModel";

@Component({
    selector: 'app-patient-registration-analytics',
    templateUrl: './patient-registration-analytics.component.html',
    styleUrls: ['./patient-registration-analytics.component.scss']
})
export class PatientRegistrationAnalyticsComponent implements OnInit {
    patientManagerReport = false;
    patientRegistration = false;
    activeTabIndex;

    pageInView = 'Patient Registration Analytics';
    hmoList  : IPatientAnalyticsReport []  = [];
    companyList : IPatientAnalyticsReport[] = [];
    familyList : IPatientAnalyticsReport[]  = [];
    constructor(private _router: Router, private reportService: ReportGeneratorService) {
    }

    ngOnInit() {
      this.getPatientAnalyticReport({searchBy:"age"})
          .then(x => {
              console.log("ApiResponse",x);
              // map the result to the Age range Bar Chart
              const data:IPatientAnalyticsReport[]     = x.data;
              this.barChartLabels  =   _.map(data, p => p.tag);
              const ageRangeData  = [
                  {
                      data : _.map(data, p => p.female),
                      label : "Female"
                  },
                  {
                      data : _.map(data, p => p.male),
                      label : "Male"
                  }
              ];
              this.barChartData =   ageRangeData;
              this.barChartData.forEach((x, index) =>{
                  this.barChartData[index]  =  x;   
              });
              console.log(ageRangeData);
             // this.barChartLabels  = x.data
          });
      // Get Registration By HMO 
        this.getPatientAnalyticReport({searchBy:"hmo"})
            .then(x => {
                console.log("ApiResponse",x);
                // map the result to the Age range Bar Chart
                const data:IPatientAnalyticsReport[]     = x.data;
                this.hmoList   = data;
            });
        
        // Get Registration By Company Cover 
        this.getPatientAnalyticReport({searchBy:"company"})
            .then(x => {
                console.log("ApiResponse",x);
                // map the result to the Age range Bar Chart
                const data:IPatientAnalyticsReport[]     = x.data;
                this.companyList   = data;
            });
    }

    //barChart 
    public barChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels: string[] = ['0-14', '3-10', '11-30', '31-50', '51 above'];
    public barChartData: any[] = [
        {data: [4, 8, 12, 16, 20, 24, 28], label: 'Female'},
        {data: [28, 48, 40, 19, 86, 27, 90], label: 'Male'}
    ];
    public barChartType: string = 'bar';
    public barChartLegend: boolean = true;

//payment plan analytics barcharts
    public barChart1Options: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChart1Labels: string[] = ['Hygiea HMO', 'Avon HMO', 'Medicare HMO', 'Reliance HMO', 'Medi Plan HMO'];
    public barChart1Data: any[] = [
        {data: [4, 8, 12, 16, 20, 24, 28], label: 'HMO Cover'},
    ];
    public barChart1Type: string = 'bar';
    public barChart1Legend: boolean = true;

    //second payment plan analytics barcharts
    public barChart2Options: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChart2Labels: string[] = ['SIDMACH', 'APMIS HMS', 'EMEDREP', 'NECA', 'CHEVRON OIL'];
    public barChart2Data: any[] = [
        {data: [4, 8, 12, 16, 20, 24, 28], label: 'COMPANY COVER'},
    ];
    public barChart2Type: string = 'bar';
    public barChart2Legend: boolean = true;


    //pieChart
    public pieChartOptions: any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public pieChartLabels: string[] = ['Private patient', 'Company cover', 'HMO', 'Family'];
    public pieChartData: any[] = [
        {data: [4, 8, 12, 16],},
    ];
    public pieChartType: string = 'pie';
    public pieChartLegend: boolean = true;

    // events
    public chartClicked(e: any): void {
    }

    public chartHovered(e: any): void {
    }
    pageInViewLoader(title) {
        this.pageInView = title;
    }

    patientRegistration_analytics() {
        this._router.navigate(['/dashboard/reports/report-dashboard']);
    }

    onTabClick(tabIndex) {
        this.activeTabIndex = tabIndex;
    }
     getPatientAnalyticReport( opt : {searchBy:string , queryString?: string}/* we could supply date ranges for certain analytics*/) {
        return  this.reportService.getPatientAnalyticReport({ ...opt,
            filterByDate :false  // All plan types eg: HMO, Family Cover, Company Cover and Private individual
        });
           /* .then(x => {
              /!*  this.analyticData = x.data;
                this.allAnalyticSummary = {
                    female: _.sumBy(x.data, x => x.female),
                    male: _.sumBy(x.data, x => x.male),
                    totalPatient: _.sumBy(x.data, x => x.totalPatient),
                    tag: "All"
                }*!/
            });*/

    }
    
}







