import { Employee } from './../../../../../models/facility-manager/setup/employee';
import { Documentation } from './../../../../../models/facility-manager/setup/documentation';
import { PatientDocumentation } from './../../../../../models/facility-manager/setup/patient-documentation';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { CoolLocalStorage } from 'angular2-cool-storage';
import {
  FormsService, FacilitiesService, OrderSetTemplateService, DocumentationService, PersonService,
  PatientService, TreatmentSheetService, EmployeeService
} from 'app/services/facility-manager/setup';
import { OrderSetTemplate, User, Facility } from '../../../../../models/index';
import { ActivatedRoute } from '@angular/router';
import { TreatmentSheetActions, InvalidTreatmentReport } from '../../../../../shared-module/helpers/global-config';
import { AuthFacadeService } from '../../../../service-facade/auth-facade.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-treatement-plan',
  templateUrl: './treatement-plan.component.html',
  styleUrls: ['./treatement-plan.component.scss']
})
export class TreatementPlanComponent implements OnInit {
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  treatmentSheetData: any = <any>{};
  isSaving: boolean;
  @Input() patient: any;
  facility: Facility = <Facility>{};
  miniFacility: Facility = <Facility>{};
  employeeDetails: any = <any>{};
  treatmentSheet: any = <any>{};
  treatmentSheetItems: any = <any>[];
  user: User = <User>{};
  investigationTableForm: FormGroup;
  medicationTableForm: FormGroup;
  procedureTableForm: FormGroup;
  nursingCareTableForm: FormGroup;
  physicianOrderTableForm: FormGroup;
  completionInfo = new FormControl();
  problemFormControl = new FormControl('', Validators.required);
  isEditTreatmentSheet = false;
  treatmentSheetId: any = '';
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};
  treatmentItemStatusValue: any = <any>{};
  trackValues: any = <any>[];

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};

  toggleInvestigation = false;
  toggleProcedure = false;
  toggleMedication = true;
  toggleNurseingCare = false;
  togglePhysicianOrder = false;
  toggleSheetDetails = false;

  constructor(
    private _route: ActivatedRoute,
    private _locker: CoolLocalStorage,
    private _orderSetTemplateService: OrderSetTemplateService,
    public facilityService: FacilitiesService,
    private _formService: FormsService,
    private _personService: PersonService,
    private _patientService: PatientService,
    private _treatmentSheetService: TreatmentSheetService,
    private _authFacadeService: AuthFacadeService,
    private documentationService: DocumentationService,
    private locker: CoolLocalStorage,
    private formBuilder: FormBuilder,
    private systemModuleService: SystemModuleService,
    private employeeService: EmployeeService
  ) {
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
    });
    // this.loginEmployee = <Employee>this.locker.getObject('loginEmployee');
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.facility = <Facility>this._locker.getObject('selectedFacility');
    this.miniFacility = <Facility>this._locker.getObject('miniFacility');
    this.treatmentItemStatusValue = TreatmentSheetActions;
    this.initializeServiceItemInvestigationTables();
    this.initializeServiceItemMedicationTables();
    this.initializeServiceItemProcedureTables();
    this.initializeServiceItemNursingCareTables();
    this.initializeServiceItemphysicianOrderTables();
    // this.employeeDetails = this._locker.getObject('loginEmployee');
    this.user = <User>this._locker.getObject('auth');
    this._authFacadeService.getLogingEmployee().then((res: any) => {
      this.loginEmployee = res;
    });

    this.getTreatmentSheet();
    this.getPersonDocumentation();
  }

  initializeServiceItemInvestigationTables() {
    this.investigationTableForm = this.formBuilder.group({
      'investigationTableArray': this.formBuilder.array([
        this.formBuilder.group({
          index: [0, [<any>Validators.required]],
          comment: [''],
          name: ['', [<any>Validators.required]],
          status: ['', [<any>Validators.required]]
        })
      ])
    });
    this.investigationTableForm.controls['investigationTableArray'] = this.formBuilder.array([]);
  }

  initializeServiceItemMedicationTables() {
    this.medicationTableForm = this.formBuilder.group({
      'medicationTableArray': this.formBuilder.array([
        this.formBuilder.group({
          index: [0, [<any>Validators.required]],
          comment: [''],
          name: ['', [<any>Validators.required]],
          status: ['', [<any>Validators.required]]
        })
      ])
    });
    this.medicationTableForm.controls['medicationTableArray'] = this.formBuilder.array([]);
  }

  initializeServiceItemProcedureTables() {
    this.procedureTableForm = this.formBuilder.group({
      'procedureTableArray': this.formBuilder.array([
        this.formBuilder.group({
          index: [0, [<any>Validators.required]],
          comment: [''],
          name: ['', [<any>Validators.required]],
          status: ['', [<any>Validators.required]]
        })
      ])
    });
    this.procedureTableForm.controls['procedureTableArray'] = this.formBuilder.array([]);
  }

  initializeServiceItemNursingCareTables() {
    this.nursingCareTableForm = this.formBuilder.group({
      'nursingCareTableArray': this.formBuilder.array([
        this.formBuilder.group({
          index: [0, [<any>Validators.required]],
          comment: [''],
          name: ['', [<any>Validators.required]],
          status: ['', [<any>Validators.required]]
        })
      ])
    });
    this.nursingCareTableForm.controls['nursingCareTableArray'] = this.formBuilder.array([]);
  }

  initializeServiceItemphysicianOrderTables() {
    this.physicianOrderTableForm = this.formBuilder.group({
      'physicianOrderTableArray': this.formBuilder.array([
        this.formBuilder.group({
          index: [0, [<any>Validators.required]],
          comment: [''],
          name: ['', [<any>Validators.required]],
          status: ['', [<any>Validators.required]]
        })
      ])
    });
    this.physicianOrderTableForm.controls['physicianOrderTableArray'] = this.formBuilder.array([]);
  }

  setTreatmentSheetValue() {
    if (this.treatmentSheet.investigations !== undefined) {
      this.treatmentSheet.investigations.forEach((item, index) => {
        (<FormArray>this.investigationTableForm.controls['investigationTableArray']).push(
          this.formBuilder.group({
            index: index,
            comment: '',
            name: item.name,
            status: item.status
          })
        );
      });
    }
    if (this.treatmentSheet.medications !== undefined) {
      this.treatmentSheet.medications.forEach((item, index) => {
        item.regimen = (item.regimen !== undefined) ? item.regimen : [{
          frequency: '',
          duration: '',
          durationUnit: ''
        }];
        (<FormArray>this.medicationTableForm.controls['medicationTableArray']).push(
          this.formBuilder.group({
            index: index,
            comment: '',
            name: item.genericName + ' - ' + item.dosage + item.dosageUnit + ','
              + item.regimen[0].frequency + ' for ' + item.regimen[0].duration + ' ' +
              item.regimen[0].durationUnit,
            status: item.status
          })
        );
      });
    }
    if (this.treatmentSheet.procedures !== undefined) {
      this.treatmentSheet.procedures.forEach((item, index) => {
        (<FormArray>this.procedureTableForm.controls['procedureTableArray']).push(
          this.formBuilder.group({
            index: index,
            comment: '',
            name: item.name,
            status: item.status
          })
        );
      });
    }
    if (this.treatmentSheet.nursingCares !== undefined) {
      this.treatmentSheet.nursingCares.forEach((item, index) => {
        (<FormArray>this.nursingCareTableForm.controls['nursingCareTableArray']).push(
          this.formBuilder.group({
            index: index,
            comment: '',
            name: item.name,
            status: item.status
          })
        );
      });
    }
    if (this.treatmentSheet.physicianOrders !== undefined) {
      this.treatmentSheet.physicianOrders.forEach((item, index) => {
        (<FormArray>this.physicianOrderTableForm.controls['physicianOrderTableArray']).push(
          this.formBuilder.group({
            index: index,
            comment: '',
            name: item.name,
            status: item.status
          })
        );
      });
    }
  }

  onViewEmployee(value) {
    this.employeeService.get(value.createdBy, {
      query: {
        $select: ['personId']
      }
    }).then(payload => {
      value.createdByName = payload.personDetails.firstName + ' ' + payload.personDetails.lastName
    }, err => {
    })
  }

  private getTreatmentSheet() {
    this._treatmentSheetService.find({
      query: {
        personId: this.patient.personId,
        facilityId: this.selectedFacility._id,
        completed: false,
        $sort: { updatedAt: -1 }
      }
    }).then(res => {
      if (res.data.length > 0) {
        this.initializeServiceItemInvestigationTables();
        this.initializeServiceItemMedicationTables();
        this.initializeServiceItemNursingCareTables();
        this.initializeServiceItemphysicianOrderTables();
        this.initializeServiceItemProcedureTables();
        this.treatmentSheetData = res.data[0];
        this.treatmentSheetId = res.data[0]._id;
        this.treatmentSheet = res.data[0].treatmentSheet;
        this.setTreatmentSheetValue();
        this.setTreatmentItemTracks();
      }
    }).catch(err => { });
  }

  onEditTreatmentSheet() {
    this.isEditTreatmentSheet = true;
  }

  onAdministerInvestigationItem(investigation) {
    this.treatmentSheet.investigations[investigation.index].tracks = (this.treatmentSheet.investigations[investigation.index].tracks === undefined) ? [] : this.treatmentSheet.investigations[investigation.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.DONE,
      createdBy: this.loginEmployee._id,
      comment: investigation.comment
    }
    this.treatmentSheet.investigations[investigation.index].isDone = true;
    this.treatmentSheet.investigations[investigation.index].status = TreatmentSheetActions.DONE;
    this.treatmentSheet.investigations[investigation.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onSuspendInvestigationItem(investigation, statue) {
    this.treatmentSheet.investigations[investigation.index].tracks = (this.treatmentSheet.investigations[investigation.index].tracks === undefined) ? [] : this.treatmentSheet.investigations[investigation.index].tracks;
    const treatmentSheetTrack = {
      action: (statue === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED,
      createdBy: this.loginEmployee._id,
      comment: investigation.comment
    }
    this.treatmentSheet.investigations[investigation.index].status = (statue === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED;
    this.treatmentSheet.investigations[investigation.index].isSuspended = statue;
    this.treatmentSheet.investigations[investigation.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onDonePhysicianOrderItem(physicianOrder) {
    this.treatmentSheet.physicianOrders[physicianOrder.index].tracks = (this.treatmentSheet.physicianOrders[physicianOrder.index].tracks === undefined) ? [] : this.treatmentSheet.physicianOrders[physicianOrder.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.DONE,
      createdBy: this.loginEmployee._id,
      comment: physicianOrder.comment
    }
    this.treatmentSheet.physicianOrders[physicianOrder.index].status = TreatmentSheetActions.DONE;
    this.treatmentSheet.physicianOrders[physicianOrder.index].isDone = true;
    this.treatmentSheet.physicianOrders[physicianOrder.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onSuspendPhysicianOrderItem(physicianOrder, statue) {
    this.treatmentSheet.physicianOrders[physicianOrder.index].tracks = (this.treatmentSheet.physicianOrders[physicianOrder.index].tracks === undefined) ? [] : this.treatmentSheet.physicianOrders[physicianOrder.index].tracks;
    const treatmentSheetTrack = {
      action: (statue === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED,
      createdBy: this.loginEmployee._id,
      comment: physicianOrder.comment
    }
    this.treatmentSheet.physicianOrders[physicianOrder.index].status = (statue === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED;
    this.treatmentSheet.physicianOrders[physicianOrder.index].isSuspended = statue;
    this.treatmentSheet.physicianOrders[physicianOrder.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  close_onClick() {
    this.closeModal.emit(true);
    this.isEditTreatmentSheet = false;
    this.initializeServiceItemInvestigationTables();
    this.initializeServiceItemMedicationTables();
    this.initializeServiceItemNursingCareTables();
    this.initializeServiceItemphysicianOrderTables();
    this.initializeServiceItemProcedureTables();
    this.refreshTreatmentSheet();
  }

  showInvestigation() {
    this.toggleInvestigation = !this.toggleInvestigation;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }

  showProcedure() {
    this.toggleProcedure = !this.toggleProcedure;
    this.toggleInvestigation = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }
  showMedication() {
    this.toggleMedication = !this.toggleMedication;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleNurseingCare = false;
    this.togglePhysicianOrder = false;
  }
  showNursingCare() {
    this.toggleNurseingCare = !this.toggleNurseingCare;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.togglePhysicianOrder = false;
  }
  showPhysicianOrder() {
    this.togglePhysicianOrder = !this.togglePhysicianOrder;
    this.toggleInvestigation = false;
    this.toggleProcedure = false;
    this.toggleMedication = false;
    this.toggleNurseingCare = false;
  }

  showSheetDetails() {
    this.toggleSheetDetails = !this.toggleSheetDetails;
  }
  /**
   * createdBy
   * createdAt
   * Action e.g: 'Edited,Added,Administered,Suspended,Completed
   * 
   **/



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

  onDoneProcedure(procedure) {
    const doc: PatientDocumentation = <PatientDocumentation>{};
    doc.facilityId = this.selectedFacility._id;
    doc.facilityIdName = this.selectedFacility.name;
    doc.createdById = this.loginEmployee._id;
    doc.createdBy = this.loginEmployee.personDetails.title + ' ' + this.loginEmployee.personDetails.firstName + ' ' + this.loginEmployee.personDetails.lastName;
    doc.patientId = this.patient._id;
    doc.patientName = this.loginEmployee.personDetails.title + ' ' + this.patient.personDetails.firstName + ' ' + this.patient.personDetails.lastName;
    doc.document = {
      documentType: {
        facilityId: this.selectedFacility._id,
        isSide: false,
        title: 'Procedure Order',
        problem: this.treatmentSheetData.problem
      },
      body: {
        'Doctor Instruction': 'Give ' + procedure.name,
        Done: 'By ' + this.loginEmployee.personDetails.lastName + ' ' + this.loginEmployee.personDetails.firstName +
          ' at ' + new Date().toLocaleString(),
        'comment': procedure.comment
      }
    }
    this.patientDocumentation.documentations.push(doc);

    this.treatmentSheet.doc = this.patientDocumentation;
    this.treatmentSheet.procedures[procedure.index].tracks = (this.treatmentSheet.procedures[procedure.index].tracks === undefined) ? [] : this.treatmentSheet.procedures[procedure.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.DONE,
      createdBy: this.loginEmployee._id,
      comment: procedure.comment
    }
    this.treatmentSheet.procedures[procedure.index].isDone = true;
    this.treatmentSheet.procedures[procedure.index].status = TreatmentSheetActions.DONE;
    this.treatmentSheet.procedures[procedure.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patchTreatmentSheetMedication(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onSuspendProcedure(procedure, status) {
    this.treatmentSheet.procedures[procedure.index].tracks = (this.treatmentSheet.procedures[procedure.index].tracks === undefined) ? [] : this.treatmentSheet.procedures[procedure.index].tracks;
    const treatmentSheetTrack = {
      action: (status === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED,
      createdBy: this.loginEmployee._id,
      comment: procedure.comment
    }
    this.treatmentSheet.procedures[procedure.index].isSuspended = status;
    this.treatmentSheet.procedures[procedure.index].status = (status === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED;
    this.treatmentSheet.procedures[procedure.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onDoneNursingCare(nursingCare) {
    const doc: PatientDocumentation = <PatientDocumentation>{};
    doc.facilityId = this.selectedFacility;
    doc.createdBy = this.loginEmployee;
    doc.patientId = this.patient._id;
    doc.document = {
      documentType: {
        facilityId: this.selectedFacility._id,
        isSide: false,
        title: 'Nursing Care',
        problem: this.treatmentSheetData.problem
      },
      body: {
        'Nursing Care': nursingCare.name,
        Done: 'By ' + this.loginEmployee.personDetails.lastName + ' ' + this.loginEmployee.personDetails.firstName +
          ' at ' + new Date().toLocaleString(),
        'comment': nursingCare.comment
      }
    }

    this.patientDocumentation.documentations.push(doc);
    this.treatmentSheet.doc = this.patientDocumentation;
    this.treatmentSheet.nursingCares[nursingCare.index].tracks = (this.treatmentSheet.nursingCares[nursingCare.index].tracks === undefined) ? [] : this.treatmentSheet.nursingCares[nursingCare.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.DONE,
      createdBy: this.loginEmployee._id,
      comment: nursingCare.comment
    }
    this.treatmentSheet.nursingCares[nursingCare.index].isDone = true;
    this.treatmentSheet.nursingCares[nursingCare.index].status = TreatmentSheetActions.DONE;
    this.treatmentSheet.nursingCares[nursingCare.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patchTreatmentSheetMedication(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onSuspendNursingCare(nursingCare, status) {
    this.treatmentSheet.nursingCares[nursingCare.index].tracks = (this.treatmentSheet.nursingCares[nursingCare.index].tracks === undefined) ? [] : this.treatmentSheet.nursingCares[nursingCare.index].tracks;
    const treatmentSheetTrack = {
      action: (status === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED,
      createdBy: this.loginEmployee._id,
      comment: nursingCare.comment
    }
    this.treatmentSheet.nursingCares[nursingCare.index].isSuspended = status;
    this.treatmentSheet.nursingCares[nursingCare.index].status = (status === true) ? TreatmentSheetActions.SUSPENDED : TreatmentSheetActions.ACTIVATED;
    this.treatmentSheet.nursingCares[nursingCare.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  administer(medication) {
    medication.staus = 'Started';
    const doc: PatientDocumentation = <PatientDocumentation>{};
    doc.facilityId = this.selectedFacility._id;
    doc.facilityIdName = this.selectedFacility.name;
    doc.createdById = this.loginEmployee._id;
    doc.createdBy = this.loginEmployee.personDetails.title + ' ' + this.loginEmployee.personDetails.firstName + ' ' + this.loginEmployee.personDetails.lastName;
    doc.patientId = this.patient._id;
    doc.patientName = this.loginEmployee.personDetails.title + ' ' + this.patient.personDetails.firstName + ' ' + this.patient.personDetails.lastName;
    doc.document = {
      documentType: {
        facilityId: this.selectedFacility._id,
        isSide: false,
        title: 'Medication Order',
        problem: this.treatmentSheetData.problem
      },
      body: {
        'Doctor Instruction': 'Give ' + medication.name,
        Done: 'By ' + this.loginEmployee.personDetails.lastName + ' ' + this.loginEmployee.personDetails.firstName +
          ' at ' + new Date().toLocaleString(),
        'comment': medication.comment
      }
    }
    this.patientDocumentation.documentations.push(doc);
    this.treatmentSheet.doc = this.patientDocumentation;
    this.treatmentSheet.medications[medication.index].tracks = (this.treatmentSheet.medications[medication.index].tracks === undefined) ? [] : this.treatmentSheet.medications[medication.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.ADMINISTERED,
      createdBy: this.loginEmployee._id,
      comment: medication.comment
    }
    this.treatmentSheet.medications[medication.index].isAdministered = true;
    this.treatmentSheet.medications[medication.index].status = TreatmentSheetActions.ADMINISTERED;
    this.treatmentSheet.medications[medication.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patchTreatmentSheetMedication(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  _updateTreatmentSheet(medication, index) {
    this.isSaving = true;
    const medicationObj = this.treatmentSheet.medications[index];
    medicationObj.status = 'Started';
    this.treatmentSheet.medications[index] = medicationObj;
    this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
      this.isSaving = false;
    }).catch(error => {
      this.isSaving = false;
    });
  }

  completeMedication(medication, index) {
    // const medicationObj = this.treatmentSheet.medications[index];
    // this.isSaving = true;
    // medicationObj.status = 'Completed';
    // medicationObj.completed = true;

    // this.treatmentSheet.medications[index] = medicationObj;
    // this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    // this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
    //   this.isSaving = false;
    // }).catch(error => {
    //   this.isSaving = false;
    // });

    this.treatmentSheet.medications[medication.index].tracks = (this.treatmentSheet.medications[medication.index].tracks === undefined) ? [] : this.treatmentSheet.medications[medication.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.COMPLETED,
      createdBy: this.loginEmployee._id,
      comment: medication.comment
    }
    this.treatmentSheet.medications[medication.index].isCompleted = true;
    this.treatmentSheet.medications[medication.index].status = TreatmentSheetActions.COMPLETED;
    this.treatmentSheet.medications[medication.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }
  discontinueMedication(medication, index) {
    // const medicationObj = this.treatmentSheet.medications[index];
    // this.isSaving = true;
    // medicationObj.status = 'Discontinued';
    // medicationObj.completed = true;

    // this.treatmentSheet.medications[index] = medicationObj;
    // this.treatmentSheetData.treatmentSheet = this.treatmentSheet;
    // this._treatmentSheetService.update(this.treatmentSheetData).then(payload => {
    //   this.isSaving = false;
    // }).catch(error => {
    //   this.isSaving = false;
    // })

    this.treatmentSheet.medications[medication.index].tracks = (this.treatmentSheet.medications[medication.index].tracks === undefined) ? [] : this.treatmentSheet.medications[medication.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.DISCONTINUED,
      createdBy: this.loginEmployee._id,
      comment: medication.comment
    }
    this.treatmentSheet.medications[medication.index].isContinue = false;
    this.treatmentSheet.medications[medication.index].status = TreatmentSheetActions.DISCONTINUED;
    this.treatmentSheet.medications[medication.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }
  suspendMedication(medication) {
    this.treatmentSheet.medications[medication.index].tracks = (this.treatmentSheet.medications[medication.index].tracks === undefined) ? [] : this.treatmentSheet.medications[medication.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.SUSPENDED,
      createdBy: this.loginEmployee._id,
      comment: medication.comment
    }
    this.treatmentSheet.medications[medication.index].isSuspended = true;
    this.treatmentSheet.medications[medication.index].status = TreatmentSheetActions.SUSPENDED;
    this.treatmentSheet.medications[medication.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  activateMedication(medication, index) {
    this.treatmentSheet.medications[medication.index].tracks = (this.treatmentSheet.medications[medication.index].tracks === undefined) ? [] : this.treatmentSheet.medications[medication.index].tracks;
    const treatmentSheetTrack = {
      action: TreatmentSheetActions.ACTIVATED,
      createdBy: this.loginEmployee._id,
      comment: medication.comment
    }
    this.treatmentSheet.medications[medication.index].isActivate = true;
    this.treatmentSheet.medications[medication.index].status = TreatmentSheetActions.ACTIVATED;
    this.treatmentSheet.medications[medication.index].tracks.push(treatmentSheetTrack);
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'treatmentSheet': this.treatmentSheet }, {}).then(payload => {
      this.onActivityTreatmentSheet();
    }, err => {
    });
  }

  onCompletedTreatmentSheet() {
    this.treatmentSheetData.annouceCompletion = true;
    this.systemModuleService.announceSweetProxy('You are about end the activities on this treatment sheet', 'question', this);
  }

  onActivityTreatmentSheet() {
    this.systemModuleService.announceSweetProxy('You have successfully added an activity this treatment sheet', 'success', null,
      null,
      null,
      null,
      null,
      null,
      null);
    this.initializeServiceItemInvestigationTables();
    this.initializeServiceItemMedicationTables();
    this.initializeServiceItemNursingCareTables();
    this.initializeServiceItemphysicianOrderTables();
    this.initializeServiceItemProcedureTables();
    this.refreshTreatmentSheet();
  }

  onAcceptCompletionSheet() {
    this._treatmentSheetService.patch(this.treatmentSheetData._id, { 'completionDescription': this.completionInfo.value, 'completed': true }, {}).then(payload => {
      this.refreshTreatmentSheet();
    }, err => { });
  }

  sweetAlertCallback(result) {
    if (result.value) {
      if (this.treatmentSheetData.annouceCompletion === true) {
        this.onAcceptCompletionSheet();
      }
    }
  }

  refreshTreatmentSheet() {
    this._treatmentSheetService.get(this.treatmentSheetId, {}).then(res => {
      if (res._id !== undefined) {
        this.treatmentSheetData = res;
        this.treatmentSheetId = res._id;
        this.treatmentSheet = res.treatmentSheet;
        this.setTreatmentSheetValue();
        this.setTreatmentItemTracks();
      }
    }).catch(err => { });
  }


  setTreatmentItemTracks() {
    this.trackValues = [];
    if (this.treatmentSheet.investigations !== undefined) {
      let trackItem = {
        label: '',
        tracks: []
      };
      trackItem.tracks = [];
      trackItem.label = 'Investigations';
      this.treatmentSheet.investigations.forEach(element2 => {
        trackItem.tracks.push(element2);
      });
      this.trackValues.push(trackItem);
    }
    if (this.treatmentSheet.medications !== undefined) {
      let trackItem = {
        label: '',
        tracks: []
      };
      trackItem.tracks = [];
      trackItem.label = 'Medications';
      this.treatmentSheet.medications.forEach(element2 => {
        let _element = JSON.parse(JSON.stringify(element2));
        _element.name = _element.genericName;
        trackItem.tracks.push(_element);
      });
      this.trackValues.push(trackItem);
    }
    if (this.treatmentSheet.procedures !== undefined) {
      let trackItem = {
        label: '',
        tracks: []
      };
      trackItem.tracks = [];
      trackItem.label = 'Procedures';
      this.treatmentSheet.procedures.forEach(element2 => {
        trackItem.tracks.push(element2);
      });
      this.trackValues.push(trackItem);
    }
    if (this.treatmentSheet.nursingCares !== undefined) {
      let trackItem = {
        label: '',
        tracks: []
      };
      trackItem.tracks = [];
      trackItem.label = 'NursingCares';
      this.treatmentSheet.nursingCares.forEach(element2 => {
        trackItem.tracks.push(element2);
      });
      this.trackValues.push(trackItem);
    }
    if (this.treatmentSheet.physicianOrders !== undefined) {
      let trackItem = {
        label: '',
        tracks: []
      };
      trackItem.tracks = [];
      trackItem.label = 'Physician Orders';
      this.treatmentSheet.physicianOrders.forEach(element2 => {
        trackItem.tracks.push(element2);
      });
      this.trackValues.push(trackItem);
    }
  }


}
