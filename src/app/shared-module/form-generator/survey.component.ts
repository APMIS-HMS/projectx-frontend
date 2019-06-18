import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReactSurveyModel, Survey, SurveyNG } from 'survey-angular';

import { DocumentationService } from '../../services/facility-manager/setup/index';
import { SharedService } from '../shared.service';

@Component({
	selector: 'survey',
	//template: `<div class="survey-container contentcontainer codecontainer survery"><div id="surveyElement"></div></div>`
	template: `<div class="survey-container contentcontainer codecontainer survery"><div id="surveyElement"></div></div>`
})
export class SurveyComponent implements OnInit, OnDestroy {
	@Input() json: any;
	@Input() isTemplate = false;
	surveyModel: any;
	symptoms: any[] = [];
	diagnoses: any[] = [];
	orderSet: any = <any>{};

	constructor(private shareService: SharedService, private documentationService: DocumentationService) {
		this.shareService.newFormAnnounced$.subscribe((payload: any) => {
			this.json = payload.json;
			this.surveyModel = new ReactSurveyModel(payload.json);
			Survey.cssType = 'bootstrap';
			this.surveyModel.onComplete.add(() => {
				this.surveyResult();
			});
			this.surveyModel.onValueChanged.add((a, b) => {});
		});

		this.shareService.announceDiagnosisSystemOrder$.subscribe((payload: any) => {
			if (payload.type === 'Symptoms') {
				if (payload.action === 'add') {
					
					this.symptoms.push(payload.data);
					

				} else {
					const index = this.symptoms.findIndex((x) => x.symptom === payload.data.symptom);
					this.symptoms.slice(index, 1);
				}
			} else if (payload.type === 'OrderSet') {
				if (payload.action === 'add') {
					this.orderSet = payload.data;
				} else {
					if (payload.orderSetType === 'medication') {
						const index = this.orderSet.medications.findIndex((x) => x.name === payload.data.name);
						this.orderSet.medications.slice(index, 1);
					} else if (payload.orderSetType === 'investigation') {
						const index = this.orderSet.investigations.findIndex((x) => x.name === payload.data.name);
						this.orderSet.investigations.slice(index, 1);
					} else if (payload.orderSetType === 'procedure') {
						const index = this.orderSet.procedures.findIndex((x) => x.name === payload.data.name);
						this.orderSet.procedures.slice(index, 1);
					} else if (payload.orderSetType === 'physicianOrder') {
						const index = this.orderSet.physicianOrders.findIndex((x) => x.name === payload.data.name);
						this.orderSet.physicianOrders.slice(index, 1);
					} else if (payload.orderSetType === 'nursingCare') {
						const index = this.orderSet.nursingCares.findIndex((x) => x.name === payload.data.name);
						this.orderSet.nursingCares.slice(index, 1);
					}
				}
			} else if (payload.type === 'ICD 10 Diagnosis') {
				if (payload.action === 'add') {
					this.diagnoses.push(payload.data);
				} else {
					const index = this.diagnoses.findIndex((x) => x.code === payload.data.code);
					this.diagnoses.slice(index, 1);
				}
			}
		});

		this.shareService.announceTemplate$.subscribe((payload: any) => {
			this.surveyModel.data = payload.data;
			SurveyNG.render('surveyElement', { model: this.surveyModel });
		});
		this.shareService.editDocumentationAnnounced$.subscribe((value: any) => {
			if (value.leg === 1) {
				if (SurveyNG !== null) {
					this.surveyModel.data = value.document;
					SurveyNG.render('surveyElement', { model: this.surveyModel });
				}
			}
		});
	}

