import { Component, OnInit, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import {
  CountriesService, EmployeeService, FormsService,
  FacilitiesService, UserService, PersonService,
  PatientService, AppointmentService, DocumentationService
} from '../../../../../services/facility-manager/setup/index';
import {
  Facility, User, Patient, Employee, MinorLocation, Appointment, Country, ClinicInteraction,
  Documentation
} from '../../../../../models/index';
import { FormControl } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { IDateRange } from 'ng-pick-daterange';
import * as format from 'date-fns/format';
import * as isWithinRange from 'date-fns/is_within_range'

@Component({
  selector: 'app-patient-vitals',
  templateUrl: './patient-vitals.component.html',
  styleUrls: ['./patient-vitals.component.scss']
})
export class PatientVitalsComponent implements OnInit {

  @Output() closeMenu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient: Patient;

  public lineChartData = [];
  public tableChartData = [];
  public lineChartLabels: Array<any> = [];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // cyan
      backgroundColor: 'rgba(77,208,225,0.2)',
      borderColor: 'rgba(77,208,225,1)',
      pointBackgroundColor: 'rgba(77,208,225,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,208,225,0.8)'
    },
    { // green
      backgroundColor: 'rgba(129,199,132,0.2)',
      borderColor: 'rgba(129,199,132,1)',
      pointBackgroundColor: 'rgba(129,199,132,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(129,199,132,0.8)'
    },
    { // lime
      backgroundColor: 'rgba(220,231,117,0.2)',
      borderColor: 'rgba(220,231,117,1)',
      pointBackgroundColor: 'rgba(220,231,117,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(220,231,117,0.8)'
    },
    { // purple
      backgroundColor: 'rgba(186,104,200,0.2)',
      borderColor: 'rgba(186,104,200,1)',
      pointBackgroundColor: 'rgba(186,104,200,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(186,104,200,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    },
    { // red
      backgroundColor: 'rgba(229,	115,	115,0.2)',
      borderColor: 'rgba(229,115,115,1)',
      pointBackgroundColor: 'rgba(229,115,115,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,115,115,0.8)'
    }
  ];

  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  isChart = false;

  addVitals_view = false;
  addVitalsPop = false;

  vitalsPulse = [];
  vitalsRespiratoryRate = [];
  vitalsBMI = [];
  vitalsHeight = [];
  vitalsWeight = [];
  vitalsSystolic = [];
  vitalsDiastolic = [];
  vitalsTemp = [];
  vitalChartData = [];

  dateRange: any;
  loadIndicatorVisible: any;

  constructor(private countryService: CountriesService,
    private patientService: PatientService,
    private userService: UserService,
    private facilityService: FacilitiesService,
    private appointmentService: AppointmentService,
    private personService: PersonService,
    private employeeService: EmployeeService,
    private formsService: FormsService,
    private router: Router, private route: ActivatedRoute,
    private locker: CoolLocalStorage,
    private _DocumentationService: DocumentationService) { }

  ngOnInit() {
    if (this.patient !== undefined) {
      this.bindVitalsDataToChart();
    }

    this._DocumentationService.listenerCreate.subscribe(payload => {
      //this.bindVitalsDataToChart();
      // window.location.reload();
    });
    this._DocumentationService.listenerUpdate.subscribe(payload => {
      //this.bindVitalsDataToChart();
      // window.location.reload();
    });
  }

  bindVitalsDataToChart() {
    var vitalsObjArray = [];
    this.lineChartLabels = [];
    this.lineChartData = [
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' },
      { data: [], label: '' }

    ];
    this._DocumentationService.find({ query: { 'personId': this.patient.personId } }).then((payload: any) => {
      if (payload.data.length !== 0) {
        let len2 = payload.data[0].documentations.length - 1;
        for (let k = len2; k >= 0; k--) {
          if (payload.data[0].documentations[k].document !== undefined && payload.data[0].documentations[k].document.documentType.title === 'Vitals') {
            vitalsObjArray = payload.data[0].documentations[k].document.body.vitals;
            this.tableChartData = vitalsObjArray;
            if (vitalsObjArray !== undefined) {
              let len3 = vitalsObjArray.length - 1;
              for (let l = 0; l <= len3; l++) {
                this.lineChartData[0].data.push(vitalsObjArray[l].bloodPressure.systolic);
                this.lineChartData[0].label = "Systolic";
                this.lineChartData[1].data.push(vitalsObjArray[l].bloodPressure.diastolic);
                this.lineChartData[1].label = "Diastolic";
                this.lineChartData[2].data.push(vitalsObjArray[l].temperature);
                this.lineChartData[2].label = "Temperature";
                this.lineChartData[3].data.push(vitalsObjArray[l].bodyMass.height);
                this.lineChartData[3].label = "Height";
                this.lineChartData[4].data.push(vitalsObjArray[l].bodyMass.weight);
                this.lineChartData[4].label = "Weight";
                this.lineChartData[5].data.push(vitalsObjArray[l].bodyMass.bmi);
                this.lineChartData[5].label = "BMI";
                const d = new Date(vitalsObjArray[l].updatedAt);
                let dt = format(d, 'DD/MM/YY HH:mm:ss a');
                this.lineChartLabels.push(dt);
              };
              this.lineChartData = JSON.parse(JSON.stringify(this.refreshVitalsGraph(this.lineChartData)));
            }

          }
        }
      }
    }, error => {

    });
  }

  refreshVitalsGraph(lineChartData: any[]) {
    let _lineChartData: Array<any> = new Array(lineChartData.length);
    for (let i = 0; i < lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(lineChartData[i].data.length), label: lineChartData[i].label };
      for (let j = 0; j < lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = lineChartData[i].data[j];
      }
    }
    return _lineChartData;
  }

  refreshVitalsChanged(value) {
    this.bindVitalsDataToChart();
  }

  addVitals_show(e) {
    this.addVitals_view = true;
  }
  close_onClick(message: boolean): void {
    this.addVitals_view = false;
  }
  addVitalsPop_show() {
    this.addVitalsPop = true;
  }

  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  setReturnValue(e) {
    this._DocumentationService.find({ query: { 'personId': this.patient.personId } }).then((payload: any) => {
      if (payload.data.length !== 0) {
        let len2 = payload.data[0].documentations.length - 1;
        for (let k = len2; k >= 0; k--) {
          if (payload.data[0].documentations[k].document !== undefined && payload.data[0].documentations[k].document.documentType.title === 'Vitals') {
            var _tableChartData = payload.data[0].documentations[k].document.body.vitals;
            this.tableChartData = _tableChartData.filter(x => isWithinRange(x.updatedAt, e.from, e.to) == true);
          }
        }
      }
    });
  }
}
