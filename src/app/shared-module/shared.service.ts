import { Injectable } from "@angular/core";
import { CoolLocalStorage } from "angular2-cool-storage";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class SharedService {
  private editDocumentationAnnouncedSource = new Subject<Object>();
  editDocumentationAnnounced$ = this.editDocumentationAnnouncedSource.asObservable();

  private newFormAnnouncedSource = new Subject<Object>();
  newFormAnnounced$ = this.newFormAnnouncedSource.asObservable();

  private surveyInitializedSource = new Subject<Object>();
  surveyInitialized$ = this.surveyInitializedSource.asObservable();

  private submitFormSource = new Subject<Object>();
  submitForm$ = this.submitFormSource.asObservable();

  private announceTemplateSource = new Subject<Object>();
  announceTemplate$ = this.announceTemplateSource.asObservable();

  private announceOrderSetSource = new Subject<Object>();
  announceOrderSetSource$ = this.announceOrderSetSource.asObservable();

  private announceBilledOrderSetSource = new Subject<Object>();
  announceBilledOrderSet$ = this.announceBilledOrderSetSource.asObservable();

  private announceDiagnosisSystemOrderSource = new Subject<Object>();
  announceDiagnosisSystemOrder$ = this.announceDiagnosisSystemOrderSource.asObservable();

  private announceSaveDraftSource = new Subject<Object>();
  announceSaveDraft$ = this.announceSaveDraftSource.asObservable();

  private announceFinishedSavingDraftSource = new Subject<Object>();
  announceFinishedSavingDraft$ = this.announceFinishedSavingDraftSource.asObservable();

  constructor() {}

  announceSaveDraft(temp: Object) {
    this.announceSaveDraftSource.next(temp);
  }

  announceFinishedSavingDraft(temp: Object) {
    this.announceFinishedSavingDraftSource.next(temp);
  }
  announceTemplate(temp: Object) {
    this.announceTemplateSource.next(temp);
  }

  announceDiagnosisSystemOrder(temp: Object) {
    this.announceDiagnosisSystemOrderSource.next(temp);
  }

  announceNewForm(form: Object) {
    this.newFormAnnouncedSource.next(form);
  }

  announceOrderSet(orderSet) {
    this.announceOrderSetSource.next(orderSet);
  }

  announceBilledOrderSet(orderSet) {
    this.announceBilledOrderSetSource.next(orderSet);
  }

  announceEditDocumentation(document) {
    this.editDocumentationAnnouncedSource.next(document);
  }

  surveyInitializedSourceAnnounced(survey) {
    this.surveyInitializedSource.next(survey);
  }

  submitForm(form: Object) {
    this.submitFormSource.next(form);
  }
}
