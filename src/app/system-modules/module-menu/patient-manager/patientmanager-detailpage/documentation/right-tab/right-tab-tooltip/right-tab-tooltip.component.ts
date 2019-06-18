import { Employee } from './../../../../../../../models/facility-manager/setup/employee';
import { Component, OnInit, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Documentation } from 'app/models';
import { DocumentationService } from 'app/services/facility-manager/setup';
import { FormControl } from '@angular/forms';
import { AuthFacadeService } from 'app/system-modules/service-facade/auth-facade.service';
import { SystemModuleService } from '../../../../../../../services/module-manager/setup/system-module.service';

@Component({
  selector: 'app-right-tab-tooltip',
  templateUrl: './right-tab-tooltip.component.html',
  styleUrls: ['./right-tab-tooltip.component.scss']
})
export class RightTabTooltipComponent implements OnInit, OnChanges {
  patientDocumentation: Documentation = <Documentation>{};
  @Input() selectedProblem;
  noteFormCtrl: FormControl;
  loginEmployee: Employee = <Employee>{};

  constructor(private documentationService: DocumentationService,
    private authFacadeService: AuthFacadeService,
    private systemModuleService: SystemModuleService) {
    this.noteFormCtrl = new FormControl();
   }

  ngOnChanges(simple: SimpleChanges) {
    // if (simple['selectedProblem'] != null) {
    //   console.log(this.selectedProblem);
    // }
  }
  ngOnInit() {
    this.authFacadeService.getLogingEmployee().then((payload: any) => {
      this.loginEmployee = payload;
      this.getPatientDocumentationDetails();
    });
  }

  getPatientDocumentationDetails() {
    if (this.selectedProblem.documentationId !== null || this.selectedProblem.documentationId !== '') {
        this.documentationService.find({
          query:
          {
            'personId': this.selectedProblem.personId, 'documentations.patientId': this.selectedProblem.patientId,
          }
        }).then(payload => {
          if (payload.data.length > 0) {
            this.patientDocumentation = payload.data[0];
          }
        });
    }
  }

  // the update method called on problem only creates history on the existing problem,without altering existing record
  // only the displayStatus property is updated to manage what problem is showed to the user on patient page
  onUpdate() {
    const documentationIndex = this.patientDocumentation.documentations.findIndex(x => x._id === this.selectedProblem.documentationId);
    const problemIndex = this.patientDocumentation.documentations[documentationIndex]
                          .document.body.problems.findIndex(x => x.problem === this.selectedProblem.problem);
    const problemByName = this.patientDocumentation.documentations[documentationIndex]
                            .document.body.problems.filter(x => x.problem === this.selectedProblem.problem);

    const currentDate = new Date();
    const updateProblem = {
      problem: problemByName[0].problem,
      note: problemByName[0].note,
      status: problemByName[0].status,
      displayStatus: false,
      history: [
        {
          createdBy: this.loginEmployee.personDetails.title + ' ' + this.loginEmployee.personDetails.lastName + ' ' 
                      + this.loginEmployee.personDetails.firstName,
          note: this.noteFormCtrl.value,
          status: {
            _id: 2,
            name: 'InActive'
          },
          date: currentDate
        }
      ]
    };
    // console.log(this.patientDocumentation);
    this.patientDocumentation.documentations[documentationIndex].document.body.problems[problemIndex] = updateProblem;
    this.documentationService.update(this.patientDocumentation).then(uload => {
      // update success callback, show success notification
      this.documentationService.announceDocumentation({ type: 'Problem' });
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Problem updated successfully!', 'success', null, null, null, null, null, null, null);
    },
    err => {
      // update error callback, show error notification
      this.systemModuleService.off();
      this.systemModuleService.announceSweetProxy('Problem not updated due error while saving!', 'error');
    });

  }
}
