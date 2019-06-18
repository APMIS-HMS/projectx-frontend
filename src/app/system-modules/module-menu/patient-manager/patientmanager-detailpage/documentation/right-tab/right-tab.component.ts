import { LaboratoryRequestService } from "./../../../../../../services/facility-manager/setup/laboratoryrequest.service";
import { InvestigationService } from "./../../../../../../services/facility-manager/setup/investigation.service";
import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";
import { OrderStatusService } from "../../../../../../services/module-manager/setup/index";
import { OrderStatus } from "../../../../../../models/index";
import {
  FormsService,
  FacilitiesService,
  DocumentationService,
  AppointmentService
} from "../../../../../../services/facility-manager/setup/index";
import { FormTypeService } from '../../../../../../services/module-manager/setup/index';
import {
  Facility,
  Patient,
  Employee,
  Documentation,
  PatientDocumentation,
  Document
} from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../../shared-module/shared.service';


@Component({
  selector: 'app-right-tab',
  templateUrl: './right-tab.component.html',
  styleUrls: ['./right-tab.component.scss']
})
export class RightTabComponent implements OnInit {
  laboratoryLoading: boolean;
  labRequests: any[];
  allergiesLoading: boolean;
  problemLoading: boolean;
  tooltip_view = false;

  
  @Output() addTag: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addProblem: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addAllergy: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addHistory: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() addVitals: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient;

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};

  problems: any[] = [];
  allergies: any[] = [];
  pastAppointments: any[] = [];
  futureAppointments: any[] = [];
  vitals: any[] = [];
  selectedProblem: any[] = [];

 

  constructor(
    private orderStatusService: OrderStatusService,
    private formService: FormsService,
    private locker: CoolLocalStorage,
    private documentationService: DocumentationService,
    private appointmentService: AppointmentService,
    private formTypeService: FormTypeService,
    private sharedService: SharedService,
    private labRequestService: LaboratoryRequestService,
    private facilityService: FacilitiesService
  ) {
    this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.documentationService.announceDocumentation$.subscribe(payload => {
      this.getPersonDocumentation(payload);
    });
  }

  ngOnInit() {
    this.getPersonDocumentation();
  }
  getPersonDocumentation(value?: any) {
    if (value === undefined) {
      this.problemLoading = true;
      this.allergiesLoading = true;
      this.laboratoryLoading = true;
    } else {
      if (value.type === 'Problem') {
        this.problemLoading = true;
      } else if (value.type === 'Allergies') {
        this.allergiesLoading = true;
      } else if (value.type === 'Laboratory') {
        this.laboratoryLoading = true;
      }
    }
    if (this.patient !== undefined) {
      Observable.fromPromise(
        this.documentationService.find({
          query: { personId: this.patient.personId }
        })
      ).subscribe(
        (payload: any) => {
          if (payload.data.length === 0) {
            this.patientDocumentation.personId = this.patient.personDetails;
            this.patientDocumentation.documentations = [];
            this.documentationService
              .create(this.patientDocumentation)
              .subscribe(pload => {
                this.patientDocumentation = pload;
              });
            this.getProblems();
            this.getAllergies();
            this.getPastAppointments();
            this.getFutureAppointments();
            this.getLabInvestigation();
            this.getVitals();
          } else {
            if (payload.data[0].documentations.length === 0) {
              this.patientDocumentation = payload.data[0];
              this.problemLoading = false;
              this.allergiesLoading = false;
              this.laboratoryLoading = false;
            } else {
              Observable.fromPromise(
                this.documentationService.find({
                  query: {
                    personId: this.patient.personId,
                    'documentations.patientId': this.patient._id
                    // $select: ['documentations.documents', 'documentations.facilityId']
                  }
                })
              ).subscribe(
                (mload: any) => {
                  if (mload.data.length > 0) {
                    this.patientDocumentation = mload.data[0];
                    this.getProblems();
                    this.getAllergies();
                    this.getPastAppointments();
                    this.getFutureAppointments();
                    this.getLabInvestigation();
                    this.getVitals();
                  } else {
                    this.problemLoading = false;
                    this.allergiesLoading = false;
                    this.laboratoryLoading = false;
                  }
                },
                error => {
                  this.problemLoading = false;
                  this.allergiesLoading = false;
                  this.laboratoryLoading = false;
                }
              );
            }
          }
        },
        error => {
          this.problemLoading = false;
          this.allergiesLoading = false;
          this.laboratoryLoading = false;
        }
      );
    }
  }

  getProblems() {
    this.problems = [];
    this.patientDocumentation.documentations.forEach(documentation => {
      if (
        documentation.document !== undefined &&
        documentation.document.documentType !== undefined &&
        documentation.document.documentType.title === 'Problems'
      ) {
        documentation.document.body.problems.forEach(problem => {
          // this is used to check the existing record without displayStatus
          // it sets it to default true if the displayStatus is undefined
          const displayStatus = problem.displayStatus || true;
          // added extra check displayStatus to check if problem has not been deactivated
          if (problem.status !== null && problem.status.name === 'Active' && displayStatus) {
            // Adding extra properties to the object property that the right-tab-tooltip component needs
            problem.documentationId = documentation._id;
            problem.personId = this.patient.personId,
            problem.patientId = this.patient._id;
            this.problems.push(problem);
          }
        });
      }
    });
    this.problemLoading = false;
  }
  getVitals() {
    this.vitals = [];
    this.patientDocumentation.documentations.forEach(documentation => {
      if (
        documentation.document !== undefined &&
        documentation.document.documentType !== undefined &&
        documentation.document.documentType.title === 'Vitals'
      ) {
        documentation.document.body.vitals.forEach(vital => {
          this.vitals.push(vital);
        });
      }
    });
  }
  getAllergies() {
    this.allergies = [];
    try {
      this.patientDocumentation.documentations.forEach(documentation => {
        if (
          documentation.document !== undefined &&
          documentation.document.documentType !== undefined &&
          documentation.document.documentType.title === 'Allergies'
        ) {
          documentation.document.body.allergies.forEach(allergy => {
            this.allergies.push(allergy);
          });
        }
      });
      this.allergiesLoading = false;
    } catch (error) {
      this.allergiesLoading = false;
    }
  }
  getLabInvestigation() {
    this.labRequests = [];
    this.labRequestService
      .find({
        query: {
          'patientId._id': this.patient._id
        }
      })
      .subscribe(
        payload => {
          const reqList = payload.data;
          // reqList.
          let l = reqList.length;
          while (l--) {
            this.populateLaboratoryInvestigations(reqList[l]);
          }
        },
        error => {}
      );
    this.laboratoryLoading = false;
  }
  populateLaboratoryInvestigations(request) {
    this.labRequests.push(request);
  }
  getPastAppointments() {
    this.pastAppointments = [];
    Observable.fromPromise(
      this.appointmentService.findAppointment({
        query: { patientId: this.patient._id, isPast: true }
      })
    ).subscribe((payload: any) => {
      this.pastAppointments = payload.data;
    });
  }
  getFutureAppointments() {
    this.futureAppointments = [];
    Observable.fromPromise(
      this.appointmentService.findAppointment({
        query: { patientId: this.patient._id, isFuture: true }
      })
    ).subscribe((payload: any) => {
      this.futureAppointments = payload.data;
    });
  }

  tooltip_show(data) {
    this.selectedProblem = data;
    this.tooltip_view = !this.tooltip_view;
  }

  addTags_show() {
    this.addTag.emit(true);
  }
  addProblem_show() {
    this.addProblem.emit(true);
  }
  addAllergy_show() {
    this.addAllergy.emit(true);
  }
  addHistory_show() {
    this.addHistory.emit(true);
  }
  addVitals_show() {
    this.addVitals.emit(true);
  }
}
