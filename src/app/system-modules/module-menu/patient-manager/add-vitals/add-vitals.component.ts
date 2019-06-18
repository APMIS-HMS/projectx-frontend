import { AuthFacadeService } from './../../../service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  DocumentationService, VitaLocationService, VitalRythmService, VitalPositionService,
  EmployeeService, FormsService, FacilitiesService, PatientService, VitalService
} from '../../../../services/facility-manager/setup/index';
import { Facility, Documentation, Employee, Patient, PatientDocumentation, Document } from '../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { error } from 'util';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';


@Component({
  selector: 'app-add-vitals',
  templateUrl: './add-vitals.component.html',
  styleUrls: ['./add-vitals.component.scss']
})
export class AddVitalsComponent implements OnInit {
  user: any;
  @Input() patient: any = <any>{};
  @Output() refreshVitalsChanged = new EventEmitter();
  mainErr = true;
  errMsg = 'you have unresolved errors';
  vitalRythm: any[] = [];
  vitalPosition: any[] = [];
  vitalLocation: any[] = [];
  vitalBpLocation: any[] = [];
  selectedFacility: Facility = <Facility>{};
  loginedUser: Employee = <Employee>{};
  documentation: Documentation = <Documentation>{};
  pulseRate: any = <any>{};
  respiratoryRate: any = <any>{};
  temperature: any = <any>{};
  heightWeight: any = <any>{};
  bloodPressure: any = <any>{};
  abdominal: any = <any>{};
  bmi: number = <number>{};
  isWarning = false;
  warningPulseRate = {
    status: false,
    message: ''
  };
  warningTemp = {
    status: false,
    message: ''
  };
  warningResp = {
    status: false,
    message: ''
  };
  warningSys = {
    status: false,
    message: ''
  };
  warningDia = {
    status: false,
    message: ''
  };
  warningSpo = {
    status: false,
    message: ''
  };
  bmiWarningMssg = "";
  disableSaveBtn = false;
  saveBtnText = "Add Vitals";
  selectedForm: any = <any>{};
  loginEmployee: Employee = <Employee>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};
  serverDate: Date = <Date>{};
  diabledSaveBtn = false;

  public frmAddVitals: FormGroup;
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();


  constructor(private formBuilder: FormBuilder,
    private documentationService: DocumentationService,
    private _vitaLocationService: VitaLocationService,
    private _vitalPositionService: VitalPositionService,
    private _vitalRythmService: VitalRythmService,
    private _locker: CoolLocalStorage,
    private _employeeService: EmployeeService,
    private _FormsService: FormsService,
    private _PatientService: PatientService,
    private _systemModuleService: SystemModuleService,
    private _facilityService: FacilitiesService,
    private _authFacadeServic: AuthFacadeService,
    private _vitalService: VitalService) {
    this._authFacadeServic.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
    })
  }

  ngOnInit() {
    this.selectedFacility = <Facility>this._locker.getObject('selectedFacility');
    const auth: any = this._locker.getObject('auth');
    this.user = auth;
    this.getVitalLocation();
    this.getVitalBpLocation();
    this.getVitalPosition();
    this.getVitalRythm();
    //this.getPersonDocumentation();
    this.getForm();
    this._employeeService.find({
      query:
        {
          facilityId: this.selectedFacility._id, personId: auth.data.personId
        }
    }).then(payload => {
      this.loginedUser = payload.data[0];
    });
    this.frmAddVitals = this.formBuilder.group({

      pulseRate: ['', []],
      pulseLoc: ['', []],
      pulseRythm: ['', []],
      diastolicBp1: ['', []],
      diastolicBp1Loc: ['', []],
      diastolicBp1Pos: ['', []],
      systolicBp1: ['', []],
      systolicBp1Loc: ['', []],
      systolicBp1Pos: ['', []],
      respiratoryRate: ['', []],
      temp: ['', []],
      height: ['', []],
      weight: ['', []],
      spo2: ['', []],
      girth: ['', []]
      //bmi: ['', []]
    });


    this.frmAddVitals.controls['height'].valueChanges.subscribe(value => {
      const heightSquare = (+this.frmAddVitals.controls['height'].value) * (+this.frmAddVitals.controls['height'].value);
      const bmiValue = (+this.frmAddVitals.controls['weight'].value) / heightSquare;
      this.bmi = Math.round(bmiValue * 10) / 10;
      if (this.bmi < 16) {
        this.bmiWarningMssg = "Severe Thinness";
        this.isWarning = true;
      } else if (this.bmi >= 25 && this.bmi < 30) {
        this.bmiWarningMssg = "Overweight";
        this.isWarning = true;
      } else if (this.bmi > 30) {
        this.bmiWarningMssg = "Obese Class";
        this.isWarning = true;
      } else {
        this.isWarning = false;
      }
    });

    this.frmAddVitals.controls['weight'].valueChanges.subscribe(value => {
      const heightSquare = (+this.frmAddVitals.controls['height'].value) * (+this.frmAddVitals.controls['height'].value);
      const bmiValue = (+this.frmAddVitals.controls['weight'].value) / heightSquare;
      this.bmi = Math.round(bmiValue * 10) / 10;
      if (this.bmi < 16) {
        this.bmiWarningMssg = "Severe Thinness";
        this.isWarning = true;
      }
      else if (this.bmi >= 25 && this.bmi < 30) {
        this.bmiWarningMssg = "Overweight";
        this.isWarning = true;
      }
      else if (this.bmi > 30) {
        this.bmiWarningMssg = "Obese Class";
        this.isWarning = true;
      }
      else {
        this.isWarning = false;
      }
    });

    this.frmAddVitals.controls['pulseRate'].valueChanges.subscribe(value => {
      if (value < 60) {
        this.warningPulseRate.status = true;
        this.warningPulseRate.message = 'Low';
      } else if (value > 100) {
        this.warningPulseRate.status = true;
        this.warningPulseRate.message = 'High';
      }else{
        this.warningPulseRate.status = false;
        this.warningPulseRate.message = 'Normal';
      }
    });

    this.frmAddVitals.controls['temp'].valueChanges.subscribe(value => {
      if (value < 36.2) {
        this.warningTemp.status = true;
        this.warningTemp.message = 'Low';
      } else if (value > 37.2) {
        this.warningTemp.status = true;
        this.warningTemp.message = 'High';
      }else{
        this.warningTemp.status = false;
        this.warningTemp.message = 'Normal';
      }
    });

    this.frmAddVitals.controls['respiratoryRate'].valueChanges.subscribe(value => {
      if (value < 12) {
        this.warningResp.status = true;
        this.warningResp.message = 'Low';
      } else if (value > 20) {
        this.warningResp.status = true;
        this.warningResp.message = 'High';
      }else{
        this.warningResp.status = false;
        this.warningResp.message = 'Normal';
      }
    });

    this.frmAddVitals.controls['systolicBp1'].valueChanges.subscribe(value => {
      if (value < 100) {
        this.warningSys.status = true;
        this.warningSys.message = 'Low';
      } else if (value > 130) {
        this.warningSys.status = true;
        this.warningSys.message = 'High';
      }else{
        this.warningSys.status = false;
        this.warningSys.message = 'Normal';
      }
    });

    this.frmAddVitals.controls['diastolicBp1'].valueChanges.subscribe(value => {
      if (value < 60) {
        this.warningDia.status = true;
        this.warningDia.message = 'Low';
      } else if (value > 90) {
        this.warningDia.status = true;
        this.warningDia.message = 'High';
      }else{
        this.warningDia.status = false;
        this.warningDia.message = 'Normal';
      }
    });
    this.frmAddVitals.controls['spo2'].valueChanges.subscribe(value => {
      if (value < 94) {
        this.warningSpo.status = true;
        this.warningSpo.message = 'Low';
      } else if (value > 100) {
        this.warningSpo.status = true;
        this.warningSpo.message = 'High';
      }else{
        this.warningSpo.status = false;
        this.warningSpo.message = 'Normal';
      }
    });
  }


  getPersonDocumentation() {
    this.documentationService.find({ query: { 'personId': this.patient.personId } }).subscribe((payload: any) => {

      if (payload.data.length === 0) {
        this.patientDocumentation.personId = this.patient.personDetails;
        this.patientDocumentation.documentations = [];
        this.documentationService.create(this.patientDocumentation).subscribe(pload => {
          this.patientDocumentation = pload;
        })
      } else {
        if (payload.data[0].documentations.length === 0) {
          this.patientDocumentation = payload.data[0];
        } else {
          this.documentationService.find({
            query:
              {
                'personId': this.patient.personId, 'documentations.patientId': this.patient._id,
              }
          }).subscribe((mload: any) => {
            if (mload.data.length > 0) {
              this.patientDocumentation = mload.data[0];
            }
          })
        }
      }

    })
  }

  getForm() {
    Observable.fromPromise(this._FormsService.find({ query: { title: 'Vitals' } }))
      .subscribe((payload: any) => {
        if (!!payload.data && payload.data.length > 0) {
          this.selectedForm = payload.data[0];
        }
      });
  }

  getVitalPosition() {
    this._vitalPositionService.findAll().then(payload => {
      if (!!payload.data && payload.data.length > 0) {
        this.vitalPosition = payload.data;
      }
    }, error => { });
  }
  getVitalRythm() {
    this._vitalRythmService.findAll().then(payload => {
      if (!!payload.data && payload.data.length > 0) {
        this.vitalRythm = payload.data;
      }
    }, error => { });
  }
  getVitalLocation() {
    this._vitaLocationService.findAll().then(payload => {
      if (!!payload.data && payload.data.length > 0) {
        this.vitalLocation = payload.data;
      }
    }, error => { });
  }

  getVitalBpLocation() {
    this._vitaLocationService.findAllBp().then(res => {
      if (!!res.data && res.data.length > 0) {
        this.vitalBpLocation = res.data;
      }
    }, error => { });
  }

  close_onClick() {
    this.closeModal.emit(true);
  }

  addVitals(valid, value) {
    if (valid) {
      this.disableSaveBtn = true;
      this.saveBtnText = "Processing... <i class='fa fa-spinner fa-spin'></i>";
      let isExisting = false;
      const vitalValue: any = <any>{};
      this.pulseRate.pulseRateValue = this.frmAddVitals.controls['pulseRate'].value;
      this.pulseRate.location = this.frmAddVitals.controls['pulseLoc'].value;
      this.pulseRate.rythm = this.frmAddVitals.controls['pulseRythm'].value;
      this.respiratoryRate = this.frmAddVitals.controls['respiratoryRate'].value;
      this.temperature = this.frmAddVitals.controls['temp'].value;
      this.heightWeight.height = this.frmAddVitals.controls['height'].value;
      this.heightWeight.weight = this.frmAddVitals.controls['weight'].value;
      this.heightWeight.bmi = this.bmi;
      this.bloodPressure.systolic = this.frmAddVitals.controls['systolicBp1'].value;
      this.bloodPressure.diastolic = this.frmAddVitals.controls['diastolicBp1'].value;
      this.bloodPressure.location = this.frmAddVitals.controls['diastolicBp1Loc'].value;
      this.bloodPressure.position = this.frmAddVitals.controls['diastolicBp1Pos'].value;
      this.abdominal.spo2 = this.frmAddVitals.controls['spo2'].value;
      this.abdominal.girth = this.frmAddVitals.controls['girth'].value;

      vitalValue.pulseRate = this.pulseRate;
      vitalValue.respiratoryRate = this.respiratoryRate;
      vitalValue.temperature = this.temperature;
      vitalValue.heightWeight = this.heightWeight;
      vitalValue.bloodPressure = this.bloodPressure;
      vitalValue.abdominalCondition = this.abdominal;
      vitalValue.facilityObj = this._locker.getObject('miniFacility');
      vitalValue.employeeObj = this.loginEmployee;
      vitalValue.patientId = this.patient._id;
      vitalValue.documentType = this.selectedForm;
      vitalValue.personId = this.patient.personDetails;

      let params = {
        patientId: this.patient._id,
        personId: this.patient.personDetails._id
      }
      this._vitalService.create(vitalValue, params).then(payload => {
        this.frmAddVitals.reset();
        this.disableSaveBtn = false;
        this.saveBtnText = "Add Vitals";
        this.close_onClick();
        //this._notification('Success', 'Vitals saved successfully');
        this._systemModuleService.announceSweetProxy('Vitals saved successfully', 'success');
        this.refreshVitalsChanged.emit(payload);

      }, error => {
        //this._notification('Error', 'There was an error while saving the vitals');
        this._systemModuleService.announceSweetProxy('There was an error while saving the vitals', 'error');
        this.disableSaveBtn = false;
      })

      // this._ServerDateService.find({ query: {} }).then(datePayload => {
      //   this.serverDate = new Date(datePayload);

      //   this.patientDocumentation.documentations.forEach(documentation => {
      //     if (documentation.document == undefined) {
      //       documentation.document = {
      //         documentType: this.selectedForm
      //       }
      //     }
      //     if (documentation.document.documentType._id != undefined &&
      //       documentation.document.documentType._id === this.selectedForm._id) {
      //       isExisting = true;
      //       documentation.document.body.vitals.push({
      //         pulseRate: this.pulseRate,
      //         respiratoryRate: this.respiratoryRate,
      //         temperature: this.temperature,
      //         bodyMass: this.heightWeight,
      //         bloodPressure: this.bloodPressure,
      //         updatedAt: this.serverDate
      //       })
      //     }
      //   });
      //   if (!isExisting) {
      //     const doc: PatientDocumentation = <PatientDocumentation>{};
      //     doc.facilityId = this._locker.getObject('miniFacility');
      //     doc.createdBy = this._facilityService.trimEmployee(this.loginEmployee);
      //     doc.patientId = this.patient._id;
      //     doc.document = {
      //       documentType: this.selectedForm,
      //       body: {
      //         vitals: []
      //       }
      //     }
      //     doc.document.body.vitals.push({
      //       pulseRate: this.pulseRate,
      //       respiratoryRate: this.respiratoryRate,
      //       temperature: this.temperature,
      //       bodyMass: this.heightWeight,
      //       bloodPressure: this.bloodPressure,
      //       updatedAt: this.serverDate
      //     });
      //     this.patientDocumentation.documentations.push(doc);
      //   }

      //   this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      //     this.patientDocumentation = payload;
      //     this.frmAddVitals.reset();
      //     this.disableSaveBtn = false;
      //     this.saveBtnText = "Add Vitals";
      //   })
      // })


    }
  }

  // addVitals(valid, value) {
  //   if (valid) {
  //     const vitalValue: any = <any>{};
  //     this.pulseRate.pulseRateValue = this.frmAddVitals.controls['pulseRate'].value;
  //     this.pulseRate.location = this.frmAddVitals.controls['pulseLoc'].value;
  //     this.pulseRate.rythm = this.frmAddVitals.controls['pulseRythm'].value;
  //     this.respiratoryRate = this.frmAddVitals.controls['respiratoryRate'].value;
  //     this.temperature = this.frmAddVitals.controls['temp'].value;
  //     this.heightWeight.height = this.frmAddVitals.controls['height'].value;
  //     this.heightWeight.weight = this.frmAddVitals.controls['weight'].value;
  //     this.heightWeight.bmi = this.bmi;
  //     this.bloodPressure.systolic = this.frmAddVitals.controls['systolicBp1'].value;
  //     this.bloodPressure.diastolic = this.frmAddVitals.controls['diastolicBp1'].value;
  //     this.bloodPressure.location = this.frmAddVitals.controls['diastolicBp1Loc'].value;
  //     this.bloodPressure.position = this.frmAddVitals.controls['diastolicBp1Pos'].value;

  //     vitalValue.pulseRate = this.pulseRate;
  //     vitalValue.respiratoryRate = this.respiratoryRate;
  //     vitalValue.temperature = this.temperature;
  //     vitalValue.heightWeight = this.heightWeight;
  //     vitalValue.bloodPressure = this.bloodPressure;
  //     // this.documentation.facilityId = this.selectedFacility._id;
  //     // this.documentation.patientId = this.patientId;

  //     // this.documentation.createdBy = this.loginedUser._id;
  //     // this.documentation.document = vitalValue;


  //     this.documentationService.create(this.documentation).then(payload => {
  //       this.frmAddVitals.reset();
  //     }, error => {
  //       
  //     });
  //   }
  // }

  private _notification(type: string, text: string): void {
    this._facilityService.announceNotification({
      users: [this.user._id],
      type: type,
      text: text
    });
  }
}
