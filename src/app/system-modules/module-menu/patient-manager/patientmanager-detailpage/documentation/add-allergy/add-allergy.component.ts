import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FormsService, FacilitiesService, DocumentationService } from '../../../../../../services/facility-manager/setup/index';
import { FormTypeService, SeverityService } from '../../../../../../services/module-manager/setup/index';
import { Facility, Patient, Employee, Documentation, PatientDocumentation, Document } from '../../../../../../models/index';
import { CoolLocalStorage } from 'angular2-cool-storage';
import { Observable } from 'rxjs/Observable';
import { SharedService } from '../../../../../../shared-module/shared.service';
import { SystemModuleService } from 'app/services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-add-allergy',
  templateUrl: './add-allergy.component.html',
  styleUrls: ['./add-allergy.component.scss']
})
export class AddAllergyComponent implements OnInit {
  isSaving: boolean;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() patient;
  allergyFormCtrl: FormControl;
  noteFormCtrl: FormControl;
  reactionFormCtrl: FormControl;
  severityFormCtrl: FormControl;
  filteredStates: any;

  mainErr = true;
  errMsg = 'you have unresolved errors';
  severities: any[] = [];

  selectedFacility: Facility = <Facility>{};
  loginEmployee: Employee = <Employee>{};
  selectedForm: any = <any>{};
  selectedDocument: PatientDocumentation = <PatientDocumentation>{};
  patientDocumentation: Documentation = <Documentation>{};


  constructor(private formBuilder: FormBuilder, private formService: FormsService, private locker: CoolLocalStorage,
    private documentationService: DocumentationService,private systemModuleService:SystemModuleService,
    private formTypeService: FormTypeService, private sharedService: SharedService,private authFacadeService:AuthFacadeService,
    private facilityService: FacilitiesService, private severityService: SeverityService) {
    this.allergyFormCtrl = new FormControl();
    this.severityFormCtrl = new FormControl();
    this.reactionFormCtrl = new FormControl();
    this.noteFormCtrl = new FormControl();
    this.authFacadeService.getLogingEmployee().then((payload:any) =>{
      this.loginEmployee = payload;
    });
    this.selectedFacility = <Facility>this.locker.getObject('selectedFacility');
  }

  ngOnInit() {
    this.getSeverities();
    this.getForm();
    this.getPersonDocumentation();
  }
  getSeverities() {
    Observable.fromPromise(this.severityService.findAll()).subscribe((payload: any) => {
      this.severities = payload.data;
    });
  }
  getForm() {
    Observable.fromPromise(this.formService.find({ query: { title: 'Allergies' } }))
      .subscribe((payload: any) => {
        if (payload.data.length > 0) {
          this.selectedForm = payload.data[0];
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
  close_onClick() {
    this.closeModal.emit(true);
  }
  severityDisplayFn(severity: any): any {
    return severity ? severity.name : severity;
  }
  save() {
    this.systemModuleService.on();
    this.isSaving = true;
    let isExisting = false;
    this.patientDocumentation.documentations.forEach(documentation => {
      if (documentation.document.documentType._id === this.selectedForm._id) {
        isExisting = true;
        documentation.document.body.allergies.push({
          allergy: this.allergyFormCtrl.value,
          reaction: this.reactionFormCtrl.value,
          severity: this.severityFormCtrl.value,
          note: this.noteFormCtrl.value
        })
      }
    });
    if (!isExisting) {
      const doc: PatientDocumentation = <PatientDocumentation>{};
      doc.createdBy = this.loginEmployee.personDetails.title + ' ' + this.loginEmployee.personDetails.lastName + ' ' + this.loginEmployee.personDetails.firstName;
      doc.facilityId = this.selectedFacility._id;
      doc.facilityName = this.selectedFacility.name;
      doc.patientId = this.patient._id,
      doc.patientName = this.patient.personDetails.title + ' ' + this.patient.personDetails.lastName + ' ' + this.patient.personDetails.firstName;
      doc.document = {
        documentType: this.selectedForm,
        body: {
          allergies: []
        }
      }
      doc.document.body.allergies.push({
        allergy: this.allergyFormCtrl.value,
        reaction: this.reactionFormCtrl.value,
        severity: this.severityFormCtrl.value,
        note: this.noteFormCtrl.value
      });
      this.patientDocumentation.documentations.push(doc);
    }
    this.documentationService.update(this.patientDocumentation).subscribe(payload => {
      this.patientDocumentation = payload;
      this.allergyFormCtrl.reset();
      this.reactionFormCtrl.reset();
      this.severityFormCtrl.reset();
      this.noteFormCtrl.reset();
      this.documentationService.announceDocumentation({ type: 'Allergies' });
      this.isSaving = false;
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Allergy added successfully!', 'success', null, null, null, null, null, null, null);
    }, error => {
      this.isSaving = false;
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('There was an error saving allergy!','error');
    })
  }
}

