import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientRegistrationReportComponent } from './patient-registration-report.component';

describe('PatientRegistrationReportComponent', () => {
  let component: PatientRegistrationReportComponent;
  let fixture: ComponentFixture<PatientRegistrationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientRegistrationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientRegistrationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