	ngOnInit() {
		try {
			this.surveyModel = new ReactSurveyModel(JSON.parse(this.json));
			Survey.cssType = 'bootstrap';
			SurveyNG.render('surveyElement', { model: this.surveyModel });
			Survey.cssType = 'bootstrap';

			this.surveyModel.onComplete.add(() => {
				this.surveyResult();
			});
			this.surveyModel.onValueChanged.add((a, b) => {
				this.shareService.announceSaveDraft(b.question.data.data);
			});

			this.shareService.surveyInitializedSourceAnnounced(this);
		} catch (error) {}
	}
	surveyResult() {
		if (!this.isTemplate) {
			document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
			const resultAsString = JSON.stringify(this.surveyModel.data);
			const obj = this.surveyModel.data;
		;

			// Symptom

			let symptom: any;
			this.symptoms.forEach((item, i) => {
				if (i === 0) {
					symptom = i + 1 + '. ' + item.symptom + ' (' + item.symptomDuration + item.durationUnit +'), ';
				} else {
					if (this.symptoms.length === i + 1) {
						symptom += i + 1 + '. ' + item.symptom + ' (' + item.symptomDuration + item.durationUnit +')';
					} else {
						symptom += i + 1 + '. ' + item.symptom + ' (' + item.symptomDuration + item.durationUnit +'), ';
					}
				}
			});

			if (!!symptom) {
				obj.symptoms = symptom;
			}

			// Diagnoses

			let diagnosis: any;
			this.diagnoses.forEach((item, i) => {
				if (i === 0) {
					diagnosis = i + 1 + '. ' + item.name + '(' + item.code + '), ';
				} else {
					if (this.diagnoses.length === i + 1) {
						diagnosis += i + 1 + '. ' + item.name + '(' + item.code + ')';
					} else {
						diagnosis += i + 1 + '. ' + item.name + '(' + item.code + '), ';
					}
				}
			});

			if (!!diagnosis) {
				obj.ICD10Diagnosis = diagnosis;
			}

			// Medication
			if (!!this.orderSet.medications) {
				let medication: any;
				this.orderSet.medications.forEach((it, i) => {
					if (i === 0) {
						// tslint:disable-next-line:max-line-length
						medication =
							i +
							1 +
							'. ' +
							it.strength +
							' ' +
							it.genericName +
							' - ' +
							it.frequency +
							' for ' +
							it.duration +
							' ' +
							it.durationUnit +
							', ';
					} else {
						if (length === i) {
							// tslint:disable-next-line:max-line-length
							medication +=
								i +
								1 +
								'. ' +
								it.strength +
								' ' +
								it.genericName +
								' - ' +
								it.frequency +
								' for ' +
								it.duration +
								' ' +
								it.durationUnit;
						} else {
							// tslint:disable-next-line:max-line-length
							medication +=
								i +
								1 +
								'. ' +
								it.strength +
								' ' +
								it.genericName +
								' - ' +
								it.frequency +
								' for ' +
								it.duration +
								' ' +
								it.durationUnit +
								', ';
						}
					}
				});
				obj.medications = medication;
			}

			// Investigation
			if (!!this.orderSet.investigations) {
				let investigation: any;
				this.orderSet.investigations.forEach((item, i) => {
					if (i === 0) {
						investigation = i + 1 + '. ' + item.name + ', ';
					} else {
						if (length === i) {
							investigation += i + 1 + '. ' + item.name;
						} else {
							investigation += i + 1 + '. ' + item.name + ', ';
						}
					}
				});
				obj.investigations = investigation;
			}

			// Procedure
			if (!!this.orderSet.procedures) {
				let procedure: any;
				this.orderSet.procedures.forEach((item, i) => {
					if (i === 0) {
						procedure = i + 1 + '. ' + item.name + ', ';
					} else {
						if (length === i) {
							procedure += i + 1 + '. ' + item.name;
						} else {
							procedure += i + 1 + '. ' + item.name + ', ';
						}
					}
				});
				obj.procedures = procedure;
			}

			// Nursing Care
			if (!!this.orderSet.nursingCares) {
				let nursingCare: any;
				this.orderSet.nursingCares.forEach((item, i) => {
					if (i === 0) {
						nursingCare = i + 1 + '. ' + item.name + ', ';
					} else {
						if (length === i) {
							nursingCare += i + 1 + '. ' + item.name;
						} else {
							nursingCare += i + 1 + '. ' + item.name + ', ';
						}
					}
				});
				obj.nursingCares = nursingCare;
			}

			// Physician Order
			if (!!this.orderSet.physicianOrders) {
				let physicianOrder: any;
				this.orderSet.physicianOrders.forEach((item, i) => {
					if (i === 0) {
						physicianOrder = i + 1 + '. ' + item.name + ', ';
					} else {
						if (length === i) {
							physicianOrder += i + 1 + '. ' + item.name;
						} else {
							physicianOrder += i + 1 + '. ' + item.name + ', ';
						}
					}
				});
				obj.physicianOrder = physicianOrder;
			}

			this.shareService.submitForm(obj);
			this.shareService.announceBilledOrderSet(this.orderSet);
			this.json = null;
			this.symptoms = [];
		} else {
			document.getElementById('surveyElement').innerHTML = '';
			const resultAsString = JSON.stringify(this.surveyModel.data);
			this.symptoms.forEach((item, i) => {
				this.surveyModel.data.symptoms = '(' + i + 1 + ') ' + item.symptom + ' (' + item.symptomDuration + item.durationUnit + ')';
			});
			this.shareService.submitForm(this.surveyModel.data);
			this.json = null;
		}
	}
	sendDataToServer(survey) {
		document.getElementById('surveyElement').innerHTML = 'Document saved successfully!';
		const resultAsString = JSON.stringify(survey.data);
		this.symptoms.forEach((item, i) => {
			survey.data.symptoms = '(' + i + 1 + ') ' + item.symptom + ' (' + item.symptomDuration + item.durationUnit + ')';
		});
		this.shareService.submitForm(survey.data);
	}

	ngOnDestroy(): void {
		this.surveyModel = undefined;
		this.isTemplate = false;
		this.ngOnInit();
	}
}
